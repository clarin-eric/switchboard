package eu.clarin.switchboard.core;

import eu.clarin.switchboard.core.xc.LinkException;
import eu.clarin.switchboard.profiler.api.Profile;
import org.junit.jupiter.api.Test;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class QuirksTest {
    @Test
    public void urlFixSpecialCases() throws LinkException {
        assertEquals(
                "https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y/download",
                Quirks.urlFixSpecialCases("https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y"));
        assertEquals(
                "https://www.dropbox.com/s/9flyntc1353ve07/id_rsa.pub?dl=1",
                Quirks.urlFixSpecialCases("https://www.dropbox.com/s/9flyntc1353ve07/id_rsa.pub?dl=0"));
    }

    @Test
    public void specializeProfile() {
        FileInfo fi = new FileInfo(UUID.randomUUID(), "filename", Path.of("/tmp/filename"));
        fi.setProfiles(Profile.builder().mediaType("text/plain").build(), Collections.emptyList());
        Profile declaredProfile = Profile.builder().mediaType("text/csv").build();
        Quirks.specializeProfile(fi, declaredProfile);
        assertEquals(fi.getProfile().toProfile().getMediaType(), declaredProfile.getMediaType());
    }
}