package eu.clarin.switchboard.core;

import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.tool.Tool;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static java.util.Arrays.asList;

public class ToolRegistryTest {
    ToolRegistry toolRegistry;

    @Before
    public void setUp() throws Exception {
        toolRegistry = new ToolRegistry("./src/test/resources/registry");
    }

    @Test
    public void filterTools() {
        List<Tool> tools;

        tools = toolRegistry.filterTools(ToolRegistry.ONLY_PRODUCTION_TOOLS);
        assertEquals(1, tools.size());

        tools = toolRegistry.filterTools(ToolRegistry.ALL_TOOLS);
        assertEquals(5, tools.size());
    }

    @Test
    public void filterToolsByProfile() {
        List<ToolRegistry.ToolMatches> allToolsMatches;
        List<Profile> profiles;

        profiles = Collections.singletonList(
                Profile.builder().mediaType("text/plain").language("eng").build()
        );
        allToolsMatches = toolRegistry.filterTools(profiles, ToolRegistry.ONLY_PRODUCTION_TOOLS);
        assertEquals(1, allToolsMatches.size());
        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(0);
            assertEquals("First", toolMatches.tool.getName());
            assertEquals(asList(asList(0)), toolMatches.getMatches());
        }

        profiles = Collections.singletonList(
                Profile.builder().mediaType("text/plain").language("eng").build()
        );
        allToolsMatches = toolRegistry.filterTools(profiles, ToolRegistry.ALL_TOOLS);
        assertEquals(4, allToolsMatches.size());

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(0);
            assertEquals("First", toolMatches.tool.getName());
            assertEquals(asList(asList(0)), toolMatches.getMatches());
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(1);
            assertEquals("Second", toolMatches.tool.getName());
            assertEquals(asList(asList(0)), toolMatches.getMatches());
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(2);
            assertEquals("Fourth", toolMatches.tool.getName());
            assertEquals(asList(asList(0, -1), asList(-1, 0)), toolMatches.getMatches());
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(3);
            assertEquals("Variadic", toolMatches.tool.getName());
            assertEquals(asList(asList(0, -1), asList(-1, 0)), toolMatches.getMatches());
        }
    }

    @Test
    public void filterToolsByMultipleProfiles() {
        List<ToolRegistry.ToolMatches> allToolsMatches;
        List<Profile> profiles;

        profiles = asList(
                Profile.builder().mediaType("text/plain").language("eng").build(),
                Profile.builder().mediaType("text/plain").language("eng").build(),
                Profile.builder().mediaType("application/pdf").language("deu").build()
        );
        allToolsMatches = toolRegistry.filterTools(profiles, ToolRegistry.ALL_TOOLS);
        assertEquals(4, allToolsMatches.size());

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(0);
            assertEquals("Fourth", toolMatches.tool.getName());
            Object expected = asList(asList(1, 0), asList(2, 0), asList(0, 1), asList(2, 1));
            assertEquals(expected, toolMatches.getMatches());
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(1);
            assertEquals("Variadic", toolMatches.tool.getName());
            Object expected = asList(asList(1, 0), asList(2, 0), asList(0, 1), asList(2, 1));
            assertEquals(expected, toolMatches.getMatches());
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(2);
            assertEquals("First", toolMatches.tool.getName());
            assertEquals(1, toolMatches.getMatches().size());
            Object expected = asList(asList(1, 0), asList(2, 0), asList(0, 1), asList(2, 1));
            assertEquals(expected, toolMatches.getMatches());
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(3);
            assertEquals("Second", toolMatches.tool.getName());
            assertEquals(1, toolMatches.getMatches().size());
            Object expected = asList(asList(1, 0), asList(2, 0), asList(0, 1), asList(2, 1));
            assertEquals(expected, toolMatches.getMatches());
        }
    }

    @Test
    public void getAllTools() {
        List<Tool> tools = toolRegistry.getAllTools();
        assertEquals(5, tools.size());
    }

    @Test
    public void getAllMediatypes() {
        Set<String> mediatypes = toolRegistry.getAllMediatypes();
        assertEquals(5, mediatypes.size());
    }

    @Test
    public void getAllLanguages() {
        Set<String> languages = toolRegistry.getAllLanguages();
        assertEquals(3, languages.size());
    }
}
