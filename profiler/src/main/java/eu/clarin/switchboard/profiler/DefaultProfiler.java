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
import java.util.ArrayList;
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
        List<Profile> profiles;
        Profile firstProfile;
        {
            profiles = tikaProfiler.profile(file);
            LOGGER.debug("file " + file.getName() + "; tika returned: " + profiles);
            assert profiles.size() == 1;
            firstProfile = profiles.get(0);
        }

        if (firstProfile.isMediaType(MediaType.APPLICATION_XML)) {
            List<Profile> xmlProfiles = xmlProfiler.profile(file);
            LOGGER.debug("file " + file.getName() + "; xmlprof returned: " + xmlProfiles);
            if (xmlProfiles != null && !xmlProfiles.isEmpty()) {
                profiles = xmlProfiles;
                firstProfile = profiles.get(0);
            }
        } else if (firstProfile.isMediaType(MediaType.APPLICATION_JSON)) {
            List<Profile> jsonProfiles = jsonProfiler.profile(file);
            LOGGER.debug("file " + file.getName() + "; jsonprof returned: " + jsonProfiles);
            if (jsonProfiles != null && !jsonProfiles.isEmpty()) {
                assert jsonProfiles.size() == 1;
                profiles = jsonProfiles;
                firstProfile = profiles.get(0);
            }
        } else if (firstProfile.isMediaType(MediaType.TEXT_PLAIN)) {
            List<Profile> textProfiles = textProfiler.profile(file);
            LOGGER.debug("file " + file.getName() + "; textprof returned: " + textProfiles);
            if (textProfiles != null && !textProfiles.isEmpty()) {
                profiles = textProfiles;
                firstProfile = profiles.get(0);
            }
        }

        if (firstProfile.getMediaType() == null) {
            firstProfile = Profile.builder(firstProfile).mediaType(MediaType.APPLICATION_OCTET_STREAM).build();
            profiles = new ArrayList<>(profiles);
            profiles.set(0, firstProfile);
        } else if (firstProfile.getLanguage() == null) {
            try {
                String text = textExtractor.getText(file, firstProfile.getMediaType());
                String language = languageDetector.detect(text);
                LOGGER.debug("file " + file.getName() + "; detected language: " + language);
                if (language != null) {
                    firstProfile = Profile.builder(firstProfile).language(language).build();
                    profiles = new ArrayList<>(profiles);
                    profiles.set(0, firstProfile);
                }
            } catch (IOException | TikaException xc) {
                LOGGER.info("Cannot convert media to text for detecting the language: " + xc.getMessage());
            }
        }

        return profiles;
    }
}
