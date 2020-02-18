package eu.clarin.switchboard.profiler.xml;

import com.google.common.collect.ImmutableMap;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.MediaType;
import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class XmlProfiler implements Profiler {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(XmlProfiler.class);

    public static final String FEATURE_SCHEMA_RELAXNG = "schemaRelaxNG";
    public static final String FEATURE_SCHEMA_SCHEMATRON = "schemaSchematron";

    public static final Map<String, String> root2mediaType = ImmutableMap.<String, String>builder()
            .put("FoLiA", "text/folia+xml")
            .put("maf", "text/maf+xml")
            .put("folker-transcription", "application/xml;format-variant=folker-fln")
            .put("basic-transcription", "application/xml;format-variant=exmaralda-exb")
            .put("praat", "text/praat+xml")
            .build();

    XMLInputFactory xmlInputFactory;

    public XmlProfiler() {
        xmlInputFactory = XMLInputFactory.newFactory();
        xmlInputFactory.setXMLResolver((publicID, systemID, baseURI, namespace) -> {
            LOGGER.info("entity resolve request: "
                    + "publicID: " + publicID + "; "
                    + "systemID: " + systemID + "; "
                    + "baseURI: " + baseURI + "; "
                    + "namespace: " + namespace);
            return new ByteArrayInputStream(new byte[0]);
        });
    }

    @Override
    public List<Profile> profile(File file) throws IOException, ProfilingException {
        XmlUtils.XmlFeatures xmlFeatures;

        XMLEventReader xmlReader = XmlUtils.newReader(xmlInputFactory, file);
        try {
            xmlFeatures = XmlUtils.goAfterRoot(xmlReader);
        } finally {
            XmlUtils.close(xmlReader);
        }

        if (TcfProfiler.XMLNAME_TCF_ROOT.equals(xmlFeatures.rootName.getLocalPart())) {
            TcfProfiler tcfProfiler = new TcfProfiler(xmlInputFactory);
            return tcfProfiler.profile(file);
        } else {
            TeiProfiler teiProfiler = new TeiProfiler(xmlInputFactory);
            if (teiProfiler.isTEIRoot(xmlFeatures.rootName.getLocalPart())) {
                return teiProfiler.profile(file);
            }
        }

        Profile.Builder profileBuilder = Profile.builder().certain();

        String mediaType = root2mediaType.get(xmlFeatures.rootName.getLocalPart());
        profileBuilder.mediaType(mediaType == null ? MediaType.APPLICATION_XML : mediaType);

        if (xmlFeatures.schemaRelaxNG != null) {
            profileBuilder.feature(FEATURE_SCHEMA_RELAXNG, xmlFeatures.schemaRelaxNG);
        }
        if (xmlFeatures.schemaSchematron != null) {
            profileBuilder.feature(FEATURE_SCHEMA_SCHEMATRON, xmlFeatures.schemaSchematron);
        }

        return Collections.singletonList(profileBuilder.build());
    }
}
