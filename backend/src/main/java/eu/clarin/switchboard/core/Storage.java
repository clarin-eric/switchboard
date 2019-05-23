package eu.clarin.switchboard.core;

import gnu.trove.set.hash.TIntHashSet;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Storage {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(Storage.class);

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
        // TODO: enforce storage policy
        dir = Files.createTempDirectory("switchboard");
    }

    public FileInfo download(UUID id, String link) throws IOException {
        String filename;
        URL url;
        {
            LinkData linkData = getLinkData(link);
            filename = linkData.filename;
            url = new URL(linkData.downloadLink);
        }

        URLConnection connection = url.openConnection();
        try {
            String header = connection.getHeaderField("Content-Disposition");
            ContentDisposition disposition = new ContentDisposition(header);
            filename = disposition.getFileName();
        } catch (ParseException xc) {
            // ignore
        }

        try (InputStream stream = connection.getInputStream()) {
            return save(id, filename, stream);
        }
    }

    public FileInfo save(UUID id, String filename, InputStream inputStream) throws IOException {
        Path idDir = dir.resolve(id.toString());
        Files.createDirectory(idDir);

        filename = sanitize(filename);
        Path path = idDir.resolve(filename);

        FileInfo fileInfo = new FileInfo(id, filename, path);
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


    final static String illegalCharsString = "\"'*/:<>?\\|";
    final static TIntHashSet illegalChars = new TIntHashSet();

    static {
        illegalCharsString.codePoints().forEachOrdered(illegalChars::add);
    }

    private static String sanitize(String filename) {
        StringBuilder cleanName = new StringBuilder();
        filename.codePoints().forEachOrdered(c -> {
            boolean replace = c < 32 || illegalChars.contains(c);
            cleanName.appendCodePoint(replace ? '_' : c);
        });
        return cleanName.toString();
    }


    private static class LinkData {
        String filename;
        String downloadLink;
    }

    private static LinkData getLinkData(String link) throws MalformedURLException {
        URL url = new URL(link);
        String host = url.getHost();
        String path = url.getPath();
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        LinkData linkData = new LinkData();
        linkData.filename = path;
        linkData.downloadLink = link;

        int lastSlash = path.lastIndexOf("/");
        if (lastSlash >= 0) {
            linkData.filename = path.substring(lastSlash + 1, path.length());
        }

        if (host.equals("b2drop.eudat.eu")) {
            linkData.filename = "b2drop_file";
            if (!path.endsWith("/download")) {
                path += "/download";
                linkData.downloadLink = new URL(url.getProtocol(), url.getHost(), path).toString();
            }
        } else if (url.getHost().equals("www.dropbox.com") || url.getHost().equals("dropbox.com")) {
            if (!link.contains("?dl=1")) {
                linkData.downloadLink = link.replaceFirst("\\?dl=0", "?dl=1");
            }
        }
        LOGGER.debug("linkData: " + linkData.filename + "; " + linkData.downloadLink);
        return linkData;
    }

}