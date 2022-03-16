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
import java.net.URI;
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

        @Override
        public String toString() {
            return "LinkInfo{" +
                    "filename='" + filename + '\'' +
                    ", downloadLink='" + downloadLink + '\'' +
                    ", redirects=" + redirects +
                    '}';
        }
    }

    public static LinkInfo getLinkData(CloseableHttpClient client, String originalUrlOrDoiOrHandle) throws CommonException {
        String link = resolveDoiOrHandle(originalUrlOrDoiOrHandle);
        link = Quirks.urlFixSpecialCases(link);
        LOGGER.debug("url fixup: " + originalUrlOrDoiOrHandle + " -> " + link);

        // do the http call
        HttpCacheContext context = HttpCacheContext.create();
        CloseableHttpResponse response;
        try {
            response = client.execute(new HttpGet(link), context);
        } catch (IllegalArgumentException xc) {
            throw new LinkException(LinkException.Kind.BAD_URL, "" + link, xc);
        } catch (IOException xc) {
            throw new LinkException(LinkException.Kind.DATA_STREAM_ERROR, "" + link, xc);
        }

        // check status for errors
        int status = response.getStatusLine().getStatusCode();
        if (status >= 400) {
            try {
                response.close();
            } catch (IOException e) {
                // ignore
            }
            throw new LinkException(LinkException.Kind.STATUS_ERROR, "" + link, status);
        }

        LinkInfo linkInfo = new LinkInfo();
        linkInfo.downloadLink = link;
        linkInfo.response = response;

        // find filename in content-disposition headers
        Header[] headers = response.getHeaders("Content-Disposition");
        if (headers != null) {
            for (Header header : headers) {
                try {
                    ContentDisposition disposition = new ContentDisposition(header.getValue());
                    String filename = disposition.getFileName();
                    if (filename != null && !DataStore.sanitize(filename).isEmpty()) {
                        // LOGGER.debug("found content-disposition filename: " + filename);
                        linkInfo.filename = filename;
                        break;
                    }
                } catch (ParseException e) {
                    LOGGER.debug("cannot parse content-disposition " + header);
                    // caused by ContentDisposition, ignore
                }
            }
        }

        // find filename in uri path if necessary, add redirect data
        List<URI> redirectURIs = context.getRedirectLocations();
        if (redirectURIs != null && !redirectURIs.isEmpty()) {
            Collections.reverse(redirectURIs); // we want direct download as first link
            if (linkInfo.filename == null) {
                for (URI redirectURI : redirectURIs) {
                    // LOGGER.debug("check filename in redirect: " + redirectURI);
                    String filename = getFilenameFromUri(redirectURI);
                    if (filename != null && !filename.isEmpty()) {
                        // LOGGER.debug("found uri filename: " + filename);
                        linkInfo.filename = filename;
                        break;
                    }
                }
            }
            linkInfo.redirects = redirectURIs.size();
            linkInfo.downloadLink = redirectURIs.get(0).toString();
        }

        if (linkInfo.filename == null) {
            // LOGGER.debug("check filename in original uri: " + linkInfo.downloadLink);
            String filename = getFilenameFromUri(URI.create(linkInfo.downloadLink));
            if (filename == null || filename.isEmpty()) {
                linkInfo.filename = DEFAULT_NAME;
            } else {
                linkInfo.filename = filename;
            }
        }

        LOGGER.debug("final linkInfo: " + linkInfo);
        return linkInfo;
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

    private static String getFilenameFromUri(URI uri) {
        String path = uri.getPath();
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        int lastSlash = path.lastIndexOf("/");
        if (lastSlash >= 0) {
            return path.substring(lastSlash + 1);
        }

        return null;
    }
}
