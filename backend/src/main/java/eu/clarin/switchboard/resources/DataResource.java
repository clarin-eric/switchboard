package eu.clarin.switchboard.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.ByteStreams;
import com.google.common.io.CharStreams;
import eu.clarin.switchboard.core.ArchiveOps;
import eu.clarin.switchboard.core.Constants;
import eu.clarin.switchboard.core.FileInfo;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.profiler.api.Profile;
import org.apache.commons.io.FilenameUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Map;
import java.util.UUID;
import java.util.zip.ZipException;

@Path("/api/storage")
public class DataResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(DataResource.class);
    private static final int MAX_INLINE_CONTENT = 4 * 1024;

    static ObjectMapper mapper = new ObjectMapper();
    MediaLibrary mediaLibrary;

    public DataResource(MediaLibrary mediaLibrary) {
        this.mediaLibrary = mediaLibrary;
    }

    @GET
    @Path("/{id}")
    public Response httpGetFile(@PathParam("id") String idString, @QueryParam("mediatype") String mediatype) throws Throwable {
        return getFile(idString, mediatype);
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN + ";charset=utf-8")
    public Response httpPutContent(@PathParam("id") String idString, String content) throws Throwable {
        return putContent(idString, content);
    }

    @GET
    @Path("/{id}/info")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response httpGetFileInfo(@Context HttpServletRequest request, @PathParam("id") String idString) throws Throwable {
        return getFileInfo(request.getRequestURI(), idString);
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response httpPostFile(@Context HttpServletRequest request,
                                 @FormDataParam("file") InputStream inputStream,
                                 @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
                                 @FormDataParam("url") String url,
                                 @FormDataParam("profile") String profileString
    ) throws Throwable {
        String filename = contentDispositionHeader == null ? null : contentDispositionHeader.getFileName();
        return postFile(request.getRequestURI(), inputStream, filename, url, profileString);
    }

    @POST
    @Path("/{id}/extractEntry")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response httpPostExtractFromArchive(@Context HttpServletRequest request,
                                               @PathParam("id") String archiveID,
                                               @FormDataParam("archiveEntryName") String archiveEntryName,
                                               @FormDataParam("profile") String profileString) throws Throwable {
        return postExtractFromArchive(request.getRequestURI(), archiveID, archiveEntryName, profileString);
    }

    @POST
    @Path("/{id}/extractText")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response httpPostExtractText(@Context HttpServletRequest request,
                                        @PathParam("id") String textContainerID) throws Throwable {
        return postExtractText(request.getRequestURI(), textContainerID);
    }

    @GET
    @Path("/{id}/outline")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response httpGetOutline(@PathParam("id") String idString)
            throws Throwable {
        return getOutline(idString);
    }

    public Response getFile(String idString, String mediatype) throws Throwable {
        FileInfo fi = getFileInfo(idString);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        StreamingOutput fileStream = output -> {
            byte[] data = Files.readAllBytes(fi.getPath());
            output.write(data);
            output.flush();
        };

        if (mediatype == null || mediatype.isEmpty()) {
            mediatype = fi.getProfile().toProfile().getMediaType();
        }
        if (MediaType.TEXT_PLAIN.equalsIgnoreCase(mediatype)) {
            String isUTF8Feature = fi.getProfile().toProfile().getFeature(Profile.FEATURE_IS_UTF8);
            if (Boolean.parseBoolean(isUTF8Feature)) {
                mediatype = mediatype + ";charset=utf-8";
            }
        }
        return Response.ok(fileStream)
                .type(mediatype)
                .header("content-disposition", "attachment; filename=" + fi.getFilename())
                .build();
    }

    public Response putContent(String idString, String content) throws Throwable {
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

    public Response getFileInfo(String requestURI, String idString) throws Throwable {
        FileInfo fi = getFileInfo(idString);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return fileInfoToResponse(requestURI, fi);
    }

    public Response postFile(String requestURI,
                             InputStream inputStream,
                             String filename,
                             String url,
                             String profileString) throws Throwable {
        FileInfo fileInfo;
        if (inputStream != null && filename != null) {
            fileInfo = mediaLibrary.addFile(filename, inputStream, null);
        } else if (url != null) {
            Profile profile = readProfile(profileString);
            fileInfo = mediaLibrary.addByUrl(url, profile);
        } else {
            return Response.status(400).entity("Please provide either a file or a url to download in the form").build();
        }

        return fileInfoToResponse(requestURI, fileInfo);
    }

    public Response postExtractFromArchive(String requestURI, String archiveID, String archiveEntryName,
                                           String profileString) throws Throwable {
        if (archiveID == null || archiveID.isEmpty()) {
            return Response.status(400).entity("Mandatory parameter not found: id (for archive id)").build();
        }
        FileInfo fi = getFileInfo(archiveID);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        Profile profile = readProfile(profileString);
        FileInfo fileInfo = mediaLibrary.addFromArchive(fi.getPath(), fi.getProfile().toProfile(), archiveEntryName, profile);
        if (archiveEntryName != null) {
            fileInfo.setSource(fi.getId(), archiveEntryName);
        }

        return fileInfoToResponse(requestURI, fileInfo);
    }

    public Response postExtractText(String requestURI, String textContainerID) throws Throwable {
        if (textContainerID == null || textContainerID.isEmpty()) {
            return Response.status(400).entity("Mandatory parameter not found: id (for archive id)").build();
        }
        FileInfo fi = getFileInfo(textContainerID);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        String filename = FilenameUtils.removeExtension(fi.getFilename()) + ".txt";
        FileInfo fileInfo = mediaLibrary.addFromTextExtraction(
                fi.getPath(), fi.getProfile().toProfile(), filename);
        fileInfo.setSource(fi.getId(), null);
        fileInfo.setSpecialResourceType(FileInfo.SpecialResourceType.EXTRACTED_TEXT);

        return fileInfoToResponse(requestURI, fileInfo);
    }

    private Profile readProfile(String profileString) {
        if (profileString == null || profileString.isEmpty()) {
            return null;
        }
        try {
            return mapper.readValue(profileString, Profile.Flat.class).toProfile();
        } catch (JsonProcessingException xc) {
            LOGGER.error("json conversion exception ", xc);
        }
        return null;
    }

    static Response fileInfoToResponse(String requestURI, FileInfo fileInfo) {
        Map<String, Object> ret;
        try {
            ret = mapper.readValue(mapper.writeValueAsString(fileInfo), new TypeReference<Map<String, Object>>() {
            });
        } catch (JsonProcessingException xc) {
            LOGGER.error("json conversion exception ", xc);
            return Response.serverError().build();
        }
        ret.remove("path");

        URI localLink = UriBuilder.fromPath(requestURI)
                .path(fileInfo.getId().toString())
                .build();
        ret.put("localLink", localLink);

        // add the file content
        File file = fileInfo.getPath().toFile();
        try (InputStream fin = new BufferedInputStream(new FileInputStream(file));
             InputStream in = ByteStreams.limit(fin, MAX_INLINE_CONTENT);
             Reader reader = new InputStreamReader(in, StandardCharsets.UTF_8)
        ) {
            String preview = CharStreams.toString(reader);
            if (preview != null && !preview.isEmpty()) {
                ret.put("content", preview);
                if (file.length() > MAX_INLINE_CONTENT) {
                    ret.put("contentIsIncomplete", true);
                }
            }
        } catch (IOException e) {
            LOGGER.warn("Cannot read file to return inline content: " + e.getMessage());
        }

        // LOGGER.debug("postFile returns: " + ret);
        return Response.ok(ret).build();
    }

    public Response getOutline(String idString) throws Throwable {
        FileInfo fi = getFileInfo(idString);
        if (fi == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (fi.getProfile().toProfile().isMediaType(Constants.MEDIATYPE_ZIP)) {
            try {
                ArchiveOps.Outline outline = ArchiveOps.extractOutlineFromZip(fi.getPath().toFile());
                return Response.ok(outline).build();
            } catch (ZipException xc) {
                LOGGER.info("bad zip archive: " + xc.getMessage());
                return Response.status(Response.Status.NOT_ACCEPTABLE).entity(xc.getMessage()).build();
            }
        } else if (fi.getProfile().toProfile().isMediaType(Constants.MEDIATYPE_TAR)) {
            ArchiveOps.Outline outline = ArchiveOps.extractOutlineFromTar(fi.getPath().toFile());
            return Response.ok(outline).build();
        }

        return Response.status(Response.Status.NO_CONTENT).build();
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
}
