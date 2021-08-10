package eu.clarin.switchboard.core;

import eu.clarin.switchboard.profiler.api.Profile;

import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class FileInfo {
    public enum SpecialResourceType {
        EXTRACTED_TEXT, // text extracted from another resource
    }

    private final UUID id;

    private final String filename; // original filename, on disk we use a sanitized form
    private final Path path; // actual path on disk
    private final long fileLength;

    private Profile.Flat profile;
    private List<Profile.Flat> secondaryProfiles;

    private String originalLink; // original link; can point to a landing page, not to the data
    private String downloadLink; // link used for downloading from original location
    private int httpRedirects; // if getting the data requires redirects

    private boolean selection; // if content is coming from a user selection

    private UUID sourceID; // if this resource is derived from another resource (e.g. zip)
    private String sourceEntryName; // if this resource is derived from another resource (e.g. zip)
    private SpecialResourceType specialResourceType;

    public FileInfo(UUID id, String filename, Path path) {
        this.id = id;
        this.filename = filename;
        this.path = path;

        this.fileLength = path == null ? -1 : path.toFile().length();
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

    public Profile.Flat getProfile() {
        return profile;
    }

    public List<Profile.Flat> getSecondaryProfiles() {
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

    public boolean isSelection() {
        return selection;
    }

    public SpecialResourceType getSpecialResourceType() {
        return specialResourceType;
    }

    public UUID getSourceID() {
        return sourceID;
    }

    public String getSourceEntryName() {
        return sourceEntryName;
    }

    void setLinksInfo(String originalUrlOrDoiOrHandle, String downloadLink, int redirects) {
        this.originalLink = originalUrlOrDoiOrHandle;
        this.downloadLink = downloadLink;
        this.httpRedirects = redirects;
    }

    public void setProfiles(Profile profile, List<Profile> secondaryProfiles) {
        this.profile = profile.flat();
        this.secondaryProfiles = secondaryProfiles.stream().map(Profile::flat).collect(Collectors.toList());
    }

    public void setSelection(boolean selection) {
        this.selection = selection;
    }

    public void setSource(UUID sourceID, String sourceEntryName) {
        this.sourceID = sourceID;
        this.sourceEntryName = sourceEntryName;
    }

    public void setSpecialResourceType(SpecialResourceType specialResourceType) {
        this.specialResourceType = specialResourceType;
    }

    @Override
    public String toString() {
        return "FileInfo: " +
                "\nid=" + id +
                "\nfilename='" + filename + '\'' +
                "\npath=" + path +
                "\nfileLength=" + fileLength +
                "\noriginalLink='" + originalLink + '\'' +
                "\nhttpRedirects=" + httpRedirects +
                "\nselection=" + selection +
                "\nspecialResourceType=" + specialResourceType +
                "\nsourceID=" + sourceID +
                "\nsourceEntryName=" + sourceEntryName +
                "\nprofile=" + profile +
                "\nsecondaryProfiles=" + secondaryProfiles;
    }
}
