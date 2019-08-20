package eu.clarin.switchboard.core;

import java.util.HashMap;
import java.util.List;


public class Tool extends HashMap<String, Object> {
    private class Parameters {
        String input;
        String lang;
        String analysis;
        boolean batch;
    }

    public String getName() {
        return (String) get("name");
    }

    public List<String> getLanguages() {
        return (List<String>) get("languages");
    }

    public String getLangEncoding() {
        return (String) get("langEncoding");
    }

    public List<String> getMediatypes() {
        return (List<String>) get("mimetypes");
    }

    public String getDeployment() {
        return (String) get("deployment");
    }


    public List<String> getOutput() {
        return (List<String>) get("output");
    }

    public String getUrl() {
        return (String) get("url");
    }

    public Parameters getParameters() {
        return (Parameters) get("parameters");
    }
}
