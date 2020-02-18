package eu.clarin.switchboard.resources;

import com.google.common.io.ByteStreams;
import eu.clarin.switchboard.app.config.ToolConfig;
import eu.clarin.switchboard.core.Tool;
import eu.clarin.switchboard.core.ToolRegistry;
import eu.clarin.switchboard.profiler.ProfileMatcher;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Paths;
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
                             @QueryParam("onlyProductionTools") String onlyProductionTools,
                             @Context UriInfo uriInfo) {
        ProfileMatcher.Builder profileMatcher = ProfileMatcher.builder();

        MultivaluedMap<String, String> queryParams = uriInfo.getQueryParameters();
        for (String param: queryParams.keySet()) {
            if ("mediatype".equalsIgnoreCase(param) ||
                    "language".equalsIgnoreCase(param) ||
                    "onlyProductionTools".equalsIgnoreCase(param)) {
                continue;
            }

            List<String> values = queryParams.get(param);
            if (values.size() > 1) {
                return Response.status(400).entity("optional parameters cannot have multiple values: see `" + param + "`").build();
            }
            if (values.isEmpty()) {
                profileMatcher.feature(param);
            } else {
                profileMatcher.feature(param, values.get(0));
            }
        }

        boolean onlyProd = toolConfig.getShowOnlyProductionTools();
        if (onlyProductionTools != null && !onlyProductionTools.isEmpty()) {
            onlyProd = Boolean.parseBoolean(onlyProductionTools);
        }

        mediatype = (mediatype != null && mediatype.isEmpty()) ? null : mediatype;
        language = (language != null && language.isEmpty()) ? null : language;
        if (language != null && language.length() != 3) {
            return Response.status(400).entity("parameter `language` must be a ISO 639-3 language code").build();
        }

        List<Tool> tools = toolRegistry.filterTools(mediatype, language, onlyProd);
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
}
