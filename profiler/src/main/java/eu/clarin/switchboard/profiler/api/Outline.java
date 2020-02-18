package eu.clarin.switchboard.profiler.api;

import java.util.Collection;

public interface Outline {
    interface Node {
        enum Kind {
            Folder,
            File,
            XmlSchema,
            XmlNode,
            XmlText,
        }

        Kind getKind();
        String getNamespace();
        String getNameOrValue();
        Collection<? extends Node> getChildren();
    }

    Node getRoot();
}
