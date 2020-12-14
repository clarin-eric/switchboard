package eu.clarin.switchboard.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.clarin.switchboard.core.FileInfo;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.util.Map;
import java.util.UUID;

@Path("/api/storage")
public class DataResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(DataResource.class);
    private static final long MAX_INLINE_CONTENT = 1024;

    static ObjectMapper mapper = new ObjectMapper();
    MediaLibrary mediaLibrary;

    public DataResource(MediaLibrary mediaLibrary) {
        this.mediaLibrary = mediaLibrary;
    }

    @GET
    @Path("/{id}")
    public Response getFile(@PathParam("id") String idString, @QueryParam("mediatype") String mediatype) throws Throwable {
        UUID id;
        try {
            id = UUID.fromString(idString);
        } catch (IllegalArgumentException xc) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        FileInfo fi = mediaLibrary.waitForFileInfo(id);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        StreamingOutput fileStream = output -> {
            byte[] data = Files.readAllBytes(fi.getPath());
            output.write(data);
            output.flush();
        };

        Response.ResponseBuilder builder = Response.ok(fileStream);
        if (mediatype != null && !mediatype.isEmpty()) {
            builder.type(mediatype);
        } else {
            builder.type(fi.getProfile().toProfile().getMediaType());
        }
        builder.header("content-disposition", "attachment; filename=" + fi.getFilename());
        return builder.build();
    }

    @GET
    @Path("/{id}/info")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getFileInfo(@Context HttpServletRequest request, @PathParam("id") String idString)
            throws Throwable {
        UUID id;
        try {
            id = UUID.fromString(idString);
        } catch (IllegalArgumentException xc) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        FileInfo fi = mediaLibrary.waitForFileInfo(id);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        final String trimEnd = "/info";
        String localLink = request.getRequestURI();
        assert (localLink.endsWith(trimEnd));
        localLink = localLink.substring(0, localLink.length() - trimEnd.length());

        return fileInfoToResponse(URI.create(localLink), fi);
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response postFile(@Context HttpServletRequest request,
                             @FormDataParam("file") InputStream inputStream,
                             @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
                             @FormDataParam("url") String url) throws CommonException, ProfilingException {
        FileInfo fileInfo;

        if (contentDispositionHeader != null) {
            String filename = contentDispositionHeader.getFileName();
            fileInfo = mediaLibrary.addFile(filename, inputStream);
        } else if (url != null) {
            fileInfo = mediaLibrary.addByUrl(url);
        } else {
            return Response.status(400).entity("Please provide either a file or a url to download in the form").build();
        }

        URI localLink = UriBuilder.fromPath(request.getRequestURI())
                .path(fileInfo.getId().toString())
                .build();
        return fileInfoToResponse(localLink, fileInfo);
    }

    static Response fileInfoToResponse(URI localLink, FileInfo fileInfo) {
        Map<String, Object> ret;
        try {
            ret = mapper.readValue(mapper.writeValueAsString(fileInfo), new TypeReference<Map<String, Object>>() {
            });
        } catch (JsonProcessingException xc) {
            LOGGER.error("json conversion exception ", xc);
            return Response.serverError().build();
        }
        ret.remove("path");
        ret.put("localLink", localLink);

        if (fileInfo.getFileLength() < MAX_INLINE_CONTENT &&
                fileInfo.getProfile().toProfile().isMediaType("text/plain")) {
            try {
                ret.put("content", new String(Files.readAllBytes(fileInfo.getPath())));
            } catch (IOException e) {
                LOGGER.warn("Cannot read file to return inline content: " + e.getMessage());
            }
        }

        LOGGER.debug("postFile returns: " + ret);
        return Response.ok(ret).build();
    }
}
