package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.core.ToolRegistry;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

@Path("")
public class InfoResource {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(InfoResource.class);

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
        Map map = new HashMap<String, Object>();
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
        return Response.ok(toolRegistry.getAllMediatypes()).build();
    }

    // same as /mediatypes
    @GET
    @Path("/mimetypes")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getMimetypes() {
        return Response.ok(toolRegistry.getAllMediatypes()).build();
    }

    @GET
    @Path("/languages")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getLanguages() {
        return Response.ok(toolRegistry.getAllLanguages()).build();
    }
}
