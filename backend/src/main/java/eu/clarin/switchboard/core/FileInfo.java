package eu.clarin.switchboard.core;

import eu.clarin.switchboard.profiler.api.Profile;

import java.nio.file.Path;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class FileInfo {
    private final UUID id;
    private final Instant creation;

    private final String filename; // original filename, on disk we use a sanitized form
    private final Path path; // actual path on disk
    private final long fileLength;

    private Profile profile;
    private List<Profile> secondaryProfiles;

    private String originalLink; // original link; can point to a landing page, not to the data
    private String downloadLink; // link used for downloading from original location
    private int httpRedirects; // if getting the data requires redirects

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

    public Profile getProfile() {
        return profile;
    }

    public List<Profile> getSecondaryProfiles() {
        return secondaryProfiles;
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

    void setLinksInfo(String originalUrlOrDoiOrHandle, String downloadLink, int redirects) {
        this.originalLink = originalUrlOrDoiOrHandle;
        this.downloadLink = downloadLink;
        this.httpRedirects = redirects;
    }

    public void setProfiles(Profile profile, List<Profile> secondaryProfiles) {
        this.profile = profile;
        this.secondaryProfiles = secondaryProfiles;
    }

    @Override
    public String toString() {
        return "FileInfo: " +
                "\nid=" + id +
                "\ncreation=" + creation.toString() +
                "\nfilename='" + filename + '\'' +
                "\npath=" + path +
                "\nfileLength=" + fileLength +
                "\noriginalLink='" + originalLink + '\'' +
                "\nhttpRedirects=" + httpRedirects +
                "\nprofile=" + profile +
                "\nsecondaryProfiles=" + secondaryProfiles;
    }
}
