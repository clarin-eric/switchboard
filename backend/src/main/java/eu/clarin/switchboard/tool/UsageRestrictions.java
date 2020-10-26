package eu.clarin.switchboard.tool;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsageRestrictions {
    String individualUserRestrictions; // academic, public, regional, other, unknown, license only
    String countriesNotSupported;
    String countriesSupported;

    public String getIndividualUserRestrictions() {
        return individualUserRestrictions;
    }

    public void setIndividualUserRestrictions(String individualUserRestrictions) {
        this.individualUserRestrictions = individualUserRestrictions;
    }

    public String getCountriesNotSupported() {
        return countriesNotSupported;
    }

    public void setCountriesNotSupported(String countriesNotSupported) {
        this.countriesNotSupported = countriesNotSupported;
    }

    public String getCountriesSupported() {
        return countriesSupported;
    }

    public void setCountriesSupported(String countriesSupported) {
        this.countriesSupported = countriesSupported;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nindividualUserRestrictions", individualUserRestrictions)
                .add("\ncountriesNotSupported", countriesNotSupported)
                .add("\ncountriesSupported", countriesSupported)
                .toString();
    }
}
