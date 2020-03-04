package eu.clarin.switchboard.profiler.xml;

import com.google.common.collect.ImmutableSet;
import eu.clarin.switchboard.profiler.api.*;
import eu.clarin.switchboard.profiler.utils.LanguageCode;

import javax.xml.namespace.QName;
import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.Attribute;
import javax.xml.stream.events.StartElement;
import javax.xml.stream.events.XMLEvent;
import java.io.File;
import java.io.IOException;
import java.util.*;

public class TcfProfiler implements Profiler {
    public final static String XMLNAME_TCF_ROOT = "D-Spin";

    public final static String MEDIATYPE_TCF = "text/tcf+xml";
    public final static String MEDIATYPE_LEXICON  = "text/lexicon+xml";

    public static final String FEATURE_VERSION = "version";

    private final static String XMLNAME_TEXT_CORPUS = "TextCorpus";
    private final static String XMLNAME_LEXICON = "Lexicon";
    private final static String XMLNAME_EXTERNAL_DATA = "ExternalData";
    private final static String XMLNAME_VERSION = "version";
    private final static String XMLNAME_LANG = "lang";

    private final static String FORMAT_FEATURE = "%s.%s";
    private final static String FORMAT_EXT_FEATURE = "ext.%s.%s";

    // Features constructed on basis of the TCF, that should not be added.
    private static final Set<String> IGNORED_FEATURES = ImmutableSet.of("tokens.charoffsets");

    XMLInputFactory xmlInputFactory;

    public TcfProfiler() {
        this(XMLInputFactory.newInstance());
    }

    public TcfProfiler(XMLInputFactory factory) {
        this.xmlInputFactory = factory;
    }

    @Override
    public List<Profile> profile(File file) throws IOException, ProfilingException {
        XMLEventReader xmlReader = XmlUtils.newReader(xmlInputFactory, file);

        Profile.Builder profileBuilder = Profile.builder().certain();
        try {
            boolean isInDocument = false;
            boolean isInExternalData = false;
            int depth = 0;
            while (xmlReader.hasNext()) {
                XMLEvent event = xmlReader.nextEvent();
                if (event.isStartElement()) {
                    StartElement element = event.asStartElement();
                    String elementName = element.getName().getLocalPart();
                    if (elementName.equals(XMLNAME_TCF_ROOT)) {
                        Attribute attribute = element.getAttributeByName(new QName(XMLNAME_VERSION));
                        if (attribute != null) {
                            profileBuilder.feature(FEATURE_VERSION, attribute.getValue());
                        }
                    } else if (elementName.equals(XMLNAME_TEXT_CORPUS)) {
                        profileBuilder.mediaType(MEDIATYPE_TCF);
                        isInDocument = true;
                        Attribute attribute = element.getAttributeByName(new QName(XMLNAME_LANG));
                        if (attribute != null) {
                            String languageCode = LanguageCode.iso639_1to639_3(attribute.getValue());
                            profileBuilder.language(languageCode);
                        }
                    } else if (elementName.equals(XMLNAME_LEXICON)) {
                        profileBuilder.mediaType(MEDIATYPE_LEXICON);
                        isInDocument = true;
                        Attribute attribute = element.getAttributeByName(new QName(XMLNAME_LANG));
                        if (attribute != null) {
                            String languageCode = LanguageCode.iso639_1to639_3(attribute.getValue());
                            profileBuilder.language(languageCode);
                        }
                    } else if (elementName.equals(XMLNAME_EXTERNAL_DATA)) {
                        isInExternalData = true;
                    } else if ((isInDocument || isInExternalData) && depth++ == 0) {
                        boolean hasAttr = false;

                        Iterator<?> iter = element.getAttributes();
                        while (iter.hasNext()) {
                            Attribute attr = (Attribute) iter.next();
                            String featureFormat = isInDocument ? FORMAT_FEATURE : FORMAT_EXT_FEATURE;
                            String featureName = String.format(featureFormat, elementName.toLowerCase(), attr.getName().getLocalPart().toLowerCase());

                            // Normally, the feature name is constructed as the TCF tag name and ann attribute, e.g.
                            // '<postags taget=...' becomes 'postags.tagset'. However, there are exceptions, such as
                            // tokens. However in a case such as '<tokens charOffsets=...', the feature would be
                            // 'tokens.charoffsets'. However, many services already use 'tokens' as an input feature
                            // and at this point we cannot change them to use 'tokens.charoffsets=(true|false)'
                            // anymore :(.
                            if (IGNORED_FEATURES.contains(featureName)) {
                                continue;
                            }

                            hasAttr = true;
                            String valueName = attr.getValue().toLowerCase();
                            profileBuilder.feature(featureName, valueName);
                        }
                        if (!hasAttr) {
                            profileBuilder.feature(elementName.toLowerCase());
                        }
                    }
                } else if (event.isEndElement()) {
                    String elementName = event.asEndElement().getName().getLocalPart();
                    if (elementName.equals(XMLNAME_TEXT_CORPUS)) {
                        isInDocument = false;
                    } else if (elementName.equals(XMLNAME_EXTERNAL_DATA)) {
                        isInExternalData = false;
                    } else if (isInDocument || isInExternalData) {
                        depth--;
                    }
                }
            }
        } catch (XMLStreamException ex) {
            throw new ProfilingException("xml stream error", ex);
        }

        return Collections.singletonList(profileBuilder.build());
    }
}
