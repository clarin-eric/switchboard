package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;


public class DataStoreTest {
    DataStore dataStore;

    @BeforeEach
    public void setUp() throws Exception {
        Path dataStoreRoot = Files.createTempDirectory("switchboard-test-");
        String maxSize = "1k";
        String maxFiles = "10";
        String maxLifetime = "4";
        String maxLifetimeUnit = "seconds";
        String cleanupPeriod = "1";
        String cleanupPeriodUnit = "seconds";
        DataStoreConfig dataStoreConfig = new DataStoreConfig(
                dataStoreRoot.toString(), false, maxSize, maxFiles, maxLifetime, maxLifetimeUnit, cleanupPeriod, cleanupPeriodUnit);
        StoragePolicy storagePolicy = new DefaultStoragePolicy(dataStoreConfig);
        dataStore = new DataStore(dataStoreRoot, storagePolicy);
    }

    @Test
    public void saveAndDelete() throws IOException, StoragePolicyException {
        UUID id = UUID.randomUUID();
        String content = "this is the file's cöntent";

        InputStream is = streamFrom(content);
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

        InputStream is = streamFrom(content);
        Path path = dataStore.save(id, "test_set_content", is);
        assertArrayEquals(Files.readAllBytes(path), content.getBytes(StandardCharsets.UTF_8));

        dataStore.setContent(path, newcontent);
        assertArrayEquals(Files.readAllBytes(path), newcontent.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    public void eraseAllStorage() throws IOException, StoragePolicyException {
        String filename = "test";
        String content = "this is the file's cöntent";

        Path path1 = dataStore.save(UUID.randomUUID(), "test", streamFrom(content));
        Path path2 = dataStore.save(UUID.randomUUID(), "test2", streamFrom(content));
        Path path3 = dataStore.save(UUID.randomUUID(), "test2", streamFrom(content));

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

    @Test
    public void uploadTooLarge() throws IOException, StoragePolicyException {
        assertThrows(StoragePolicyException.class, () -> {
            UUID id = UUID.randomUUID();
            InputStream is = new ByteArrayInputStream(new byte[2 * 1024]);
            Path path = dataStore.save(id, "test", is);
        });
    }

    @Test
    public void sanitize() {
        assertEquals("___1_2_3_4_5_6_7_8_9_0", DataStore.sanitize("~`!1@2#3$4%5^6&7*8(9)0"));
        assertEquals("_-+=_____________.__", DataStore.sanitize("_-+={[}]:;'\"|\\<,>.?/"));
        assertEquals("abcdefghijklmnopqrstuvxyw", DataStore.sanitize("abcdefghijklmnopqrstuvxyw"));
        assertEquals("ABCDEFGHIJKLMNOPQRSTUVXYZW", DataStore.sanitize("ABCDEFGHIJKLMNOPQRSTUVXYZW"));
        assertEquals("_____alpha", DataStore.sanitize("❗️:)😀alpha"));
        assertEquals("my.test.file+12-AZ=", DataStore.sanitize("my.test.file+12-AZ="));
    }

    public static InputStream streamFrom(String input) {
        return new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8));
    }
}
