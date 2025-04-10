package eu.clarin.switchboard.core;

import java.util.Set;

public class Constants {
    public static final String MEDIATYPE_ZIP = "application/zip";
    public static final String MEDIATYPE_TAR = "application/x-tar";
    public static final String MEDIATYPE_GZIP = "application/gzip";
    public static final String MEDIATYPE_BZIP = "application/x-bzip2";

    public static final Set<String> ACCEPTED_MEDIATYPE_TYPES = Set.of(
            "audio",
            "image",
            "video",
            "text"
    );
}
