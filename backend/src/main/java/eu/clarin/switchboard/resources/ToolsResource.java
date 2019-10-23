package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.app.config.ToolConfig;
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
    ToolConfig toolConfig;

    public ToolsResource(ToolRegistry toolRegistry, ToolConfig toolConfig) {
        this.toolRegistry = toolRegistry;
        this.toolConfig = toolConfig;
    }

    @GET
    @Path("tools")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getTools(@QueryParam("mediatype") String mediatype,
                             @QueryParam("language") String language,
                             @QueryParam("onlyProductionTools") String onlyProductionTools) {
        boolean onlyProd = toolConfig.getShowOnlyProductionTools();
        if (onlyProductionTools != null && !onlyProductionTools.isEmpty()) {
            onlyProd = Boolean.parseBoolean(onlyProductionTools);
        }

        language = language == null ? "" : language;
        mediatype = mediatype == null ? "" : mediatype;
        List<Tool> tools = toolRegistry.filterTools(mediatype, language, onlyProd);
        tools.sort((t1, t2) -> t1.getName().compareToIgnoreCase(t2.getName()));
        return Response.ok(tools).build();
    }
}
