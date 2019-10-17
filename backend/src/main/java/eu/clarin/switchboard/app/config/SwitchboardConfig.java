package eu.clarin.switchboard.app.config;

import com.google.common.base.MoreObjects;
import eu.clarin.switchboard.core.ToolRegistry;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class SwitchboardConfig {
    @Valid
    @NotNull
    private String tikaConfigPath;

    @Valid
    @NotNull
    private String contactEmail;

    @Valid
    @NotNull
    private DataStoreConfig dataStore;

    @Valid
    @NotNull
    private UrlResolverConfig urlResolver;

    @Valid
    @NotNull
    private ToolConfig tools;

    public String getContactEmail() {
        return contactEmail;
    }

    public String getTikaConfigPath() {
        return tikaConfigPath;
    }

    public DataStoreConfig getDataStore() {
        return dataStore;
    }

    public UrlResolverConfig getUrlResolver() {
        return urlResolver;
    }

    public ToolConfig getTools() {
        return tools;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\ttikaConfigPath", tikaConfigPath)
                .add("\tcontactEmail", contactEmail)
                .add("\tdataStore", dataStore)
                .add("\turlResolver", urlResolver)
                .add("\ttoolConfig", tools)
                .toString();
    }

}
