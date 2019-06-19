package eu.clarin.switchboard.core;

import com.google.common.collect.ImmutableSet;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Path;
import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * MediaLibrary keeps records about datafiles, identified by uuids.
 * The records contain file paths, profiles, origin information.
 */
public class MediaLibrary {
    public static final int MAX_ALLOWED_REDIRECTS = 5;


    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(MediaLibrary.class);

    DataStore dataStore;
    Profiler profiler;
    Converter converter;
    StoragePolicy storagePolicy;

    Map<UUID, FileInfo> fileInfoMap = Collections.synchronizedMap(new HashMap<>());

    public static final Set<String> convertableMediatypes = ImmutableSet.of(
            "application/pdf",
            "application/rtf",
            "application/msword",
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
        Instant creation;

        String filename; // original filename, on disk we use a sanitized form
        Path path; // actual path on disk
        long fileLength;

        String mediatype;
        String language;

        String originalLink; // original link; can point to a landing page, not to the data
        String downloadLink; // link used for downloading from original location
        int httpRedirects; // if getting the data requires redirects

        public FileInfo(UUID id, String filename, Path path) {
            this.id = id;
            this.filename = filename;
            this.path = path;

            this.creation = new Date().toInstant();
            this.fileLength = path.toFile().length();
        }

        public UUID getId() {
            return id;
        }

        public Instant getCreation() {
            return creation;
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

        public int getHttpRedirects() {
            return httpRedirects;
        }

        @Override
        public String toString() {
            return "FileInfo: " +
                    "\nid=" + id +
                    "\ncreation=" + creation.toString() +
                    "\nfilename='" + filename + '\'' +
                    "\npath=" + path +
                    "\nfileLength=" + fileLength +
                    "\nmediatype='" + mediatype + '\'' +
                    "\nlanguage='" + language + '\'' +
                    "\noriginalLink='" + originalLink + '\'' +
                    "\nhttpRedirects=" + httpRedirects;
        }
    }

    public MediaLibrary(DataStore dataStore, Profiler profiler, Converter converter, StoragePolicy storagePolicy) {
        this.dataStore = dataStore;
        this.profiler = profiler;
        this.converter = converter;
        this.storagePolicy = storagePolicy;

        ExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        Duration cleanup = storagePolicy.getCleanupPeriod();
        ((ScheduledExecutorService) executor).scheduleAtFixedRate(
                () -> periodicCleanup(),
                cleanup.getSeconds(),
                cleanup.getSeconds(),
                TimeUnit.SECONDS);
    }

    public FileInfo addMedia(String originalUrl) throws IOException, StoragePolicyException {
        DownloadUtils.LinkData linkData = DownloadUtils.getLinkData(originalUrl);
        HttpURLConnection connection = (HttpURLConnection) new URL(linkData.downloadLink).openConnection();

        int redirects = 0;
        for (int status = connection.getResponseCode();
             redirects < MAX_ALLOWED_REDIRECTS &&
                     (status == HttpURLConnection.HTTP_MOVED_TEMP
                             || status == HttpURLConnection.HTTP_MOVED_PERM
                             || status == HttpURLConnection.HTTP_SEE_OTHER);
             redirects += 1
                ) {
            String newUrl = connection.getHeaderField("Location");
            String cookies = connection.getHeaderField("Set-Cookie");

            connection = (HttpURLConnection) new URL(newUrl).openConnection();
            connection.setRequestProperty("Cookie", cookies);

            status = connection.getResponseCode();
        }

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
            fileInfo.httpRedirects = redirects;
            return fileInfo;
        }
    }

    public FileInfo addMedia(String filename, InputStream inputStream) throws IOException, StoragePolicyException {
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
            // language cannot be detected in this case
        } else {
            fileInfo.language = profiler.detectLanguage(file);
        }

        try {
            storagePolicy.acceptProfile(fileInfo.mediatype, fileInfo.language);
        } catch (StoragePolicyException xc) {
            dataStore.delete(id, path);
            fileInfoMap.remove(fileInfo);
            throw xc;
        }

        return fileInfo;
    }

    public FileInfo getFileInfo(UUID id) {
        return fileInfoMap.get(id);
    }

    private void periodicCleanup() {
        // this runs on its own thread
        LOGGER.info("start periodic cleanup now");
        for (Iterator<FileInfo> iterator = fileInfoMap.values().iterator(); iterator.hasNext(); ) {
            FileInfo fi = iterator.next();
            Duration lifetime = Duration.between(fi.getCreation(), Instant.now());
            if (lifetime.compareTo(storagePolicy.getMaxAllowedLifetime()) > 0) {
                LOGGER.debug("removing entry: " + fi.getId());
                dataStore.delete(fi.getId(), fi.getPath());
                iterator.remove();
            }
        }
    }
}
