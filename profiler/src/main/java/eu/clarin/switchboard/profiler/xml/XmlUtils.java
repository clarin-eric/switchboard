package eu.clarin.switchboard.profiler.xml;

import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.slf4j.LoggerFactory;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.*;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class XmlUtils {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(XmlUtils.class);

    public static final String NS_RELAX_NG = "http://relaxng.org/ns/structure/1.0";

    public static XMLEventReader newReader(XMLInputFactory xmlInputFactory, File file) throws IOException, ProfilingException {
        try {
            InputStream stream = new BufferedInputStream(Files.newInputStream(file.toPath()));
            return xmlInputFactory.createXMLEventReader(stream);
        } catch (XMLStreamException ex) {
            throw new ProfilingException("xml stream error", ex);
        }
    }

    public static void close(XMLEventReader xmlReader) {
        try {
            xmlReader.close();
        } catch (XMLStreamException e) {
            // ignore
        }
    }

    public static XmlFeatures goAfterRoot(XMLEventReader xmlReader) throws ProfilingException {
        XmlFeatures xmlFeatures = new XmlFeatures();

        XMLEvent event = null;
        try {
            while (xmlReader.hasNext()) {
                event = xmlReader.peek();
                if (event.isProcessingInstruction() && event instanceof ProcessingInstruction) {
                    processPI((ProcessingInstruction) event, xmlFeatures);
                }
                if (event instanceof DTD) {
                    DTD dtd = (DTD)event;
                    LOGGER.info("dtd: " + dtd.getDocumentTypeDeclaration());
                }
                if (event.isNamespace() && event instanceof Namespace) {
                    Namespace ns = (Namespace) event;
                    LOGGER.info("namespace: " + ns.getPrefix() + ":" + ns.getNamespaceURI());
                    if (ns.getPrefix().isEmpty()) {
                        xmlFeatures.rootNamespace = ns.getNamespaceURI();
                    }
                }
                if (event.isStartElement()) {
                    if (xmlFeatures.rootName == null) {
                        xmlFeatures.rootName = event.asStartElement().getName().getLocalPart();

                        Iterator<?> iter = event.asStartElement().getAttributes();
                        while (iter.hasNext()) {
                            Attribute attr = (Attribute) iter.next();
                            LOGGER.info("root attr: " + attr.getName().getLocalPart() + "=" + attr.getValue());
                            xmlFeatures.rootAttributes.put(attr.getName().getLocalPart(), attr.getValue());
                        }
                    } else {
                        break;
                    }
                }
                xmlReader.nextEvent();
            }
            if (xmlFeatures.rootName == null) {
                throw new ProfilingException("bad xml file: root element not found");
            }
        } catch (XMLStreamException ex) {
            throw new ProfilingException("xml stream error", ex);
        }

        return xmlFeatures;
    }

    public static class XmlFeatures {
        String rootName;
        String rootNamespace;
        Map<String, String> rootAttributes = new LinkedHashMap<>();
        String schemaRelaxNG;
        String schemaSchematron;
    }

    private static final Pattern PATTERN_XMLATTRIBUTE = Pattern.compile("(\\w+)=\"(.*)\"");

    private static void processPI(ProcessingInstruction pi, XmlFeatures xmlFeatures) {
        if ("xml-model".equalsIgnoreCase(pi.getTarget())) {
            String href = null, type = null, schematypens = null;

            String[] attributeValueList = pi.getData().split("\\s+");
            for (String attributeValue : attributeValueList) {
                Matcher matcher = PATTERN_XMLATTRIBUTE.matcher(attributeValue);
                if (matcher.matches()) {
                    String attribute = matcher.group(1);
                    String value = matcher.group(2);
                    switch (attribute) {
                        case "href":
                            href = value;
                            break;
                        case "type":
                            type = value;
                            break;
                        case "schematypens":
                            schematypens = value;
                            break;
                    }
                }
            }

            if (NS_RELAX_NG.equals(schematypens)) {
                xmlFeatures.schemaRelaxNG = href;
            }
        }
    }
}
