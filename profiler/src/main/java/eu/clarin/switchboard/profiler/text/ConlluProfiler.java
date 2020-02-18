package eu.clarin.switchboard.profiler.text;

import eu.clarin.switchboard.profiler.api.Profile;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.profiler.general.OptimaizeLanguageDetector;

import java.io.*;
import java.nio.file.Files;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class ConlluProfiler implements Profiler {

    public static final String MEDIATYPE_CONLLU = "application/conllu";

    private static final String TAB = "\\t";
    private static final String UNDERSCORE = "_";
    private static final String HASH = "#";
    private static final String EQUAL = "=";

    private static final Pattern commentLine = Pattern.compile("^#");
    private static final Pattern blankLinePattern = Pattern.compile("^\\s*$");
    private static final Pattern tabPattern = Pattern.compile(TAB);
    private static final Pattern hashPattern = Pattern.compile(HASH);
    private static final Pattern sentIdPattern = Pattern.compile("^# sent_id\\s*=?\\s*(\\S+)");
    private static final Pattern commentTextLine = Pattern.compile("^# text\\s*=\\s*(.+)");
    private static final Pattern idRangePattern = Pattern.compile("(\\d+)-(\\d+)");
    private static final Pattern idPattern = Pattern.compile("(\\d+)");

    static final int MAX_LINE_TO_CONSIDER_FOR_FINDING_ANNOTATION = 1000;

    static final int CONLLU_FORM_COLUMN_INDEX = 1;
    static final List<String> CONLLU_COLUMN_NAME = Arrays.asList(
            "conllu.ids", "conllu.forms", "conllu.lemmas", "conllu.upostags", "conllu.xpostags",
            "conllu.feats", "conllu.heads", "conllu.deprels", "conllu.deps", "conllu.misc");

    OptimaizeLanguageDetector languageDetector = new OptimaizeLanguageDetector();

    public ConlluProfiler() throws IOException {
    }

    @Override
    public List<Profile> profile(File file) throws IOException {
        List<String> texts = new ArrayList<>();
        Map<Integer, List<String>> annotationLayers = new HashMap<>();

        try (InputStream is = new BufferedInputStream(Files.newInputStream(file.toPath()))) {
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(is));

            String line = null;
            int index = 0;
            while ((line = bufferedReader.readLine()) != null) {
                line = line.trim();
                String[] columns = line.split(TAB);
                if (matchPattern(commentLine, line).isPresent()) {
                    if (matchPattern(commentTextLine, line).isPresent()) {
                        String[] annotations = line.split(EQUAL);
                        if (annotations.length > 1) {
                            texts.add(annotations[1]);
                        }
                    }
                } else if (columns.length > 1 && matchPattern(idPattern, columns[0]).isPresent()) {
                    if (index == MAX_LINE_TO_CONSIDER_FOR_FINDING_ANNOTATION) {
                        break;
                    }
                    String[] columnList = line.split(TAB);
                    if (columnList.length != CONLLU_COLUMN_NAME.size()) {
                        // Invalid conllu: Number of columns in annoation lines mismatch
                        return null;
                    }
                    for (int column = 0; column < columnList.length; column++) {
                        List<String> columnStrings = new ArrayList<>();
                        if (!columnList[column].equals(UNDERSCORE)) {
                            if (!isColumnInfoValid(column, columnList[column])) {
                                // Invalid conllu: wrong annotation
                                return null;
                            }
                            if (annotationLayers.containsKey(column)) {
                                columnStrings = annotationLayers.get(column);
                            }
                            columnStrings.add(columnList[column]);
                            annotationLayers.put(column, columnStrings);
                        }
                    }
                    index++;
                } else if (isInvalidLine(line)) {
                    // Invalid conllu
                    return null;
                }
            }
        }

        if (texts.isEmpty() && annotationLayers.isEmpty()) {
            return null;
        }

        Profile.Builder profileBuilder = Profile.builder().mediaType(MEDIATYPE_CONLLU);

        if (!texts.isEmpty()) {
            String text = String.join(" ", texts);
            profileBuilder.language(languageDetector.detect(text));
        } else if (!annotationLayers.isEmpty() && annotationLayers.get(CONLLU_FORM_COLUMN_INDEX) != null) {
            String text = String.join(" ", annotationLayers.get(CONLLU_FORM_COLUMN_INDEX));
            profileBuilder.language(languageDetector.detect(text));
        }

        for (int column : annotationLayers.keySet()) {
            if (column < CONLLU_COLUMN_NAME.size()) {
                List<String> columnStrings = annotationLayers.get(column);
                if (!columnStrings.isEmpty()) {
                    profileBuilder.feature(CONLLU_COLUMN_NAME.get(column));
                }
            }
        }

        Profile profile = profileBuilder.build();
        return Collections.singletonList(profile);
    }

    private boolean isInvalidLine(String trimLine) {
        return (!matchPattern(commentLine, trimLine).isPresent()
                && !matchPattern(blankLinePattern, trimLine).isPresent()
                && !matchPattern(idRangePattern, trimLine).isPresent());
    }

    private boolean isColumnInfoValid(int column, String annoatatedLine) {
        if (column == 0) {
            return matchPattern(idPattern, annoatatedLine).isPresent() ||
                    matchPattern(idRangePattern, annoatatedLine).isPresent();
        }
        return true;
    }

    private Optional<String> matchPattern(Pattern pattern, String stringToMatch) {
        Matcher matcher = pattern.matcher(stringToMatch);
        if (matcher.find()) {
            return Optional.of(matcher.group());
        }
        return Optional.empty();
    }
}
