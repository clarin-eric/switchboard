package eu.clarin.switchboard.core;

import eu.clarin.switchboard.core.xc.CommonException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.cache.CacheConfig;
import org.apache.http.impl.client.cache.CachingHttpClients;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class LinkMetadataTest {
    @Test
    public void testInfo() throws CommonException, IOException {
        CacheConfig cacheConfig = CacheConfig.custom()
                .setMaxCacheEntries(100)
                .setMaxObjectSize(1024 * 1024)
                .build();
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(120000)
                .setSocketTimeout(120000)
                .setMaxRedirects(10)
                .setRedirectsEnabled(true)
                .build();
        CloseableHttpClient cachingClient = CachingHttpClients.custom()
                .setCacheConfig(cacheConfig)
                .setDefaultRequestConfig(requestConfig)
                .build();
        LinkMetadata.LinkInfo info;

        info = LinkMetadata.getLinkData(cachingClient, "http://doi.org/10.1045/may99-payette");
        assertEquals("05payette.html", info.filename);
        info.response.close();

        info = LinkMetadata.getLinkData(cachingClient, "https://people.sc.fsu.edu/~jburkardt/data/ply/airplane.ply");
        assertEquals("airplane.ply", info.filename);
        info.response.close();

        info = LinkMetadata.getLinkData(cachingClient, "https://raw.githubusercontent.com/clarin-eric/switchboard/master/LICENCE");
        assertEquals("LICENCE", info.filename);
        info.response.close();

        info = LinkMetadata.getLinkData(cachingClient, "https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y");
        assertEquals("sherlock-short.txt", info.filename);
        info.response.close();

        info = LinkMetadata.getLinkData(cachingClient, "https://google.com/trends");
        assertEquals("trends", info.filename);
        info.response.close();
    }

    @Test
    public void testVcrNegotiation() throws CommonException, IOException {
        CacheConfig cacheConfig = CacheConfig.custom()
                .setMaxCacheEntries(100)
                .setMaxObjectSize(1024 * 1024)
                .build();
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(2000)
                .setSocketTimeout(2000)
                .setMaxRedirects(10)
                .setRedirectsEnabled(true)
                .build();
        CloseableHttpClient cachingClient = CachingHttpClients.custom()
                .setCacheConfig(cacheConfig)
                .setDefaultRequestConfig(requestConfig)
                .addInterceptorFirst(Quirks.QUIRKS_REQUEST_INTERCEPTOR)
                .build();
        LinkMetadata.LinkInfo info;
        String contentType;

        info = LinkMetadata.getLinkData(cachingClient, "https://doi.org/10.34733/vc-1061");
        contentType = info.response.getFirstHeader("content-type").getValue();
        assertEquals("application/x-cmdi+xml", contentType);
        info.response.close();

        info = LinkMetadata.getLinkData(cachingClient, "https://collections.clarin.eu/service/v1/collections//1061");
        contentType = info.response.getFirstHeader("content-type").getValue();
        System.out.println("contentType = " + contentType);
        assertEquals("application/x-cmdi+xml", contentType);
        info.response.close();
    }

    @Test
    public void resolveDoiOrHandle() {
        assertResolve("10.1045/may99-payette", "https://doi.org/10.1045/may99-payette");

        assertResolve("11304/0cff951a-fe8b-43a9-8849-db1bdd5106e6",
                "https://hdl.handle.net/11304/0cff951a-fe8b-43a9-8849-db1bdd5106e6");
        assertResolve("11304/0cff951a-fe8b-43a9-8849-db1bdd5106e6@ds1",
                "https://hdl.handle.net/11304/0cff951a-fe8b-43a9-8849-db1bdd5106e6@ds1");

        assertResolve("http://example.com", "http://example.com");
        assertResolve("https://example.com", "https://example.com");
        assertResolve("http://example.com/1", "http://example.com/1");
        assertResolve("https://example.com/1", "https://example.com/1");
        assertResolve("http://example.com/1/asdf", "http://example.com/1/asdf");
        assertResolve("http://example.com/1/asdf.xor", "http://example.com/1/asdf.xor");
        assertResolve("https://example.com/1/asdf", "https://example.com/1/asdf");
        assertResolve("http://example.com/1/asdf?q=ad%32ass", "http://example.com/1/asdf?q=ad%32ass");
        assertResolve("https://example.com/1/asdf?q=ad%32ass", "https://example.com/1/asdf?q=ad%32ass");
    }

    void assertResolve(String test, String expected) {
        assertEquals(expected, LinkMetadata.resolveDoiOrHandle(test));
    }
}
