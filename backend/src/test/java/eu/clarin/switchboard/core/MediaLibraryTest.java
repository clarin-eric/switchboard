package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.Config;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
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
        Config.SwitchboardConfig.DataStoreConfig dataStoreConfig = new Config.SwitchboardConfig.DataStoreConfig(
                dataStoreRoot.toString(), false, maxSize, maxLifetime, maxLifetimeUnit, cleanupPeriod, cleanupPeriodUnit);
        StoragePolicy storagePolicy = new DefaultStoragePolicy(dataStoreConfig);
        DataStore dataStore = new DataStore(dataStoreRoot, storagePolicy);

        Profiler profiler;
        profiler = new Profiler();

        Converter converter = new Converter("./tikaConfig.xml");

        Config.SwitchboardConfig.UrlResolverConfig urlResolver = new Config.SwitchboardConfig.UrlResolverConfig(3, 3, "seconds");

        mediaLibrary = new MediaLibrary(dataStore, profiler, converter, storagePolicy,
                urlResolver);
    }

    @Test(expected = StoragePolicyException.class)
    public void addMedia() throws CommonException {
        // just a random site that does a HTTP redirect
        mediaLibrary.addMedia("http://hoc.com");
    }
}
