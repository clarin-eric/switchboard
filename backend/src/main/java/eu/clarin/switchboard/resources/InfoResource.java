package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.core.ToolRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.*;

@Path("")
public class InfoResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(InfoResource.class);

    Map<String, String> gitProps;
    long maxAllowedDataSize;
    String contactEmail;
    ToolRegistry toolRegistry;

    public InfoResource(ToolRegistry toolRegistry, Map<String, String> gitProps, long maxAllowedDataSize, String contactEmail) {
        this.toolRegistry = toolRegistry;
        this.gitProps = gitProps == null ? new HashMap<>() : gitProps;
        this.maxAllowedDataSize = maxAllowedDataSize;
        this.contactEmail = contactEmail;
    }

    @GET
    @Path("/info")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getApiInfo() {
        Map<String, Object> map = new HashMap<>();
        map.put("git", gitProps);
        map.put("version", gitProps.get("git.build.version"));
        map.put("contactEmail", contactEmail);
        map.put("maxAllowedDataSize", maxAllowedDataSize);
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
                int diff = Long.compare(o1.length(), o2.length());
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
        List<String> list = new ArrayList<>(toolRegistry.getAllLanguages());
        list.sort(String::compareTo);
        return Response.ok(list).build();
    }
}
