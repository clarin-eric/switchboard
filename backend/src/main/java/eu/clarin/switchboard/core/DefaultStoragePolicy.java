package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.Config;

import java.io.File;
import java.time.Duration;
import java.util.Set;

public class DefaultStoragePolicy implements StoragePolicy {
    Config.SwitchboardConfig.DataStoreConfig dataStoreConfig;
    Set<String> allowedMediaTypes;

    public DefaultStoragePolicy(Config.SwitchboardConfig.DataStoreConfig dataStoreConfig) {
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
            throw new StoragePolicyException("input data too big, maximum allowed size: " +
                    dataStoreConfig.getMaxSize() + " bytes",
                    StoragePolicyException.Kind.TOO_BIG);
        }
    }

    @Override
    public void acceptProfile(String mediatype, String language) throws StoragePolicyException {
        if (!allowedMediaTypes.contains(mediatype)) {
            throw new StoragePolicyException("mediatype not allowed: " + mediatype,
                    StoragePolicyException.Kind.MEDIA_NOT_ALLOWED);
        }
    }
}
