package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import org.junit.Before;
import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.*;


public class DataStoreTest {
    DataStore dataStore;

    @Before
    public void setUp() throws Exception {
        Path dataStoreRoot = Files.createTempDirectory("switchboard-test-");
        String maxSize = "1k";
        String maxLifetime = "4";
        String maxLifetimeUnit = "seconds";
        String cleanupPeriod = "1";
        String cleanupPeriodUnit = "seconds";
        DataStoreConfig dataStoreConfig = new DataStoreConfig(
                dataStoreRoot.toString(), false, maxSize, maxLifetime, maxLifetimeUnit, cleanupPeriod, cleanupPeriodUnit);
        StoragePolicy storagePolicy = new DefaultStoragePolicy(dataStoreConfig);
        dataStore = new DataStore(dataStoreRoot, storagePolicy);
    }

    @Test
    public void saveAndDelete() throws IOException, StoragePolicyException {
        UUID id = UUID.randomUUID();
        String content = "this is the file's cöntent";

        InputStream is = new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
        Path path = dataStore.save(id, "test", is);

        assertTrue(path.toFile().exists());

        List<String> lines = Files.readAllLines(path);
        assertEquals(lines.size(), 1);
        assertEquals(lines.get(0), content);

        dataStore.delete(id, path);
        assertFalse(path.toFile().exists());
        assertFalse(path.getParent().toFile().exists());
    }

    @Test
    public void setContent() throws IOException, StoragePolicyException {
        UUID id = UUID.randomUUID();
        String content = "first content";
        String newcontent = "now updated";

        InputStream is = new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
        Path path = dataStore.save(id, "test_set_content", is);
        assertArrayEquals(Files.readAllBytes(path), content.getBytes(StandardCharsets.UTF_8));

        dataStore.setContent(path, newcontent);
        assertArrayEquals(Files.readAllBytes(path), newcontent.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    public void eraseAllStorage() throws IOException, StoragePolicyException {
        String filename = "test";
        String content = "this is the file's cöntent";

        Path path1 = dataStore.save(UUID.randomUUID(), "test",
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)));
        Path path2 = dataStore.save(UUID.randomUUID(), "test2",
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)));
        Path path3 = dataStore.save(UUID.randomUUID(), "test2",
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)));

        dataStore.eraseAllStorage();

        assertFalse(path1.toFile().exists());
        assertFalse(path1.getParent().toFile().exists());

        assertFalse(path2.toFile().exists());
        assertFalse(path2.getParent().toFile().exists());

        assertFalse(path3.toFile().exists());
        assertFalse(path3.getParent().toFile().exists());

        Path storePath = path1.getParent().getParent();
        assertTrue(storePath.toFile().exists());
        assertEquals(storePath.toFile().listFiles().length, 0);
    }
}
