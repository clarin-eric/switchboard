package eu.clarin.switchboard.core;

import com.google.common.base.MoreObjects;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import eu.clarin.switchboard.core.xc.BadToolException;
import eu.clarin.switchboard.profiler.api.Matcher;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.tool.Input;
import eu.clarin.switchboard.tool.Tool;
import eu.clarin.switchboard.tool.WebApplication;
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
    public static final Predicate<Tool> ALL_TOOLS = tool -> true;
    public static final Predicate<Tool> ONLY_PRODUCTION_TOOLS = tool ->
            tool.getDeployment().equalsIgnoreCase(PRODUCTION_DEPLOYMENT);

    private final Path registryPath;
    private final AtomicReference<List<Tool>> tools = new AtomicReference<>();
    private Runnable callback;

    public List<Tool> filterTools(Predicate<Tool> filter) {
        return tools.get()
                .stream()
                .filter(filter)
                .collect(Collectors.toList());
    }

    /// one matching possibility for a tool
    public static class ProfilesToToolInputMatch extends ArrayList<Integer> {
        // mapping from profile index, which is the index of the profile in array,
        // to input index when they match, and null if there is no match
        // e.g. [2, null] means first profile matches input with index 2
        //      and the second profile does not match anything
        public ProfilesToToolInputMatch(int size) {
            super(size);
            for (int i = 0; i < size; ++i) {
                add(null);
            }
        }

        private ProfilesToToolInputMatch(ProfilesToToolInputMatch other) {
            super(other);
        }

        public ProfilesToToolInputMatch update(int profileIndex, int inputIndex) {
            ProfilesToToolInputMatch ret = new ProfilesToToolInputMatch(this);
            ret.set(profileIndex, inputIndex);
            return ret;
        }

        public boolean isProfileIndexUsed(int profileIndex) {
            return get(profileIndex) != null;
        }

        public boolean isInputIndexUsed(int inputIndex) {
            return stream().anyMatch(pIndex -> pIndex != null && pIndex == inputIndex);
        }

        private int getUsedProfilesCount() {
            return (int) stream().filter(Objects::nonNull).count();
        }

        private Set<Integer> getUsedInputs() {
            return stream().filter(Objects::nonNull).collect(Collectors.toSet());
        }

        private int getUsedInputsCount() {
            return (int) stream().filter(Objects::nonNull).distinct().count();
        }
    }

    /// all matching possibilities for a tool
    public static class ToolMatches {
        Tool tool;
        List<ProfilesToToolInputMatch> matches;

        public ToolMatches(Tool tool) {
            this.tool = tool;
            this.matches = new ArrayList<>();
        }

        public Tool getTool() {
            return tool;
        }

        public List<ProfilesToToolInputMatch> getMatches() {
            return matches;
        }

        public void add(ProfilesToToolInputMatch match) {
            this.matches.add(match);
        }

        public float getProfileMatchPercent() {
            return 100 * matches.get(0).getUsedProfilesCount() / (float) matches.get(0).size();
        }

        public float getMandatoryInputsMatchPercent() {
            long usedMandatoryInputs = matches.get(0).getUsedInputs()
                    .stream()
                    .filter(i -> !tool.getInputs().get(i).isOptional())
                    .count();
            long toolMandatoryInputs = tool.getInputs()
                    .stream()
                    .filter(in -> !in.isOptional())
                    .count();
            return 100 * usedMandatoryInputs / (float) toolMandatoryInputs;
        }

        public float getAllInputsMatchPercent() {
            long usedInputs = matches.get(0).getUsedInputs().size();
            long toolInputs = tool.getInputs().size();
            return 100 * usedInputs / (float) toolInputs;
        }

        @Override
        public String toString() {
            return MoreObjects.toStringHelper(this)
                    .add("tool", tool.getName())
                    .add("matches", matches)
                    .toString();
        }
    }

    public List<ToolMatches> filterTools(List<Profile> profiles, Predicate<Tool> filter) {
        long startTime = System.nanoTime();
        List<ToolMatches> results = new ArrayList<>();

        for (Tool tool : tools.get()) {
            if (!filter.test(tool)) {
                continue;
            }
            List<Input> inputs = tool.getInputs();
            List<ProfilesToToolInputMatch> matches = new ArrayList<>();
            matches.add(new ProfilesToToolInputMatch(profiles.size()));

            for (int profileIndex = 0; profileIndex < profiles.size(); ++profileIndex) {
                for (int inputIndex = 0; inputIndex < inputs.size(); ++inputIndex) {
                    List<ProfilesToToolInputMatch> betterMatches = new ArrayList<>();
                    for (ProfilesToToolInputMatch currentMatch : matches) {
                        boolean inputIsAlreadyUsed = currentMatch.isInputIndexUsed(inputIndex);
                        boolean inputIsMultiple = inputs.get(inputIndex).isMultiple();
                        boolean profileIsAlreadyUsed = currentMatch.isProfileIndexUsed(profileIndex);
                        if (profileIsAlreadyUsed || (inputIsAlreadyUsed && !inputIsMultiple)) {
                            continue;
                        }
                        boolean contentRequired = tool.doesInputRequireContent(inputIndex);
                        Matcher matcher = inputs.get(inputIndex).getMatcher(contentRequired);
                        if (matcher.matches(profiles.get(profileIndex))) {
                            betterMatches.add(currentMatch.update(profileIndex, inputIndex));
                        }
                    }
                    matches.addAll(betterMatches);
                    betterMatches.clear();
                }
            }

            if (matches.size() > 1) {
                matches.sort((o1, o2) -> o2.getUsedInputsCount() - o1.getUsedInputsCount());
                matches.sort((o1, o2) -> o2.getUsedProfilesCount() - o1.getUsedProfilesCount());
                float topPercent = matches.get(0).getUsedInputsCount() + matches.get(0).getUsedProfilesCount();
                ToolMatches toolMatches = new ToolMatches(tool);
                for (int i = 0; i < matches.size() - 1; ++i) {
                    if (matches.get(i).getUsedInputsCount() + matches.get(i).getUsedProfilesCount() >= topPercent) {
                        // only add the best matches (can be more than one with same matching percent)
                        toolMatches.add(matches.get(i));
                    }
                }
                results.add(toolMatches);
            }
        }

        results.sort((tm1, tm2) -> {
            float x = tm2.getMandatoryInputsMatchPercent() - tm1.getMandatoryInputsMatchPercent();
            if (x != 0) {
                return (int) x;
            }
            x = tm2.getProfileMatchPercent() - tm1.getProfileMatchPercent();
            if (x != 0) {
                return (int) x;
            }
            return tm1.getTool().getName().compareToIgnoreCase(tm2.getTool().getName());
        });

        LOGGER.debug("matched " + profiles.size() + " profile(s) against " + tools.get().size() + " tools in " +
                (System.nanoTime() - startTime)/1000000 + "ms");
        return results;
    }

    public List<Tool> getAllTools() {
        return tools.get();
    }

    public Set<String> getAllMediatypes() {
        Set<String> mediatypes = new HashSet<>();
        for (Tool tool : getAllTools()) {
            for (Input input : tool.getInputs()) {
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
            for (Input input : tool.getInputs()) {
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

    public ToolRegistry(String toolRegistryPath) throws IOException, BadToolException {
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
                    } catch (BadToolException e) {
                        LOGGER.warn("tool watching thread: bad tool exception: ", e);
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

    static List<Tool> read(Path registryDir) throws IOException, BadToolException {
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

                long distinctIDs = tool.getInputs().stream().map(Input::getId).distinct().count();
                if (distinctIDs != tool.getInputs().size()) {
                    LOGGER.error("duplicated id in inputs of tool: " + tool.getName());
                    continue;
                }

                if (tool.getName() == null || tool.getDescription() == null) {
                    LOGGER.warn("json file " + f.getPath() + " does not seem to be a tool (no name or description) and will be ignored");
                } else {
                    tools.add(tool);
                }
            } catch (JsonParseException | IOException | BadToolException xc) {
                LOGGER.error("error reading tool: " + f + "\n" + xc.getMessage());
            }
        }
        checkTools(tools);
        return Collections.unmodifiableList(tools);
    }

    private static void checkTools(List<Tool> tools) throws BadToolException {
        Set<String> names = new HashSet<>();
        Set<Integer> ids = new HashSet<>();
            for (Tool t : tools) {
            if (t.getId() == null) {
                // switch to throwing BadToolException when all the production tools have an id
                LOGGER.warn("tools with null id found: " + t.getName());
            } else if (ids.contains(t.getId())) {
                throw new BadToolException("tools with duplicate ids found: id=" + t.getId() + "; name=" + t.getName());
            } else {
                ids.add(t.getId());
            }

            if (names.contains(t.getName())) {
                throw new BadToolException("tools with same name found: " + t.getName());
            }
            names.add(t.getName());

            WebApplication webApplication = t.getWebApplication();
            if (webApplication != null) {
                if (webApplication.getQueryParameters() != null) {
                    webApplication.getQueryParameters().removeIf(Objects::isNull);
                }
                if (webApplication.getPathParameters() != null) {
                    webApplication.getPathParameters().removeIf(Objects::isNull);
                }
            }
        }
    }
}
