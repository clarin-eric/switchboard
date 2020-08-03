package eu.clarin.switchboard.core;

import eu.clarin.switchboard.profiler.api.Profile;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;

public class ToolRegistryTest {
    ToolRegistry toolRegistry;

    @Before
    public void setUp() throws Exception {
        toolRegistry = new ToolRegistry("./src/test/resources/registry");
    }

    @Test
    public void filterTools() {
        List<Tool> tools;

        tools = toolRegistry.filterTools("text/plain", "eng", true, false);
        assertEquals(1, tools.size());

        tools = toolRegistry.filterTools("text/plain", "eng", false, false);
        assertEquals(2, tools.size());
    }

    @Test
    public void filterToolsByProfile() {
        List<Tool> tools;

        tools = toolRegistry.filterTools(Profile.builder().mediaType("text/plain").language("eng").build(), true, false);
        assertEquals(1, tools.size());

        tools = toolRegistry.filterTools(Profile.builder().mediaType("text/plain").language("eng").build(), false, false);
        assertEquals(2, tools.size());
    }

    @Test
    public void getAllTools() {
        List<Tool> tools = toolRegistry.getAllTools();
        assertEquals(3, tools.size());
    }

    @Test
    public void getAllMediatypes() {
        Set<String> mediatypes = toolRegistry.getAllMediatypes();
        assertEquals(5, mediatypes.size());
    }

    @Test
    public void getAllLanguages() {
        Set<String> languages = toolRegistry.getAllLanguages();
        assertEquals(2, languages.size());
    }
}