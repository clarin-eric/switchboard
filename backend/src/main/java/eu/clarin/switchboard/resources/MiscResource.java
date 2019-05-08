package eu.clarin.switchboard.resources;

import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("")
public class MiscResource {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(MiscResource.class);

    private final Map<String, String> gitProps;

    public MiscResource(Map<String, String> gitProps) {
        this.gitProps = gitProps == null ? new HashMap<>() : gitProps;
    }

    @GET
    @Path("/info")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getApiInfo() {
        Map map = new HashMap<String, Object>() {{
            put("git", MiscResource.this.gitProps);
            put("version", MiscResource.this.gitProps.get("git.build.version"));
        }};
        return Response.ok(map).build();
    }

    //TODO: take the mimetypes from the list of tools
    @GET
    @Path("/mimetypes")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getMediatypes() {
        List<String> mediatypes = new ArrayList<>();
        mediatypes.add("text/plain");
        mediatypes.add("application/pdf");
        mediatypes.add("application/rtf");
        mediatypes.add("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        mediatypes.add("application/zip");
        mediatypes.add("application/x-gzip");
        return Response.ok(mediatypes).build();
    }

    //TODO: take the languages from the list of tools
    @GET
    @Path("/languages")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response getLanguages() {
        List<String> languages = new ArrayList<>();
        languages.add("eng");
        languages.add("deu");
        languages.add("generic");
        return Response.ok(languages).build();
    }
}
