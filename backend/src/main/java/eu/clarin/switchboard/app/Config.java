package eu.clarin.switchboard.app;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import io.dropwizard.Configuration;

public class Config extends Configuration {
    @Valid
    @NotNull
    private String tikaConfPath;

    @JsonProperty("tikaConfigPath")
    public String getTikaConfPath() {
        return tikaConfPath;
    }
}
