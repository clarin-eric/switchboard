package eu.clarin.switchboard.resources;

import com.google.common.io.ByteStreams;
import eu.clarin.switchboard.app.config.ToolConfig;
import eu.clarin.switchboard.core.Tool;
import eu.clarin.switchboard.core.ToolRegistry;
import eu.clarin.switchboard.profiler.api.Confidence;
import eu.clarin.switchboard.profiler.api.Profile;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Path("")
public class ToolsResource {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(ToolsResource.class);

    public static final String QUERY_PARAM_MEDIATYPE = "mediatype";
    public static final String QUERY_PARAM_LANGUAGE = "language";
    public static final String QUERY_PARAM_ONLY_PRODUCTION_TOOLS = "onlyProductionTools";

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

    @POST
    @Path("tools/match")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getToolsByProfile(@QueryParam("onlyProductionTools") String onlyProductionTools, Profile.Flat flat) {
        boolean onlyProd = toolConfig.getShowOnlyProductionTools();
        if (onlyProductionTools != null && !onlyProductionTools.isEmpty()) {
            onlyProd = Boolean.parseBoolean(onlyProductionTools);
        }

        List<Tool> tools = toolRegistry.filterTools(flat.toProfile(), onlyProd);
        tools.sort((t1, t2) -> t1.getName().compareToIgnoreCase(t2.getName()));
        return Response.ok(tools).build();
    }

    @GET
    @Path("logos/{logoName}")
    public Response getTools(@PathParam("logoName") String logoName) throws IOException {
        String imageMimeType = URLConnection.guessContentTypeFromName(logoName);
        java.nio.file.Path logo = Paths.get(toolConfig.getLogoRegistryPath(), logoName);

        byte[] data;
        if (logo.toFile().exists()) {
            data = Files.readAllBytes(logo);
        } else {
            LOGGER.debug("logo not found, trying to find it in resources: " + logoName);
            data = readResource(logoName);
        }

        if (data == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        StreamingOutput fileStream = output -> {
            output.write(data);
            output.flush();
            // doc says not to close the output stream
        };
        return Response
                .ok(fileStream, imageMimeType)
                .build();
    }

    private byte[] readResource(String name) throws IOException {
        try (InputStream is = this.getClass().getResourceAsStream("/webui/images/" + name)) {
            if (is == null) {
                return null;
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ByteStreams.copy(is, baos);
            return baos.toByteArray();
        }
    }

    /** Utility for conversion to and from Json */
    public static class JsonProfile {
        public Confidence confidence;
        public String mediaType;
        public Map<String, String> features;
    }
}
