package eu.clarin.switchboard.profiler;

import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import eu.clarin.switchboard.profiler.general.OptimaizeLanguageDetector;
import eu.clarin.switchboard.profiler.general.TikaProfiler;
import eu.clarin.switchboard.profiler.general.TikaTextExtractor;
import eu.clarin.switchboard.profiler.json.JsonProfiler;
import eu.clarin.switchboard.profiler.text.TextProfiler;
import eu.clarin.switchboard.profiler.xml.XmlProfiler;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;


public class DefaultProfiler implements Profiler {
    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultProfiler.class);

    Profiler tikaProfiler;
    Profiler xmlProfiler;
    Profiler jsonProfiler;
    Profiler textProfiler;
    TikaTextExtractor textExtractor;
    OptimaizeLanguageDetector languageDetector;

    public DefaultProfiler() throws TikaException, IOException, SAXException {
        TikaConfig tikaConfig = new TikaConfig(this.getClass().getResourceAsStream("/tikaConfig.xml"));
        tikaProfiler = new TikaProfiler(tikaConfig);
        xmlProfiler = new XmlProfiler();
        jsonProfiler = new JsonProfiler();
        textProfiler = new TextProfiler();
        textExtractor = new TikaTextExtractor(tikaConfig);
        languageDetector = new OptimaizeLanguageDetector();
    }

    public List<Profile> profile(File file) throws IOException, ProfilingException {
        Profile profile;
        {
            List<Profile> tikaProfiles = tikaProfiler.profile(file);
            assert tikaProfiles.size() == 1;
            profile = tikaProfiles.get(0);
            LOGGER.debug("file " + file.getName() + "; tika returned: " + profile.getMediaType());
        }

        if (profile.isMediaType(MediaType.APPLICATION_XML)) {
            List<Profile> xmlProfiles = xmlProfiler.profile(file);
            assert xmlProfiles.size() == 1;
            LOGGER.debug("file " + file.getName() + "; xmlprof returned: " + xmlProfiles.get(0).getMediaType());
            return xmlProfiles;
        }

        if (profile.isMediaType(MediaType.APPLICATION_JSON)) {
            List<Profile> jsonProfiles = jsonProfiler.profile(file);
            if (jsonProfiles != null) {
                assert jsonProfiles.size() == 1;
                LOGGER.debug("file " + file.getName() + "; jsonprof returned: " + jsonProfiles.get(0).getMediaType());
                return jsonProfiles;
            }
        }

        if (profile.isMediaType(MediaType.TEXT_PLAIN)) {
            List<Profile> textProfiles = textProfiler.profile(file);
            LOGGER.debug("file " + file.getName() + "; textprof returned: " + textProfiles);
            if (textProfiles != null) {
                if (textProfiles.size() > 1) {
                    return textProfiles;
                } else if (textProfiles.size() == 1) {
                    profile = textProfiles.get(0);
                }
            }
        }

        if (profile.getLanguage() == null) {
            try {
                String text = textExtractor.getText(file, profile.getMediaType());
                String language = languageDetector.detect(text);
                LOGGER.debug("file " + file.getName() + "; detected language: " + language);
                if (language != null) {
                    profile = Profile.builder(profile).language(language).build();
                }
            } catch (IOException | TikaException | SAXException xc) {
                LOGGER.info("Cannot convert media to text for detecting the language: " + xc.getMessage());
            }
        }

        return Collections.singletonList(Profile.builder(profile).build());
    }
}
