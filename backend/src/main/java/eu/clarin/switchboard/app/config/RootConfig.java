package eu.clarin.switchboard.app.config;

import io.dropwizard.Configuration;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class RootConfig extends Configuration {
    @Valid
    @NotNull
    private SwitchboardConfig switchboard;

    public SwitchboardConfig getSwitchboard() {
        return switchboard;
    }

}