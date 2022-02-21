package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.app.FileAsset;
import eu.clarin.switchboard.app.config.ToolConfig;
import eu.clarin.switchboard.tool.Tool;
import eu.clarin.switchboard.core.ToolRegistry;
import eu.clarin.switchboard.profiler.api.Profile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Path("/api")
public class ToolsResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(ToolsResource.class);

    ToolRegistry toolRegistry;
    ToolConfig toolConfig;

    public ToolsResource(ToolRegistry toolRegistry, ToolConfig toolConfig) {
        this.toolRegistry = toolRegistry;
        this.toolConfig = toolConfig;
    }

    /**
     * PUBLIC API
     */
    @GET
    @Path("tools")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getTools(@QueryParam("onlyProductionTools") String onlyProductionTools) {
        Predicate<Tool> filter = toolConfig.getShowOnlyProductionTools() ? ToolRegistry.ONLY_PRODUCTION_TOOLS : ToolRegistry.ALL_TOOLS;
        if (onlyProductionTools != null && !onlyProductionTools.isEmpty()) {
            filter = Boolean.parseBoolean(onlyProductionTools) ? ToolRegistry.ONLY_PRODUCTION_TOOLS : ToolRegistry.ALL_TOOLS;
        }
        List<Tool> tools = toolRegistry.filterTools(filter);
        tools.sort((t1, t2) -> t1.getName().compareToIgnoreCase(t2.getName()));
        return Response.ok(tools).build();
    }

    /**
     * PUBLIC API
     */
    @GET
    @Path("tools/{id}")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getToolByID(@PathParam("id") Integer id) {
        Predicate<Tool> filter = tool -> tool.getId() != null && tool.getId().equals(id);
        List<Tool> tools = toolRegistry.filterTools(filter);
        if (tools == null || tools.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(tools.get(0)).build();
    }

    /**
     * PUBLIC API
     */
    @POST
    @Path("tools/match")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getToolsByProfile(@QueryParam("onlyProductionTools") String onlyProductionTools,
                                      List<Profile.Flat> flat) {
        long startTime = System.nanoTime();
        Predicate<Tool> filter = toolConfig.getShowOnlyProductionTools() ? ToolRegistry.ONLY_PRODUCTION_TOOLS : ToolRegistry.ALL_TOOLS;
        if (onlyProductionTools != null && !onlyProductionTools.isEmpty()) {
            filter = Boolean.parseBoolean(onlyProductionTools) ? ToolRegistry.ONLY_PRODUCTION_TOOLS : ToolRegistry.ALL_TOOLS;
        }
        List<Profile> profiles = flat.stream().map(Profile.Flat::toProfile).collect(Collectors.toList());
        List<ToolRegistry.ToolMatches> toolMatches = toolRegistry.filterTools(profiles, filter);
        LOGGER.debug("getToolsByProfile finished in {}ms", ((System.nanoTime() - startTime) / 1000));

        return Response.ok(toolMatches).build();
    }

    @GET
    @Path("logos/{logoName}")
    public Response getTools(@Context Request request, @PathParam("logoName") String logoName) throws IOException {
        java.nio.file.Path logo = Paths.get(toolConfig.getLogoRegistryPath(), logoName);
        FileAsset fileAsset = new FileAsset(logo);
        return fileAsset.makeResponse(request);
    }
}
