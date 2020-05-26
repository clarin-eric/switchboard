package eu.clarin.switchboard.resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.clarin.switchboard.app.FileAsset;
import eu.clarin.switchboard.core.xc.CommonException;
import eu.clarin.switchboard.profiler.api.ProfilingException;
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

@Path("")
public class MainResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(MainResource.class);

    ObjectMapper mapper = new ObjectMapper();

    public MainResource() {
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
    public IndexView postDataGetIndex(
            // @Context Request request
            @FormDataParam("file") InputStream inputStream,
            @FormDataParam("file") final FormDataContentDisposition contentDispositionHeader,
            @FormDataParam("url") String url) throws CommonException, ProfilingException {
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
    @Produces("image/x-icon")
    public Response getFavicon(@Context Request request) {
        FileAsset fileAsset = new FileAsset("webui/favicon.ico");
        return fileAsset.makeResponse(request);
    }
}
