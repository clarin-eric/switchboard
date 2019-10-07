package eu.clarin.switchboard.core;

import eu.clarin.switchboard.core.xc.ConverterException;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.SAXException;

import java.io.*;

public class Converter {
    TikaConfig config;

    public Converter(String configPath) throws TikaException, IOException, SAXException {
        config = new TikaConfig(configPath);
    }

    public String parseToPlainText(File file) throws IOException, ConverterException {
        AutoDetectParser parser = new AutoDetectParser(config);
        BodyContentHandler handler = new BodyContentHandler();
        Metadata metadata = new Metadata();
        try (InputStream stream = new BufferedInputStream(new FileInputStream(file))) {
            parser.parse(stream, handler, metadata);
            String str = handler.toString();
            return str.trim();
        } catch (TikaException | SAXException xc) {
            throw new ConverterException(xc);
        }
    }
}
