package com.eragapati.springai.llama.configuration;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.util.Objects;

@Slf4j
@Configuration
public class InMemoryVectorStoreConfig {

    @Value("${vectorstore.simple.offload.path:vectorstore_backup.json}")
    private String vectorStorePath;

    private SimpleVectorStore simpleVectorStore;

    @Bean
    public VectorStore simpleVectorStore(EmbeddingModel embeddingModel) {
        var vectorStoreFile = new File(vectorStorePath);
        this.simpleVectorStore = SimpleVectorStore.builder(embeddingModel).build();
        if (vectorStoreFile.exists() && vectorStoreFile.isFile()) {
            log.info("Loading SimpleVectorStore from file: {}", vectorStoreFile.getAbsolutePath());
            try {
                simpleVectorStore.load(vectorStoreFile);
            } catch (Exception e) {
                log.error("Error loading vector store from file: ${e.message}. Starting fresh.", e);
            }
        } else {
            log.info("No Previous backups to load... Backup location: {}", vectorStoreFile.getAbsolutePath());
        }
        return simpleVectorStore;
    }

    @PreDestroy
    public void offloadSimpleVectorStoreDataToFile() {
        if (Objects.nonNull(simpleVectorStore)) {
            var file = new File(vectorStorePath);
            System.out.println("Offloading SimpleVectorStore data into file: ${file.absolutePath}");
            try {
                simpleVectorStore.save(file);
                System.out.println("SimpleVectorStore saved successfully.");
            } catch (Exception e) {
                System.err.println("Error offloading SimpleVectorStore data to file" + e.getMessage());
            }
        } else {
            System.out.println("VectorStore bean was not initialized, skipping save.");
        }
    }
}
