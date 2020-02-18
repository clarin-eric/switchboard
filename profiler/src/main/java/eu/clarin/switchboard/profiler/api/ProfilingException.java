package eu.clarin.switchboard.profiler.api;

public class ProfilingException extends Exception {
    public ProfilingException(String message) {
        super(message);
    }

    public ProfilingException(String message, Throwable cause) {
        super(message, cause);
    }
}
