package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.app.config.UrlResolverConfig;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.core.xc.LinkException;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import eu.clarin.switchboard.profiler.general.TikaProfiler;
import org.apache.tika.config.TikaConfig;
import org.junit.Before;
import org.junit.Test;

import java.nio.file.Files;
import java.nio.file.Path;

public class MediaLibraryTest {
    MediaLibrary mediaLibrary;

    @Before
    public void setUp() throws Exception {
        Path dataStoreRoot = Files.createTempDirectory("switchboard-test-");
        String maxSize = "1M";
        String maxLifetime = "4";
        String maxLifetimeUnit = "seconds";
        String cleanupPeriod = "1";
        String cleanupPeriodUnit = "seconds";
        DataStoreConfig dataStoreConfig = new DataStoreConfig(
                dataStoreRoot.toString(), false, maxSize, maxLifetime, maxLifetimeUnit, cleanupPeriod, cleanupPeriodUnit);
        StoragePolicy storagePolicy = new DefaultStoragePolicy(dataStoreConfig);
        DataStore dataStore = new DataStore(dataStoreRoot, storagePolicy);

        TikaConfig tikaConfig = new TikaConfig(this.getClass().getResourceAsStream("/tikaConfig.xml"));
        Profiler profiler = new TikaProfiler(tikaConfig);

        UrlResolverConfig urlResolver = new UrlResolverConfig(3, 3, "seconds");

        mediaLibrary = new MediaLibrary(dataStore, profiler, storagePolicy, urlResolver);
    }

    @Test(expected = LinkException.class)
    public void addMedia1() throws CommonException, ProfilingException {
        mediaLibrary.addMedia("http://this^is&a)bad@url");
    }

    @Test(expected = StoragePolicyException.class)
    public void addMedia() throws CommonException {
        // a site that does a HTTP redirect
        mediaLibrary.addMedia("http://clarin.eu");
    }
}
