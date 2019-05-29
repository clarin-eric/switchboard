package eu.clarin.switchboard.core;

import com.google.common.io.ByteStreams;
import gnu.trove.set.hash.TIntHashSet;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

/**
 * DataStore handles data at the file level. It tries to keep the original filename,
 * since it can be useful to the profiler (e.g. getting metadata from extension).
 */
public class DataStore {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(DataStore.class);

    Path dataStoreRoot;
    StoragePolicy storagePolicy;

    public DataStore(Path dataStoreRoot, StoragePolicy storagePolicy) throws IOException {
        this.dataStoreRoot = dataStoreRoot;
        this.storagePolicy = storagePolicy;
    }

    public Path save(UUID id, String filename, InputStream inputStream) throws IOException, StoragePolicyException {
        Path idDir = dataStoreRoot.resolve(id.toString());
        Files.createDirectory(idDir);

        filename = sanitize(filename);
        Path path = idDir.resolve(filename);

        long limit = storagePolicy.getMaxAllowedDataSize() + 1; // set limit just above the maximum
        InputStream limitedInputStream = ByteStreams.limit(inputStream, limit);
        Files.copy(limitedInputStream, path);

        try {
            storagePolicy.check(path.toFile());
        } catch (StoragePolicyException e) {
            this.delete(id, path);
            LOGGER.info("storage policy check: reject store of: " + filename);
            throw e;
        }

        return path;
    }

    final static String illegalCharsString = "\"'*/:<>?\\|";
    final static TIntHashSet illegalChars = new TIntHashSet();

    static {
        illegalCharsString.codePoints().forEachOrdered(illegalChars::add);
    }

    private static String sanitize(String filename) {
        StringBuilder cleanName = new StringBuilder();
        filename.codePoints().forEachOrdered(c -> {
            boolean replace = c < 32 || illegalChars.contains(c);
            cleanName.appendCodePoint(replace ? '_' : c);
        });
        return cleanName.toString();
    }

    public void delete(UUID id, Path path) {
        try {
            Files.delete(path);
            Path idDir = dataStoreRoot.resolve(id.toString());
            Files.delete(idDir);
        } catch (IOException xc) {
            LOGGER.error("data store: cannot remove file/dir: " + path);
        }
    }
}
