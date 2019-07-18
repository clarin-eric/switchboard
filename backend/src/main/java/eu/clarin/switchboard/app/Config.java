package eu.clarin.switchboard.app;

import com.google.common.base.MoreObjects;
import io.dropwizard.Configuration;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.Duration;
import java.time.temporal.ChronoUnit;

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
        private String contactEmail;

        @Valid
        @NotNull
        private DataStoreConfig dataStore;

        public String getContactEmail() {
            return contactEmail;
        }

        public static class DataStoreConfig {
            public DataStoreConfig() {
            }

            public DataStoreConfig(String location, Boolean eraseAllStorageOnStart, String maxSize, String maxLifetime, String maxLifetimeUnit, String cleanupPeriod, String cleanupPeriodUnit) {
                this.location = location;
                this.eraseAllStorageOnStart = eraseAllStorageOnStart;
                this.maxSize = maxSize;
                this.maxLifetime = maxLifetime;
                this.maxLifetimeUnit = maxLifetimeUnit;
                this.cleanupPeriod = cleanupPeriod;
                this.cleanupPeriodUnit = cleanupPeriodUnit;
            }

            @Valid
            private String location;

            @Valid
            @NotNull
            private Boolean eraseAllStorageOnStart;

            @Valid
            @NotNull
            private String maxSize;

            @Valid
            @NotNull
            private String maxLifetime;

            @Valid
            @NotNull
            private String maxLifetimeUnit;

            @Valid
            @NotNull
            private String cleanupPeriod;

            @Valid
            @NotNull
            private String cleanupPeriodUnit;

            public String getLocation() {
                return location;
            }

            public boolean isEraseAllStorageOnStart() {
                return eraseAllStorageOnStart;
            }

            public long getMaxSize() {
                String str = maxSize.trim();
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

            public Duration getMaxLifetime() {
                long t = Integer.parseInt(maxLifetime.trim());
                ChronoUnit u = ChronoUnit.valueOf(maxLifetimeUnit.trim().toUpperCase());
                return Duration.of(t, u);
            }

            public Duration getCleanupPeriod() {
                long t = Integer.parseInt(cleanupPeriod.trim());
                ChronoUnit u = ChronoUnit.valueOf(cleanupPeriodUnit.trim().toUpperCase());
                return Duration.of(t, u);
            }

            public String getMaxLifetimeUnit() {
                return maxLifetimeUnit;
            }

            public String getCleanupPeriodUnit() {
                return cleanupPeriodUnit;
            }

            @Override
            public String toString() {
                return MoreObjects.toStringHelper(this)
                        .add("\tlocation", location)
                        .add("\teraseAllStorageOnStart", eraseAllStorageOnStart)
                        .add("\tmaxSize", maxSize)
                        .add("\tmaxLifetime", maxLifetime)
                        .add("\tmaxLifetimeUnit", maxLifetimeUnit)
                        .add("\tcleanupPeriod", cleanupPeriod)
                        .add("\tcleanupPeriodUnit", cleanupPeriodUnit)
                        .toString();
            }
        }

        public String getTikaConfigPath() {
            return tikaConfigPath;
        }

        public String getToolRegistryPath() {
            return toolRegistryPath;
        }

        public DataStoreConfig getDataStore() {
            return dataStore;
        }

        @Override
        public String toString() {
            return MoreObjects.toStringHelper(this)
                    .add("\ttikaConfigPath", tikaConfigPath)
                    .add("\ttoolRegistryPath", toolRegistryPath)
                    .add("\tcontactEmail", contactEmail)
                    .add("\tdataStore", dataStore)
                    .toString();
        }
    }
}
