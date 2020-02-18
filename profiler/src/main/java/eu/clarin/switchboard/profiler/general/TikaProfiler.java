package eu.clarin.switchboard.profiler.general;

import eu.clarin.switchboard.profiler.api.LanguageCode;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import org.apache.tika.Tika;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.detect.Detector;
import org.apache.tika.exception.TikaException;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.metadata.TikaMetadataKeys;
import org.apache.tika.parser.AutoDetectParser;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import java.io.File;
import java.io.IOException;

public class TikaProfiler implements Profiler {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(TikaProfiler.class);

    Detector mediaTypeDetector;
    AutoDetectParser parser = new AutoDetectParser();

    public TikaProfiler(TikaConfig config) throws IOException, SAXException, TikaException {
        mediaTypeDetector = new Tika().getDetector();
    }

    @Override
    public Profile profile(File file) throws IOException {
        String mediatype;
        try (TikaInputStream inputStream = TikaInputStream.get(file.toPath())) {
            Metadata metadata = new Metadata();
            metadata.add(TikaMetadataKeys.RESOURCE_NAME_KEY, file.getName());
            mediatype = mediaTypeDetector.detect(inputStream, metadata).toString();
        }
//        try (TikaInputStream inputStream = TikaInputStream.get(file.toPath())) {
//            TikaOutline.MyContentHandler handler = new TikaOutline.MyContentHandler();
//            try {
//                parser.parse(data, handler, metadata);
//            } catch (SAXException | TikaException e) {
//                e.printStackTrace();
//            }
//            System.out.println("----------------- outline:");
//            System.out.println(handler.getDocumentOutline());
//        }

        return Profile.builder().mediaType(mediatype).build();
    }
}
