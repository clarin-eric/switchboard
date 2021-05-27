package eu.clarin.switchboard.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.MoreObjects;
import eu.clarin.switchboard.core.FileInfo;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.profiler.api.Profile;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.*;
import java.net.URI;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;

@Path("/api/storage")
public class DataResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(DataResource.class);
    private static final int MAX_INLINE_CONTENT = 4 * 1024;
    private static final long MAX_ZIP_ENTRIES = 4 * 1024;

    static ObjectMapper mapper = new ObjectMapper();
    MediaLibrary mediaLibrary;

    public DataResource(MediaLibrary mediaLibrary) {
        this.mediaLibrary = mediaLibrary;
    }

    @GET
    @Path("/{id}")
    public Response getFile(@PathParam("id") String idString, @QueryParam("mediatype") String mediatype) throws Throwable {
        FileInfo fi = getFileInfo(idString);
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

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN + ";charset=utf-8")
    public Response putContent(@PathParam("id") String idString, String content) throws Throwable {
        FileInfo fi = getFileInfo(idString);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        String currentMediaType = fi.getProfile().toProfile().getMediaType();
        if (!currentMediaType.equals(MediaType.TEXT_PLAIN)) {
            return Response.status(Response.Status.UNSUPPORTED_MEDIA_TYPE).build();
        }

        mediaLibrary.setContent(fi.getId(), content);
        return Response.ok(content).type(MediaType.TEXT_PLAIN).build();
    }

    @GET
    @Path("/{id}/info")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getFileInfo(@Context HttpServletRequest request, @PathParam("id") String idString)
            throws Throwable {
        FileInfo fi = getFileInfo(idString);
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
                             @FormDataParam("url") String url,
                             @FormDataParam("zipID") String zipID,
                             @FormDataParam("zipEntryName") String zipEntryName,
                             @FormDataParam("profile") String profileString
    ) throws Throwable {
        FileInfo fileInfo;
        if (contentDispositionHeader != null) {
            String filename = contentDispositionHeader.getFileName();
            fileInfo = mediaLibrary.addFile(filename, inputStream, null);
        } else if (url != null) {
            fileInfo = mediaLibrary.addByUrl(url);
        } else if (zipID != null && !zipID.isEmpty() && zipEntryName != null && !zipEntryName.isEmpty()) {
            FileInfo fi = getFileInfo(zipID);
            if (fi == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            Profile profile = null;
            if (profileString != null && !profileString.isEmpty()) {
                Profile.Flat flat;
                try {
                    flat = mapper.readValue(profileString, Profile.Flat.class);
                } catch (JsonProcessingException xc) {
                    LOGGER.error("json conversion exception ", xc);
                    return Response.status(Response.Status.BAD_REQUEST).entity("Bad json profile").build();
                }
                profile = flat.toProfile();
            }
            fileInfo = mediaLibrary.addFromZip(fi.getPath(), zipEntryName, profile);
            fileInfo.setSource(fi.getId(), zipEntryName);
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

        // add the file content
        File file = fileInfo.getPath().toFile();
        try (InputStream in = new BufferedInputStream(new FileInputStream(file))) {
            byte[] data = new byte[MAX_INLINE_CONTENT];
            int n = in.read(data);
            if (n > 0) {
                String preview = new String(data, 0, n, StandardCharsets.UTF_8);
                ret.put("content", preview);
            }
        } catch (IOException e) {
            LOGGER.warn("Cannot read file to return inline content: " + e.getMessage());
        }

        // LOGGER.debug("postFile returns: " + ret);
        return Response.ok(ret).build();
    }

    @GET
    @Path("/{id}/outline")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getOutline(@Context HttpServletRequest request, @PathParam("id") String idString)
            throws Throwable {
        FileInfo fi = getFileInfo(idString);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (!fi.getProfile().toProfile().isMediaType("application/zip")) {
            LOGGER.debug("getOutline returns: no content");
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        ZipFile zfile;
        try {
            zfile = new ZipFile(fi.getPath().toFile());
        } catch (ZipException xc) {
            LOGGER.info("bad zip: " + xc.getMessage());
            return Response.status(Response.Status.NOT_ACCEPTABLE).entity(xc.getMessage()).build();
        }
        List<ZipEntry> ret = zfile.stream()
                .filter(e -> !e.isDirectory() && e.getSize() > 0)
                .filter(e -> !e.getName().startsWith("__MACOSX/"))
                .limit(MAX_ZIP_ENTRIES)
                .map(e -> new ZipEntry(e.getName(), e.getSize()))
                .sorted(Comparator.comparing(ZipEntry::getName))
                .collect(Collectors.toList());
        return Response.ok(ret).build();
    }

    private FileInfo getFileInfo(String idString) throws Throwable {
        UUID id;
        try {
            id = UUID.fromString(idString);
        } catch (IllegalArgumentException xc) {
            return null;
        }
        return mediaLibrary.waitForFileInfo(id);
    }

    static class ZipEntry {
        String name;
        long size;

        public ZipEntry(String name, long size) {
            this.name = name;
            this.size = size;
        }

        public String getName() {
            return name;
        }

        public long getSize() {
            return size;
        }

        @Override
        public String toString() {
            return MoreObjects.toStringHelper(this)
                    .add("name", name)
                    .add("size", size)
                    .toString();
        }
    }
}
