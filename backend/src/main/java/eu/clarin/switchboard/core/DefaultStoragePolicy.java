package eu.clarin.switchboard.core;

import java.io.File;
import java.util.Set;

public class DefaultStoragePolicy implements StoragePolicy {
    long maxAllowedDataSize;
    Set<String> allowedMediaTypes;

    public DefaultStoragePolicy(long maxAllowedDataSize) {
        this.maxAllowedDataSize = maxAllowedDataSize;
    }

    public void setAllowedMediaTypes(Set<String> allowedMediaTypes) {
        this.allowedMediaTypes = allowedMediaTypes;
    }

    @Override
    public long getMaxAllowedDataSize() {
        return maxAllowedDataSize;
    }

    @Override
    public void check(File file) throws StoragePolicyException {
        if (file.length() > maxAllowedDataSize) {
            throw new StoragePolicyException("input data too big, maximum allowed size: " + maxAllowedDataSize + " bytes",
                    StoragePolicyException.Kind.TOO_BIG);
        }
    }

    @Override
    public void checkProfile(String mediatype, String language) throws StoragePolicyException {
        if (!allowedMediaTypes.contains(mediatype)) {
            throw new StoragePolicyException("mediatype not allowed: " + mediatype,
                    StoragePolicyException.Kind.MEDIA_NOT_ALLOWED);
        }
    }
}
