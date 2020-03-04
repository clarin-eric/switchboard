package eu.clarin.switchboard.profiler.general;

import com.optimaize.langdetect.LanguageDetectorBuilder;
import com.optimaize.langdetect.i18n.LdLocale;
import com.optimaize.langdetect.ngram.NgramExtractors;
import com.optimaize.langdetect.profiles.LanguageProfile;
import com.optimaize.langdetect.profiles.LanguageProfileReader;
import com.optimaize.langdetect.text.CommonTextObjectFactories;
import com.optimaize.langdetect.text.TextObject;
import com.optimaize.langdetect.text.TextObjectFactory;
import eu.clarin.switchboard.profiler.utils.LanguageCode;
import eu.clarin.switchboard.profiler.api.LanguageDetector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

public class OptimaizeLanguageDetector implements LanguageDetector {
    private static final Logger LOGGER = LoggerFactory.getLogger(OptimaizeLanguageDetector.class);

    public static final int SHORT_TEXT_THRESHOLD = 15;
    private static final int TEXT_LIMIT = 99000;

    final com.optimaize.langdetect.LanguageDetector detector;

    public OptimaizeLanguageDetector() throws IOException {
        List<LanguageProfile> languageProfiles = new LanguageProfileReader().readAllBuiltIn();
        detector = LanguageDetectorBuilder.create(NgramExtractors.standard())
                .withProfiles(languageProfiles)
                .build();
    }

    @Override
    public String detectLanguage(File file, String mediaType) throws IOException {
        String s = new String(Files.readAllBytes(file.toPath()));
        return detect(s);
    }

    /**
     * @return the detected ISO 639-3 code of the detected language, and "und"
     * (also a valid ISO code) if the language cannot be determined.
     */
    public String detect(String text) {
        if (text == null || text.isEmpty()) {
            return LanguageCode.UNDETERMINED;
        }
        if (text.length() > TEXT_LIMIT) {
            text = text.substring(0, TEXT_LIMIT);
        }

        TextObjectFactory textObjectFactory;
        if (text.length() < SHORT_TEXT_THRESHOLD) {
            textObjectFactory = CommonTextObjectFactories.forDetectingShortCleanText();
        } else {
            textObjectFactory = CommonTextObjectFactories.forDetectingOnLargeText();
        }

        TextObject textObject = textObjectFactory.forText(text);

        com.google.common.base.Optional<LdLocale> locale = detector.detect(textObject);

        if (locale.isPresent()) {
            String lang = locale.get().getLanguage();
            if (LanguageCode.isIso639_3(lang)) {
                return lang;
            }
            lang = LanguageCode.iso639_1to639_3(lang);
            if (LanguageCode.isIso639_3(lang)) {
                return lang;
            }
        }

        return LanguageCode.UNDETERMINED;
    }
}
