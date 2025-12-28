package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.app.config.UrlResolverConfig;
import eu.clarin.switchboard.core.DataStore;
import eu.clarin.switchboard.core.DefaultStoragePolicy;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.profiler.DefaultProfiler;
import eu.clarin.switchboard.profiler.api.Profiler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class DataResourceTest {
    DataResource dataResource;

    @BeforeEach
    public void setUp() throws Exception {
        Path dataStoreRoot = Files.createTempDirectory("switchboard-test-");
        String maxSize = "1M";
        String maxFiles = "2";
        String maxLifetime = "4";
        String maxLifetimeUnit = "seconds";
        String cleanupPeriod = "1";
        String cleanupPeriodUnit = "seconds";

        DataStoreConfig dataStoreConfig = new DataStoreConfig(
                dataStoreRoot.toString(), false, maxSize, maxFiles, maxLifetime, maxLifetimeUnit, cleanupPeriod, cleanupPeriodUnit);

        DefaultStoragePolicy storagePolicy = new DefaultStoragePolicy(dataStoreConfig);
        storagePolicy.setSupportedToolMediaTypes(Collections.singleton("text/plain"));

        DataStore dataStore = new DataStore(dataStoreRoot, storagePolicy);
        DefaultProfiler profiler = new DefaultProfiler();
        UrlResolverConfig urlResolver = new UrlResolverConfig(3, 3, 3, 3, "seconds", 10, 8192L);
        MediaLibrary mediaLibrary = new MediaLibrary(
                dataStore, profiler, profiler.getTextExtractor(),
                storagePolicy, urlResolver, dataStoreConfig);
        dataResource = new DataResource(mediaLibrary);
    }


    @Test
    public void getFile() throws Throwable {
        InputStream is = new ByteArrayInputStream("first content".getBytes(StandardCharsets.UTF_8));

        Response postResponse = dataResource.postFile("", is, "filename", null, null);
        String id = ((Map) postResponse.getEntity()).get("id").toString();

        Response r = dataResource.getFile(id, null, null);
        assertEquals("text/plain;charset=utf-8", r.getHeaderString("content-type"));
    }

    @Test
    public void getFileInfo() throws Throwable {
        String filename = "myfilename";
        InputStream is = new ByteArrayInputStream("first content".getBytes(StandardCharsets.UTF_8));

        Response postResponse = dataResource.postFile("", is, filename, null, null);
        String id = ((Map) postResponse.getEntity()).get("id").toString();

        Response r = dataResource.getFileInfo("/info", id);
        Map fileinfo = ((Map) r.getEntity());

        assertEquals(id, fileinfo.get("id").toString());
        assertEquals(filename, fileinfo.get("filename").toString());
        assertTrue((int)fileinfo.get("fileLength") > 0);
        assertFalse((boolean)fileinfo.get("selection"));
        assertEquals("text/plain", ((Map)fileinfo.get("profile")).get("mediaType"));
    }

    @Test
    public void putContent() throws Throwable {
        String newContent = "new content";
        InputStream is = new ByteArrayInputStream("first content".getBytes(StandardCharsets.UTF_8));

        Response postResponse = dataResource.postFile("", is, "filename", null, null);
        String id = ((Map) postResponse.getEntity()).get("id").toString();

        dataResource.putContent(id, newContent);

        Response r = dataResource.getFile(id, null, null);
        StreamingOutput output = (StreamingOutput) r.getEntity();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        output.write(baos);
        assertEquals(newContent, baos.toString());
    }
}