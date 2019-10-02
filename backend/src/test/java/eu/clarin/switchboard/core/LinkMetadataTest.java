package eu.clarin.switchboard.core;

import org.junit.Test;

import java.util.regex.Pattern;

import static org.junit.Assert.*;

public class LinkMetadataTest {

    @Test
    public void resolveDoiOrHandle() {
        assertResolve("10.1045/may99-payette", "https://doi.org/10.1045/may99-payette");

        assertResolve("11304/0cff951a-fe8b-43a9-8849-db1bdd5106e6", "https://hdl.handle.net/11304/0cff951a-fe8b-43a9-8849-db1bdd5106e6");
        assertResolve("11304/0cff951a-fe8b-43a9-8849-db1bdd5106e6@ds1", "https://hdl.handle.net/11304/0cff951a-fe8b-43a9-8849-db1bdd5106e6@ds1");

        assertResolve("http://example.com", "http://example.com");
        assertResolve("https://example.com", "https://example.com");
        assertResolve("http://example.com/1", "http://example.com/1");
        assertResolve("https://example.com/1", "https://example.com/1");
        assertResolve("http://example.com/1/asdf", "http://example.com/1/asdf");
        assertResolve("https://example.com/1/asdf", "https://example.com/1/asdf");
        assertResolve("http://example.com/1/asdf?q=ad%32ass", "http://example.com/1/asdf?q=ad%32ass");
        assertResolve("https://example.com/1/asdf?q=ad%32ass", "https://example.com/1/asdf?q=ad%32ass");
    }

    void assertResolve(String test, String expected) {
        assertEquals(expected, LinkMetadata.resolveDoiOrHandle(test));
    }
}