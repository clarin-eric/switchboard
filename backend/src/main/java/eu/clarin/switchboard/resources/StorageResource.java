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
import javax.ws.rs.core.UriBuilder;
import javax.xml.ws.spi.http.HttpContext;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

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

    @Context HttpServletRequest request;

    public StorageResource(String tikaConfigPath) throws IOException, TikaException, SAXException {
        storage = new Storage();
        profiler = new Profiler();
        converter = new Converter(tikaConfigPath);
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response postFile(@FormDataParam("file") InputStream inputStream,
                             @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
                             @FormDataParam("link") String link) throws Exception {
        UUID id = UUID.randomUUID();
        if (contentDispositionHeader != null) {
            String filename = contentDispositionHeader.getFileName();
            storage.save(id, filename, inputStream);
            LOGGER.info("uploaded file: " + filename);
        } else if (link != null) {
            storage.download(id, link);
            LOGGER.info("downloaded link: " + link);
        } else {
            return Response.status(400).entity("Please provide either a file or a link to download in the form").build();
        }

        Map<String, Object> ret = profile(id);
        ret.put("url", UriBuilder
                .fromPath(request.getRequestURI())
                .path(id.toString())
                .build());
        if (link != null) {
            ret.put("origin", link);
        }
        return Response.ok(ret).build();
    }


    private Map<String, Object> profile(UUID id) throws IOException, ConverterException {
        Storage.FileInfo fi = storage.getFileInfo(id);
        File file = fi.getPath().toFile();
        String filename = fi.getName();

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

        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("filename", filename);
        map.put("length", file.length());
        map.put("mediatype", mediatype);
        map.put("language", language);
        return map;
    }
}
