package eu.clarin.switchboard.app.config;

import io.dropwizard.core.Configuration;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class RootConfig extends Configuration {
    @Valid
    @NotNull
    private SwitchboardConfig switchboard;

    public SwitchboardConfig getSwitchboard() {
        return switchboard;
    }

}