package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.app.FileAsset;
import eu.clarin.switchboard.app.config.ToolConfig;
import eu.clarin.switchboard.core.Tool;
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

    @GET
    @Path("tools")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getTools(@QueryParam("onlyProductionTools") String onlyProductionTools) {
        boolean onlyProd = toolConfig.getShowOnlyProductionTools();
        if (onlyProductionTools != null && !onlyProductionTools.isEmpty()) {
            onlyProd = Boolean.parseBoolean(onlyProductionTools);
        }
        List<Tool> tools = toolRegistry.filterTools(onlyProd);
        tools.sort((t1, t2) -> t1.getName().compareToIgnoreCase(t2.getName()));
        return Response.ok(tools).build();
    }

    @POST
    @Path("tools/match")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getToolsByProfile(@QueryParam("onlyProductionTools") String onlyProductionTools,
                                      List<Profile.Flat> flat) {
        boolean onlyProd = toolConfig.getShowOnlyProductionTools();
        if (onlyProductionTools != null && !onlyProductionTools.isEmpty()) {
            onlyProd = Boolean.parseBoolean(onlyProductionTools);
        }
        List<Profile> profiles = flat.stream().map(Profile.Flat::toProfile).collect(Collectors.toList());
        List<ToolRegistry.ToolMatches> toolMatches = toolRegistry.filterTools(profiles, onlyProd);

        toolMatches.sort((tm1, tm2) -> {
            final int K = 1000;
            int diff = (int) (K * tm2.getBestMatchPercent()) - (int) (K * tm1.getBestMatchPercent());
            return diff != 0 ? diff :
                    tm1.getTool().getName().compareToIgnoreCase(tm2.getTool().getName());
        });

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
