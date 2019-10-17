package eu.clarin.switchboard.app.config;

import com.google.common.base.MoreObjects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class ToolConfig {
    @Valid
    @NotNull
    private String toolRegistryPath;

    @Valid
    @NotNull
    private boolean showOnlyProductionTools;

    @Valid
    @NotNull
    private boolean includeWebServices;

    public ToolConfig() {
    }

    public ToolConfig(String toolRegistryPath, boolean showOnlyProductionTools, boolean includeWebServices) {
        this.toolRegistryPath = toolRegistryPath;
        this.showOnlyProductionTools = showOnlyProductionTools;
        this.includeWebServices = includeWebServices;
    }

    public String getToolRegistryPath() {
        return toolRegistryPath;
    }

    public boolean getShowOnlyProductionTools() {
        return showOnlyProductionTools;
    }

    public boolean getIncludeWebServices() {
        return includeWebServices;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\ntoolRegistryPath", toolRegistryPath)
                .add("\nshowOnlyProductionTools", showOnlyProductionTools)
                .add("\nincludeWebServices", includeWebServices)
                .toString();
    }
}
