package eu.clarin.switchboard.profiler;

import eu.clarin.switchboard.profiler.general.OptimaizeLanguageDetector;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class OptimaizeLanguageDetectorTest {
    OptimaizeLanguageDetector languageDetector;

    @Before
    public void setUp() throws Exception {
        languageDetector = new OptimaizeLanguageDetector();
    }

    @Test
    public void testDetectLanguageText() {
        String language = languageDetector.detect(
                "The CLARIN center federation consists of universities and research institutes throughout Europe.");
        assertEquals("eng", language);
    }

    @Test
    public void testDetectLanguageTextDe() {
        String language = languageDetector.detect("Karin fliegt nach New York. Sie will dort Urlaub machen.");
        assertEquals("deu", language);
    }

    @Test
    public void testDetectLanguageTextEs() {
        String language = languageDetector.detect("Picasso empezó a pintar desde edad temprana. " +
                "En 1889, a los ocho años, tras una corrida de toros y bajo la dirección de su padre " +
                "pintó El pequeño picador, su primera pintura al óleo, de la que siempre se negó a separarse.");
        assertEquals("spa", language);
    }
}
