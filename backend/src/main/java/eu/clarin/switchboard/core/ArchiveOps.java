package eu.clarin.switchboard.core;

import com.google.common.base.MoreObjects;
import com.google.common.io.ByteStreams;
import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.zip.ZipFile;

/**
 * Operations with archives
 */
public class ArchiveOps {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(ArchiveOps.class);

    static final long MAX_OUTLINE_ENTRIES = 4 * 1024;
    static final Predicate<ZEntry> IS_OS_SPECIFIC = e -> e.getName().startsWith("__MACOSX/");

    public static Outline extractOutlineFromZip(File zipfile) throws IOException {
        try (ZipFile zfile = new ZipFile(zipfile)) {
            List<ZEntry> outline = zfile.stream()
                    .filter(e -> !e.isDirectory() && e.getSize() > 0)
                    .map(e -> new ZEntry(e.getName(), e.getSize()))
                    .filter(IS_OS_SPECIFIC.negate())
                    .collect(Collectors.toList());
            boolean outlineIsIncomplete = false;
            if (outline.size() > MAX_OUTLINE_ENTRIES) {
                outline = outline.subList(0, (int) MAX_OUTLINE_ENTRIES);
                outlineIsIncomplete = true;
            }
            return new Outline(outline, outlineIsIncomplete);
        }
    }

    public static Outline extractOutlineFromTar(File tarfile) throws IOException {
        try (BufferedInputStream fis = new BufferedInputStream(new FileInputStream(tarfile));
             TarArchiveInputStream tais = new TarArchiveInputStream(fis)) {
            List<ZEntry> outline = new ArrayList<>();
            boolean outlineIsIncomplete = false;
            for (TarArchiveEntry entry = tais.getNextTarEntry(); entry != null; entry = tais.getNextTarEntry()) {
                if (tais.canReadEntryData(entry) && !entry.isDirectory() && entry.getSize() > 0) {
                    if (outline.size() >= MAX_OUTLINE_ENTRIES) {
                        outlineIsIncomplete = true;
                        break;
                    }
                    outline.add(new ZEntry(entry.getName(), entry.getSize()));
                }
            }
            return new Outline(outline, outlineIsIncomplete);
        }
    }

    public static InputStream extractFileFromTar(File archiveFile, String archiveEntry) throws IOException {
        BufferedInputStream fis = new BufferedInputStream(new FileInputStream(archiveFile));
        TarArchiveInputStream tais = new TarArchiveInputStream(fis);
        for (ArchiveEntry entry = tais.getNextEntry(); entry != null; entry = tais.getNextEntry()) {
            if (entry.getName().equals(archiveEntry) && tais.canReadEntryData(entry)) {
                InputStream entryStream = ByteStreams.limit(tais, entry.getSize());
                return new DependentInputStream(entryStream, tais);
            }
        }
        return null;
    }

    /**
     * Utility class that wraps an inputstream and takes another additional
     * input stream. All streams are closed on <pre>close()</pre>.
     */
    private static class DependentInputStream extends InputStream implements Closeable {
        InputStream delegate;
        InputStream dependent;

        public DependentInputStream(InputStream delegate, InputStream dependent) {
            this.delegate = delegate;
            this.dependent = dependent;
        }

        @Override
        public int read() throws IOException {
            return delegate.read();
        }

        @Override
        public void close() throws IOException {
            super.close();

            try {
                delegate.close();
            } catch (IOException xc) {
                dependent.close();
                throw xc;
            }

            dependent.close();
        }
    }


    public static class Outline {
        List<ZEntry> outline;
        boolean outlineIsIncomplete;

        public Outline(List<ZEntry> outline, boolean outlineIsIncomplete) {
            this.outline = outline;
            this.outlineIsIncomplete = outlineIsIncomplete;
            outline.sort(Comparator.comparing(ZEntry::getName));
        }

        public List<ZEntry> getOutline() {
            return outline;
        }

        public boolean isOutlineIsIncomplete() {
            return outlineIsIncomplete;
        }
    }

    public static class ZEntry {
        String name;
        long size;

        public ZEntry(String name, long size) {
            this.name = name;
            this.size = size;
        }

        public String getName() {
            return name;
        }

        public long getSize() {
            return size;
        }

        @Override
        public String toString() {
            return MoreObjects.toStringHelper(this)
                    .add("name", name)
                    .add("size", size)
                    .toString();
        }
    }

}
