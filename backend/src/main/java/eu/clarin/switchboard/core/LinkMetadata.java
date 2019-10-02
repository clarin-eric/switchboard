package eu.clarin.switchboard.core;

import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;
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

        public String getFilename() {
            return filename;
        }

        public String getDownloadLink() {
            return downloadLink;
        }
    }

    public static LinkInfo getLinkData(String original) throws MalformedURLException {
        LinkInfo linkInfo = new LinkInfo();

        String resolved = resolveDoiOrHandle(original);
        linkInfo.downloadLink = resolved;

        URL url = new URL(resolved);
        String host = url.getHost();
        String path = url.getPath();
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        linkInfo.filename = path;
        int lastSlash = path.lastIndexOf("/");
        if (lastSlash >= 0) {
            linkInfo.filename = path.substring(lastSlash + 1, path.length());
        }
        if (linkInfo.filename.isEmpty()) {
            linkInfo.filename = DEFAULT_NAME;
        }

        // b2drop file: https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y
        if (host.equals("b2drop.eudat.eu") && path.startsWith("/s/")) {
            linkInfo.filename = "b2drop_file";
            if (!path.endsWith("/download")) {
                path += "/download";
                linkInfo.downloadLink = new URL(url.getProtocol(), url.getHost(), path).toString();
            }
        }

        // dropbox file: https://www.dropbox.com/s/9flyntc1353ve07/id_rsa.pub?dl=0
        if ((url.getHost().equals("www.dropbox.com") || url.getHost().equals("dropbox.com"))
                && path.startsWith("/s/")) {
            if (!resolved.contains("?dl=1")) {
                linkInfo.downloadLink = resolved.replaceFirst("\\?dl=0", "?dl=1");
            }
        }
        LOGGER.debug("linkInfo: " + linkInfo.filename + "; " + linkInfo.downloadLink);
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
}
