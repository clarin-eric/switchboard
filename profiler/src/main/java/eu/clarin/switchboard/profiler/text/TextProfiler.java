package eu.clarin.switchboard.profiler.text;

import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.api.ProfilingException;
import org.apache.tika.detect.TextStatistics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.MediaType;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

/**
 * @author akislev
 */
public class TextProfiler implements Profiler {
    private static final Logger LOGGER = LoggerFactory.getLogger(TextProfiler.class);

    public static final String MEDIATYPE_NEGRA = "text/negra";
    public static final String MEDIATYPE_SDT = "text/sdt";

    public static final String MEDIATYPE_EXMARALDA_SIMPLE = "text/exmaralda-simple";
    public static final String MEDIATYPE_QUERY_CQP = "text/query-cqp";
    public static final String MEDIATYPE_QUERY_DDC = "text/query-ddc";
    public static final String MEDIATYPE_QUERY_DLEXDB = "text/query-dlexdb";
    public static final String MEDIATYPE_QUERY_CQL = "text/query-cql";

    public static final List<Profile> TEXT_PROFILES = Arrays.asList(
            Profile.builder().mediaType(MediaType.TEXT_PLAIN).language("und").build(),
            Profile.builder().mediaType(MEDIATYPE_QUERY_CQP).build(),
            Profile.builder().mediaType(MEDIATYPE_QUERY_DDC).build(),
            Profile.builder().mediaType(MEDIATYPE_QUERY_DLEXDB).build(),
            Profile.builder().mediaType(MEDIATYPE_QUERY_CQL).build(),
            Profile.builder().mediaType(MEDIATYPE_EXMARALDA_SIMPLE).build()
    );

    static final int TEST_BYTES_LENGTH = 4 * 1024 * 1024; // how much to test and read into a string

    static final String HEADER_NEGRA = "%% NEGRA converted from TCF";

    static final double CONLLU_MIN_LINES_FIRSTCHAR_DIGIT_HASH_EMPTY_RATIO = 0.90; // conservative - all lines start with digit, hash, or empty
    static final double CONLLU_MIN_TAB_TO_DIGITLINE_RATIO = 8.9; // each line that starts with a digit should have 9 tabs

    static final double NEGRA_MIN_TAB_TO_BYTE_RATIO = 0.10;
    static final double TEXT_MIN_SPACE_TO_BYTE_RATIO = 0.05;
    static final double EXMARALDA_SIMPLE_MIN_COLON_TO_NEWLINE_RATIO = 0.2;

    static final int DDC_CQP_MAX_QUERY_SIZE = 2 * 1024;
    static final Pattern DDC_PATTERN = Pattern.compile("[\"\\w\\s\\&\\|\\*!$#0-9@=äÄöÖüÜß]+");

    ConlluProfiler conlluProfiler = new ConlluProfiler();

    public TextProfiler() throws IOException {
    }

    @Override
    public List<Profile> profile(File file) throws IOException, ProfilingException {
        Statistics stats;
        {
            try (InputStream inputStream = new BufferedInputStream(Files.newInputStream(file.toPath()))) {
                stats = compileStatistics(inputStream);
            }
            if (stats == null) {
                return null; // control chars encountered, this looks like a binary file
            }
        }

        String header;
        {
            byte[] bytes = Files.readAllBytes(file.toPath());
            int len = Math.min(bytes.length, TEST_BYTES_LENGTH);
            header = new String(bytes, 0, len, StandardCharsets.UTF_8);
        }

        return profile(stats, header, file);
    }

    TextStatistics s = new TextStatistics();

    static class Statistics {
        int spaces = 0;
        int tabs = 0;

        int brackets = 0;
        int openBrackets = 0;
        int quotes = 0;
        int colons = 0;

        int newLines = 0;
        int emptyLines = 0;
        int linesWithTabs = 0;
        int linesStartingWithDigit = 0;
        int linesStartingWithHash = 0;

        double tabToCharRatio = 0;
        double spaceToCharRatio = 0;
        double linesStartingWithDigitOrHashOrEmptyRatio = 0;
        double tabsToLinesWithTabsRatio = 0;
        double tabsToLinesStartingWithDigitRatio = 0;
        double tabsToNewLineRatio = 0;
        double colonsToNewLineRatio = 0;
    }

    static Statistics compileStatistics(InputStream inputStream) throws IOException {
        Statistics stats = new Statistics();

        int i = 0;
        int b = 0;
        int prev = 0;

        boolean lineHasTabs = false;

        for (; i < TEST_BYTES_LENGTH; i++) {
            prev = b;
            b = inputStream.read();
            if (b < 0) {
                break;
            } else if (b < '\t' || ('\r' < b && b < ' ')) {
                return null;
            } else if (b == '"' || b == '\'') {
                stats.quotes++;
            } else if (b == '[') {
                stats.brackets++;
                stats.openBrackets++;
            } else if (b == ']') {
                stats.brackets++;
                stats.openBrackets--;
            } else if (b == '\t') {
                stats.tabs++;
                if (!lineHasTabs) {
                    stats.linesWithTabs++;
                    lineHasTabs = true;
                }
            } else if (b == '\n') {
                stats.newLines++;
                lineHasTabs = false;
            } else if (b == ':') {
                stats.colons++;
            } else if (Character.isSpaceChar(b)) {
                stats.spaces++;
            }
            if (prev == '\n') {
                if (b >= '1' && b <= '9') {
                    stats.linesStartingWithDigit++;
                } else if (b == '#') {
                    stats.linesStartingWithHash++;
                } else if (b == '\n') {
                    stats.emptyLines++;
                }
            }
        }

        if (stats.newLines == 0) {
            stats.newLines = 1;
        }

        stats.tabToCharRatio = stats.tabs / (double) i;
        stats.spaceToCharRatio = stats.spaces / (double) i;
        stats.linesStartingWithDigitOrHashOrEmptyRatio =
                (stats.linesStartingWithDigit + stats.linesStartingWithHash + stats.emptyLines) / (double) stats.newLines;
        stats.tabsToLinesWithTabsRatio = stats.tabs / (double) (stats.linesWithTabs == 0 ? 1 : stats.linesWithTabs);
        stats.tabsToLinesStartingWithDigitRatio = stats.linesStartingWithDigit == 0 ? 1.0 :
                (stats.tabs / (double) stats.linesStartingWithDigit);
        stats.tabsToNewLineRatio = stats.tabs / (double) stats.newLines;
        stats.colonsToNewLineRatio = stats.colons / (double) stats.newLines;

        return stats;
    }

    public List<Profile> profile(Statistics stats, String header, File file) throws IOException {
        if (header.startsWith(HEADER_NEGRA)) {
            Profile profile = Profile.builder().certain().mediaType(MEDIATYPE_NEGRA).build();
            return Collections.singletonList(profile);
        }

        if ((stats.tabsToLinesStartingWithDigitRatio > CONLLU_MIN_TAB_TO_DIGITLINE_RATIO) &&
                stats.linesStartingWithDigitOrHashOrEmptyRatio >= CONLLU_MIN_LINES_FIRSTCHAR_DIGIT_HASH_EMPTY_RATIO) {
            List<Profile> conlluProfileSet = conlluProfiler.profile(file);
            if (conlluProfileSet != null) {
                return conlluProfileSet;
            }
        }

        if (header.length() < DDC_CQP_MAX_QUERY_SIZE &&
                (ddcMatches(header) || cqpMatches(stats))) {
            // looks like a query, but return all text profiles to let the user choose
            return TEXT_PROFILES;
        }

        if (1 < stats.tabsToLinesWithTabsRatio && stats.tabsToLinesWithTabsRatio < 3) {
            Profile profile = Profile.builder().mediaType(MEDIATYPE_SDT).build();
            return Collections.singletonList(profile);
        }

        if (stats.tabToCharRatio > NEGRA_MIN_TAB_TO_BYTE_RATIO && stats.spaceToCharRatio < TEXT_MIN_SPACE_TO_BYTE_RATIO) {
            // could be negra
            Profile profile = Profile.builder().mediaType(MEDIATYPE_NEGRA).build();
            return Collections.singletonList(profile);
        }

        if (stats.tabToCharRatio < NEGRA_MIN_TAB_TO_BYTE_RATIO &&
                stats.spaceToCharRatio > TEXT_MIN_SPACE_TO_BYTE_RATIO &&
                stats.colonsToNewLineRatio < EXMARALDA_SIMPLE_MIN_COLON_TO_NEWLINE_RATIO) {
            // looks like text plain
            Profile profile = Profile.builder().mediaType(MediaType.TEXT_PLAIN).build();
            return Collections.singletonList(profile);
        }

        // don't know exactly
        return TEXT_PROFILES;
    }

    private boolean ddcMatches(String string) {
        return DDC_PATTERN.matcher(string).matches();
    }

    private boolean cqpMatches(Statistics stats) {
        return stats.brackets > 2 && stats.openBrackets == 0 &&
                stats.quotes > 0 && stats.quotes % 2 == 0;
    }
}
