package eu.clarin.switchboard.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.*;


public class GitProperties {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(GitProperties.class);
    final static String GIT_PROPERTIES_FILENAME = "git.properties";

    public static Map<String, String> load(String appOrLibName) {
        JsonNode json = null;

        for (String cp : System.getProperty("java.class.path").split(File.pathSeparator)) {
            if (cp.contains(File.separator + appOrLibName + File.separator) && cp.endsWith("classes")) {
                // url ~= /my/path/here/appname/classes/git.properties
                String filepath = cp + File.separator + GIT_PROPERTIES_FILENAME;
                try (InputStream is = new FileInputStream(filepath)) {
                    json = new ObjectMapper().readTree(is);
                    break;
                } catch (Exception e) {
                    LOGGER.warn("exception when trying to read git.properties from classes in " +
                            appOrLibName + "\n-> " + e.getMessage());
                }
            }
            if (cp.contains(File.separator + appOrLibName + '-') && cp.endsWith(".jar")) {
                // url ~= jar:file:/my/path/here/appname-x.y.z.jar!/git.properties
                String url = "jar:file:" + cp + "!" + File.separator + GIT_PROPERTIES_FILENAME;
                try (InputStream is = new URL(url).openConnection().getInputStream()) {
                    json = new ObjectMapper().readTree(is);
                    break;
                } catch (Exception e) {
                    LOGGER.warn("exception when trying to read git.properties from jar in " +
                        appOrLibName + "\n-> " + e.getMessage());
                }
            }
        }

        if (json == null) {
            LOGGER.warn("Could not find or get git properties for " + appOrLibName);
            return null;
        }

        Map<String, String> ret = new HashMap<>();
        StringBuilder out = new StringBuilder();
        for (Iterator<String> it = json.fieldNames(); it.hasNext(); ) {
            String key = it.next();
            String value = json.get(key).asText();
            out.append("\n" + key + " = " + value);
            ret.put(key, value);
        }
        LOGGER.info(out.toString());
        return ret;
    }
}
