package eu.clarin.switchboard.resources;

import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("")
public class MiscResource {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(MiscResource.class);

    private final Map<String, String> gitProps;

    public MiscResource(Map<String, String> gitProps) {
        this.gitProps = gitProps == null ? new HashMap<>() : gitProps;
    }

    @GET
    @Path("/info")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getApiInfo() {
        Map map = new HashMap<String, Object>() {{
            put("git", MiscResource.this.gitProps);
            put("version", MiscResource.this.gitProps.get("git.build.version"));
        }};
        return Response.ok(map).build();
    }
}
