package eu.clarin.switchboard.core;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.Future;

public class FileInfoFuture {
    private final UUID id;
    private final Instant creation;
    private final Future<FileInfo> future;

    public FileInfoFuture(UUID id, Future<FileInfo> future) {
        this.id = id;
        this.future = future;
        this.creation = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Instant getCreation() {
        return creation;
    }

    public Future<FileInfo> getFileInfoFuture() {
        return future;
    }
}
