package eu.clarin.switchboard.profiler.json;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import eu.clarin.switchboard.profiler.api.Confidence;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.MediaType;
import java.io.*;
import java.nio.file.Files;
import java.util.*;

public class JsonProfiler implements Profiler {
    private static final Logger LOGGER = LoggerFactory.getLogger(JsonProfiler.class);

    public static final String MEDIATYPE_LIF = "application/lif+json";

    static final String LIF_DISCRIMINATOR = "http://vocab.lappsgrid.org/ns/media/jsonld#lif";

    @Override
    public List<Profile> profile(File file) throws IOException {
        Map json;

        try (InputStream is = new BufferedInputStream(Files.newInputStream(file.toPath()))) {
            Reader reader = new BufferedReader(new InputStreamReader(is));
            json = new Gson().fromJson(reader, HashMap.class);
        } catch (JsonSyntaxException xc) {
            // not a json file
            return null;
        } catch (JsonIOException xc) {
            throw new IOException(xc);
        }

        try {
            String discriminator = (String)json.get("discriminator");
            if (LIF_DISCRIMINATOR.equalsIgnoreCase(discriminator)) {
                Profile profile = Profile.builder().certain().mediaType(MEDIATYPE_LIF).build();
                return Collections.singletonList(profile);
            }
        } catch (ClassCastException xc) {
            // bad casts means it's not a lif file
        }

        Profile profile = Profile.builder().certain().mediaType(MediaType.APPLICATION_JSON).build();
        return Collections.singletonList(profile);
    }
}
