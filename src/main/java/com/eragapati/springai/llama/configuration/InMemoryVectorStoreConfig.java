package com.eragapati.springai.llama.configuration;

import com.eragapati.springai.llama.service.RAGFeederService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class InMemoryVectorStoreConfig {

    @Value("${vectorstore.simple.offload.path:/src/main/resources/vectorstore_backup.json}")
    private String restoreFile;

    private SimpleVectorStore simpleVectorStore;

    @Bean
    public VectorStore simpleVectorStore(EmbeddingModel embeddingModel) {
        this.simpleVectorStore = SimpleVectorStore.builder(embeddingModel).build();

        var file = new File(restoreFile);
        if (file.exists() && file.isFile()) {
            log.info("Restore SimpleVectorStore from file: {}", file.getAbsolutePath());
            try {
                simpleVectorStore.load(file);
            } catch (Exception e) {
                log.error("Error loading vector store from file: ${e.message}. Starting fresh.", e);
            }
        } else {
            log.info("No Previous backups to load... Backup location: {}", file.getAbsolutePath());
        }
        return simpleVectorStore;
    }
}
