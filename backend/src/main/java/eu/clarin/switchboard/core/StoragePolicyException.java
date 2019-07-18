package eu.clarin.switchboard.core;

public class StoragePolicyException extends Exception {
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
