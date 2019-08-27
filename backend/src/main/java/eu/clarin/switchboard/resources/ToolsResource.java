package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.core.Tool;
import eu.clarin.switchboard.core.ToolRegistry;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("")
public class ToolsResource {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(ToolsResource.class);

    ToolRegistry toolRegistry;

    public ToolsResource(ToolRegistry toolRegistry) {
        this.toolRegistry = toolRegistry;
    }

    @GET
    @Path("tools")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getTools(@QueryParam("includeWS") String includeWS,
                             @QueryParam("deployment") String deployment,
                             @QueryParam("language") String language,
                             @QueryParam("mediatype") String mediatype) {
        includeWS = includeWS == null ? "" : includeWS;
        // TODO: includeWS is currently unused
        deployment = deployment == null ? "" : deployment;
        language = language == null ? "" : language;
        mediatype = mediatype == null ? "" : mediatype;
        List<Tool> tools = toolRegistry.filterTools(deployment, language, mediatype);
        LOGGER.info("" + tools.size() + " tools for " + deployment + ":" + mediatype + ":" + language);
        return Response.ok(tools).build();
    }
}
