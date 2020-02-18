package eu.clarin.switchboard.profiler.api;

import java.io.File;
import java.io.IOException;

public interface Matcher {
    /**
     * Test a profile for matching some criteria.
     *
     * @param profile the profile matched against
     * @return true if the profile matches, false otherwise
     */

    boolean matches(Profile profile);
}
