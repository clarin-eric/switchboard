package eu.clarin.switchboard.resources;

import com.google.common.io.ByteStreams;
import eu.clarin.switchboard.app.config.ToolConfig;
import eu.clarin.switchboard.core.Tool;
import eu.clarin.switchboard.core.ToolRegistry;
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
import java.util.Arrays;
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
