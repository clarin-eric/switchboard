package eu.clarin.switchboard.profiler;

import eu.clarin.switchboard.profiler.api.Profile;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ProfileMatcherTest {
    Profile empty = Profile.builder().build();

    Profile justText = Profile.builder().mediaType("text/plain").build();
    Profile engText = Profile.builder().mediaType("text/plain").language("eng").build();
    Profile engTextFeature = Profile.builder().mediaType("text/plain").language("eng").feature("utf8").build();
    Profile engTextFeatureValue = Profile.builder().mediaType("text/plain").language("eng").feature("encoding", "utf8").build();
    Profile textFeature = Profile.builder().mediaType("text/plain").feature("utf8").build();
    Profile textFeatureValue = Profile.builder().mediaType("text/plain").feature("encoding", "utf8").build();

    Profile xml = Profile.builder().mediaType("application/xml").build();

    @Before
    public void setUp() {
    }

    @Test
    public void testEmptyMatcher() {
        ProfileMatcher pm = ProfileMatcher.builder().build();
        assertTrue(pm.matches(empty));
        assertTrue(pm.matches(justText));
        assertTrue(pm.matches(engText));
        assertTrue(pm.matches(textFeature));
        assertTrue(pm.matches(textFeatureValue));
        assertTrue(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));
    }

    @Test
    public void testTypeMatcher() {
        ProfileMatcher pm = ProfileMatcher.builder().mediaType("text/plain").build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(xml));

        assertTrue(pm.matches(justText));
        assertTrue(pm.matches(engText));
        assertTrue(pm.matches(textFeature));
        assertTrue(pm.matches(textFeatureValue));
        assertTrue(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));
    }

    @Test
    public void testTypeLanguageMatcher() {
        ProfileMatcher pm = ProfileMatcher.builder().mediaType("text/plain").language("eng").build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertTrue(pm.matches(engText));
        assertFalse(pm.matches(textFeature));
        assertFalse(pm.matches(textFeatureValue));
        assertTrue(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));
    }

    @Test
    public void testFeatureMatcher() {
        ProfileMatcher pm = ProfileMatcher.builder().mediaType("text/plain").feature("utf8").build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertFalse(pm.matches(engText));
        assertTrue(pm.matches(textFeature));
        assertFalse(pm.matches(textFeatureValue));
        assertTrue(pm.matches(engTextFeature));
        assertFalse(pm.matches(engTextFeatureValue));
    }

    @Test
    public void testFeatureValueMatcher() {
        ProfileMatcher pm = ProfileMatcher.builder().mediaType("text/plain").feature("encoding", "utf8").build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertFalse(pm.matches(engText));
        assertFalse(pm.matches(textFeature));
        assertTrue(pm.matches(textFeatureValue));
        assertFalse(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));
    }

    @Test
    public void testTypeLanguageFeatureValueMatcher() {
        ProfileMatcher pm = ProfileMatcher.builder().mediaType("text/plain").language("eng").feature("encoding", "utf8").build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertFalse(pm.matches(engText));
        assertFalse(pm.matches(textFeature));
        assertFalse(pm.matches(textFeatureValue));
        assertFalse(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));
    }
}
