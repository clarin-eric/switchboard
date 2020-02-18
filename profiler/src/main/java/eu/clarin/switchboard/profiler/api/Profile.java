package eu.clarin.switchboard.profiler.api;

import com.google.common.base.MoreObjects;

import java.util.*;

public class Profile {
    // profile mediatype, e.g. application/xml
    String mediaType;

    // document's main language, encoded as ISO 639-3
    String language;

    // dynamic parameters or features
    // e.g. document format version, used when appropriate (e.g. TCF4/5, XML 1.0/1.1)
    Map<String, String> features = new HashMap<>();

    public static Profile.Builder builder() {
        return new Profile.Builder(null);
    }

    public static Profile.Builder builder(Profile profile) {
        return new Profile.Builder(profile);
    }

    public String getMediaType() {
        return mediaType;
    }

    public String getLanguage() {
        return language;
    }

    public boolean isMediaType(String mediaType) {
        return this.mediaType.equalsIgnoreCase(mediaType);
    }

    public Map<String, String> getFeatures() {
        return features;
    }

    public boolean isXmlMediaType() {
        // mediatype format is: type "/" [tree "."] subtype ["+" suffix]* [";" parameter]*
        // 1. remove parameter suffix
        int formatStartIndex = mediaType.indexOf(';');
        if (formatStartIndex > 0) {
            mediaType = mediaType.substring(0, formatStartIndex);
        }
        // 2. split in type and subtypes
        String[] typeSubtype = mediaType.split("/");
        if (typeSubtype.length == 2) {
            String subtype = typeSubtype[1];
            // 3. find and remove tree name
            int i = subtype.indexOf(".");
            if (i >= 0) {
                subtype = typeSubtype[1].substring(i + 1);
            }
            // 4. find suffix
            String suffix = "";
            i = subtype.lastIndexOf("+");
            if (i >= 0) {
                suffix = subtype.substring(i + 1);
                subtype = subtype.substring(0, i);
            }
            return "xml".equalsIgnoreCase(subtype) || "xml".equalsIgnoreCase(suffix);
        }
        return false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Profile profile = (Profile) o;
        return Objects.equals(mediaType, profile.mediaType) &&
                Objects.equals(language, profile.language) &&
                Objects.equals(features, profile.features);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mediaType, language, features);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nmediaType", mediaType)
                .add("\nlanguage", language)
                .add("\nfeatures", features)
                .toString();
    }

    public static class Builder {
        String mediaType;

        // language code, ISO 639-3
        String language;

        // document format version, used when appropriate (e.g. TCF4/5, XML 1.0/1.1)
        String version;

        // dynamic parameters or features
        Map<String, String> features = new HashMap<>();

        public Builder(Profile p) {
            if (p != null) {
                this.mediaType = p.mediaType;
                this.language= p.language;
                p.features.forEach(this::feature);
            }
        }

        public Builder mediaType(String mediaType) {
            if (mediaType!= null && mediaType.isEmpty()) {
                throw new IllegalArgumentException("bad mediaType argument: empty");
            }
            this.mediaType = mediaType;
            return this;
        }

        /// @param language  ISO 639-3 code of the language
        public Builder language(String language) {
            if (language != null && language.length() != 3) {
                throw new IllegalArgumentException("Profile.Builder: language is not ISO 639-3: " + language);
            }
            this.language= language;
            return this;
        }

        public Builder feature(String featureName) {
            Objects.requireNonNull(featureName);
            features.put(featureName, null);
            return this;
        }

        public Builder feature(String featureName, String value) {
            Objects.requireNonNull(featureName);
            features.put(featureName, value);
            return this;
        }

        public Profile build() {
            Profile profile = new Profile();
            profile.mediaType = mediaType;
            profile.language = language;
            profile.features = features;
            return profile;
        }
    }
}
