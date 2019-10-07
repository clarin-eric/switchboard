package eu.clarin.switchboard.core.xc;

import eu.clarin.switchboard.app.Config;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Response;
import java.net.HttpURLConnection;

public class SwitchboardExceptionMapper implements javax.ws.rs.ext.ExceptionMapper<Exception> {
    private static final ch.qos.logback.classic.Logger LOGGER =
            (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(SwitchboardExceptionMapper.class);

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
        if (exception instanceof CommonException) {
            return toResponse((CommonException) exception);
        }
        LOGGER.error("Exception", exception);
        JsonXc json = new JsonXc();
        json.message = "Server error." + BUG;
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(json).build();
    }

    public Response toResponse(CommonException exception) {
        if (exception instanceof LinkException) {
            return toResponse((LinkException) exception);
        }

        JsonXc json = new JsonXc();
        Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
        if (exception instanceof StorageException) {
            LOGGER.error("StorageException", exception);
            json.message = "Server storage error." + TRY_AGAIN;
        } else if (exception instanceof ProfilingException) {
            LOGGER.error("ProfilingException", exception);
            json.message = "Resource's media type could not be detected." + BUG;
        } else if (exception instanceof StoragePolicyException) {
            StoragePolicyException spe = (StoragePolicyException) exception;
            json.message = spe.getMessage();
            if (spe.getKind() == StoragePolicyException.Kind.TOO_BIG) {
                status = Response.Status.REQUEST_ENTITY_TOO_LARGE;
            } else if (spe.getKind() == StoragePolicyException.Kind.MEDIA_NOT_ALLOWED) {
                status = Response.Status.UNSUPPORTED_MEDIA_TYPE;
            }
        } else {
            LOGGER.error("unknown CommonException", exception);
        }
        return Response.status(status).entity(json).build();
    }

    public Response toResponse(LinkException exception) {
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
                json.message = "Unexpected http client error from resource.";
            } else if (exception.getHttpCode() / 100 == 5) {
                json.message = "Unexpected http server error from resource.";
            } else {
                json.message = "Unexpected http status code from resource.";
            }
        } else {
            LOGGER.error("unknown LinkException", exception);
        }
        return Response.status(status).entity(json).build();
    }
}
