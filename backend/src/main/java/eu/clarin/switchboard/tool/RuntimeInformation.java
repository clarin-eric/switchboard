package eu.clarin.switchboard.tool;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RuntimeInformation {
    String memoryRequirements;
    String storageRequirements;
    String processorRequirements;
    List<OperatingSystem> operatingSystem;
    String fileSize;
    List<String> installationLicense;
    List<String> runtimeEnvironment; // Java, Docker, etc.

    public String getMemoryRequirements() {
        return memoryRequirements;
    }

    public void setMemoryRequirements(String memoryRequirements) {
        this.memoryRequirements = memoryRequirements;
    }

    public String getStorageRequirements() {
        return storageRequirements;
    }

    public void setStorageRequirements(String storageRequirements) {
        this.storageRequirements = storageRequirements;
    }

    public String getProcessorRequirements() {
        return processorRequirements;
    }

    public void setProcessorRequirements(String processorRequirements) {
        this.processorRequirements = processorRequirements;
    }

    public List<OperatingSystem> getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(List<OperatingSystem> operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public List<String> getInstallationLicense() {
        return installationLicense;
    }

    public void setInstallationLicense(List<String> installationLicense) {
        this.installationLicense = installationLicense;
    }

    public List<String> getRuntimeEnvironment() {
        return runtimeEnvironment;
    }

    public void setRuntimeEnvironment(List<String> runtimeEnvironment) {
        this.runtimeEnvironment = runtimeEnvironment;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nmemoryRequirements", memoryRequirements)
                .add("\nstorageRequirements", storageRequirements)
                .add("\nprocessorRequirements", processorRequirements)
                .add("\noperatingSystem", operatingSystem)
                .add("\nfileSize", fileSize)
                .add("\ninstallationLicense", installationLicense)
                .add("\nruntimeEnvironment", runtimeEnvironment)
                .toString();
    }
}
