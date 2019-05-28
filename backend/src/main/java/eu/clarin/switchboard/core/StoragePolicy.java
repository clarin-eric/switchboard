package eu.clarin.switchboard.core;

import java.io.File;

public interface StoragePolicy {
    long getMaxAllowedDataSize();
    void check(File file) throws StoragePolicyException;
    void checkProfile(String mediatype, String language) throws StoragePolicyException;
}
