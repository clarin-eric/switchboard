package eu.clarin.switchboard.profiler.api;

import java.io.File;
import java.io.IOException;

public interface LanguageDetector {
    /**
     * Identify the language of a file
     *
     * @param file the input data container
     * @param mediaType the file's known media type
     * @return the ISO 639-3 language code of the text (and "und" when unknown)
     */
    String detectLanguage(File file, String mediaType) throws IOException;
}
