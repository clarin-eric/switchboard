package eu.clarin.switchboard.core;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;

public class StoragePolicyExceptionMapper implements ExceptionMapper<StoragePolicyException> {
    public StoragePolicyExceptionMapper() {
        super();
    }

    @Override
    public Response toResponse(StoragePolicyException xc) {
        Response.Status status = Response.Status.BAD_REQUEST;
        switch (xc.getKind()) {
            case TOO_BIG:
                status = Response.Status.REQUEST_ENTITY_TOO_LARGE;
                break;
            case MEDIA_NOT_ALLOWED:
                status = Response.Status.UNSUPPORTED_MEDIA_TYPE;
                break;
        }
        return Response.status(status).entity(xc).build();
    }
}
