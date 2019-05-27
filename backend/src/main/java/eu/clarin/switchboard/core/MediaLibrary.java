package eu.clarin.switchboard.core;

import com.google.common.collect.ImmutableSet;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.UriBuilder;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Path;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * MediaLibrary keeps records about datafiles, identified by uuids.
 * The records contain file paths, profiles, origin information.
 */
public class MediaLibrary {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(MediaLibrary.class);


    DataStore dataStore;
    Profiler profiler;
    Converter converter;

    Map<UUID, FileInfo> fileInfoMap = new HashMap<>();

    public static final Set<String> convertableMediatypes = ImmutableSet.of(
            "application/pdf",
            "application/rtf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public static final Set<String> nonTextMediatypes = ImmutableSet.of(
            "application/zip",
            "application/x-gzip",
            "audio/vnd.wave",
            "audio/x-wav",
            "audio/wav",
            "audio/mp3",
            "audio/mp4",
            "audio/x-mpeg"
    );

    public static class FileInfo {
        UUID id;
        String filename; // original filename, on disk we use a sanitized form
        Path path; // actual path on disk
        long fileLength;

        String mediatype;
        String language;

        String originalLink; // original link; can point to a landing page, not to the data
        String downloadLink; // link used for downloading from original location

        public FileInfo(UUID id, String filename, Path path) {
            this.id = id;
            this.filename = filename;
            this.path = path;
            this.fileLength = path.toFile().length();
        }

        public UUID getId() {
            return id;
        }

        public String getFilename() {
            return filename;
        }

        public Path getPath() {
            return path;
        }

        public long getFileLength() {
            return fileLength;
        }

        public String getMediatype() {
            return mediatype;
        }

        public String getLanguage() {
            return language;
        }

        public String getOriginalLink() {
            return originalLink;
        }

        public String getDownloadLink() {
            return downloadLink;
        }

        @Override
        public String toString() {
            return "FileInfo { " +
                    "id=" + id +
                    ", filename='" + filename + '\'' +
                    ", path=" + path +
                    ", fileLength=" + fileLength +
                    ", mediatype='" + mediatype + '\'' +
                    ", language='" + language + '\'' +
                    ", originLink='" + originalLink + '\'' +
                    ", downloadLink='" + downloadLink + '\'' +
                    " }";
        }
    }

    public MediaLibrary(DataStore dataStore, Profiler profiler, Converter converter) throws IOException {
        this.dataStore = dataStore;
        this.profiler = profiler;
        this.converter = converter;
    }

    public FileInfo addMedia(String originalUrl) throws IOException {
        DownloadUtils.LinkData linkData = DownloadUtils.getLinkData(originalUrl);
        URL url = new URL(linkData.downloadLink);
        URLConnection connection = url.openConnection();
        try {
            String header = connection.getHeaderField("Content-Disposition");
            ContentDisposition disposition = new ContentDisposition(header);
            linkData.filename = disposition.getFileName();
        } catch (ParseException xc) {
            // ignore
        }

        try (InputStream stream = connection.getInputStream()) {
            FileInfo fileInfo = addMedia(linkData.filename, stream);
            fileInfo.downloadLink = linkData.downloadLink;
            fileInfo.originalLink = originalUrl;
            LOGGER.debug("additional fileInfo: " + fileInfo);
            return fileInfo;
        }
    }

    public FileInfo addMedia(String filename, InputStream inputStream) throws IOException {
        UUID id = UUID.randomUUID();
        Path path = dataStore.save(id, filename, inputStream);

        FileInfo fileInfo = new FileInfo(id, filename, path);
        fileInfoMap.put(id, fileInfo);

        File file = path.toFile();
        fileInfo.mediatype = profiler.detectMediatype(file);
        if (convertableMediatypes.contains(fileInfo.mediatype)) {
            try {
                String text = converter.parseToPlainText(file);
                fileInfo.language = profiler.detectLanguage(text);
            } catch (ConverterException xc) {
                LOGGER.info("Cannot convert media to text for detecting the language: " + xc.getMessage());
            }
        } else if (nonTextMediatypes.contains(fileInfo.mediatype)) {
            // no language for this one
        } else {
            fileInfo.language = profiler.detectLanguage(file);
        }

        LOGGER.debug("fileInfo: " + fileInfo);
        return fileInfo;
    }

    public FileInfo getFileInfo(UUID id) {
        return fileInfoMap.get(id);
    }
}