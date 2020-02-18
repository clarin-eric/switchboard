package eu.clarin.switchboard.profiler.general;

import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.metadata.TikaMetadataKeys;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.SAXException;

import java.io.*;

public class TikaTextExtractor {
    AutoDetectParser parser;

    public TikaTextExtractor(TikaConfig config) {
        parser = new AutoDetectParser(config);
    }

    public String getText(File file) throws IOException, TikaException, SAXException {
        BodyContentHandler handler = new BodyContentHandler();

        try (TikaInputStream inputStream = TikaInputStream.get(file.toPath())) {
            Metadata metadata = new Metadata();
            metadata.add(TikaMetadataKeys.RESOURCE_NAME_KEY, file.getName());
            parser.parse(inputStream, handler, metadata);
        }

        String str = handler.toString();
        return str.trim();
    }
}
