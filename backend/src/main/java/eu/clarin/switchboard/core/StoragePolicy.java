package eu.clarin.switchboard.core;

import eu.clarin.switchboard.core.xc.StoragePolicyException;
import eu.clarin.switchboard.profiler.api.Profile;

import java.io.File;
import java.time.Duration;

public interface StoragePolicy {
    long getMaxAllowedDataSize();

    long getMaxAllowedTotalFiles();

    void acceptFile(File file) throws StoragePolicyException;

    void acceptSize(long fileSize) throws StoragePolicyException;

    void acceptProfile(Profile profile) throws StoragePolicyException;

    Duration getMaxAllowedLifetime();

    Duration getCleanupPeriod();
}
