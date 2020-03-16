package eu.clarin.switchboard.profiler;

import com.google.common.collect.ImmutableMap;
import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import eu.clarin.switchboard.profiler.text.TextProfiler;
import org.apache.tika.exception.TikaException;
import org.junit.Test;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.IOException;
import java.util.*;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ProfileAllTestFiles {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(ProfileAllTestFiles.class);

    static final String RESOURCES_ROOT_PATH = "./src/test/resources/";

    static final Map<String, Profile> EXPECTED_SINGLE = new ImmutableMap.Builder<String, Profile>()
            // .put("conllu/", Profile.builder().mediaType("application/").build())
            // .put("cqp/", Profile.builder().mediaType("application/").build())
            // .put("ddc/", Profile.builder().mediaType("application/").build())
            // .put("dlexdb/", Profile.builder().mediaType("application/").build())

            .put("doc/test.doc", Profile.builder().certain().mediaType("application/msword").language("eng").build())
            .put("doc/test.docx", Profile.builder().certain().mediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document").language("eng").build())

            // .put("exmaralda/", Profile.builder().mediaType("application/").build())

            .put("folia/folia-WR-P-E-J-0000000000.folia.xml", Profile.builder().certain().mediaType("text/folia+xml").language("nld").build())

            // .put("folker/", Profile.builder().mediaType("application/").build())

            .put("html/geoVis.html", Profile.builder().mediaType("text/html").language("und").build())

            // .put("lexicon/", Profile.builder().mediaType("application/").build())

            // .put("lif/", Profile.builder().mediaType("application/").build())

            // .put("maf/", Profile.builder().mediaType("application/").build())

            // .put("negra/", Profile.builder().mediaType("application/").build())

            //.put("odt/test.odt", Profile.builder().mediaType("application/vnd.oasis.opendocument.text").build())

            .put("pdf/test.pdf", Profile.builder().certain().mediaType("application/pdf").language("eng").build())

            .put("ppt/test.pptx", Profile.builder().certain().mediaType("application/vnd.openxmlformats-officedocument.presentationml.presentation").language("eng").build())

            // .put("praat/", Profile.builder().mediaType("application/").build())

            .put("rtf/test.rtf", Profile.builder().certain().mediaType("application/rtf").language("eng").build())

            // .put("sdt/", Profile.builder().mediaType("application/").build())

            // .put("tcf/", Profile.builder().mediaType("application/").build())

            .put("tei-arche/Aachen_Prot_1.xml", Profile.builder().certain().mediaType("application/tei+xml").language("und").build())
            .put("tei-arche/Verona_I_11.xml", Profile.builder().certain().mediaType("application/tei+xml").language("und").build())

            .put("tei/tei-eAla007.xml", Profile.builder().certain().mediaType("application/tei+xml").language("eng").build())

            .put("tei/tei.xml", Profile.builder().certain().mediaType("application/tei+xml").language("deu").build())
            .put("tei/tei-corpus.xml", Profile.builder().certain().mediaType("application/tei+xml").language("eng").build())
            .put("tei/ics-tei-Jetsam.xml", Profile.builder().certain().mediaType("application/tei+xml;format-variant=teiCorpus").language("eng").build())
            .put("tei/tei-11_souq_salesman.tei.xml", Profile.builder().certain().mediaType("application/tei+xml").language("und").build())
            .put("tei/tei-anonyme_actricenouvelle.xml", Profile.builder().certain().mediaType("application/tei+xml").language("fra").build())
            .put("tei/tei-greek-xmlchunk.xml", Profile.builder().certain().mediaType("application/tei+xml").language("ell").build())
            .put("tei/tei-tempest.xml", Profile.builder().certain().mediaType("application/tei+xml").language("eng").build())
            .put("tei/tei_no_xml_header.xml", Profile.builder().certain().mediaType("application/tei+xml").language("deu").build())

            .put("tei/Baedeker-Palaestina_und_Syrien_1875.xml", Profile.builder().certain().mediaType("application/tei+xml").language("deu").build())
            .put("tei/ger.xml", Profile.builder().certain().mediaType("application/tei+xml").language("deu").build())
            .put("tei/ota-5729.xml", Profile.builder().certain().mediaType("application/tei+xml").language("eng").build())
            //.put("tei/tei-dc_aeb_eng.xml.tei", Profile.builder().mediaType("application/tei+xml").build())

            .put("tei-dta/brandenburg_zigeuner_1684.TEI-P5.xml", Profile.builder().certain().mediaType("application/tei+xml;format-variant=tei-dta").language("deu").build())
            .put("tei-dta/zwinger_theatrum_1690.TEI-P5.xml", Profile.builder().certain().mediaType("application/tei+xml;format-variant=tei-dta").language("deu").build())
            .put("tei-dta/nn_msgermqu2124_1827.TEI-P5.xml", Profile.builder().certain().mediaType("application/tei+xml;format-variant=tei-dta").language("deu").build())

            .put("text/test.txt", Profile.builder().mediaType("text/plain").language("eng").build())
            .put("text/test.de.txt", Profile.builder().mediaType("text/plain").language("deu").build())
            .put("text/test.ro.txt", Profile.builder().mediaType("text/plain").language("ron").build())
            .put("text/pg76.txt", Profile.builder().mediaType("text/plain").language("eng").build())

            .put("xls/Tcf2Excel.xls", Profile.builder().certain().mediaType("application/vnd.ms-excel").language("und").build())
            .put("xls/Tcf2Excel.xlsx", Profile.builder().certain().mediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").language("und").build())

            .put("zip/htmlfiles.zip", Profile.builder().certain().mediaType("application/zip").build())

            .build();

    static final Map<String, List<Profile>> EXPECTED_MULTIPLE = new ImmutableMap.Builder<String, List<Profile>>()
            .put("text/test", Arrays.asList(
                    Profile.builder().mediaType(MediaType.TEXT_PLAIN).language("und").build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_QUERY_CQP).build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_QUERY_DDC).build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_QUERY_DLEXDB).build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_QUERY_CQL).build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_EXMARALDA_SIMPLE).build()
                    )
            )
            .put("text/test the second", Arrays.asList(
                    Profile.builder().mediaType(MediaType.TEXT_PLAIN).language("eng").build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_QUERY_CQP).build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_QUERY_DDC).build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_QUERY_DLEXDB).build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_QUERY_CQL).build(),
                    Profile.builder().mediaType(TextProfiler.MEDIATYPE_EXMARALDA_SIMPLE).build()
                    )
            )
            .build();

    DefaultProfiler profiler = new DefaultProfiler();

    public ProfileAllTestFiles() throws TikaException, IOException, SAXException {
    }

    @Test
    public void testAllTestFiles() throws IOException, ProfilingException {
        File[] typeList = new File(RESOURCES_ROOT_PATH).listFiles(File::isDirectory);
        assert typeList != null;

        for (File type : typeList) {
            File[] testFileList = type.listFiles();
            assert testFileList != null;

            for (File testFile : testFileList) {
                String relPath = type.getName() + File.separator + testFile.getName();

                List<Profile> expected = new ArrayList<>();
                Profile expectedProfile = EXPECTED_SINGLE.get(relPath);
                if (expectedProfile != null) {
                    expected.add(expectedProfile);
                } else {
                    expected = EXPECTED_MULTIPLE.get(relPath);
                }

                if (expected == null) { // not in the list
                    LOGGER.warn("Missing profile(s) for file: " + relPath);
                    continue;
                }

                List<Profile> profiles = profiler.profile(new File(RESOURCES_ROOT_PATH + relPath));
                assertEquals(relPath, expected.size(), profiles.size());
                assertEquals(relPath, expected, profiles);
                LOGGER.info("GOOD profile for file: " + relPath);
            }
        }
    }


    @Test
    public void testAllFilesExist() {
        for (String path : EXPECTED_SINGLE.keySet()) {
            assertTrue(path, new File(RESOURCES_ROOT_PATH + path).exists());
        }
        for (String path : EXPECTED_MULTIPLE.keySet()) {
            assertTrue(path, new File(RESOURCES_ROOT_PATH + path).exists());
        }
    }
}
