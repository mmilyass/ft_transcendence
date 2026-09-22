package com.example.demo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

final class DotenvLoader {

    private DotenvLoader() {}

    static void load() {
        load(Path.of(".env"));
    }

    static void load(Path path) {
        if (!Files.isReadable(path)) {
            return;
        }

        List<String> lines;
        try {
            lines = Files.readAllLines(path);
        } catch (IOException e) {
            System.err.println("Failed to read " + path + ": " + e.getMessage());
            return;
        }

        for (String rawLine : lines) {
            String line = rawLine.strip();
            if (line.isEmpty() || line.startsWith("#")) {
                continue;
            }

            int eq = line.indexOf('=');
            if (eq <= 0) {
                continue;
            }

            String key = line.substring(0, eq).strip();
            String value = line.substring(eq + 1).strip();

            if (value.length() >= 2
                    && ((value.startsWith("\"") && value.endsWith("\""))
                    || (value.startsWith("'") && value.endsWith("'")))) {
                value = value.substring(1, value.length() - 1);
            }

            if (System.getenv(key) != null || System.getProperty(key) != null) {
                continue; // a real env var or -D flag already set this — don't override it
            }

            System.setProperty(key, value);
        }
    }
}
