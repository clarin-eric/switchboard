package eu.clarin.switchboard.profiler.api;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface Profiler {
    /**
     * Identify the profile of a data container.
     *
     * The profiler needs a file and not an input stream, as the data needs to be rereadable
     * and the data container name (i.e. the file name) is part of metadata.
     *
     * @param file the input data container, with a significant file name extension
     * @return a list of possible data profiles, ordered by confidence, or null.
     * Most of the profilers return a single Profile. If a profiler does not know the type
     * it will return null. An exception will be thrown in exceptional cases.
     */
    List<Profile> profile(File file) throws IOException, ProfilingException;
}
