package eu.clarin.switchboard.core;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class Storage {
    Path dir;

    Map<String, FileInfo> fileInfoMap = new HashMap<>();
    static class FileInfo {
        String id;
        String name;

        public FileInfo(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }
    }

    public Storage() throws IOException {
        dir = Files.createTempDirectory("switchboard");
    }

    public File save(String id, String name, InputStream inputStream) throws IOException {
        Path idDir = dir.resolve(id);
        Files.createDirectory(idDir);
        fileInfoMap.put(id, new FileInfo(id, name));
        Path f = idDir.resolve(name);
        Files.copy(inputStream, f);
        return f.toFile();
    }

    public File getFile(String id) {
        FileInfo fi = fileInfoMap.get(id);
        return dir.resolve(id).resolve(fi.getName()).toFile();
    }
}
