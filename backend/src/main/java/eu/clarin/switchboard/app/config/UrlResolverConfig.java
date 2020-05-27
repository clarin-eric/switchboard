package eu.clarin.switchboard.app.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.base.MoreObjects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.Duration;
import java.time.temporal.ChronoUnit;

public class UrlResolverConfig {
    @NotNull
    private int connectTimeout;

    @NotNull
    private int readTimeout;

    @Valid
    @NotNull
    @JsonProperty
    private String unit;

    @NotNull
    private int maxHttpCacheEntries;

    public UrlResolverConfig() {
    }

    public UrlResolverConfig(int connectTimeout, int readTimeout, String unit, int maxHttpCacheEntries) {
        this.connectTimeout = connectTimeout;
        this.readTimeout = readTimeout;
        this.unit = unit;
        this.maxHttpCacheEntries = maxHttpCacheEntries;
    }

    public int getConnectTimeout() {
        ChronoUnit u = ChronoUnit.valueOf(unit.trim().toUpperCase());
        return (int) Duration.of(connectTimeout, u).getNano() / 1000 / 1000;
    }

    public int getReadTimeout() {
        ChronoUnit u = ChronoUnit.valueOf(unit.trim().toUpperCase());
        return (int) Duration.of(readTimeout, u).getNano() / 1000 / 1000;
    }

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
