package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.app.config.UrlResolverConfig;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.core.xc.LinkException;
import eu.clarin.switchboard.core.xc.StorageException;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import eu.clarin.switchboard.profiler.DefaultProfiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class MediaLibraryTest {
    DataStoreConfig dataStoreConfig;
    DefaultStoragePolicy storagePolicy;
    DataStore dataStore;
    DefaultProfiler profiler;
    UrlResolverConfig urlResolver;

    @BeforeEach
    public void setUp() throws Exception {
        Path dataStoreRoot = Files.createTempDirectory("switchboard-test-");
        String maxSize = "1M";
        String maxFiles = "2";
        String maxLifetime = "4";
        String maxLifetimeUnit = "seconds";
        String cleanupPeriod = "1";
        String cleanupPeriodUnit = "seconds";
        dataStoreConfig = new DataStoreConfig(
                dataStoreRoot.toString(), false, maxSize, maxFiles, maxLifetime, maxLifetimeUnit, cleanupPeriod, cleanupPeriodUnit);

        storagePolicy = new DefaultStoragePolicy(dataStoreConfig);
        storagePolicy.setSupportedToolMediaTypes(Collections.singleton("text/plain"));

        dataStore = new DataStore(dataStoreRoot, storagePolicy);

        profiler = new DefaultProfiler();

        urlResolver = new UrlResolverConfig(3, 3, 3, 3, "seconds", 10, 8192L);
    }

    @Test
    public void allOk() throws IOException, StoragePolicyException, ProfilingException, StorageException {
        MediaLibrary mediaLibrary = new MediaLibrary(
                dataStore, profiler, profiler.getTextExtractor(),
                storagePolicy, urlResolver, dataStoreConfig);
        mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
        mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
        assert (true);
    }

    @Test
    public void tooManyFiles() throws IOException, StoragePolicyException, ProfilingException, StorageException {
        assertThrows(StoragePolicyException.class, () -> {
            MediaLibrary mediaLibrary = new MediaLibrary(
                    dataStore, profiler, profiler.getTextExtractor(),
                    storagePolicy, urlResolver, dataStoreConfig);
            mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
            mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
            mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
        });
    }

    @Test
    public void addMedia1() throws CommonException, ProfilingException {
        assertThrows(LinkException.class, () -> {
            MediaLibrary mediaLibrary = new MediaLibrary(
                    dataStore, profiler, profiler.getTextExtractor(),
                    storagePolicy, urlResolver, dataStoreConfig);
            mediaLibrary.addByUrl("http://this^is&a)bad@url", null);
        });
    }

    @Test
    public void addMedia2() throws CommonException, ProfilingException {
        assertThrows(StoragePolicyException.class, () -> {
            MediaLibrary mediaLibrary = new MediaLibrary(
                    dataStore, profiler, profiler.getTextExtractor(),
                    storagePolicy, urlResolver, dataStoreConfig);
            // a "font/woff2" file is in principle not allowed
            mediaLibrary.addByUrl("https://www.clarin.eu/themes/contrib/clarin_bootstrap/fonts/sourcesans3/SourceSans3-Regular.ttf.woff2", null);
        });
    }
}
