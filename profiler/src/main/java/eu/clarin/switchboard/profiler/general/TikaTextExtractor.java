package eu.clarin.switchboard.profiler.general;

import com.google.common.collect.ImmutableSet;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.SAXException;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.Scanner;
import java.util.Set;

public class TikaTextExtractor {
    public static final Set<String> textualMediatypes = ImmutableSet.of(
            "application/pdf",
            "application/rtf",
            "application/msword",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public static final Set<String> nonTextMediatypes = ImmutableSet.of(
            "application/zip",
            "application/x-gzip",
            "audio/vnd.wave",
            "audio/x-wav",
            "audio/wav",
            "audio/mp3",
            "audio/mp4",
            "audio/x-mpeg"
    );

    AutoDetectParser parser;

    public TikaTextExtractor(TikaConfig config) {
        parser = new AutoDetectParser(config);
    }

    public String getText(File file, String mediaType) throws IOException, TikaException, SAXException {
        Objects.requireNonNull(mediaType);

        if (textualMediatypes.contains(mediaType)) {
            BodyContentHandler handler = new BodyContentHandler();
            try (TikaInputStream inputStream = TikaInputStream.get(file.toPath())) {
                Metadata metadata = new Metadata();
                metadata.add(Metadata.RESOURCE_NAME_KEY, file.getName());
                if (mediaType != null) {
                    metadata.add(Metadata.CONTENT_TYPE, file.getName());
                }
                parser.parse(inputStream, handler, metadata);
            }
            String text = handler.toString();
            return text.trim();
        }

        if (!nonTextMediatypes.contains(mediaType)) {
            String text;
            try (InputStream is = new BufferedInputStream(new FileInputStream(file))) {
                Scanner s = new Scanner(is, StandardCharsets.UTF_8.name()).useDelimiter("\\A");
                text = s.hasNext() ? s.next() : "";
            }
            return text.trim();
        }

        return null;
    }
}
