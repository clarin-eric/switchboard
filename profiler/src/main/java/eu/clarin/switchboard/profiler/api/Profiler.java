package eu.clarin.switchboard.profiler.api;

import java.io.File;
import java.io.IOException;

public interface Profiler {
    /**
     * Identify the profile of a data container.
     *
     * The profiler needs a file and not an input stream, as the data needs to be rereadable
     * and the data container name (i.e. the file name) is part of metadata.
     *
     * @param file the input data container, with a significant file name extension
     * @return the profile of the data
     */
    Profile profile(File file) throws IOException, ProfilingException;
}
