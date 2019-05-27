package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.core.ToolRegistry;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("tools")
public class ToolsResource {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(ToolsResource.class);

    ToolRegistry toolRegistry;

    public ToolsResource(ToolRegistry toolRegistry) {
        this.toolRegistry = toolRegistry;
    }

    @GET
    @Path("")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getApiInfo() {
        return Response.ok(toolRegistry.getTools()).build();
    }
}
