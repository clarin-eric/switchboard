package eu.clarin.switchboard.app;

import eu.clarin.switchboard.resources.ToolsResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.*;
import java.io.IOException;
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
            mimeType = URLConnection.guessContentTypeFromName(filepath.getFileName().toString());
            eTag = new EntityTag('"' + hash(content) + '"');
            lastModifiedTime = new Date(filepath.toFile().lastModified());
        } catch (IOException e) {
            LOGGER.info("file asset not found:" + filepath);
            return;
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
