package eu.clarin.switchboard.profiler.api;

public interface Matcher {
    /**
     * Test a profile for matching some criteria.
     *
     * @param profile the profile matched against
     * @return true if the profile matches, false otherwise
     */
    boolean matches(Profile profile);
}
