package eu.clarin.switchboard.core;

import eu.clarin.switchboard.core.xc.ConverterException;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.nio.file.Paths;

import static org.junit.Assert.assertEquals;

public class ConverterTest {
    static String expected = "The CLARIN center federation consists of universities and research institutes " +
            "throughout Europe. These centers provide an infrastructure for the distributed access " +
            "and processing of written, spoken and multi-modal language data.";

    Converter converter;

    @Before
    public void setUp() throws Exception {
        converter = new Converter("./tikaConfig.xml");
    }

    @Test
    public void pdf() throws IOException, ConverterException {
        String fileName = "./src/test/resources/test.pdf";
        String converted = converter.parseToPlainText(Paths.get(fileName).toFile());
        // pdf is a lossy format, we have to normalize spacing characters
        converted = converted.replaceAll("\\s+", " ");
        assertEquals(expected, converted);
    }

    @Test
    public void doc() throws IOException, ConverterException {
        String fileName = "./src/test/resources/test.doc";
        String converted = converter.parseToPlainText(Paths.get(fileName).toFile());
        assertEquals(expected, converted);
    }

    @Test
    public void rtf() throws IOException, ConverterException {
        String fileName = "./src/test/resources/test.rtf";
        String converted = converter.parseToPlainText(Paths.get(fileName).toFile());
        assertEquals(expected, converted);
    }
}
