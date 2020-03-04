package eu.clarin.switchboard.profiler.api;

import com.google.common.collect.ImmutableMap;
import org.jetbrains.annotations.NotNull;

import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

/**
 * A simple data object for storing a data profile (e.g. mediatype, language, version, other features).
 * Use the nested Builder to build a profile, or the nested Flat class for serialization/deserialization.
 */
public class Profile implements Comparable<Profile> {
    /**
     * feature name for the document's main language (when appropriate), encoded as ISO 639-3
     */
    public final static String FEATURE_LANGUAGE = "language";

    // how sure we are this is the right profile
    private final Confidence confidence;

    // profile mediatype, e.g. application/xml
    private final String mediaType;

    // dynamic parameters or features
    // e.g. document format version, used when appropriate (e.g. TCF4/5, XML 1.0/1.1)
    private Map<String, String> features;

    private Profile(Confidence confidence, String mediaType, Map<String, String> features) {
        this.confidence = Objects.requireNonNull(confidence);
        this.mediaType = Objects.requireNonNull(mediaType);
        this.features = ImmutableMap.copyOf(Objects.requireNonNull(features));
    }

    public static Profile.Builder builder() {
        return new Profile.Builder(null);
    }

    public static Profile.Builder builder(Profile profile) {
        return new Profile.Builder(profile);
    }

    public Confidence getConfidence() {
        return confidence;
    }

    public String getMediaType() {
        return mediaType;
    }

    public Map<String, String> getFeatures() {
        return features;
    }

    public String getFeature(String featureKey) {
        return features.get(featureKey);
    }

    public boolean isMediaType(String mediaType) {
        return this.mediaType.equalsIgnoreCase(mediaType);
    }

    public boolean isXmlMediaType() {
        // mediatype format is: type "/" [tree "."] subtype ["+" suffix]* [";" parameter]*
        // 1. remove parameter suffix
        String mediaType = this.mediaType;
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
        return Objects.equals(confidence, profile.confidence) &&
                Objects.equals(mediaType, profile.mediaType) &&
                Objects.equals(features, profile.features);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mediaType, features);
    }

    @Override
    public String toString() {
        StringBuilder buf = new StringBuilder("Profile { confidence=");
        buf.append(confidence).append("; mediaType=").append(mediaType);
        for (String k : features.keySet()) {
            buf.append("; ").append(k);
            String v = features.get(k);
            if (v != null && !v.isEmpty()) {
                buf.append("=").append(v);
            }
        }
        buf.append(" }");
        return buf.toString();
    }

    @Override
    public int compareTo(@NotNull Profile o) {
        int x = confidence.compareTo(o.confidence);
        if (x == 0 && mediaType != null) {
            x = mediaType.compareToIgnoreCase(o.mediaType);
        }
        return x;
    }

    /**
     * Builder class pattern for a Profile.
     */
    public static class Builder {
        Confidence confidence = Confidence.Uncertain;

        String mediaType = MediaType.APPLICATION_OCTET_STREAM;

        // dynamic parameters or features
        Map<String, String> features = new HashMap<>();

        public Builder(Profile p) {
            if (p != null) {
                this.confidence = p.confidence;
                this.mediaType = p.mediaType;
                p.features.forEach(this::feature);
            }
        }

        public Builder certain() {
            this.confidence = Confidence.Certain;
            return this;
        }

        public Builder mediaType(String mediaType) {
            Objects.requireNonNull(mediaType);
            if (mediaType.isEmpty()) {
                throw new IllegalArgumentException("bad mediaType argument: empty");
            }
            this.mediaType = mediaType;
            return this;
        }

        /// @param language ISO 639-3 code of the language
        public Builder language(String language) {
            Objects.requireNonNull(language);
            if (language.length() != 3) {
                throw new IllegalArgumentException("Profile.Builder: language is not ISO 639-3: " + language);
            }
            features.put(FEATURE_LANGUAGE, language);
            return this;
        }

        public Builder feature(String featureName) {
            Objects.requireNonNull(featureName);
            if (FEATURE_LANGUAGE.equals(featureName)) {
                throw new IllegalArgumentException("Profile.Builder: language is a special feature and must have a value");
            }
            features.put(featureName, "");
            return this;
        }

        public Builder feature(String featureName, String value) {
            Objects.requireNonNull(featureName);
            Objects.requireNonNull(value);
            if (FEATURE_LANGUAGE.equals(featureName)) {
                return language(value);
            }
            features.put(featureName, value);
            return this;
        }

        public Profile build() {
            return new Profile(confidence, mediaType, features);
        }
    }

    public Flat flat() {
        return Flat.fromProfile(this);
    }

    /**
     * Utility class for serializing and deserializing a Profile
     */
    public static class Flat extends LinkedHashMap<String, String> {
        public static Flat fromProfile(Profile p) {
            Flat flat = new Flat();
            flat.put("confidence", p.getConfidence().name());
            flat.put("mediaType", p.getMediaType());
            flat.putAll(p.getFeatures());
            return flat;
        }

        public Profile toProfile() {
            for (String value : this.values()) {
                if (value == null) {
                    throw new IllegalArgumentException("null values in Profile are illegal");
                }
            }
            Map<String, String> features = new LinkedHashMap<>(this);
            String confidence = features.get("confidence");
            features.remove("confidence");
            String mediaType = features.get("mediaType");
            features.remove("mediaType");
            return new Profile(
                    confidence == null ? Confidence.Uncertain : Confidence.Certain,
                    mediaType == null ? MediaType.APPLICATION_OCTET_STREAM : mediaType,
                    features);
        }
    }
}
