package eu.clarin.switchboard.profiler;

import eu.clarin.switchboard.profiler.DefaultProfiler;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class DefaultProfilerTest {
    DefaultProfiler profiler;

    @Before
    public void setUp() throws Exception {
        profiler = new DefaultProfiler();
    }

    @Test
    public void simpleTestPdf() throws IOException, ProfilingException {
        Profile profile = profiler.profile(file("pdf", "test.pdf"));
        assertEquals("application/pdf", profile.getMediaType());
        assertEquals("eng", profile.getLanguage());
    }

    @Test
    public void simpleTestTxt() throws IOException, ProfilingException {
        Profile profile = profiler.profile(file("text", "test.txt"));
        assertEquals("text/plain", profile.getMediaType());
        assertEquals("eng", profile.getLanguage());
    }

    private File file(String type, String name) {
        return new File("./src/test/resources/" + type + "/" + name);
    }
}
