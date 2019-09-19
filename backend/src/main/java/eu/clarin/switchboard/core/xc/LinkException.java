package eu.clarin.switchboard.core.xc;

import com.google.common.base.MoreObjects;

public class LinkException extends CommonException {
    public enum Kind {
        BAD_URL,
        CONNECTION_ERROR,
        RESPONSE_ERROR,
        TOO_MANY_REDIRECTS,
        STATUS_ERROR,
        DATA_STREAM_ERROR,
    }

    Kind kind;
    String link;
    int httpCode;

    public LinkException(Kind kind, String link, int httpCode) {
        this(kind, link, httpCode, null);
    }

    public LinkException(Kind kind, String link, Exception cause) {
        this(kind, link, 0, cause);
    }

    private LinkException(Kind kind, String link, int httpCode, Exception cause) {
        super(cause);
        this.kind = kind;
        this.link = link;
        this.httpCode = httpCode;
    }

    public Kind getKind() {
        return kind;
    }

    public String getLink() {
        return link;
    }

    public int getHttpCode() {
        return httpCode;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nkind", kind)
                .add("\nlink", link)
                .add("\nhttpCode", httpCode)
                .toString();
    }
}
