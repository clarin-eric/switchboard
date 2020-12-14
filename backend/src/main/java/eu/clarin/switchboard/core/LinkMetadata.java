package eu.clarin.switchboard.core;

import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.core.xc.LinkException;
import org.apache.http.Header;
import org.apache.http.client.cache.HttpCacheContext;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.text.ParseException;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LinkMetadata {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(LinkMetadata.class);

    public static final Pattern DOI_PATTERN = Pattern.compile("^10.\\d{4,9}/[-._;()/:A-Z0-9]+$", Pattern.CASE_INSENSITIVE);
    public static final String DOI_URL_PREFIX = "https://doi.org/";
    public static final Pattern HANDLE_PATTERN = Pattern.compile("^[^./]+(\\.[^./]+)*/.+$");
    public static final String HANDLE_URL_PREFIX = "https://hdl.handle.net/";

    public static final String DEFAULT_NAME = "resource";

    public static class LinkInfo {
        String filename;
        String downloadLink;
        int redirects;
        CloseableHttpResponse response;

        public String getFilename() {
            return filename;
        }

        public String getDownloadLink() {
            return downloadLink;
        }

        public int getRedirects() {
            return redirects;
        }

        public CloseableHttpResponse getResponse() {
            return response;
        }
    }

    public static LinkInfo getLinkData(CloseableHttpClient client, String originalUrlOrDoiOrHandle) throws CommonException {
        LinkMetadata.LinkInfo linkInfo = fixOriginalUrl(originalUrlOrDoiOrHandle);

        HttpCacheContext context = HttpCacheContext.create();

        CloseableHttpResponse response;
        try {
            response = client.execute(new HttpGet(linkInfo.downloadLink), context);
        } catch (IllegalArgumentException xc) {
            throw new LinkException(LinkException.Kind.BAD_URL, "" + linkInfo.downloadLink, xc);
        } catch (IOException xc) {
            throw new LinkException(LinkException.Kind.DATA_STREAM_ERROR, "" + linkInfo.downloadLink, xc);
        }

        int status = response.getStatusLine().getStatusCode();
        if (status >= 400) {
            throw new LinkException(LinkException.Kind.STATUS_ERROR, "" + linkInfo.downloadLink, status);
        }

        switch (context.getCacheResponseStatus()) {
            case CACHE_HIT:
                LOGGER.debug("A response was generated from the cache with no requests sent upstream");
                break;
            case CACHE_MODULE_RESPONSE:
                LOGGER.debug("The response was generated directly by the caching module");
                break;
            case CACHE_MISS:
                LOGGER.debug("The response came from an upstream server");
                break;
            case VALIDATED:
                LOGGER.debug("The response was generated from the cache after validating the entry with the origin server");
                break;
        }

        Header header = response.getFirstHeader("Content-Disposition");
        if (header != null) {
            try {
                ContentDisposition disposition = new ContentDisposition(header.getValue());
                String name = disposition.getFileName();
                if (name != null && !DataStore.sanitize(name).isEmpty()) {
                    linkInfo.filename = name;
                }
            } catch (ParseException e) {
                LOGGER.debug("cannot parse content-disposition " + header);
                // caused by ContentDisposition, ignore
            }
        }

        linkInfo.response = response;

        List<URI> redirectURIs = context.getRedirectLocations();
        if (redirectURIs != null && !redirectURIs.isEmpty()) {
            Collections.reverse(redirectURIs); // we want direct download as first link
            for (URI redirectURI : redirectURIs) {
                try {
                    tryToSetFilenameFromUrl(linkInfo, redirectURI.toURL());
                } catch (MalformedURLException e) {
                    // ignore
                }
            }
            linkInfo.redirects = redirectURIs.size();
            linkInfo.downloadLink = redirectURIs.get(0).toString();
        }

        if (linkInfo.filename == null) {
            linkInfo.filename = DEFAULT_NAME;
        }

        LOGGER.debug("final linkInfo: " + linkInfo.filename + "; " + linkInfo.downloadLink);
        return linkInfo;
    }

    private static LinkInfo fixOriginalUrl(String original) throws LinkException {
        LinkInfo linkInfo = new LinkInfo();

        String resolved = resolveDoiOrHandle(original);
        linkInfo.downloadLink = resolved;

        URL url;
        try {
            url = new URL(resolved);
        } catch (MalformedURLException xc) {
            throw new LinkException(LinkException.Kind.BAD_URL, original, xc);
        }

        String host = url.getHost();
        String path = url.getPath();
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        tryToSetFilenameFromUrl(linkInfo, url);

        // e.g. b2drop file: https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y
        if (host.equals("b2drop.eudat.eu") && path.startsWith("/s/")) {
            if (linkInfo.filename == null) {
                linkInfo.filename = "b2drop_file";
            }
            if (!path.endsWith("/download")) {
                path += "/download";
                try {
                    linkInfo.downloadLink = new URL(url.getProtocol(), url.getHost(), path).toString();
                } catch (MalformedURLException xc) {
                    throw new LinkException(LinkException.Kind.BAD_URL, url.toString(), xc);
                }
            }
        }

        // dropbox file: https://www.dropbox.com/s/9flyntc1353ve07/id_rsa.pub?dl=0
        if ((url.getHost().equals("www.dropbox.com") || url.getHost().equals("dropbox.com"))
                && path.startsWith("/s/")) {
            if (!resolved.contains("?dl=1")) {
                linkInfo.downloadLink = resolved.replaceFirst("\\?dl=0", "?dl=1");
            }
        }
        LOGGER.debug("new linkInfo: " + linkInfo.filename + "; " + linkInfo.downloadLink);
        return linkInfo;
    }

    private static void tryToSetFilenameFromUrl(LinkInfo linkInfo, URL url) {
        if (linkInfo.filename != null) {
            return;
        }

        String path = url.getPath();
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        String filename = path;
        int lastSlash = path.lastIndexOf("/");
        if (lastSlash >= 0) {
            filename = path.substring(lastSlash + 1, path.length());
        }

        if (filename.contains(".")) {
            linkInfo.filename = filename;
        }
    }

    public static String resolveDoiOrHandle(String original) {
        original = original.trim();
        Matcher doiMatcher = DOI_PATTERN.matcher(original);
        if (doiMatcher.matches()) {
            return DOI_URL_PREFIX + original;
        }
        if (original.startsWith("http://") || original.startsWith("https://")) {
            return original;
        }
        Matcher handleMatcher = HANDLE_PATTERN.matcher(original);
        if (handleMatcher.matches()) {
            return HANDLE_URL_PREFIX + original;
        }
        return original;
    }
}
