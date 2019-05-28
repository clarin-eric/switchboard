package eu.clarin.switchboard.core;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

public class ToolRegistry {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(ToolRegistry.class);

    Path registryPath;

    AtomicReference<List<Tool>> tools = new AtomicReference<>();
    Runnable callback;

    public List<Tool> getTools() {
        return tools.get();
    }

    public Set<String> getAllMediatypes() {
        Set<String> mediatypes = new HashSet<>();
        for (Tool tool : getTools())
            mediatypes.addAll(tool.getMimetypes());
        return mediatypes;
    }

    public Set<String> getAllLanguages() {
        Set<String> languages = new HashSet<>();
        for (Tool tool : getTools())
            languages.addAll(tool.getLanguages());
        return languages;
    }


    public void onUpdate(Runnable callback) {
        this.callback = callback;
    }

    public ToolRegistry(String toolRegistryPath) throws IOException {
        registryPath = Paths.get(toolRegistryPath);
        LOGGER.info("reading tool definitions from: " + registryPath);
        tools.set(read(registryPath));

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
                    Thread.sleep(100); // give more time to fs to finish more complex operations

                    for (WatchEvent<?> event : key.pollEvents()) {
                        LOGGER.debug("tool monitoring event: " + event.kind() + "; " + event.context());
                    }

                    try {
                        LOGGER.info("reading tool definitions from: " + registryPath);
                        tools.set(read(registryPath));
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
        File[] files = registryDir.toFile().listFiles((dir, name) -> name.endsWith(".json"));
        if (files == null) {
            throw new IOException("cannot read tool registry folder: " + registryDir);
        }

        Gson gson = new Gson();
        List<Tool> tools = new ArrayList<>();
        for (File f : files) {
            try (Reader r = new BufferedReader(new FileReader(f))) {
                tools.add(gson.fromJson(r, Tool.class));
            } catch (JsonSyntaxException | IOException xc) {
                LOGGER.error("error reading tool: " + f + "\n" + xc.getMessage());
            }
        }
        return Collections.unmodifiableList(tools);
    }

}
