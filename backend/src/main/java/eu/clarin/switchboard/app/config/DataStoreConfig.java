package eu.clarin.switchboard.app.config;

import com.google.common.base.MoreObjects;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.temporal.ChronoUnit;

public class DataStoreConfig {
    public DataStoreConfig() {
    }

    public DataStoreConfig(String location, Boolean eraseAllStorageOnStart, String maxSize, String maxFiles, String maxLifetime, String maxLifetimeUnit, String cleanupPeriod, String cleanupPeriodUnit) {
        this.location = location;
        this.eraseAllStorageOnStart = eraseAllStorageOnStart;
        this.maxSize = maxSize;
        this.maxFiles = maxFiles;
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
    private String maxFiles;

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
        return convertStringWithMultiplicatorToLong(maxSize);
    }

    public long getMaxFiles() {
        return convertStringWithMultiplicatorToLong(maxFiles);
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
                .add("\tmaxFiles", maxFiles)
                .add("\tmaxLifetime", maxLifetime)
                .add("\tmaxLifetimeUnit", maxLifetimeUnit)
                .add("\tcleanupPeriod", cleanupPeriod)
                .add("\tcleanupPeriodUnit", cleanupPeriodUnit)
                .toString();
    }

    static long convertStringWithMultiplicatorToLong(String input) {
        String str = input.trim();
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
}
