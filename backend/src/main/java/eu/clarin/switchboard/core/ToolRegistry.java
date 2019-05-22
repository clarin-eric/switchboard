package eu.clarin.switchboard.core;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class ToolRegistry {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(ToolRegistry.class);

    Path registryPath;
    List<Tool> tools = new ArrayList<>();


    public ToolRegistry(String toolRegistryPath) throws IOException {
        registryPath = Paths.get(toolRegistryPath);
        tools = read(registryPath);
    }


    static List<Tool> read(Path registryDir) throws IOException {
        LOGGER.info("reading tool definitions from: " + registryDir);

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
        return tools;
    }

    public List<Tool> getTools() {
        return Collections.unmodifiableList(tools);
    }
}
