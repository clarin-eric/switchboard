package eu.clarin.switchboard.core.xc;

public class StoragePolicyException extends CommonException {
    public enum Kind {
        TOO_BIG,
        MEDIA_NOT_ALLOWED,
    }

    Kind kind;

    public StoragePolicyException(String message, Kind kind) {
        super(message);
        this.kind = kind;
    }

    public Kind getKind() {
        return kind;
    }
}
