package eu.clarin.switchboard.tool;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;
import eu.clarin.switchboard.profiler.DefaultMatcher;
import eu.clarin.switchboard.profiler.api.Matcher;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Input {
    String id;
    List<String> mediatypes;
    Object languages;
    Integer maxSize;
    boolean multiple;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getMediatypes() {
        return mediatypes;
    }

    public void setMediatypes(List<String> mediatypes) {
        this.mediatypes = mediatypes;
    }

    public Object getLanguages() {
        return languages;
    }

    public void setLanguages(Object languages) {
        this.languages = languages;
    }

    public Integer getMaxSize() {
        return maxSize;
    }

    public void setMaxSize(Integer maxSize) {
        this.maxSize = maxSize;
    }

    public Boolean getMultiple() {
        return multiple;
    }

    public void setMultiple(Boolean multiple) {
        this.multiple = multiple;
    }

    @JsonIgnore
    public Matcher getMatcher(boolean requiresContent) {
        DefaultMatcher.Builder matcherBuilder = DefaultMatcher.builder();
        mediatypes.forEach(matcherBuilder::acceptMediaType);
        if (languages != null) {
            if (languages instanceof String && Tool.ANY_LANGUAGE_KEYWORD.equals((String) languages)) {
                matcherBuilder.acceptLanguage();
            } else if (languages instanceof List) {
                List<String> langs = (List<String>) this.languages;
                langs.forEach(matcherBuilder::acceptLanguage);
            }
        }
        if (requiresContent) {
            matcherBuilder.acceptFeatureWithValue("contentIsAvailable", "true");
        }
        return matcherBuilder.build();
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nid", id)
                .add("\nmediatypes", mediatypes)
                .add("\nlanguages", languages)
                .add("\nmaxSize", maxSize)
                .add("\nmultiple", multiple)
                .toString();
    }
}
