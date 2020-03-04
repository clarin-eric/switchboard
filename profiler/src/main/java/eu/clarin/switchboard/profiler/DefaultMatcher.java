package eu.clarin.switchboard.profiler;

import com.google.common.base.MoreObjects;
import eu.clarin.switchboard.profiler.api.Matcher;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.utils.SetPredicate;

import java.util.*;

/**
 * The default Matcher implementation
 */
public class DefaultMatcher implements Matcher {
    /**
     * Mediatypes to match.
     */
    private final SetPredicate<String> mediaTypes;

    /**
     * Features to match.
     */
    private final Map<String, SetPredicate<String>> features;

    private DefaultMatcher(SetPredicate<String> mediaTypes, Map<String, SetPredicate<String>> features) {
        this.mediaTypes = Objects.requireNonNull(mediaTypes);
        this.features = Objects.requireNonNull(features);
    }

    @Override
    public boolean matches(Profile profile) {
        if (!mediaTypes.test(profile.getMediaType())) {
            return false;
        }

        for (String feature : features.keySet()) {
            if (!profile.getFeatures().containsKey(feature)) {
                return false;
            }
            SetPredicate<String> required = features.get(feature);
            String value = profile.getFeatures().get(feature);
            if (!required.test(value)) {
                return false;
            }
        }

        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DefaultMatcher that = (DefaultMatcher) o;
        return Objects.equals(mediaTypes, that.mediaTypes) &&
                Objects.equals(features, that.features);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mediaTypes, features);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nmediaTypes", mediaTypes)
                .add("\nfeatures", features)
                .toString();
    }

    public static DefaultMatcher.Builder builder() {
        return new DefaultMatcher.Builder();
    }

    public static class Builder {
        private final SetPredicate.Builder<String> mediaTypeBuilder = SetPredicate.builder();

        private final Map<String, SetPredicate.Builder<String>> featureBuilder = new HashMap<>();

        public Builder acceptAnyMediaType() {
            mediaTypeBuilder.acceptAnyValue();
            return this;
        }

        public Builder acceptMediaType(String mediaType) {
            Objects.requireNonNull(mediaType);
            mediaTypeBuilder.acceptValue(mediaType.toLowerCase(Locale.ROOT));
            return this;
        }

        public Builder acceptLanguage() {
            acceptFeatureWithAnyValue(Profile.FEATURE_LANGUAGE);
            return this;
        }

        /// @param language encoded as ISO 639-3
        public Builder acceptLanguage(String language) {
            Objects.requireNonNull(language);
            if (language.length() != 3) {
                throw new IllegalArgumentException("Matcher.Builder: language is not ISO 639-3: " + language);
            }
            acceptFeatureWithValue(Profile.FEATURE_LANGUAGE, language.toLowerCase(Locale.ROOT));
            return this;
        }

        public Builder acceptFeatureWithValue(String featureName, String value) {
            Objects.requireNonNull(featureName);
            Objects.requireNonNull(value);
            featureBuilder.computeIfAbsent(featureName, k -> SetPredicate.builder())
                    .acceptValue(value);
            return this;
        }

        public Builder acceptFeatureWithAnyValue(String featureName) {
            Objects.requireNonNull(featureName);
            featureBuilder.computeIfAbsent(featureName, k -> SetPredicate.builder()).acceptAnyValue();
            return this;
        }

        public DefaultMatcher build() {
            Map<String, SetPredicate<String>> features = new HashMap<>();
            for (Map.Entry<String, SetPredicate.Builder<String>> entry : featureBuilder.entrySet()) {
                features.put(entry.getKey(), entry.getValue().build());
            }
            return new DefaultMatcher(mediaTypeBuilder.build(), features);
        }
    }
}
