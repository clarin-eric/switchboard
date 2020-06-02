package eu.clarin.switchboard.core;

import com.google.common.io.ByteStreams;
import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.app.config.UrlResolverConfig;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.core.xc.LinkException;
import eu.clarin.switchboard.core.xc.StorageException;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.cache.CacheConfig;
import org.apache.http.impl.client.cache.CachingHttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * MediaLibrary keeps records about datafiles, identified by uuids.
 * The records contain file paths, profiles, origin information.
 */
public class MediaLibrary {
    public static final int MAX_ALLOWED_REDIRECTS = 10;

    private static final Logger LOGGER = LoggerFactory.getLogger(MediaLibrary.class);

    private final DataStore dataStore;
    private final Profiler profiler;
    private final StoragePolicy storagePolicy;
    private final UrlResolverConfig urlResolverConfig;
    private final CloseableHttpClient cachingClient;

    Map<UUID, FileInfo> fileInfoMap = Collections.synchronizedMap(new HashMap<>());

    public MediaLibrary(DataStore dataStore, Profiler profiler, StoragePolicy storagePolicy,
                        UrlResolverConfig urlResolver, DataStoreConfig dataStoreConfig) {
        this.dataStore = dataStore;
        this.profiler = profiler;
        this.storagePolicy = storagePolicy;
        this.urlResolverConfig = urlResolver;

        CacheConfig cacheConfig = CacheConfig.custom()
                .setMaxCacheEntries(urlResolver.getMaxHttpCacheEntries())
                .setMaxObjectSize(dataStoreConfig.getMaxSize())
                .build();
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(urlResolverConfig.getConnectTimeout())
                .setSocketTimeout(urlResolverConfig.getReadTimeout())
                .setMaxRedirects(MAX_ALLOWED_REDIRECTS)
                .setRedirectsEnabled(true)
                .build();
        cachingClient = CachingHttpClients.custom()
                .setCacheConfig(cacheConfig)
                .setDefaultRequestConfig(requestConfig)
                .build();

        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        Duration cleanup = storagePolicy.getCleanupPeriod();
        executor.scheduleAtFixedRate(this::periodicCleanup, cleanup.getSeconds(), cleanup.getSeconds(), TimeUnit.SECONDS);
    }

    public FileInfo addMedia(String originalUrlOrDoiOrHandle) throws CommonException, ProfilingException {
        LinkMetadata.LinkInfo linkInfo = LinkMetadata.getLinkData(cachingClient, originalUrlOrDoiOrHandle);
        try {
            FileInfo fileInfo = addMedia(linkInfo.filename, linkInfo.response.getEntity().getContent());
            fileInfo.setLinksInfo(originalUrlOrDoiOrHandle, linkInfo.downloadLink, linkInfo.redirects);
            return fileInfo;
        } catch (IOException xc) {
            throw new LinkException(LinkException.Kind.DATA_STREAM_ERROR, "" + linkInfo.downloadLink, xc);
        } finally {
            try {
                linkInfo.response.close();
            } catch (IOException e) {
                // ignore
            }
        }
    }

    public FileInfo addMedia(String filename, InputStream inputStream) throws
            StoragePolicyException, StorageException, ProfilingException {
        UUID id = UUID.randomUUID();
        Path path;
        try {
            path = dataStore.save(id, filename, inputStream);
        } catch (IOException xc) {
            throw new StorageException(xc);
        }

        FileInfo fileInfo = new FileInfo(id, filename, path);
        File file = path.toFile();

        try {
            List<Profile> profileList = profiler.profile(file);
            if (profileList == null || profileList.isEmpty()) {
                throw new ProfilingException("null profiling result");
            }
            fileInfo.setProfiles(
                    profileList.get(0),
                    profileList.subList(1, profileList.size())
            );
        } catch (IOException xc) {
            dataStore.delete(id, path);
            throw new StorageException(xc);
        } catch (ProfilingException xc) {
            dataStore.delete(id, path);
            throw xc;
        }

        fileInfoMap.put(id, fileInfo);

        try {
            storagePolicy.acceptProfile(fileInfo.getProfile());
        } catch (StoragePolicyException xc) {
            LOGGER.debug("profile not accepted: " + fileInfo);
            dataStore.delete(id, path);
            fileInfoMap.remove(id);
            throw xc;
        }

        return fileInfo;
    }

    public FileInfo getFileInfo(UUID id) {
        return fileInfoMap.get(id);
    }

    private void periodicCleanup() {
        // this runs on its own thread
        LOGGER.info("start periodic cleanup now");
        for (Iterator<FileInfo> iterator = fileInfoMap.values().iterator(); iterator.hasNext(); ) {
            FileInfo fi = iterator.next();
            Duration lifetime = Duration.between(fi.getCreation(), Instant.now());
            if (lifetime.compareTo(storagePolicy.getMaxAllowedLifetime()) > 0) {
                LOGGER.debug("removing entry: " + fi.getId());
                dataStore.delete(fi.getId(), fi.getPath());
                iterator.remove();
            }
        }
    }
}
