package eu.clarin.switchboard.core;

import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class ProfilerTest {
    Profiler profiler;

    @Before
    public void setUp() throws Exception {
        profiler = new Profiler();
    }

    @Test
    public void testDetectMediatypePdf() throws IOException {
        String fileName = "./src/test/resources/test.pdf";
        String mediatype = profiler.detectMediatype(new File(fileName));
        assertEquals("application/pdf", mediatype);
    }

    @Test
    public void testDetectMediatypeTxt() throws IOException {
        String fileName = "./src/test/resources/test.txt";
        String mediatype = profiler.detectMediatype(new File(fileName));
        assertEquals("text/plain", mediatype);
    }

    @Test
    public void testDetectMediatypeRtf() throws IOException {
        String fileName = "./src/test/resources/test.rtf";
        String mediatype = profiler.detectMediatype(new File(fileName));
        assertEquals("application/rtf", mediatype);
    }

    @Test
    public void testDetectMediatypeDoc() throws IOException {
        String fileName = "./src/test/resources/test.doc";
        String mediatype = profiler.detectMediatype(new File(fileName));
        assertEquals("application/msword", mediatype);
    }

    @Test
    public void testDetectLanguageFile() throws IOException {
        String fileName = "./src/test/resources/test.txt";
        String mediatype = profiler.detectLanguage(new File(fileName));
        assertEquals(mediatype, "en");
    }

    public void testDetectLanguageText() {
        String mediatype = profiler.detectLanguage(
                "The CLARIN center federation consists of universities and research institutes throughout Europe.");
        assertEquals(mediatype, "en");
    }

    @Test
    public void testDetectLanguageFileDe() throws IOException {
        String fileName = "./src/test/resources/test.txt";
        String mediatype = profiler.detectLanguage(new File(fileName));
        assertEquals(mediatype, "en");
    }

    public void testDetectLanguageTextDe() {
        String mediatype = profiler.detectLanguage("Karin fliegt nach New York. Sie will dort Urlaub machen.");
        assertEquals(mediatype, "de");
    }

    public void testDetectLanguageTextEs() {
        String mediatype = profiler.detectLanguage("Picasso comenzó a pintar desde edad temprana.");
        assertEquals(mediatype, "es");
    }
}