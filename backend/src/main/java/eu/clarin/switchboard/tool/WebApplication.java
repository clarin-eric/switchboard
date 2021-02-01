package eu.clarin.switchboard.tool;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class WebApplication {
    String browserRequirements;
    String applicationSuite;
    String scalabilityType; // singleUser, smallGroups, classroomSize, lectureSize, unlimited, unknown, other
    List<String> licenseInformation;
    RuntimeInformation runtimeInformation;

    String url;
    List<Parameter> queryParameters;
    List<Parameter> pathParameters;
    List<Parameter> manualParameters;

    public String getBrowserRequirements() {
        return browserRequirements;
    }

    public void setBrowserRequirements(String browserRequirements) {
        this.browserRequirements = browserRequirements;
    }

    public String getApplicationSuite() {
        return applicationSuite;
    }

    public void setApplicationSuite(String applicationSuite) {
        this.applicationSuite = applicationSuite;
    }

    public String getScalabilityType() {
        return scalabilityType;
    }

    public void setScalabilityType(String scalabilityType) {
        this.scalabilityType = scalabilityType;
    }

    public List<String> getLicenseInformation() {
        return licenseInformation;
    }

    public void setLicenseInformation(List<String> licenseInformation) {
        this.licenseInformation = licenseInformation;
    }

    public RuntimeInformation getRuntimeInformation() {
        return runtimeInformation;
    }

    public void setRuntimeInformation(RuntimeInformation runtimeInformation) {
        this.runtimeInformation = runtimeInformation;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<Parameter> getQueryParameters() {
        return queryParameters;
    }

    public void setQueryParameters(List<Parameter> queryParameters) {
        this.queryParameters = queryParameters;
    }

    public List<Parameter> getPathParameters() {
        return pathParameters;
    }

    public void setPathParameters(List<Parameter> pathParameters) {
        this.pathParameters = pathParameters;
    }

    public List<Parameter> getManualParameters() {
        return manualParameters;
    }

    public void setManualParameters(List<Parameter> manualParameters) {
        this.manualParameters = manualParameters;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nbrowserRequirements", browserRequirements)
                .add("\napplicationSuite", applicationSuite)
                .add("\nscalabilityType", scalabilityType)
                .add("\nlicenseInformation", licenseInformation)
                .add("\nruntimeInformation", runtimeInformation)
                .add("\nurl", url)
                .add("\nqueryParameters", queryParameters)
                .add("\npathParameters", pathParameters)
                .add("\nmanualParameters", manualParameters)
                .toString();
    }
}
