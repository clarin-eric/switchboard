package eu.clarin.switchboard.core;

import eu.clarin.switchboard.core.xc.StoragePolicyException;

import java.io.File;
import java.time.Duration;

public interface StoragePolicy {
    long getMaxAllowedDataSize();

    void acceptFile(File file) throws StoragePolicyException;

    void acceptProfile(String mediatype, String language) throws StoragePolicyException;

    Duration getMaxAllowedLifetime();

    Duration getCleanupPeriod();
}
