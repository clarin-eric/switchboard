package eu.clarin.switchboard.core;

import org.junit.Test;

import static org.junit.Assert.*;

public class DefaultStoragePolicyTest {

    @Test
    public void testIsXmlMediatype() {
        assertTrue(DefaultStoragePolicy.isXmlMediatype("text/xml"));
        assertTrue(DefaultStoragePolicy.isXmlMediatype("application/xml"));
        assertTrue(DefaultStoragePolicy.isXmlMediatype("application/tei+xml"));
        assertTrue(DefaultStoragePolicy.isXmlMediatype("application/tei+xml;format-variant=whatever"));
        assertTrue(DefaultStoragePolicy.isXmlMediatype("text/xml+imaginary;parameter=unknown"));

        assertFalse(DefaultStoragePolicy.isXmlMediatype("incorrect/mediatype;xml"));
        assertFalse(DefaultStoragePolicy.isXmlMediatype("garbage,./)*xml*format"));
    }
}