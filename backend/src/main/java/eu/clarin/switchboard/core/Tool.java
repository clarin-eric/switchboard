package eu.clarin.switchboard.core;

import eu.clarin.switchboard.profiler.DefaultMatcher;
import eu.clarin.switchboard.profiler.api.Matcher;

import java.util.HashMap;
import java.util.List;


public class Tool extends HashMap<String, Object> {
    public String getName() {
        return (String) get("name");
    }

    public List<String> getLanguages() {
        List<String> languages = (List<String>) get("languages");
        // may contain null at the end if there's a trailing comma in json
        languages.remove(null);
        return languages;
    }

    public String getLangEncoding() {
        return (String) get("langEncoding");
    }

    public List<String> getMediatypes() {
        List<String> mediatypes = (List<String>) get("mimetypes");
        // may contain null at the end if there's a trailing comma in json
        mediatypes.remove(null);
        return mediatypes;
    }

    public String getDeployment() {
        return (String) get("deployment");
    }

    public String getUrl() {
        return (String) get("url");
    }

    public Matcher getMatcher() {
        DefaultMatcher.Builder matcherBuilder = DefaultMatcher.builder();

        getMediatypes().forEach(matcherBuilder::acceptMediaType);

        List<String> languages = getLanguages();
        if (languages.contains("generic")) {
            matcherBuilder.acceptLanguage();
        } else {
            languages.forEach(matcherBuilder::acceptLanguage);
        }

        return matcherBuilder.build();
    }
}
