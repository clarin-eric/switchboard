package eu.clarin.switchboard.app;

import com.google.common.io.Resources;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.servlets.assets.AssetServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

class TemplatedAssetsBundle extends AssetsBundle {
    private static final Logger LOGGER = LoggerFactory.getLogger(TemplatedAssetsBundle.class);
    String resourcePath;
    String uriPath;
    String indexFile;
    String assetsName;
    String indexPath;
    Set<String> suffixes = new HashSet<>();
    Map<Pattern, String> substitutions = new HashMap<>();

    public TemplatedAssetsBundle(String resourcePath, String uriPath, String indexFile, String assetsName) {
        super(resourcePath, uriPath, indexFile, assetsName);
        this.resourcePath = resourcePath;
        this.uriPath = uriPath;
        this.indexFile = indexFile;
        this.assetsName = assetsName;
        this.indexPath = resourcePath + indexFile;
        if (this.indexPath.startsWith("/")) {
            this.indexPath = this.indexPath.substring(1);
        }
    }
    protected AssetServlet createServlet() {
        return new MyAssetServlet(resourcePath, uriPath, indexFile, StandardCharsets.UTF_8);
    }

    public void enableSubstitutionForFileSuffix(String suffix) {
        LOGGER.info("enable substitution for suffix: " + suffix);
        suffixes.add(suffix);
    }

    public void addSubstitution(String original, String changed) {
        LOGGER.info("add substitution: " + original + " -> " + changed);
        substitutions.put(Pattern.compile(original, Pattern.LITERAL), changed);
    }

    public void setAppContextPathSubstitutions(String fileSuffix, String appContextPath) {
        if (appContextPath.endsWith("/")) {
            appContextPath = appContextPath.substring(0, appContextPath.length() - 1);
        }
        enableSubstitutionForFileSuffix("index.html");
        addSubstitution("href=\"/", "href=\"" + appContextPath + "/");
        addSubstitution("src=\"/", "src=\"" + appContextPath + "/");
        addSubstitution("APP_CONTEXT_PATH=\"\"", "APP_CONTEXT_PATH=\"" + appContextPath + "\"");
    }

    protected class MyAssetServlet extends AssetServlet {
        public MyAssetServlet(String resourcePath, String uriPath, String indexFile, Charset charset) {
            super(resourcePath, uriPath, indexFile, charset);
        }

        protected byte[] readResource(URL requestedResourceURL) throws IOException {
            try {
                for (String suffix : suffixes) {
                    if (requestedResourceURL.toString().endsWith(suffix)) {
                        LOGGER.info("performing substitutions for resource: " + requestedResourceURL);
                        String resource = Resources.toString(requestedResourceURL, StandardCharsets.UTF_8);
                        for (Map.Entry<Pattern, String> entry : substitutions.entrySet()) {
                            resource = entry.getKey().matcher(resource).replaceAll(entry.getValue());
                        }
                        return resource.getBytes(StandardCharsets.UTF_8);
                    }
                }
                return Resources.toByteArray(requestedResourceURL);
            } catch (RuntimeException xc) {
                LOGGER.warn("exception in readResource: ", xc);
                throw xc;
            }
        }

        protected URL getResourceUrl(String absoluteRequestedResourcePath) {
            try {
                return super.getResourceUrl(absoluteRequestedResourcePath);
            } catch (IllegalArgumentException xc) {
                // requested resource was not found, return index.html
                LOGGER.info("returning default index file because: " + xc.getMessage());
                return super.getResourceUrl(indexPath);
            }
        }
    }
}
