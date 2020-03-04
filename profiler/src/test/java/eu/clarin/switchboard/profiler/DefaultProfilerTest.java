package eu.clarin.switchboard.profiler;

import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class DefaultProfilerTest {
    DefaultProfiler profiler;

    @Before
    public void setUp() throws Exception {
        profiler = new DefaultProfiler();
    }

    @Test
    public void simpleTestPdf() throws IOException, ProfilingException {
        List<Profile> profiles = profiler.profile(file("pdf", "test.pdf"));
        assertEquals(1, profiles.size());
        assertEquals("application/pdf", profiles.get(0).getMediaType());
        assertEquals("eng", profiles.get(0).getFeature(Profile.FEATURE_LANGUAGE));
    }

    @Test
    public void simpleTestTxt() throws IOException, ProfilingException {
        List<Profile> profiles = profiler.profile(file("text", "test.txt"));
        assertEquals(1, profiles.size());
        assertEquals("text/plain", profiles.get(0).getMediaType());
        assertEquals("eng", profiles.get(0).getFeature(Profile.FEATURE_LANGUAGE));
    }

    private File file(String type, String name) {
        return new File("./src/test/resources/" + type + "/" + name);
    }
}
