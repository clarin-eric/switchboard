package eu.clarin.switchboard.app.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.base.MoreObjects;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.temporal.ChronoUnit;

public class UrlResolverConfig {
    @NotNull
    private int connectTimeout;

    @NotNull
    private int readTimeout;

    @NotNull
    private int preflightConnectTimeout;

    @NotNull
    private int preflightReadTimeout;

    @Valid
    @NotNull
    @JsonProperty
    private String unit;

    @NotNull
    private int maxHttpCacheEntries;

    @NotNull
    private long preflightDataLimit;

    public UrlResolverConfig() {
    }

    public UrlResolverConfig(int connectTimeout, int readTimeout, int preflightConnectTimeout, int preflightReadTimeout, String unit, int maxHttpCacheEntries, long preflightDataLimit) {
        this.connectTimeout = connectTimeout;
        this.readTimeout = readTimeout;
        this.preflightConnectTimeout = preflightConnectTimeout;
        this.preflightReadTimeout = preflightReadTimeout;
        this.unit = unit;
        this.maxHttpCacheEntries = maxHttpCacheEntries;
        this.preflightDataLimit = preflightDataLimit;
    }

    public int getConnectTimeout() {
        ChronoUnit u = ChronoUnit.valueOf(unit.trim().toUpperCase());
        return (int) Duration.of(connectTimeout, u).getNano() / 1000 / 1000;
    }

    public int getReadTimeout() {
        ChronoUnit u = ChronoUnit.valueOf(unit.trim().toUpperCase());
        return (int) Duration.of(readTimeout, u).getNano() / 1000 / 1000;
    }

    public int getPreflightConnectTimeout() {
        ChronoUnit u = ChronoUnit.valueOf(unit.trim().toUpperCase());
        return (int) Duration.of(preflightConnectTimeout, u).getNano() / 1000 / 1000;
    }

    public int getPreflightReadTimeout() {
        ChronoUnit u = ChronoUnit.valueOf(unit.trim().toUpperCase());
        return (int) Duration.of(preflightReadTimeout, u).getNano() / 1000 / 1000;
    }

    public long getPreflightDataLimit() { return (long) preflightDataLimit; }

    public int getMaxHttpCacheEntries() {
        return maxHttpCacheEntries;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nconnectTimeout", connectTimeout)
                .add("\nreadTimeout", readTimeout)
                .add("\nunit", unit)
                .add("\nmaxHttpCacheEntries", maxHttpCacheEntries)
                .toString();
    }
}
