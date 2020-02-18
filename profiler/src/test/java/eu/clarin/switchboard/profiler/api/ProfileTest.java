package eu.clarin.switchboard.profiler.api;

import org.junit.Test;

import javax.ws.rs.core.MediaType;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ProfileTest {
    @Test
    public void isMediaType() {
        assertTrue(newProfile("text/xml").isMediaType(MediaType.TEXT_XML));
        assertFalse(newProfile("text/xml").isMediaType(MediaType.APPLICATION_XML));
        assertFalse(newProfile("text/xml;format=x").isMediaType(MediaType.TEXT_XML));
    }

    @Test
    public void isXmlMediaType() {
        assertTrue(newProfile("text/xml").isXmlMediaType());
        assertTrue(newProfile("application/xml").isXmlMediaType());
        assertTrue(newProfile("application/tei+xml").isXmlMediaType());
        assertTrue(newProfile("application/tei+xml;format-variant=whatever").isXmlMediaType());
        assertTrue(newProfile("text/xml+imaginary;parameter=unknown").isXmlMediaType());
        assertTrue(newProfile("text/prs.xml+imaginary;parameter=unknown").isXmlMediaType());
        assertTrue(newProfile("text/prs.xmlasd+xml;parameter=unknown").isXmlMediaType());

        assertFalse(newProfile("text/prs.xmlasd+xm;parameter=unknown").isXmlMediaType());
        assertFalse(newProfile("garbage,./)*xml*format").isXmlMediaType());
        assertFalse(newProfile("garbage,./)*xm*format").isXmlMediaType());
        assertFalse(newProfile("garbage,xml./)*format").isXmlMediaType());

    }

    private Profile newProfile(String mimetype) {
        return Profile.builder().mediaType(mimetype).build();
    }
}