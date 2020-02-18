package eu.clarin.switchboard.profiler.xml;

import eu.clarin.switchboard.profiler.api.LanguageCode;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.StartElement;
import javax.xml.stream.events.XMLEvent;
import java.io.File;
import java.io.IOException;

public class TeiProfiler implements Profiler {
    public final static String XMLNAME_ROOT_TEI = "TEI";
    public final static String XMLNAME_ROOT_TEI2 = "TEI.2";
    public final static String XMLNAME_ROOT_TEI_CORPUS = "teiCorpus";

    private final static String MEDIATYPE_TEI = "application/tei+xml";

    private final static String MEDIATYPE_TEI_DTA = "application/tei+xml;format-variant=tei-dta";
    private final static String SCHEMALOCATION_DTA_RELAXNG = "http://www.deutschestextarchiv.de/basisformat.rng";

    private final static String MEDIATYPE_TEI_CORPUS = "application/tei+xml;format-variant=teiCorpus";

//    private final static String MEDIATYPE_TEI_ISOSPOKEN = "application/tei+xml;format-variant=tei-iso-spoken";
//    private final static String MEDIATYPE_TEI_CLANCHA = "application/xml;format-variant=clan-cha";
//    private final static String MEDIATYPE_TEI_EXMARALDAAEXB = "application/xml;format-variant=exmaralda-exb";
//    private final static String MEDIATYPE_TEI_FOLKERFLN = "application/xml;format-variant=folker-fln";
//    private final static String MEDIATYPE_TEI_TRANSCRIBERTRS = "application/xml;format-variant=transcriber-trs";

    XMLInputFactory xmlInputFactory;

    public TeiProfiler() {
        this(XMLInputFactory.newInstance());
    }

    public TeiProfiler(XMLInputFactory factory) {
        this.xmlInputFactory = factory;
    }

    @Override
    public Profile profile(File file) throws IOException, ProfilingException {
        XmlUtils.XmlFeatures xmlFeatures;
        Profile.Builder profileBuilder = Profile.builder();

        XMLEventReader xmlReader = XmlUtils.newReader(xmlInputFactory, file);
        try {
            xmlFeatures = XmlUtils.goAfterRoot(xmlReader);
            if (xmlFeatures.schemaRelaxNG != null &&
                    xmlFeatures.schemaRelaxNG.equalsIgnoreCase(SCHEMALOCATION_DTA_RELAXNG)) {
                profileBuilder.mediaType(MEDIATYPE_TEI_DTA);
            } else if (XMLNAME_ROOT_TEI.equals(xmlFeatures.rootName)) {
                profileBuilder.mediaType(MEDIATYPE_TEI);
            } else if (XMLNAME_ROOT_TEI2.equals(xmlFeatures.rootName)) {
                profileBuilder.mediaType(MEDIATYPE_TEI);
                String lang = xmlFeatures.rootAttributes.get("lang");
                if (lang != null) {
                    String lang3 = LanguageCode.iso639_1to639_3(lang);
                    if (lang3 != null) {
                        lang = lang3;
                    }
                    if (LanguageCode.isIso639_3(lang)) {
                        profileBuilder.language(lang);
                    }
                }
            } else if (XMLNAME_ROOT_TEI_CORPUS.equals(xmlFeatures.rootName)) {
                profileBuilder.mediaType(MEDIATYPE_TEI_CORPUS);
            }
        } finally {
            XmlUtils.close(xmlReader);
        }
        return profileBuilder.build();
    }

    public boolean isTEIRoot(String rootName) {
        return XMLNAME_ROOT_TEI.equals(rootName) || XMLNAME_ROOT_TEI2.equals(rootName) || XMLNAME_ROOT_TEI_CORPUS.equals(rootName);
    }
}
