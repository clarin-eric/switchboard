package eu.clarin.switchboard.profiler.xml;

import eu.clarin.switchboard.profiler.api.*;
import eu.clarin.switchboard.profiler.utils.LanguageCode;

import javax.xml.namespace.QName;
import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class TeiProfiler implements Profiler {
    public final static String XMLNAME_ROOT_TEI = "TEI";
    public final static String XMLNAME_ROOT_TEI2 = "TEI.2";
    public final static String XMLNAME_ROOT_TEI_CORPUS = "teiCorpus";

    public final static String MEDIATYPE_TEI = "application/tei+xml";

    public final static String MEDIATYPE_TEI_DTA = "application/tei+xml;format-variant=tei-dta";
    public final static String SCHEMALOCATION_DTA_RELAXNG_PREFIX = "http://www.deutschestextarchiv.de/basisformat";

    public final static String MEDIATYPE_TEI_CORPUS = "application/tei+xml;format-variant=teiCorpus";

//    public final static String MEDIATYPE_TEI_ISOSPOKEN = "application/tei+xml;format-variant=tei-iso-spoken";
//    public final static String MEDIATYPE_TEI_CLANCHA = "application/xml;format-variant=clan-cha";
//    public final static String MEDIATYPE_TEI_EXMARALDAEXB = "application/xml;format-variant=exmaralda-exb";
//    public final static String MEDIATYPE_TEI_FOLKERFLN = "application/xml;format-variant=folker-fln";
//    public final static String MEDIATYPE_TEI_TRANSCRIBERTRS = "application/xml;format-variant=transcriber-trs";

    XMLInputFactory xmlInputFactory;

    public TeiProfiler() {
        this(XMLInputFactory.newInstance());
    }

    public TeiProfiler(XMLInputFactory factory) {
        this.xmlInputFactory = factory;
    }

    @Override
    public List<Profile> profile(File file) throws IOException, ProfilingException {
        XmlUtils.XmlFeatures xmlFeatures;
        Profile.Builder profileBuilder = Profile.builder().certain();

        XMLEventReader xmlReader = XmlUtils.newReader(xmlInputFactory, file);
        try {
            xmlFeatures = XmlUtils.goAfterRoot(xmlReader);
            if (xmlFeatures.schemaRelaxNG != null &&
                    xmlFeatures.schemaRelaxNG.startsWith(SCHEMALOCATION_DTA_RELAXNG_PREFIX)) {
                profileBuilder.mediaType(MEDIATYPE_TEI_DTA);
            } else if (XMLNAME_ROOT_TEI.equals(xmlFeatures.rootName.getLocalPart())) {
                profileBuilder.mediaType(MEDIATYPE_TEI);
            } else if (XMLNAME_ROOT_TEI2.equals(xmlFeatures.rootName.getLocalPart())) {
                profileBuilder.mediaType(MEDIATYPE_TEI);
                String lang = xmlFeatures.rootAttributes.get(new QName("lang"));
                if (lang != null) {
                    String lang3 = LanguageCode.iso639_1to639_3(lang);
                    if (lang3 != null) {
                        lang = lang3;
                    }
                    if (LanguageCode.isIso639_3(lang)) {
                        profileBuilder.language(lang);
                    }
                }
            } else if (XMLNAME_ROOT_TEI_CORPUS.equals(xmlFeatures.rootName.getLocalPart())) {
                profileBuilder.mediaType(MEDIATYPE_TEI_CORPUS);
            }
        } finally {
            XmlUtils.close(xmlReader);
        }
        return Collections.singletonList(profileBuilder.build());
    }

    public boolean isTEIRoot(String rootName) {
        return XMLNAME_ROOT_TEI.equals(rootName) || XMLNAME_ROOT_TEI2.equals(rootName) || XMLNAME_ROOT_TEI_CORPUS.equals(rootName);
    }
}
