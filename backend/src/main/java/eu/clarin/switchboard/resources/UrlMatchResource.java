package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.app.config.ToolConfig;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.core.ToolRegistry;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import eu.clarin.switchboard.tool.Tool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Path("/api/urlmatch")
public class UrlMatchResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(UrlMatchResource.class);

    MediaLibrary mediaLibrary;
    ToolRegistry toolRegistry;
    ToolConfig toolConfig;

    public UrlMatchResource(MediaLibrary mediaLibrary, ToolRegistry toolRegistry, ToolConfig toolConfig) {
        this.mediaLibrary = mediaLibrary;
        this.toolRegistry = toolRegistry;
        this.toolConfig = toolConfig;
    }

    /**
     * PUBLIC API
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response doUrlsMatch(@QueryParam("onlyProductionTools") String onlyProductionTools, List<String> urlList) throws CommonException, ProfilingException {
        long startTime = System.nanoTime();
        List<Profile> profiles = urlList.stream().map(url -> {
            try {
                return mediaLibrary.addByUrlPreflight(url, null).getProfile().toProfile();
            } catch (Exception e) {
                LOGGER.info("Exception in urlmatch addByUrlPreflight: "+e.getMessage());
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());

        Predicate<Tool> filter = toolConfig.getShowOnlyProductionTools() ? ToolRegistry.ONLY_PRODUCTION_TOOLS : ToolRegistry.ALL_TOOLS;
        if (onlyProductionTools != null && !onlyProductionTools.isEmpty()) {
            filter = Boolean.parseBoolean(onlyProductionTools) ? ToolRegistry.ONLY_PRODUCTION_TOOLS : ToolRegistry.ALL_TOOLS;
        }

        boolean timeout = profiles.isEmpty();
        int matches = timeout ? 0 : toolRegistry.filterTools(profiles, filter).size();
        LOGGER.debug("urlmatch finished in " + ((System.nanoTime() - startTime) / 1000000) + "ms");

        return Response.ok(new JsonResponse(timeout, matches, profiles)).build();
    }

    public static class JsonResponse {
        public final boolean timeout;
        public final int matches;
        public final List<Profile.Flat> detectedProfiles;

        public JsonResponse(boolean timeout, int matches, List<Profile> profiles) {
            this.timeout = timeout;
            this.matches = matches;
            this.detectedProfiles = profiles.stream().map(Profile::flat).collect(Collectors.toList());
        }
    }
}
