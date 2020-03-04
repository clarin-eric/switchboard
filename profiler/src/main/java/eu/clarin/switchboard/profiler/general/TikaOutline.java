package eu.clarin.switchboard.profiler.general;

import eu.clarin.switchboard.profiler.api.Outline;
import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;

import java.util.*;

public class TikaOutline implements Outline {
    private final Map<String, String> prefixes = new HashMap<>();
    private final Node root = new Node();

    @Override
    public Outline.Node getRoot() {
        return root;
    }

    public static class Node implements Outline.Node {
        String namespace;
        String value;
        List<Node> children;

        @Override
        public Kind getKind() {
            return Kind.XmlNode;
        }

        @Override
        public String getNamespace() {
            return namespace;
        }

        @Override
        public String getNameOrValue() {
            return value;
        }

        @Override
        public Collection<Node> getChildren() {
            return children;
        }
    }

    public static class TextNode extends Node {
        @Override
        public Kind getKind() {
            return Kind.XmlText;
        }
    }

    public static class PINode extends Node {
        String target;
    }

    static final String INDENT = "    ";

    @Override
    public String toString() {
        StringBuilder buf = new StringBuilder();
        buf.append("Prefixes:\n");
        prefixes.forEach((key, value) -> {
            buf.append(INDENT).append(key).append(" : ").append(value).append("\n");
        });

        recursePrint(buf, root, 0);

        return buf.toString();
    }

    private void indent(StringBuilder buf, int indent) {
        for (int i = 0; i < indent; i++) {
            buf.append(INDENT);
        }
    }

    private void recursePrint(StringBuilder buf, Node parent, int indent) {
        if (parent.children == null) {
            return;
        }
        for (Node n : parent.children) {
            indent(buf, indent);
            if (n instanceof TextNode) {
                TextNode node = (TextNode) n;
                buf.append("‘").append(node.value).append("’").append("\n");
            } else if (n instanceof PINode) {
                PINode node = (PINode) n;
                buf.append(node.target).append(" : ").append(node.value).append("\n");
            } else {
                buf.append("<").append(n.value).append(">").append("\n");
                recursePrint(buf, n, indent + 1);
            }
        }
    }

    public static class MyContentHandler implements ContentHandler {
        public static final int MAX_TEXT_NODE_SIZE = 200;

        TikaOutline outline = null;
        Stack<Node> nodeStack = new Stack<>();

        public TikaOutline getDocumentOutline() {
            return outline;
        }

        @Override
        public void setDocumentLocator(Locator locator) {
//            System.out.println("locator: "+locator);
        }

        @Override
        public void startDocument() {
            outline = new TikaOutline();
            nodeStack.push(outline.root);
        }

        @Override
        public void endDocument() throws SAXException {
        }

        @Override
        public void startPrefixMapping(String prefix, String uri) throws SAXException {
            outline.prefixes.put(prefix, uri);
        }

        @Override
        public void endPrefixMapping(String prefix) throws SAXException {
        }

        @Override
        public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXException {
            if (skipElement(uri, localName)) {
                return;
            }
            Node newnode = new Node();
            newnode.namespace = uri;
            newnode.value = localName;
            nodeStack.push(newnode);
        }

        @Override
        public void endElement(String uri, String localName, String qName) throws SAXException {
            if (skipElement(uri, localName)) {
                return;
            }
            Node node = nodeStack.pop();
            if (node.children == null || node.children.isEmpty()) {
                return;
            }
            if (node.children.size() > 1) {
                addChild(node);
                return;
            }

            Node last = node.children.get(node.children.size() - 1);
            if (!(last instanceof TextNode)) {
                addChild(node);
                return;
            }

            TextNode textNode = (TextNode) last;
            if (!textNode.value.trim().isEmpty()) {
                addChild(node);
            }
        }

        private boolean skipElement(String uri, String localName) {
            return "http://www.w3.org/1999/xhtml".equals(uri) &&
                    ("html".equals(localName) || "body".equals(localName));
        }

        private String reduceWS(String text) {
            int len = text.length();
            text = text.replaceAll("\\s\\s", " ");
            while (len != text.length()) {
                len = text.length();
                text = text.replaceAll("\\s\\s", " ");
            }
            return text;
        }

        @Override
        public void characters(char[] ch, int start, int length) throws SAXException {
            String newtext = reduceWS(new String(ch, start, length));

            // concatenate text elements if possible
            Node top = nodeStack.peek();
            if (top.children != null && !top.children.isEmpty()) {
                Node last = top.children.get(top.children.size() - 1);
                if (last instanceof TextNode) {
                    TextNode textNode = (TextNode) last;
                    if (textNode.value.length() < MAX_TEXT_NODE_SIZE) {
                        textNode.value = reduceWS(textNode.value + newtext);
                        textNode.value = textNode.value.substring(0, Math.min(textNode.value.length(), MAX_TEXT_NODE_SIZE));
                    }
                    return;
                }
            }

            TextNode newnode = new TextNode();
            newnode.value = newtext;
            newnode.value = newnode.value.substring(0, Math.min(newnode.value.length(), MAX_TEXT_NODE_SIZE));
            addChild(newnode);
        }

        @Override
        public void ignorableWhitespace(char[] ch, int start, int length) throws SAXException {
        }

        @Override
        public void processingInstruction(String target, String data) throws SAXException {
            PINode newnode = new PINode();
            newnode.target = target;
            newnode.value = data;
            addChild(newnode);
        }

        @Override
        public void skippedEntity(String name) throws SAXException {
        }

        private void addChild(Node node) {
            Node top = nodeStack.peek();
            if (top.children == null) {
                top.children = new ArrayList<>();
            }
            top.children.add(node);
        }
    }
}
