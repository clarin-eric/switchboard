package eu.clarin.switchboard.core;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Storage {
    Path dir;

    Map<UUID, FileInfo> fileInfoMap = new HashMap<>();

    public static class FileInfo {
        UUID id;
        String name;
        Path path;

        public FileInfo(UUID id, String name, Path path) {
            this.id = id;
            this.name = name;
            this.path = path;
        }

        public UUID getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public Path getPath() {
            return path;
        }
    }

    public Storage() throws IOException {
        // TODO: make this directory configurable
        dir = Files.createTempDirectory("switchboard");
    }

    public FileInfo download(UUID id, String linkString) throws IOException {
        URL link = new URL(linkString);
        ReadableByteChannel rbc = Channels.newChannel(link.openStream());

        // todo: extract filename from url, is used in the UI
        String filename = "downloaded";

        Path idDir = dir.resolve(id.toString());
        Files.createDirectory(idDir);
        Path path = idDir.resolve(filename);
        FileInfo fileInfo = new FileInfo(id, filename, path);
        fileInfoMap.put(id, fileInfo);

        FileOutputStream fos = new FileOutputStream(path.toFile());
        fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
        return fileInfo;
    }

    public FileInfo save(UUID id, String name, InputStream inputStream) throws IOException {
        Path idDir = dir.resolve(id.toString());
        Files.createDirectory(idDir);
        Path path = idDir.resolve(name);
        FileInfo fileInfo = new FileInfo(id, name, path);
        fileInfoMap.put(id, fileInfo);
        Files.copy(inputStream, path);
        return fileInfo;
    }

    public FileInfo getFileInfo(UUID id) {
        return fileInfoMap.get(id);
    }

    public File getFile(UUID id) {
        FileInfo fi = fileInfoMap.get(id);
        return dir.resolve(id.toString()).resolve(fi.getName()).toFile();
    }
}