package eu.clarin.switchboard.profiler;

import com.google.common.base.MoreObjects;
import eu.clarin.switchboard.profiler.api.Matcher;
import eu.clarin.switchboard.profiler.api.Profile;

import java.util.Objects;

public class ProfileMatcher implements Matcher {

    private Profile required;

    @Override
    public boolean matches(Profile profile) {
        if (required.getMediaType() != null &&
                !required.getMediaType().equalsIgnoreCase(profile.getMediaType())) {
            return false;
        }
        if (required.getLanguage() != null &&
                !required.getLanguage().equalsIgnoreCase(profile.getLanguage())) {
            return false;
        }
        for (String feature : required.getFeatures().keySet()) {
            if (!profile.getFeatures().containsKey(feature)) {
                return false;
            }
            String requiredValue = required.getFeatures().get(feature);
            String matchValue = profile.getFeatures().get(feature);
            if (requiredValue == null && matchValue != null) {
                return false;
            }
            if (requiredValue != null && !requiredValue.equals(matchValue)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProfileMatcher pm = (ProfileMatcher) o;
        return Objects.equals(this.required, pm.required);
    }

    @Override
    public int hashCode() {
        return Objects.hash(required);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nmediaType", required.getMediaType())
                .add("\nlanguage", required.getLanguage())
                .add("\nfeatures", required.getFeatures())
                .toString();
    }

    public static ProfileMatcher.Builder builder() {
        return new ProfileMatcher.Builder(null);
    }

    public static class Builder {
        private Profile.Builder b;

        public Builder(ProfileMatcher pm) {
            this.b = new Profile.Builder(pm == null ? null : pm.required);
        }

        public Builder mediaType(String mediaType) {
            b.mediaType(mediaType);
            return this;
        }

        /// @param language encoded as ISO 639-3
        public Builder language(String language) {
            if (language != null && language.length() != 3) {
                throw new IllegalArgumentException("Profile.Builder: language is not ISO 639-3: " + language);
            }
            b.language(language);
            return this;
        }

        public Builder feature(String featureName) {
            b.feature(featureName);
            return this;
        }

        public Builder feature(String featureName, String value) {
            b.feature(featureName, value);
            return this;
        }

        public ProfileMatcher build() {
            ProfileMatcher pm = new ProfileMatcher();
            pm.required = b.build();
            return pm;
        }
    }
}
