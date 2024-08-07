package eu.clarin.switchboard.core;

import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.tool.Tool;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static java.util.Arrays.asList;

public class ToolRegistryTest {
    ToolRegistry toolRegistry;

    @BeforeEach
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

        System.out.println("" + allToolsMatches);

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(0);
            assertEquals("First", toolMatches.tool.getName());
            assertEquals(asList(asList(0)), toolMatches.getMatches());
            assertEquals(100.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(1);
            assertEquals("Second", toolMatches.tool.getName());
            assertEquals(asList(asList(0)), toolMatches.getMatches());
            assertEquals(100.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(2);
            assertEquals("Fourth", toolMatches.tool.getName());
            assertEquals(asList(asList(0), asList(1)), toolMatches.getMatches());
            assertEquals(100.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(50.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(3);
            assertEquals("Variadic", toolMatches.tool.getName());
            assertEquals(asList(asList(0), asList(1)), toolMatches.getMatches());
            assertEquals(100.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(50.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
        }
    }

    @Test
    public void filterToolsByTwoProfiles() {
        List<ToolRegistry.ToolMatches> allToolsMatches;
        List<Profile> profiles;

        profiles = asList(
                Profile.builder().mediaType("text/plain").language("eng").build(),
                Profile.builder().mediaType("application/pdf").language("deu").build()
        );
        allToolsMatches = toolRegistry.filterTools(profiles, ToolRegistry.ALL_TOOLS);
        assertEquals(4, allToolsMatches.size());

        System.out.println("" + allToolsMatches);
        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(0);
            assertEquals("Fourth", toolMatches.tool.getName());
            // inputs:  1: text/plain+application/pdf;  2: text/plain;
            Object expected = asList(asList(1, 0));
            assertEquals(expected, toolMatches.getMatches());
            assertEquals(100.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getAllInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(1);
            assertEquals("Variadic", toolMatches.tool.getName());
            // inputs:  1: text/plain+application/pdf multiple;  2: text/plain;  3: text/plain optional
            Object expected = asList(asList(1, 0));
            assertEquals(expected, toolMatches.getMatches());
            assertEquals(100.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
            assertEquals(66.66, toolMatches.getAllInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(2);
            assertEquals("First", toolMatches.tool.getName());
            // inputs:  1: text/plain
            Object expected = asList(asList(0, null));
            assertEquals(expected, toolMatches.getMatches());
            assertEquals(50.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getAllInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(3);
            assertEquals("Second", toolMatches.tool.getName());
            // inputs:  1: text/plain+application/pdf
            Object expected = asList(asList(0, null));
            assertEquals(expected, toolMatches.getMatches());
            assertEquals(50.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getAllInputsMatchPercent(), 0.1);
        }
    }

    @Test
    public void filterToolsByFourProfiles() {
        List<ToolRegistry.ToolMatches> allToolsMatches;
        List<Profile> profiles;

        profiles = asList(
                Profile.builder().mediaType("text/plain").language("eng").build(),
                Profile.builder().mediaType("text/plain").language("deu").build(),
                Profile.builder().mediaType("application/pdf").language("deu").build(),
                Profile.builder().mediaType("application/pdf").language("spa").build()
        );
        allToolsMatches = toolRegistry.filterTools(profiles, ToolRegistry.ALL_TOOLS);
        assertEquals(4, allToolsMatches.size());

        System.out.println("" + allToolsMatches);

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(0);
            assertEquals("Variadic", toolMatches.tool.getName());
            // inputs:  1: text/plain+application/pdf multiple;  2: text/plain;
            Object expected = asList(asList(1, 0, 0, null));
            assertEquals(expected, toolMatches.getMatches());
            assertEquals(75.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
            assertEquals(66.6, toolMatches.getAllInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(1);
            assertEquals("Fourth", toolMatches.tool.getName());
            // inputs:  1: text/plain+application/pdf;  2: text/plain;
            Object expected = asList(asList(1, 0, null, null), asList(1, null, 0, null));
            assertEquals(expected, toolMatches.getMatches());
            assertEquals(50.00, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getAllInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(2);
            assertEquals("First", toolMatches.tool.getName());
            // inputs:  1: text/plain
            Object expected = asList(asList(0, null, null, null));
            assertEquals(expected, toolMatches.getMatches());
            assertEquals(25.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getAllInputsMatchPercent(), 0.1);
        }

        {
            ToolRegistry.ToolMatches toolMatches = allToolsMatches.get(3);
            assertEquals("Second", toolMatches.tool.getName());
            // inputs:  1: text/plain+application/pdf
            Object expected = asList(asList(0, null, null, null));
            assertEquals(expected, toolMatches.getMatches());
            assertEquals(25.0, toolMatches.getProfileMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getMandatoryInputsMatchPercent(), 0.1);
            assertEquals(100.0, toolMatches.getAllInputsMatchPercent(), 0.1);
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
