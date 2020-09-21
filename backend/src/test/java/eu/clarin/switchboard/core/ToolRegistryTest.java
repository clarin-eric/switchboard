package eu.clarin.switchboard.core;

import eu.clarin.switchboard.profiler.api.Profile;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertArrayEquals;
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

        tools = toolRegistry.filterTools(true);
        assertEquals(1, tools.size());

        tools = toolRegistry.filterTools(false);
        assertEquals(4, tools.size());
    }

    @Test
    public void filterToolsByProfile() {
        List<ToolRegistry.ToolMatches> toolMatches;
        List<Profile> profiles;

        profiles = Collections.singletonList(
                Profile.builder().mediaType("text/plain").language("eng").build()
        );
        toolMatches = toolRegistry.filterTools(profiles, true);
        assertEquals(1, toolMatches.size());
        assertEquals("First", toolMatches.get(0).tool.getName());
        assertEquals(1, toolMatches.get(0).getMatches().size());
        assertEquals(Arrays.asList(0), toolMatches.get(0).getMatches().get(0));

        profiles = Collections.singletonList(
                Profile.builder().mediaType("text/plain").language("eng").build()
        );
        toolMatches = toolRegistry.filterTools(profiles, false);
        assertEquals(3, toolMatches.size());

        assertEquals("First", toolMatches.get(0).tool.getName());
        assertEquals(1, toolMatches.get(0).getMatches().size());
        assertEquals(Arrays.asList(0), toolMatches.get(0).getMatches().get(0));

        assertEquals("Second", toolMatches.get(1).tool.getName());
        assertEquals(1, toolMatches.get(1).getMatches().size());
        assertEquals(Arrays.asList(0), toolMatches.get(1).getMatches().get(0));

        assertEquals("Fourth", toolMatches.get(2).tool.getName());
        assertEquals(2, toolMatches.get(2).getMatches().size());
        assertEquals(Arrays.asList(0, -1), toolMatches.get(2).getMatches().get(0));
        assertEquals(Arrays.asList(-1, 0), toolMatches.get(2).getMatches().get(1));
    }

    @Test
    public void filterToolsByMultipleProfiles() {
        List<ToolRegistry.ToolMatches> toolMatches;
        List<Profile> profiles;

        profiles = Arrays.asList(
                Profile.builder().mediaType("text/plain").language("eng").build(),
                Profile.builder().mediaType("application/pdf").language("deu").build()
        );
        toolMatches = toolRegistry.filterTools(profiles, false);
        assertEquals(3, toolMatches.size());

        assertEquals("First", toolMatches.get(0).tool.getName());
        assertEquals(1, toolMatches.get(0).getMatches().size());
        assertEquals(Arrays.asList(0), toolMatches.get(0).getMatches().get(0));

        assertEquals("Second", toolMatches.get(1).tool.getName());
        assertEquals(1, toolMatches.get(1).getMatches().size());
        assertEquals(Arrays.asList(0), toolMatches.get(1).getMatches().get(0));

        assertEquals("Fourth", toolMatches.get(2).tool.getName());
        assertEquals(1, toolMatches.get(2).getMatches().size());
        System.out.println(toolMatches.get(2).getMatches());
        assertEquals(Arrays.asList(1, 0), toolMatches.get(2).getMatches().get(0));
    }

    @Test
    public void getAllTools() {
        List<Tool> tools = toolRegistry.getAllTools();
        assertEquals(4, tools.size());
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