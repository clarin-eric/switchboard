package eu.clarin.switchboard.core;

import com.google.common.base.Optional;
import com.optimaize.langdetect.LanguageDetector;
import com.optimaize.langdetect.LanguageDetectorBuilder;
import com.optimaize.langdetect.i18n.LdLocale;
import com.optimaize.langdetect.ngram.NgramExtractors;
import com.optimaize.langdetect.profiles.LanguageProfile;
import com.optimaize.langdetect.profiles.LanguageProfileReader;
import com.optimaize.langdetect.text.CommonTextObjectFactories;
import com.optimaize.langdetect.text.TextObject;
import com.optimaize.langdetect.text.TextObjectFactory;
import org.apache.tika.Tika;
import org.apache.tika.detect.Detector;
import org.apache.tika.io.TemporaryResources;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.metadata.TikaMetadataKeys;
import org.apache.tika.mime.MediaType;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;

public class Profiler {
    public static final int SHORT_TEXT_THRESHOLD = 15;

    private Detector mediaTypeDetector;
    private LanguageDetector languageDetector;

    public Profiler() throws IOException {
        mediaTypeDetector = new Tika().getDetector();

        List<LanguageProfile> languageProfiles = new LanguageProfileReader().readAllBuiltIn();
        languageDetector = LanguageDetectorBuilder.create(NgramExtractors.standard())
                .withProfiles(languageProfiles)
                .build();
    }

    public String detectMediatype(File file) throws IOException {
        try (TikaInputStream inputStream = TikaInputStream.get(new FileInputStream(file), new TemporaryResources())) {
            Metadata metadata = new Metadata();
            metadata.add(TikaMetadataKeys.RESOURCE_NAME_KEY, file.getName());
            MediaType mediaType = mediaTypeDetector.detect(inputStream, metadata);
            return mediaType.toString();
        }
    }

    public String detectLanguage(File file) throws IOException {
        // TODO?: read only a part of the text for language detection
        String text = new String(Files.readAllBytes(file.toPath()), StandardCharsets.UTF_8);
        return detectLanguage(text);
    }

    public String detectLanguage(String text) {
        TextObjectFactory textObjectFactory;
        if (text.length() < SHORT_TEXT_THRESHOLD) {
            textObjectFactory = CommonTextObjectFactories.forDetectingShortCleanText();
        } else {
            textObjectFactory = CommonTextObjectFactories.forDetectingOnLargeText();
        }
        TextObject textObject = textObjectFactory.forText(text);
        Optional<LdLocale> locale = languageDetector.detect(textObject);
        if (locale.isPresent()) {
            return locale.get().getLanguage();
        }
        return null;
    }
}
