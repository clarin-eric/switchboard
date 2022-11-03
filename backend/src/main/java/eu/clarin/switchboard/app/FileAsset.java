package eu.clarin.switchboard.app;

import eu.clarin.switchboard.resources.ToolsResource;
import io.dropwizard.servlets.assets.ResourceURL;
import io.dropwizard.util.Resources;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ws.rs.core.EntityTag;
import jakarta.ws.rs.core.Request;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.util.Date;
import java.util.zip.CRC32;

public class FileAsset {
    private static final Logger LOGGER = LoggerFactory.getLogger(ToolsResource.class);

    private static final String IF_MODIFIED_SINCE = "If-Modified-Since";
    private static final String IF_NONE_MATCH = "If-None-Match";
    private static final String ETAG = "ETag";
    private static final String LAST_MODIFIED = "Last-Modified";

    private byte[] content;
    private String mimeType;
    private EntityTag eTag;
    private Date lastModifiedTime;

    public FileAsset(java.nio.file.Path filepath) {
        try {
            content = Files.readAllBytes(filepath);
            String filename = filepath.getFileName().toString();
            mimeType = URLConnection.guessContentTypeFromName(filename);
            if (mimeType == null && filename.endsWith(".svg")) {
                mimeType = "image/svg+xml";
            }
            eTag = new EntityTag('"' + hash(content) + '"');
            lastModifiedTime = new Date(filepath.toFile().lastModified());
        } catch (IOException e) {
            LOGGER.info("file asset not found:" + filepath);
        }
    }

    public FileAsset(String resourcePath) {
        URL requestedResourceURL;
        try {
            requestedResourceURL = Resources.getResource(resourcePath);
        } catch (IllegalArgumentException xc) {
            LOGGER.info(xc.getMessage());
            return;
        }

        try {
            content = Resources.toByteArray(requestedResourceURL);
            mimeType = URLConnection.guessContentTypeFromName(resourcePath);
            eTag = new EntityTag('"' + hash(content) + '"');

            long lastModified = ResourceURL.getLastModified(requestedResourceURL);
            if (lastModified < 1L) {
                lastModified = System.currentTimeMillis();
            }
            lastModifiedTime = new Date(lastModified);
        } catch (IOException e) {
            LOGGER.info("resource asset not found:" + resourcePath);
        }
    }

    private static String hash(byte[] resource) {
        final CRC32 crc32 = new CRC32();
        crc32.update(resource, 0, resource.length);
        return Long.toHexString(crc32.getValue());
    }

    public Response makeResponse(Request request) {
        if (content == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Response.ResponseBuilder response = request.evaluatePreconditions(lastModifiedTime, eTag);
        if (response != null) {
            return response.lastModified(lastModifiedTime).tag(eTag).build();
        }

        StreamingOutput fileStream = output -> {
            output.write(content);
            output.flush();
            // doc says not to close the output stream
        };
        return Response
                .ok(fileStream, mimeType)
                .lastModified(lastModifiedTime)
                .tag(eTag)
                .build();
    }
}
