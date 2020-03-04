package eu.clarin.switchboard.profiler;

import eu.clarin.switchboard.profiler.api.Profile;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class DefaultMatcherTest {
    Profile empty = Profile.builder().build();

    Profile justText = Profile.builder().mediaType("text/plain").build();
    Profile engText = Profile.builder().mediaType("text/plain").language("eng").build();
    Profile engTextFeature = Profile.builder().mediaType("text/plain").language("eng").feature("utf8").build();
    Profile engTextFeatureValue = Profile.builder().mediaType("text/plain").language("eng").feature("encoding", "utf8").build();
    Profile xmlFeature = Profile.builder().mediaType("application/xml").feature("utf8").build();
    Profile xmlFeatureValue = Profile.builder().mediaType("application/xml").feature("utf8", "true").build();

    Profile xml = Profile.builder().mediaType("application/xml").build();

    @Before
    public void setUp() {
    }

    @Test
    public void testEmptyMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder().build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertFalse(pm.matches(engText));
        assertFalse(pm.matches(engTextFeature));
        assertFalse(pm.matches(engTextFeatureValue));
        assertFalse(pm.matches(xmlFeature));
        assertFalse(pm.matches(xmlFeatureValue));
    }

    @Test
    public void testAnyMimetypeMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder()
                .acceptAnyMediaType()
                .build();
        assertTrue(pm.matches(empty));
        assertTrue(pm.matches(justText));
        assertTrue(pm.matches(engText));
        assertTrue(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));
        assertTrue(pm.matches(xmlFeature));
        assertTrue(pm.matches(xmlFeatureValue));
    }

    @Test
    public void testAnyMimetypeAndLanguageMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder()
                .acceptAnyMediaType()
                .acceptLanguage()
                .build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));

        assertTrue(pm.matches(engText));
        assertTrue(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));

        assertFalse(pm.matches(xmlFeature));
        assertFalse(pm.matches(xmlFeatureValue));
    }

    @Test
    public void testAnyLanguageMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder()
                .acceptMediaType("text/plain")
                .acceptLanguage()
                .build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));

        assertTrue(pm.matches(engText));
        assertTrue(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));

        assertFalse(pm.matches(xmlFeature));
        assertFalse(pm.matches(xmlFeatureValue));
    }

    @Test
    public void testTypeMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder()
                .acceptMediaType("text/plain")
                .build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(xml));

        assertTrue(pm.matches(justText));
        assertTrue(pm.matches(engText));
        assertTrue(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));

        assertFalse(pm.matches(xmlFeature));
        assertFalse(pm.matches(xmlFeatureValue));
    }

    @Test
    public void testTypeLanguageMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder()
                .acceptMediaType("text/plain")
                .acceptLanguage("eng")
                .build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertTrue(pm.matches(engText));
        assertTrue(pm.matches(engTextFeature));
        assertTrue(pm.matches(engTextFeatureValue));

        assertFalse(pm.matches(xmlFeature));
        assertFalse(pm.matches(xmlFeatureValue));
    }

    @Test
    public void testFeatureMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder()
                .acceptMediaType("text/plain")
                .acceptFeatureWithAnyValue("utf8")
                .build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertFalse(pm.matches(engText));
        assertTrue(pm.matches(engTextFeature));
        assertFalse(pm.matches(engTextFeatureValue));
        assertFalse(pm.matches(xmlFeature));
        assertFalse(pm.matches(xmlFeatureValue));
    }

    @Test
    public void testFeatureValueMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder()
                .acceptMediaType("application/xml")
                .acceptFeatureWithAnyValue("utf8")
                .build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertFalse(pm.matches(engText));
        assertFalse(pm.matches(engTextFeature));
        assertFalse(pm.matches(engTextFeatureValue));

        assertTrue(pm.matches(xmlFeature));
        assertTrue(pm.matches(xmlFeatureValue));
    }

    @Test
    public void testTypeLanguageFeatureValueMatcher() {
        DefaultMatcher pm = DefaultMatcher.builder()
                .acceptMediaType("application/xml")
                .acceptFeatureWithValue("utf8", "true")
                .build();
        assertFalse(pm.matches(empty));
        assertFalse(pm.matches(justText));
        assertFalse(pm.matches(engText));
        assertFalse(pm.matches(engTextFeature));
        assertFalse(pm.matches(engTextFeatureValue));
        assertFalse(pm.matches(xmlFeature));
        assertTrue(pm.matches(xmlFeatureValue));
    }
}
