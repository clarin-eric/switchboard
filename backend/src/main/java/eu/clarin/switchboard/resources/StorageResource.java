package eu.clarin.switchboard.resources;

import com.google.common.collect.ImmutableSet;
import eu.clarin.switchboard.core.Converter;
import eu.clarin.switchboard.core.ConverterException;
import eu.clarin.switchboard.core.Profiler;
import eu.clarin.switchboard.core.Storage;
import org.apache.tika.exception.TikaException;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Path("storage")
public class StorageResource {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(StorageResource.class);

    public static final Set<String> convertableMediatypes = ImmutableSet.of(
            "application/pdf",
            "application/rtf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public static final Set<String> nonTextMediatypes = ImmutableSet.of(
            "application/zip",
            "application/x-gzip",
            "audio/vnd.wave",
            "audio/x-wav",
            "audio/wav",
            "audio/mp3",
            "audio/mp4",
            "audio/x-mpeg"
    );

    Storage storage;
    Profiler profiler;
    Converter converter;

    public StorageResource(String tikaConfigPath) throws IOException, TikaException, SAXException {
        storage = new Storage();
        profiler = new Profiler();
        converter = new Converter(tikaConfigPath);
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response putFile(@FormDataParam("file") InputStream inputStream,
                            @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
                            @PathParam("id") String id,
                            @Context HttpServletRequest request) throws Exception {
        String uploadedFileName = contentDispositionHeader.getFileName();
        storage.save(id, uploadedFileName, inputStream);
        LOGGER.info("uploaded file: " + uploadedFileName);

        File file = storage.getFile(id);
        String mediatype = profiler.detectMediatype(file);
        String language = null;
        if (convertableMediatypes.contains(mediatype)) {
            String text = converter.parseToPlainText(file);
            language = profiler.detectLanguage(text);
        } else if (nonTextMediatypes.contains(mediatype)) {
            // no language for this one
        } else {
            language = profiler.detectLanguage(file);
        }

        LOGGER.info("mediatype: " + mediatype + "; language: " + language);

        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("filename", uploadedFileName);
        response.put("length", file.length());
        response.put("mediatype", mediatype);
        response.put("language", language);
        return Response.ok(response).build();
    }
}
