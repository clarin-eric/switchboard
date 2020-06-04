package eu.clarin.switchboard.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.clarin.switchboard.app.FileAsset;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.core.xc.CommonException;
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
import java.io.InputStream;
import java.util.UUID;

@Path("")
public class MainResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(MainResource.class);

    ObjectMapper mapper = new ObjectMapper();
    MediaLibrary mediaLibrary;

    public MainResource(MediaLibrary mediaLibrary) {
        this.mediaLibrary = mediaLibrary;
    }

    @GET
    @Path("/")
    @Produces(MediaType.TEXT_HTML + ";charset=utf-8")
    public IndexView getIndex() {
        return new IndexView();
    }

    @POST
    @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_HTML + ";charset=utf-8")
    public View postDataGetIndex(@FormDataParam("file") InputStream inputStream,
                                 @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
                                 @FormDataParam("url") String url,
                                 @FormDataParam("popup") boolean popup)
            throws JsonProcessingException {
        if (contentDispositionHeader != null) {
            String filename = contentDispositionHeader.getFileName();
            UUID id = mediaLibrary.addMediaAsync(filename, inputStream);
            return IndexView.fileInfoID(id, popup);
        } else if (url != null) {
            UUID id = mediaLibrary.addMediaAsync(url);
            return IndexView.fileInfoID(id, popup);
        } else {
            return IndexView.error("Switchboard needs either a file or a url in the POST request", popup);
        }
    }

    @GET
    @Path("/{name}")
    @Produces(MediaType.TEXT_HTML + ";charset=utf-8")
    public IndexView getIndex(String name) {
        return new IndexView();
    }

    @GET
    @Path("/bundle.js")
    @Produces("application/javascript;charset=utf-8")
    public Response getBundle(@Context Request request) {
        FileAsset fileAsset = new FileAsset("webui/bundle.js");
        return fileAsset.makeResponse(request);
    }

    @GET
    @Path("/bundle.js.map")
    public Response getBundleMap(@Context Request request) {
        FileAsset fileAsset = new FileAsset("webui/bundle.js.map");
        return fileAsset.makeResponse(request);
    }

    @GET
    @Path("/favicon.ico")
    public Response getFavicon(@Context Request request) {
        FileAsset fileAsset = new FileAsset("webui/favicon.ico");
        return fileAsset.makeResponse(request);
    }
}
