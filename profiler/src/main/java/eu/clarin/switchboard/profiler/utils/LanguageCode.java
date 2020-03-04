package eu.clarin.switchboard.profiler.utils;

import java.util.Locale;
import java.util.MissingResourceException;

/**
 * Utility class for language code manipulations.
 */
public class LanguageCode {
    // see https://en.wikipedia.org/w/index.php?title=ISO_639-3#Special_codes
    public static final String UNDETERMINED = "und";

    public static boolean isIso639_3(String lang) {
        return lang != null && lang.length() == 3;
    }

    public static String iso639_1to639_3(String lang) {
        if (lang == null) {
            return null;
        }
        try {
            return Locale.forLanguageTag(lang).getISO3Language();
        } catch (MissingResourceException xc) {
            return null;
        }
    }
}