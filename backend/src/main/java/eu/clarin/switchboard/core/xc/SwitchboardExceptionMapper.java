package eu.clarin.switchboard.core.xc;

import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.net.HttpURLConnection;

public class SwitchboardExceptionMapper implements javax.ws.rs.ext.ExceptionMapper<Exception> {
    private static final Logger LOGGER =
            LoggerFactory.getLogger(SwitchboardExceptionMapper.class);

    public SwitchboardExceptionMapper() {
        super();
    }

    static class JsonXc {
        String message = null;
        String url = null;
        Integer resourceStatus = null;

        public String getMessage() {
            return message;
        }

        public String getUrl() {
            return url;
        }

        public Integer getResourceStatus() {
            return resourceStatus;
        }
    }

    public static final String BUG = " Please report this issue to the Switchboard team.";
    public static final String TRY_AGAIN = " Please try again and report if the error persists.";

    @Override
    public Response toResponse(Exception exception) {
        if (exception instanceof LinkException) {
            return toResponse((LinkException) exception);
        } else if (exception instanceof StoragePolicyException) {
            return toResponse((StoragePolicyException) exception);
        }

        JsonXc json = new JsonXc();
        Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;

        if (exception instanceof StorageException) {
            LOGGER.error("StorageException", exception);
            json.message = "Server storage/IO error." + TRY_AGAIN;
        } else if (exception instanceof ProfilingException) {
            LOGGER.error("ProfilingException", exception);
            json.message = "Resource's media type could not be detected." + BUG;
        } else if (exception instanceof WebApplicationException) {
            LOGGER.error("WebApplicationException: " + exception.getMessage());
            // LOGGER.error("WebApplicationException: ", exception);
            return ((WebApplicationException)exception).getResponse();
        } else {
            LOGGER.error("Exception", exception);
            json.message = "Server error." + BUG;
        }

        return Response.status(status).entity(json).build();
    }

    private static Response toResponse(StoragePolicyException exception) {
        JsonXc json = new JsonXc();
        Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;

        json.message = exception.getMessage();
        if (exception.getKind() == StoragePolicyException.Kind.TOO_BIG) {
            status = Response.Status.REQUEST_ENTITY_TOO_LARGE;
        } else if (exception.getKind() == StoragePolicyException.Kind.MEDIA_NOT_ALLOWED) {
            status = Response.Status.UNSUPPORTED_MEDIA_TYPE;
        }

        return Response.status(status).entity(json).build();
    }

    private static Response toResponse(LinkException exception) {
        JsonXc json = new JsonXc();
        Response.Status status = Response.Status.BAD_REQUEST;
        json.url = exception.getLink();
        if (exception.getKind() == LinkException.Kind.BAD_URL) {
            json.message = "Malformed resource URL.";
        } else if (exception.getKind() == LinkException.Kind.CONNECTION_ERROR) {
            json.message = "Cannot open connection to resource.";
        } else if (exception.getKind() == LinkException.Kind.RESPONSE_ERROR) {
            json.message = "Error getting response from resource.";
        } else if (exception.getKind() == LinkException.Kind.TOO_MANY_REDIRECTS) {
            json.message = "Too many redirects from resource.";
        } else if (exception.getKind() == LinkException.Kind.DATA_STREAM_ERROR) {
            json.message = "Cannot get resource data.";
        } else if (exception.getKind() == LinkException.Kind.STATUS_ERROR) {
            json.resourceStatus = exception.getHttpCode();
            if (exception.getHttpCode() == HttpURLConnection.HTTP_NO_CONTENT) {
                json.message = "No content from resource.";
            } else if (exception.getHttpCode() == HttpURLConnection.HTTP_UNAUTHORIZED) {
                json.message = "Unauthorized access to resource.";
            } else if (exception.getHttpCode() == HttpURLConnection.HTTP_FORBIDDEN) {
                json.message = "Forbidden access to resource.";
            } else if (exception.getHttpCode() / 100 == 4) {
                json.message = "Unexpected HTTP client error from resource.";
            } else if (exception.getHttpCode() / 100 == 5) {
                json.message = "Unexpected HTTP server error from resource.";
            } else {
                json.message = "Unexpected HTTP status code from resource.";
            }
        } else {
            LOGGER.error("unknown LinkException", exception);
        }
        return Response.status(status).entity(json).build();
    }
}
