package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.app.config.SwitchboardConfig;
import eu.clarin.switchboard.core.ToolRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.*;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Path("/api")
public class InfoResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(InfoResource.class);

    Map<String, String> gitProps;
    boolean enableMultipleResources;
    long maxAllowedDataSize;
    String contactEmail;
    ToolRegistry toolRegistry;
    Map<String, String> languageCodeToName;
    Boolean showFundingBadge;

    public InfoResource(ToolRegistry toolRegistry, Map<String, String> gitProps, SwitchboardConfig config) throws IOException {
        this.toolRegistry = toolRegistry;
        this.gitProps = gitProps == null ? new HashMap<>() : gitProps;
        this.enableMultipleResources = config.getTools().getEnableMultipleResources();
        this.maxAllowedDataSize = config.getDataStore().getMaxSize();
        this.contactEmail = config.getContactEmail();
        this.showFundingBadge = config.getShowFundingBadge();

        this.languageCodeToName = new HashMap<>();
        try (InputStream is = getClass().getResourceAsStream("/iso639-3.tsv");
             Reader reader = new InputStreamReader(is, StandardCharsets.UTF_8);
             BufferedReader buffered = new BufferedReader(reader)) {
            buffered.lines().forEach(line -> {
                int i = line.indexOf('\t');
                assert i > 0;
                languageCodeToName.put(
                        line.substring(0, i),
                        line.substring(i+1, line.length()).trim());
            });
        }
    }

    @GET
    @Path("/info")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getApiInfo() {
        Map<String, Object> map = new HashMap<>();
        map.put("git", gitProps);
        map.put("version", gitProps.get("git.build.version"));
        map.put("enableMultipleResources", enableMultipleResources);
        map.put("maxAllowedDataSize", maxAllowedDataSize);
        map.put("contactEmail", contactEmail);
        map.put("showFundingBadge", showFundingBadge);
        try {
            InetAddress host = InetAddress.getLocalHost();
            map.put("host", new HashMap<String, String>() {{
                put("ip", host.getHostAddress());
                put("name", host.getHostName());
            }});
        } catch (UnknownHostException e) {
            // ignore
        }
        return Response.ok(map).build();
    }

    @GET
    @Path("/mediatypes")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getMediatypes() {
        List<String> list = new ArrayList<>(toolRegistry.getAllMediatypes());
        list.sort(new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                MediaType m1 = MediaType.valueOf(o1);
                MediaType m2 = MediaType.valueOf(o2);
                String t1 = m1 != null ? m1.getType() : "";
                String t2 = m2 != null ? m2.getType() : "";
                // return smaller type classes first (text < image < application)
                int diff = Long.compare(t1.length(), t2.length());
                if (diff != 0) {
                    return diff;
                }
                // normal ordering inside typeclasses (audio < image < video)
                diff = m1.getType().compareToIgnoreCase(m2.getType());
                if (diff != 0) {
                    return diff;
                }
                // smaller first, then normal ordering
                diff = Long.compare(o1.length(), o2.length());
                return diff == 0 ? o1.compareToIgnoreCase(o2) : diff;
            }
        });
        return Response.ok(list).build();
    }

    // same as /mediatypes
    @GET
    @Path("/mimetypes")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getMimetypes() {
        return getMediatypes();
    }

    @GET
    @Path("/languages")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getLanguages() {
        List<String[]> list = new ArrayList<>();
        for (String code : toolRegistry.getAllLanguages()) {
            String name = languageCodeToName.get(code);
            if (name != null) {
                list.add(new String[]{code, name});
            }
        }
        return Response.ok(list).build();
    }
}
