package eu.clarin.switchboard.core;

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

    public DataStore(Path dataStoreRoot) throws IOException {
        // TODO: enforce storage policy
        this.dataStoreRoot = dataStoreRoot;
    }

    public Path save(UUID id, String filename, InputStream inputStream) throws IOException {
        Path idDir = dataStoreRoot.resolve(id.toString());
        Files.createDirectory(idDir);

        filename = sanitize(filename);
        Path path = idDir.resolve(filename);

        Files.copy(inputStream, path);
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
}
