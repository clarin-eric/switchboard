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
    private String logoRegistryPath;

    @Valid
    @NotNull
    private boolean showOnlyProductionTools;

    @Valid
    @NotNull
    private boolean enableMultipleResources;

    public ToolConfig() {
    }

    public ToolConfig(String toolRegistryPath,
                      String logoRegistryPath,
                      boolean showOnlyProductionTools,
                      boolean enableMultipleResources) {
        this.toolRegistryPath = toolRegistryPath;
        this.logoRegistryPath = logoRegistryPath;
        this.showOnlyProductionTools = showOnlyProductionTools;
        this.enableMultipleResources = enableMultipleResources;
    }

    public String getToolRegistryPath() {
        return toolRegistryPath;
    }

    public String getLogoRegistryPath() {
        return logoRegistryPath;
    }

    public boolean getShowOnlyProductionTools() {
        return showOnlyProductionTools;
    }

    public boolean getEnableMultipleResources() {
        return enableMultipleResources;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\ntoolRegistryPath", toolRegistryPath)
                .add("\nlogoRegistryPath", logoRegistryPath)
                .add("\nshowOnlyProductionTools", showOnlyProductionTools)
                .add("\nenableMultipleResources", enableMultipleResources)
                .toString();
    }
}
