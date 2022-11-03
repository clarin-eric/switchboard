package eu.clarin.switchboard.core;

import eu.clarin.switchboard.core.xc.LinkException;
import eu.clarin.switchboard.profiler.api.Profile;
import org.apache.http.HttpException;
import org.apache.http.HttpHost;
import org.apache.http.HttpRequest;
import org.apache.http.HttpRequestInterceptor;
import org.apache.http.protocol.HttpContext;
import org.apache.http.protocol.HttpCoreContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ws.rs.core.MediaType;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Quirks {
    final static String REPO_ARACHNE = "arachne";

    final static String B2DROP_HOST = "b2drop.eudat.eu";
    final static String DROPBOX_HOST_1 = "dropbox.com";
    final static String DROPBOX_HOST_2 = "www.dropbox.com";

    final static String PROFILE_MEDIATYPE_KEY = "mediaType";

    private static final Logger LOGGER = LoggerFactory.getLogger(MediaLibrary.class);

    public static final HttpRequestInterceptor QUIRKS_REQUEST_INTERCEPTOR = new HttpRequestInterceptor() {
        @Override
        public void process(HttpRequest request, HttpContext context) throws
                HttpException, IOException {
            try {
                if (context instanceof HttpCoreContext) {
                    HttpCoreContext ctx = (HttpCoreContext) context;
                    if (ctx.getTargetHost().getHostName().endsWith("collections.clarin.eu")
                            && request.getFirstHeader("accept") == null) {
                        // we require machine-readable mediatypes from vcr collections
                        request.setHeader("accept", "application/*");
                    }
                }
            } catch (Exception xc) {
                LOGGER.warn("exception in quirks interceptor: ", xc);
            }
        }
    };

    public static void fillInfoBasedOnOrigin(FileInfo fileInfo, String origin) {
        if (origin == null || fileInfo == null) {
            return;
        }
        Profile.Flat p = fileInfo.getProfile();
        if (origin.equalsIgnoreCase(REPO_ARACHNE)
                && p.getOrDefault(PROFILE_MEDIATYPE_KEY, "").equalsIgnoreCase(MediaType.TEXT_PLAIN)
                && (p.get(Profile.FEATURE_LANGUAGE) == null || p.get(Profile.FEATURE_LANGUAGE) == "und")) {
            p.put(Profile.FEATURE_LANGUAGE, "deu");
        }
    }


    public static String urlFixSpecialCases(String link) throws LinkException {
        URL url;
        try {
            url = new URL(link);
        } catch (MalformedURLException xc) {
            throw new LinkException(LinkException.Kind.BAD_URL, link, xc);
        }

        String path = url.getPath();
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        // e.g. b2drop file: https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y
        if (url.getHost().equals(B2DROP_HOST) && path.startsWith("/s/")) {
            if (!path.endsWith("/download")) {
                path += "/download";
                try {
                    link = new URL(url.getProtocol(), url.getHost(), path).toString();
                } catch (MalformedURLException xc) {
                    throw new LinkException(LinkException.Kind.BAD_URL, url.toString(), xc);
                }
            }
        }

        // dropbox file: https://www.dropbox.com/s/9flyntc1353ve07/id_rsa.pub?dl=0
        if ((url.getHost().equals(DROPBOX_HOST_1) || url.getHost().equals(DROPBOX_HOST_2))
                && path.startsWith("/s/")) {
            link = link.replaceFirst("\\?dl=0", "?dl=1");
        }

        return link;
    }

    // Sometimes the profiler sets a very general mediatype (e.g. text/plain)
    // instead of the correct mediatype which is a specialization of the
    // general one.
    static final Map<String, Set<String>> SPECIALIZED_MEDIATYPES = Map.of(
            "text/plain", Set.of(
                    "text/csv",
                    "text/comma-separated-value",
                    "text/plain; format-variant=praat-textgrid",
                    "text/markdown",
                    "text/rst",
                    "application/vnd.dariahde.geobrowser.csv"
            )
    );

    /**
     * If the mediatype of the <i>declaredProfile</i> is a specialized version
     * of the one in the fileInfo, than set the <i>declaredProfile</i> as the
     * correct one.
     */
    public static void specializeProfile(FileInfo fileInfo, Profile declaredProfile) {
        if (declaredProfile == null) {
            return;
        }

        Profile profile = fileInfo.getProfile().toProfile();
        String mediatype = profile.getMediaType();
        if (!SPECIALIZED_MEDIATYPES.containsKey(mediatype)) {
            return;
        }

        String declaredMediatype = declaredProfile.getMediaType();
        if (!SPECIALIZED_MEDIATYPES.get(mediatype).contains(declaredMediatype)) {
            return;
        }

        // update just the mediatype in the main profile of the fileInfo
        Profile newProfile = Profile.builder(profile)
                .mediaType(declaredMediatype)
                .build();
        List<Profile> sameSecondaryProfiles = fileInfo.getSecondaryProfiles()
                .stream()
                .map(Profile.Flat::toProfile)
                .collect(Collectors.toList());
        fileInfo.setProfiles(newProfile, sameSecondaryProfiles);
    }
}
