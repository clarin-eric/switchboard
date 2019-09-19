package eu.clarin.switchboard.core.xc;

public class CommonException extends Exception {
    public CommonException(Exception xc) {
        super(xc);
    }

    public CommonException(String message) {
        super(message);
    }

    public CommonException(String message, Exception xc) {
        super(message, xc);
    }
}
