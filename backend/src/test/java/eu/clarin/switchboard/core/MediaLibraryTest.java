package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.app.config.UrlResolverConfig;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.core.xc.LinkException;
import eu.clarin.switchboard.core.xc.StorageException;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import eu.clarin.switchboard.profiler.general.TikaProfiler;
import org.apache.tika.config.TikaConfig;
import org.junit.Before;
import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

public class MediaLibraryTest {
    DataStoreConfig dataStoreConfig;
    DefaultStoragePolicy storagePolicy;
    DataStore dataStore;
    Profiler profiler;
    UrlResolverConfig urlResolver;

    @Before
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
        storagePolicy.setAllowedMediaTypes(Collections.singleton("text/plain"));

        dataStore = new DataStore(dataStoreRoot, storagePolicy);

        TikaConfig tikaConfig = new TikaConfig(this.getClass().getResourceAsStream("/tikaConfig.xml"));
        profiler = new TikaProfiler(tikaConfig);

        urlResolver = new UrlResolverConfig(3, 3, "seconds", 10);
    }

    @Test
    public void allOk() throws IOException, StoragePolicyException, ProfilingException, StorageException {
        MediaLibrary mediaLibrary = new MediaLibrary(dataStore, profiler, storagePolicy, urlResolver, dataStoreConfig);
        mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
        mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
        assert (true);
    }

    @Test(expected = StoragePolicyException.class)
    public void tooManyFiles() throws IOException, StoragePolicyException, ProfilingException, StorageException {
        MediaLibrary mediaLibrary = new MediaLibrary(dataStore, profiler, storagePolicy, urlResolver, dataStoreConfig);
        mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
        mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
        mediaLibrary.addFile("test", new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8)), null);
        assert (false); // will not get here
    }

    @Test(expected = LinkException.class)
    public void addMedia1() throws CommonException, ProfilingException {
        MediaLibrary mediaLibrary = new MediaLibrary(dataStore, profiler, storagePolicy, urlResolver, dataStoreConfig);
        mediaLibrary.addByUrl("http://this^is&a)bad@url");
    }

    @Test(expected = StoragePolicyException.class)
    public void addMedia2() throws CommonException, ProfilingException {
        MediaLibrary mediaLibrary = new MediaLibrary(dataStore, profiler, storagePolicy, urlResolver, dataStoreConfig);
        // a site that does a HTTP redirect
        mediaLibrary.addByUrl("http://clarin.eu");
    }
}
