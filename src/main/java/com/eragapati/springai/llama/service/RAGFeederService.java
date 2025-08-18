package com.eragapati.springai.llama.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FilenameFilter;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class RAGFeederService {
    @Value("${vectorstore.simple.offload.path:src/main/resources/vectorstore_backup.json}")
    private String backFileNamePath;

    public void loadFromFiles(SimpleVectorStore simpleVectorStore, String ragFeederPath) {
        if (StringUtils.isBlank(ragFeederPath)) throw new RuntimeException();

        List<Document> documents = new ArrayList<>();
        File directory = new File(ragFeederPath);
        FilenameFilter textFiles = (dir, name) -> name.toLowerCase().endsWith(".txt");
        File[] files = directory.listFiles(textFiles);

        if (Objects.nonNull(files)) {
            System.out.println(files.length);
            for (File file : files) {
                System.out.println("working on " + file.getAbsolutePath());
                try {
                    documents.add(Document.builder()
                            .text(Files.readString(file.toPath()))
                            .metadata("fileName", file.getName())
                            .build());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        var textSplitter = new TokenTextSplitter();
        var chunkedDocuments = textSplitter.apply(documents);

        try {
            simpleVectorStore.add(chunkedDocuments);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void offloadToFile(SimpleVectorStore simpleVectorStore) {
        if (Objects.nonNull(simpleVectorStore)) {
            var file = new File(backFileNamePath);
            log.info("Offloading SimpleVectorStore data into file: ${file.absolutePath}");
            try {
                simpleVectorStore.save(file);
                log.info("SimpleVectorStore saved successfully.");
            } catch (Exception e) {
                log.error("Error offloading SimpleVectorStore data to file" + e.getMessage());
            }
        } else {
            log.error("VectorStore bean was not initialized, skipping save.");
        }
    }

}
