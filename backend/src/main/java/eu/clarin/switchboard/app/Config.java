package eu.clarin.switchboard.app;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import io.dropwizard.Configuration;

public class Config extends Configuration {
    @Valid
    @NotNull
    private String tikaConfPath;

    @Valid
    @NotNull
    private String toolRegistryPath;

    @JsonProperty("tikaConfigPath")
    public String getTikaConfPath() {
        return tikaConfPath;
    }

    @JsonProperty("toolRegistryPath")
    public String getToolRegistryPath() {
        return toolRegistryPath;
    }
}
