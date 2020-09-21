package eu.clarin.switchboard.core;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import eu.clarin.switchboard.core.xc.BadToolException;
import eu.clarin.switchboard.profiler.api.Matcher;
import eu.clarin.switchboard.profiler.api.Profile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class ToolRegistry {
    private static final Logger LOGGER = LoggerFactory.getLogger(ToolRegistry.class);
    private static final String PRODUCTION_DEPLOYMENT = "production";

    private final Path registryPath;
    private final AtomicReference<List<Tool>> tools = new AtomicReference<>();
    private Runnable callback;

    public List<Tool> filterTools(boolean onlyProductionTools) {
        Predicate<Tool> filter = tool -> !onlyProductionTools || tool.getDeployment().equalsIgnoreCase(PRODUCTION_DEPLOYMENT);
        return tools.get()
                .stream()
                .filter(filter)
                .collect(Collectors.toList());
    }

    /// one matching possibility for a tool
    public static class ProfilesToolMatch extends ArrayList<Integer> {
        // mapping from input index, which is the index of the element in array,
        // to profile index when they match, and -1 if they don't match
        // e.g. [2, -1] means first input matches profile with index 2
        //      and the second input does not match anything
        public ProfilesToolMatch(int size) {
            super(size);
            for (int i = 0; i < size; ++i) {
                add(-1);
            }
        }

        private ProfilesToolMatch(ProfilesToolMatch other) {
            super(other);
        }

        public ProfilesToolMatch update(int inputIndex, int profileIndex) {
            ProfilesToolMatch ret = new ProfilesToolMatch(this);
            ret.set(inputIndex, profileIndex);
            return ret;
        }

        public boolean usesProfileIndex(int profileIndex) {
            return stream().anyMatch(pIndex -> pIndex == profileIndex);
        }

        public boolean inputIndexOccupied(int inputIndex) {
            return get(inputIndex) >= 0;
        }

        public int matchCount() {
            return (int) stream().filter(pIndex -> pIndex >= 0).count();
        }

        public float matchPercent() {
            return 100 * matchCount() / (float)size();
        }
    }

    /// all matching possibilities for a tool
    public static class ToolMatches {
        Tool tool;
        List<ProfilesToolMatch> matches;

        public ToolMatches(Tool tool) {
            this.tool = tool;
            this.matches = new ArrayList<>();
        }

        public Tool getTool() {
            return tool;
        }

        public List<ProfilesToolMatch> getMatches() {
            return matches;
        }

        public void add(ProfilesToolMatch match) {
            this.matches.add(match);
        }

        public float getBestMatchPercent() {
            // the matches should always be ordered by matchCount
            return matches.get(0).matchPercent();
        }
    }

    public List<ToolMatches> filterTools(List<Profile> profiles, boolean onlyProductionTools) {
        Predicate<Tool> filterDeployment = tool -> !onlyProductionTools || tool.getDeployment().equalsIgnoreCase(PRODUCTION_DEPLOYMENT);

        List<ToolMatches> results = new ArrayList<>();

        for (Tool tool : tools.get()) {
            if (!filterDeployment.test(tool)) {
                continue;
            }
            List<Tool.Input> inputs = tool.getInputs();
            List<ProfilesToolMatch> matches = new ArrayList<>();
            matches.add(new ProfilesToolMatch(inputs.size()));

            for (int inputIndex = 0; inputIndex < inputs.size(); ++inputIndex) {
                for (int profileIndex = 0; profileIndex < profiles.size(); ++profileIndex) {
                    List<ProfilesToolMatch> betterMatches = new ArrayList<>();
                    for (ProfilesToolMatch currentMatch : matches) {
                        if (!currentMatch.usesProfileIndex(profileIndex) && !currentMatch.inputIndexOccupied(inputIndex)) {
                            Matcher matcher = inputs.get(inputIndex).getMatcher(tool.requiresContent(inputIndex));
                            if (matcher.matches(profiles.get(profileIndex))) {
                                betterMatches.add(currentMatch.update(inputIndex, profileIndex));
                            }
                        }
                    }
                    matches.addAll(betterMatches);
                    betterMatches.clear();
                }
            }

            if (matches.size() > 1) {
                matches.sort((o1, o2) -> o2.matchCount() - o1.matchCount());
                float topPercent = matches.get(0).matchPercent();
                ToolMatches toolMatches = new ToolMatches(tool);
                for (int i = 0; i < matches.size() - 1; ++i) {
                    if (matches.get(i).matchPercent() >= topPercent) {
                        // only add the best matches (can be more than one with same matching percent)
                        toolMatches.add(matches.get(i));
                    }
                }
                results.add(toolMatches);
            }
        }

        return results;
    }

    public List<Tool> getAllTools() {
        return tools.get();
    }

    public Set<String> getAllMediatypes() {
        Set<String> mediatypes = new HashSet<>();
        for (Tool tool : getAllTools()) {
            for (Tool.Input input : tool.getInputs()) {
                if (input.getMediatypes() != null) {
                    mediatypes.addAll(input.getMediatypes());
                }
            }
        }
        return mediatypes;
    }

    public Set<String> getAllLanguages() {
        Set<String> languages = new HashSet<>();
        for (Tool tool : getAllTools())
            for (Tool.Input input : tool.getInputs()) {
                Object langs = input.getLanguages();
                if (langs instanceof List) {
                    languages.addAll((List<String>) langs);
                }
            }
        return languages;
    }


    public void setOnUpdate(Runnable callback) {
        this.callback = callback;
    }

    public ToolRegistry(String toolRegistryPath) throws IOException {
        registryPath = Paths.get(toolRegistryPath);

        LOGGER.info("reading tool definitions from: " + registryPath);
        tools.set(read(registryPath));
        LOGGER.info("finished reading " + tools.get().size() + " tools");

        LOGGER.info("starting tool monitoring service");
        WatchService watchService = FileSystems.getDefault().newWatchService();
        registryPath.register(watchService,
                StandardWatchEventKinds.ENTRY_CREATE,
                StandardWatchEventKinds.ENTRY_DELETE,
                StandardWatchEventKinds.ENTRY_MODIFY);

        new Thread(() -> {
            try {
                WatchKey key;
                while ((key = watchService.take()) != null) {
                    Thread.sleep(2000); // give time to fs to finish more complex operations

                    for (WatchEvent<?> event : key.pollEvents()) {
                        LOGGER.debug("tool monitoring event: " + event.kind() + "; " + event.context());
                    }

                    try {
                        LOGGER.info("reading tool definitions from: " + registryPath);
                        tools.set(read(registryPath));
                        LOGGER.info("finished reading " + tools.get().size() + " tools");
                    } catch (IOException e) {
                        LOGGER.warn("tool watching thread: io exception: ", e);
                        e.printStackTrace();
                    }

                    try {
                        if (callback != null) {
                            callback.run();
                        }
                    } catch (Exception e) {
                        LOGGER.warn("tool watching thread: exception in callback: ", e);
                        e.printStackTrace();
                    }

                    key.reset();
                }
            } catch (InterruptedException e) {
                LOGGER.warn("tool watching thread was interrupted", e);
            }
        }).start();
    }

    static List<Tool> read(Path registryDir) throws IOException {
        Objects.requireNonNull(registryDir);
        FilenameFilter filter = (dir, name) -> name.endsWith(".json");
        File[] files = registryDir.toFile().listFiles(filter);
        if (files == null) {
            throw new IOException("cannot read tool registry folder: " + registryDir);
        }

        Gson gson = new Gson();
        List<Tool> tools = new ArrayList<>();
        for (File f : files) {
            try (Reader r = new BufferedReader(new FileReader(f))) {
                Tool tool = gson.fromJson(r, Tool.class);
                try (Reader r2 = new BufferedReader(new FileReader(f))) {
                    tool.augment(gson.fromJson(r2, Map.class));
                }

                if (tool.getName() == null || tool.getUrl() == null) {
                    LOGGER.warn("json file " + f.getPath() + " does not seem to be a tool (no name and url) and will be ignored");
                } else {
                    tools.add(tool);
                }
            } catch (JsonParseException | IOException | BadToolException xc) {
                LOGGER.error("error reading tool: " + f + "\n" + xc.getMessage());
            }
        }

        return Collections.unmodifiableList(tools);
    }
}
