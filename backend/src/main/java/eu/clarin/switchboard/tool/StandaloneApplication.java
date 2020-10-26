package eu.clarin.switchboard.tool;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class StandaloneApplication {
    List<String> availableOnDevice;
    List<String> installURL;
    List<TypedURL> downloadURL;
    String applicationSuite;
    String featureList;
    String permissions;
    String releaseNotes;
    String softwareAddOn;
    String softwareRequirements;
    String supportingData;
    String dataTransfer; // "none"/"local"/"cloud"/"unknown"/"other"/"N/A"
    List<String> licenseInformation;
    RuntimeInformation runtimeInformation;

    public List<String> getAvailableOnDevice() {
        return availableOnDevice;
    }

    public void setAvailableOnDevice(List<String> availableOnDevice) {
        this.availableOnDevice = availableOnDevice;
    }

    public List<String> getInstallURL() {
        return installURL;
    }

    public void setInstallURL(List<String> installURL) {
        this.installURL = installURL;
    }

    public List<TypedURL> getDownloadURL() {
        return downloadURL;
    }

    public void setDownloadURL(List<TypedURL> downloadURL) {
        this.downloadURL = downloadURL;
    }

    public String getApplicationSuite() {
        return applicationSuite;
    }

    public void setApplicationSuite(String applicationSuite) {
        this.applicationSuite = applicationSuite;
    }

    public String getFeatureList() {
        return featureList;
    }

    public void setFeatureList(String featureList) {
        this.featureList = featureList;
    }

    public String getPermissions() {
        return permissions;
    }

    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }

    public String getReleaseNotes() {
        return releaseNotes;
    }

    public void setReleaseNotes(String releaseNotes) {
        this.releaseNotes = releaseNotes;
    }

    public String getSoftwareAddOn() {
        return softwareAddOn;
    }

    public void setSoftwareAddOn(String softwareAddOn) {
        this.softwareAddOn = softwareAddOn;
    }

    public String getSoftwareRequirements() {
        return softwareRequirements;
    }

    public void setSoftwareRequirements(String softwareRequirements) {
        this.softwareRequirements = softwareRequirements;
    }

    public String getSupportingData() {
        return supportingData;
    }

    public void setSupportingData(String supportingData) {
        this.supportingData = supportingData;
    }

    public String getDataTransfer() {
        return dataTransfer;
    }

    public void setDataTransfer(String dataTransfer) {
        this.dataTransfer = dataTransfer;
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

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\navailableOnDevice", availableOnDevice)
                .add("\ninstallURL", installURL)
                .add("\ndownloadURL", downloadURL)
                .add("\napplicationSuite", applicationSuite)
                .add("\nfeatureList", featureList)
                .add("\npermissions", permissions)
                .add("\nreleaseNotes", releaseNotes)
                .add("\nsoftwareAddOn", softwareAddOn)
                .add("\nsoftwareRequirements", softwareRequirements)
                .add("\nsupportingData", supportingData)
                .add("\ndataTransfer", dataTransfer)
                .add("\nlicenseInformation", licenseInformation)
                .add("\nruntimeInformation", runtimeInformation)
                .toString();
    }
}
