package eu.clarin.switchboard.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.clarin.switchboard.app.FileAsset;
import eu.clarin.switchboard.core.FileInfo;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.core.Quirks;
import eu.clarin.switchboard.core.xc.StorageException;
import eu.clarin.switchboard.core.xc.StoragePolicyException;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import io.dropwizard.views.View;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Path("")
public class MainResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(MainResource.class);
    public static Set<String> ROOT_RESOURCES = new HashSet<String>() {{
        add("index.html");
        add("input");
        add("input-url");
        add("input-text");
        add("tools");
        add("help");
        add("about");
    }};

    ObjectMapper mapper = new ObjectMapper();
    MediaLibrary mediaLibrary;

    public MainResource(MediaLibrary mediaLibrary) {
        this.mediaLibrary = mediaLibrary;
    }

    @GET
    // @Path("/")
    @Produces(MediaType.TEXT_HTML + ";charset=utf-8")
    public IndexView getIndex() {
        return new IndexView();
    }

    @GET
    @Path("/{name}")
    @Produces(MediaType.TEXT_HTML + ";charset=utf-8")
    public View getIndex(@PathParam("name") String name) {
        if (ROOT_RESOURCES.contains(name)) {
            return new IndexView();
        }
        throw new WebApplicationException(404);
    }

    @GET
    @Path("/bundle.js")
    @Produces("application/javascript;charset=utf-8")
    public Response getBundle(@Context Request request) {
        return new FileAsset("webui/bundle.js").makeResponse(request);
    }

    @GET
    @Path("/bundle.js.map")
    public Response getBundleMap(@Context Request request) {
        return new FileAsset("webui/bundle.js.map").makeResponse(request);
    }

    @GET
    @Path("/favicon.ico")
    public Response getFavicon(@Context Request request) {
        return new FileAsset("webui/favicon.ico").makeResponse(request);
    }


    @POST
    // @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_HTML + ";charset=utf-8")
    public View postToRoot(@FormDataParam("file") InputStream inputStream,
                           @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
                           @FormDataParam("url") String url,
                           @FormDataParam("id") String id,
                           @FormDataParam("origin") String origin,
                           @FormDataParam("selection") String selection,
                           @FormDataParam("popup") boolean popup)
            throws JsonProcessingException, ProfilingException, StorageException, StoragePolicyException {
        return post(inputStream, contentDispositionHeader, url, id, origin, selection, popup);
    }

    @POST
    @Path("/index.html")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_HTML + ";charset=utf-8")
    public View postToIndex(@FormDataParam("file") InputStream inputStream,
                            @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
                            @FormDataParam("url") String url,
                            @FormDataParam("id") String id,
                            @FormDataParam("origin") String origin,
                            @FormDataParam("selection") String selection,
                            @FormDataParam("popup") boolean popup)
            throws JsonProcessingException, ProfilingException, StorageException, StoragePolicyException {
        return post(inputStream, contentDispositionHeader, url, id, origin, selection, popup);
    }

    public View post(InputStream inputStream,
                     final FormDataContentDisposition contentDispositionHeader,
                     String url,
                     String idParam,
                     String origin,
                     String selection,
                     boolean popup)
            throws JsonProcessingException, ProfilingException, StoragePolicyException, StorageException {
        if (contentDispositionHeader != null) {
            String filename = contentDispositionHeader.getFileName();
            UUID id = mediaLibrary.addFileAsync(filename, inputStream);
            return IndexView.fileInfoID(id, popup);
        } else if (url != null) {
            UUID id = mediaLibrary.addByUrlAsync(url);
            return IndexView.fileInfoID(id, popup);
        } else if (idParam != null) {
            UUID id = UUID.fromString(idParam);
            return IndexView.fileInfoID(id, popup);
        } else if (selection != null && !selection.isEmpty()) {
            ByteArrayInputStream bais = new ByteArrayInputStream(selection.getBytes(StandardCharsets.UTF_8));
            FileInfo fileInfo = mediaLibrary.addFile("selection", bais, null);
            fileInfo.setSelection(true);
            Quirks.fillInfoBasedOnOrigin(fileInfo, origin);
            return IndexView.fileInfoID(fileInfo.getId(), popup);
        } else {
            return IndexView.error("Switchboard needs either a file or a url in the POST request", popup);
        }
    }
}
