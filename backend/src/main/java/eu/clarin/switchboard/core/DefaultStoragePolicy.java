package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import eu.clarin.switchboard.profiler.api.Profile;

import java.io.File;
import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

public class DefaultStoragePolicy implements StoragePolicy {
    private final DataStoreConfig dataStoreConfig;
    private Set<String> supportedToolMediaTypes = new HashSet<>();

    public DefaultStoragePolicy(DataStoreConfig dataStoreConfig) {
        this.dataStoreConfig = dataStoreConfig;
    }

    public void setSupportedToolMediaTypes(Set<String> supportedToolMediaTypes) {
        this.supportedToolMediaTypes = supportedToolMediaTypes;
    }

    @Override
    public long getMaxAllowedDataSize() {
        return dataStoreConfig.getMaxSize();
    }

    @Override
    public long getMaxAllowedTotalFiles() {
        return dataStoreConfig.getMaxFiles();
    }

    @Override
    public Duration getMaxAllowedLifetime() {
        return dataStoreConfig.getMaxLifetime();
    }

    @Override
    public Duration getCleanupPeriod() {
        return dataStoreConfig.getCleanupPeriod();
    }

    @Override
    public void acceptFile(File file) throws StoragePolicyException {
        if (file.length() > dataStoreConfig.getMaxSize()) {
            throw tooBig();
        }
    }

    @Override
    public void acceptSize(long fileSize) throws StoragePolicyException {
        if (fileSize > dataStoreConfig.getMaxSize()) {
            throw tooBig();
        }
    }

    @Override
    public void acceptProfile(Profile profile) throws StoragePolicyException {
        String mediaType = profile.getMediaType();

        if (!supportedToolMediaTypes.contains(mediaType) &&
            !isWhitelistedMediaType(profile)) {
                throw new StoragePolicyException("This resource type (" + mediaType + ") is currently not allowed.",
                StoragePolicyException.Kind.MEDIA_NOT_ALLOWED);
        }
    }

    private boolean isWhitelistedMediaType(Profile profile) {
        // allow xml as a special case, see https://github.com/clarin-eric/switchboard/issues/14
        return (profile.isXmlMediaType() || isArchiveOrCompressed(profile));
    }

    static final Set<String> ARCHIVE_OR_COMPRESSED_MEDIATYPES = Set.of(
            Constants.MEDIATYPE_TAR,
            Constants.MEDIATYPE_ZIP,
            Constants.MEDIATYPE_GZIP,
            Constants.MEDIATYPE_BZIP
    );

    private boolean isArchiveOrCompressed(Profile profile) {
        return ARCHIVE_OR_COMPRESSED_MEDIATYPES.contains(profile.getMediaType());
    }

    private boolean isDefaultAcceptedMediatypeType(String mediaType) {
        String type = mediaType.split("/")[0];
        return Constants.ACCEPTED_MEDIATYPE_TYPES.contains(type);
    }

    private StoragePolicyException tooBig() {
        return new StoragePolicyException(
                "The resource is too large. The maximum allowed data size is " +
                        humanSize(getMaxAllowedDataSize()) + ".",
                StoragePolicyException.Kind.TOO_BIG);
    }

    public static String humanSize(long maxSize) {
        final double K = 1024;
        if (maxSize < K) {
            return String.format("%d bytes", maxSize);
        } else if (maxSize < K * K) {
            return String.format("%.2f KiB", maxSize / K);
        } else if (maxSize < K * K * K) {
            return String.format("%.2f MiB", maxSize / K / K);
        } else {
            return String.format("%.2f GB", maxSize / K / K / K);
        }
    }
}
