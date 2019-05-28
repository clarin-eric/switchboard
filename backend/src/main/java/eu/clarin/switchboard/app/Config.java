package eu.clarin.switchboard.app;

import io.dropwizard.Configuration;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class Config extends Configuration {
    @Valid
    @NotNull
    private SwitchboardConfig switchboard;

    public SwitchboardConfig getSwitchboard() {
        return switchboard;
    }

    public static class SwitchboardConfig {
        @Valid
        @NotNull
        private String tikaConfigPath;

        @Valid
        @NotNull
        private String toolRegistryPath;

        @Valid
        @NotNull
        private String maximumDataSize;

        public String getTikaConfigPath() {
            return tikaConfigPath;
        }

        public String getToolRegistryPath() {
            return toolRegistryPath;
        }

        public long getMaximumDataSize() {
            String str = maximumDataSize.trim();
            final long onek = 1024;
            long multiplier = 1;
            if (str.endsWith("k") || str.endsWith("K")) {
                multiplier = onek;
                str = str.substring(0, str.length() - 1);
            } else if (str.endsWith("m") || str.endsWith("M")) {
                multiplier = onek * onek;
                str = str.substring(0, str.length() - 1);
            } else if (str.endsWith("g") || str.endsWith("G")) {
                multiplier = onek * onek * onek;
                str = str.substring(0, str.length() - 1);
            }
            return Long.parseLong(str) * multiplier;
        }

        @Override
        public String toString() {
            return "SwitchboardConfig:" +
                    "\n\ttikaConfigPath='" + tikaConfigPath + '\'' +
                    "\n\ttoolRegistryPath='" + toolRegistryPath + '\'' +
                    "\n\tmaximumDataSize='" + maximumDataSize + '\'';
        }
    }
}
