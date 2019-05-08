package eu.clarin.switchboard.core;

import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.SAXException;

import java.io.*;
import java.nio.file.Files;

public class Converter {
    public String parseToPlainText(File file) throws IOException, ConverterException {
        AutoDetectParser parser = new AutoDetectParser();
        BodyContentHandler handler = new BodyContentHandler();
        Metadata metadata = new Metadata();
        try (InputStream stream = new BufferedInputStream(new FileInputStream(file))) {
//            java.util.Scanner s = new java.util.Scanner(stream).useDelimiter("\\A");
//            String text = s.hasNext() ? s.next() : "";
            parser.parse(stream, handler, metadata);
            return handler.toString();
        } catch (TikaException | SAXException xc) {
            throw new ConverterException(xc);
        }
    }
}
