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
    private Set<String> allowedMediaTypes = new HashSet<>();

    public DefaultStoragePolicy(DataStoreConfig dataStoreConfig) {
        this.dataStoreConfig = dataStoreConfig;
    }

    public void setAllowedMediaTypes(Set<String> allowedMediaTypes) {
        this.allowedMediaTypes = allowedMediaTypes;
    }

    @Override
    public long getMaxAllowedDataSize() {
        return dataStoreConfig.getMaxSize();
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
            throw new StoragePolicyException(
                    "The resource is too large. The maximum allowed data size is " +
                            humanSize(dataStoreConfig.getMaxSize()) + ".",
                    StoragePolicyException.Kind.TOO_BIG);
        }
    }

    @Override
    public void acceptProfile(Profile profile) throws StoragePolicyException {
        if (!allowedMediaTypes.contains(profile.getMediaType())) {
            // allow xml as a special case, see https://github.com/clarin-eric/switchboard/issues/14
            if (!profile.isXmlMediaType()) {
                throw new StoragePolicyException("This resource type (" + profile.getMediaType() + ") is currently not supported.",
                        StoragePolicyException.Kind.MEDIA_NOT_ALLOWED);
            }
        }
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
