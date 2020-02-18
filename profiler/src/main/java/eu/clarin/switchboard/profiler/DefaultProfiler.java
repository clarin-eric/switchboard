package eu.clarin.switchboard.profiler;

import com.google.common.collect.ImmutableSet;
import eu.clarin.switchboard.profiler.api.LanguageCode;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import eu.clarin.switchboard.profiler.general.OptimaizeLanguageDetector;
import eu.clarin.switchboard.profiler.general.TikaProfiler;
import eu.clarin.switchboard.profiler.general.TikaTextExtractor;
import eu.clarin.switchboard.profiler.xml.XmlProfiler;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import javax.ws.rs.core.MediaType;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import java.util.Set;

public class DefaultProfiler implements Profiler {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(Profiler.class);

    public static final Set<String> convertableMediatypes = ImmutableSet.of(
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

    Profiler tikaProfiler;
    Profiler xmlProfiler;
    TikaTextExtractor textExtractor;
    OptimaizeLanguageDetector languageDetector;

    public DefaultProfiler() throws TikaException, IOException, SAXException {
        TikaConfig tikaConfig = new TikaConfig(this.getClass().getResourceAsStream("/tikaConfig.xml"));
        tikaProfiler = new TikaProfiler(tikaConfig);
        xmlProfiler = new XmlProfiler();
        textExtractor = new TikaTextExtractor(tikaConfig);
        languageDetector = new OptimaizeLanguageDetector();
    }

    public Profile profile(File file) throws IOException, ProfilingException {
        Profile profile = tikaProfiler.profile(file);

        LOGGER.debug("file " + file.getName() + ": " + profile.getMediaType());
        if (profile.isMediaType(MediaType.APPLICATION_XML)) {
            profile = xmlProfiler.profile(file);
            return profile;
        }

        if (profile.getLanguage() == null) {
            String language = detectLanguage(file, profile.getMediaType());
            profile = Profile.builder(profile).language(language).build();
        }

        return profile;
    }

    public String detectLanguage(File file, String mediaType) throws IOException {
        String languageCode = null;

        if (convertableMediatypes.contains(mediaType)) {
            try {
                String text = textExtractor.getText(file);
                languageCode = languageDetector.detect(text);
            } catch (IOException | TikaException | SAXException xc) {
                LOGGER.info("Cannot convert media to text for detecting the language: " + xc.getMessage());
            }
        } else if (!nonTextMediatypes.contains(mediaType)) {
            try (InputStream is = new BufferedInputStream(new FileInputStream(file))) {
                Scanner s = new Scanner(is, StandardCharsets.UTF_8.name()).useDelimiter("\\A");
                String text = s.hasNext() ? s.next() : "";
                languageCode = languageDetector.detect(text);
            }
        }

        return languageCode;
    }
}
