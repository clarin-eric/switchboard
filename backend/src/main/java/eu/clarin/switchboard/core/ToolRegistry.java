package eu.clarin.switchboard.core;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
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

    public List<Tool> filterTools(String mediatype, String language, boolean onlyProductionTools) {
        Predicate<Tool> filterMediatypes = tool -> Strings.isNullOrEmpty(mediatype) || tool.getMediatypes().contains(mediatype);

        // accept tools with matching languages, or tools with 'generic' language input
        Predicate<Tool> filterLanguages = tool -> Strings.isNullOrEmpty(language)
                || tool.getLanguages().contains(language) || tool.getLanguages().contains("generic");

        Predicate<Tool> filterDeployment = tool -> !onlyProductionTools || tool.getDeployment().equalsIgnoreCase(PRODUCTION_DEPLOYMENT);

        Predicate<Tool> filter = filterDeployment.and(filterLanguages).and(filterMediatypes);
        return tools.get()
                .stream()
                .filter(filter)
                .collect(Collectors.toList());
    }


    public List<Tool> filterTools(Profile profile, boolean onlyProductionTools) {
        Predicate<Tool> filterProfile = tool -> tool.getMatcher().matches(profile);
        Predicate<Tool> filterDeployment = tool -> !onlyProductionTools || tool.getDeployment().equalsIgnoreCase(PRODUCTION_DEPLOYMENT);

        Predicate<Tool> filter = filterDeployment.and(filterProfile);
        return tools.get()
                .stream()
                .filter(filter)
                .collect(Collectors.toList());
    }

    public List<Tool> getAllTools() {
        return tools.get();
    }

    public Set<String> getAllMediatypes() {
        Set<String> mediatypes = new HashSet<>();
        for (Tool tool : getAllTools())
            mediatypes.addAll(tool.getMediatypes());
        return mediatypes;
    }

    public Set<String> getAllLanguages() {
        Set<String> languages = new HashSet<>();
        for (Tool tool : getAllTools())
            languages.addAll(tool.getLanguages());
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
                if (tool.getName() == null || tool.getUrl() == null) {
                    LOGGER.warn("json file " + f.getPath() + " does not seem to be a tool (no name and url) and will be ignored");
                } else {
                    tools.add(tool);
                }
            } catch (JsonParseException | IOException xc) {
                LOGGER.error("error reading tool: " + f + "\n" + xc.getMessage());
            }
        }

        return Collections.unmodifiableList(tools);
    }
}
