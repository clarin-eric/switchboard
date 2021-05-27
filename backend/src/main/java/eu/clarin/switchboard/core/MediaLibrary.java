package eu.clarin.switchboard.core;

import eu.clarin.switchboard.app.config.DataStoreConfig;
import eu.clarin.switchboard.app.config.UrlResolverConfig;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.core.xc.LinkException;
import eu.clarin.switchboard.core.xc.StorageException;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.cache.CacheConfig;
import org.apache.http.impl.client.cache.CachingHttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.zip.ZipFile;

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
    private final CloseableHttpClient cachingClient;
    private final ExecutorService executorService;

    Map<UUID, FileInfoFuture> fileInfoFutureMap = Collections.synchronizedMap(new HashMap<>());

    public MediaLibrary(DataStore dataStore, Profiler profiler, StoragePolicy storagePolicy,
                        UrlResolverConfig urlResolverConfig, DataStoreConfig dataStoreConfig) {
        this.dataStore = dataStore;
        this.profiler = profiler;
        this.storagePolicy = storagePolicy;

        CacheConfig cacheConfig = CacheConfig.custom()
                .setMaxCacheEntries(urlResolverConfig.getMaxHttpCacheEntries())
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

        executorService = Executors.newCachedThreadPool();

        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        Duration cleanup = storagePolicy.getCleanupPeriod();
        executor.scheduleAtFixedRate(this::periodicCleanup, cleanup.getSeconds(), cleanup.getSeconds(), TimeUnit.SECONDS);
    }

    public FileInfo addByUrl(String originalUrlOrDoiOrHandle) throws CommonException, ProfilingException {
        UUID id = UUID.randomUUID();
        FileInfo fileInfo = addByUrl(cachingClient, dataStore, profiler, storagePolicy, id, originalUrlOrDoiOrHandle);
        fileInfoFutureMap.put(id, new FileInfoFuture(id, wrap(fileInfo)));
        return fileInfo;
    }

    public FileInfo addFile(String filename, InputStream inputStream, Profile profile) throws
            StoragePolicyException, StorageException, ProfilingException {
        UUID id = UUID.randomUUID();
        FileInfo fileInfo = addFile(dataStore, profiler, storagePolicy, id, filename, inputStream, profile);
        fileInfoFutureMap.put(id, new FileInfoFuture(id, wrap(fileInfo)));
        return fileInfo;
    }

    public UUID addByUrlAsync(String originalUrlOrDoiOrHandle) {
        UUID id = UUID.randomUUID();
        Future<FileInfo> future = executorService.submit(() ->
                addByUrl(cachingClient, dataStore, profiler, storagePolicy, id, originalUrlOrDoiOrHandle));
        fileInfoFutureMap.put(id, new FileInfoFuture(id, future));
        return id;
    }

    public UUID addFileAsync(String filename, InputStream inputStream) {
        UUID id = UUID.randomUUID();
        Future<FileInfo> future = executorService.submit(() ->
                addFile(dataStore, profiler, storagePolicy, id, filename, inputStream, null));
        fileInfoFutureMap.put(id, new FileInfoFuture(id, future));
        return id;
    }

    public FileInfo addFromZip(Path zipPath, String zipEntry, Profile profile) throws IOException, StoragePolicyException, ProfilingException, StorageException {
        Path path = Paths.get(zipEntry);
        String name = path.getName(path.getNameCount() - 1).toString();
        ZipFile zfile = new ZipFile(zipPath.toFile());
        return addFile(name, zfile.getInputStream(zfile.getEntry(zipEntry)), profile);
    }

    public FileInfo waitForFileInfo(UUID id) throws Throwable {
        FileInfoFuture fif = fileInfoFutureMap.get(id);
        Future<FileInfo> future = fif == null ? null : fif.getFileInfoFuture();
        if (future == null) {
            return null;
        }
        try {
            return future.get();
        } catch (ExecutionException xc) {
            LOGGER.debug("rethrow previous async error: {}", xc.getCause().getMessage());
            throw xc.getCause();
        }
    }

    private static Future<FileInfo> wrap(FileInfo fileInfo) {
        FutureTask<FileInfo> future = new FutureTask<>(() -> fileInfo);
        future.run();
        return future;
    }

    private static FileInfo addByUrl(CloseableHttpClient cachingClient,
                                     DataStore dataStore, Profiler profiler, StoragePolicy storagePolicy,
                                     UUID id, String originalUrlOrDoiOrHandle) throws CommonException, ProfilingException {
        LinkMetadata.LinkInfo linkInfo = LinkMetadata.getLinkData(cachingClient, originalUrlOrDoiOrHandle);
        try {
            storagePolicy.acceptSize(linkInfo.response.getEntity().getContentLength());
            FileInfo fileInfo = addFile(dataStore, profiler, storagePolicy,
                    id, linkInfo.filename, linkInfo.response.getEntity().getContent(), null);
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

    private static FileInfo addFile(DataStore dataStore, Profiler profiler, StoragePolicy storagePolicy,
                                    UUID id, String filename, InputStream inputStream, Profile profile) throws
            StoragePolicyException, StorageException, ProfilingException {
        Path path;
        try {
            path = dataStore.save(id, filename, inputStream);
        } catch (IOException xc) {
            throw new StorageException(xc);
        }

        FileInfo fileInfo = new FileInfo(id, filename, path);
        try {
            File file = path.toFile();

            List<Profile> profileList;
            if (profile != null) {
                profileList = Collections.singletonList(profile);
            } else {
                profileList = profiler.profile(file);
            }
            if (profileList == null || profileList.isEmpty()) {
                throw new ProfilingException("null profiling result");
            }
            fileInfo.setProfiles(
                    profileList.get(0),
                    profileList.subList(1, profileList.size())
            );

            storagePolicy.acceptProfile(fileInfo.getProfile().toProfile());

            return fileInfo;
        } catch (IOException xc) {
            dataStore.delete(id, path);
            throw new StorageException(xc);
        } catch (ProfilingException | StoragePolicyException xc) {
            dataStore.delete(id, path);
            throw xc;
        }
    }

    public void setContent(UUID id, String content) throws Throwable {
        FileInfo fi = waitForFileInfo(id);
        if (fi != null) {
            dataStore.setContent(fi.getPath(), content);
        }
    }

    private void periodicCleanup() {
        // this runs on its own thread
        LOGGER.info("start periodic cleanup now");
        for (Iterator<FileInfoFuture> iterator = fileInfoFutureMap.values().iterator(); iterator.hasNext(); ) {
            FileInfoFuture fileInfoFuture = iterator.next();
            Duration lifetime = Duration.between(fileInfoFuture.getCreation(), Instant.now());
            if (lifetime.compareTo(storagePolicy.getMaxAllowedLifetime()) > 0) {
                LOGGER.debug("removing entry: " + fileInfoFuture.getId());
                try {
                    Future<FileInfo> future = fileInfoFuture.getFileInfoFuture();
                    if (!future.isDone()) {
                        future.cancel(true);
                    }
                    FileInfo fileInfo = future.get(1, TimeUnit.SECONDS);
                    dataStore.delete(fileInfoFuture.getId(), fileInfo.getPath());
                } catch (ExecutionException | InterruptedException | TimeoutException e) {
                    // ignore 'future' errors, we're only interested in deleting data on disk
                }
                iterator.remove();
            }
        }
    }
}
