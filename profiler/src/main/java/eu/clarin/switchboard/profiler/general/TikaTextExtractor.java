package eu.clarin.switchboard.profiler.general;

import com.google.common.collect.ImmutableSet;
import eu.clarin.switchboard.profiler.json.JsonProfiler;
import eu.clarin.switchboard.profiler.xml.TcfProfiler;
import eu.clarin.switchboard.profiler.xml.TeiProfiler;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.SAXException;

import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.IOException;
import java.util.Objects;
import java.util.Set;

public class TikaTextExtractor {
    public static final Set<String> textualMediatypes = ImmutableSet.of(
            MediaType.TEXT_PLAIN,
            MediaType.TEXT_HTML,

            "application/pdf",
            "application/rtf",
            "application/msword",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            MediaType.APPLICATION_XML,
            TcfProfiler.MEDIATYPE_LEXICON,
            TcfProfiler.MEDIATYPE_TCF,
            TeiProfiler.MEDIATYPE_TEI,
            TeiProfiler.MEDIATYPE_TEI_CORPUS,
            TeiProfiler.MEDIATYPE_TEI_DTA,
            "text/folia+xml",

            MediaType.APPLICATION_JSON,
            JsonProfiler.MEDIATYPE_LIF
    );

    AutoDetectParser parser;

    public TikaTextExtractor(TikaConfig config) {
        parser = new AutoDetectParser(config);
    }

    public String getText(File file, String mediaType) throws IOException, TikaException {
        Objects.requireNonNull(mediaType);

        if (!textualMediatypes.contains(mediaType)) {
            return null;
        }

        BodyContentHandler handler = new BodyContentHandler();
        try (TikaInputStream inputStream = TikaInputStream.get(file.toPath())) {
            Metadata metadata = new Metadata();
            metadata.add(Metadata.RESOURCE_NAME_KEY, file.getName());
            metadata.add(Metadata.CONTENT_TYPE, mediaType);
            parser.parse(inputStream, handler, metadata);
        } catch (SAXException e) {
            // ignore, we just try to get the text
        }
        return handler.toString().trim();
    }
}
