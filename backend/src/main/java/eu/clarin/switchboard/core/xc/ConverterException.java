package eu.clarin.switchboard.core.xc;

public class ConverterException extends CommonException {
    public ConverterException(Exception xc) {
        super(xc);
    }

    public ConverterException(String message) {
        super(message);
    }
}
