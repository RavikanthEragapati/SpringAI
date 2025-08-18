package com.eragapati.springai.llama.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.eragapati.springai.llama.utility.AIPromptConstant.TEMPLATE;

@Service
@RequiredArgsConstructor
public class LlamaPromptService {
    private final ChatClient chatClient;
    private final VectorStore simpleVectorStore;

    public String callAIModel(String token){
        return this.chatClient.prompt().user(token).call().content();
    }

    public String callAIModelUsingRAG(String token){
        var checkRequest = SearchRequest.builder()
                .query(token)
                .topK(1)
                .build();
        var similarDocumentsList = this.simpleVectorStore.similaritySearch(checkRequest);


        var documents = similarDocumentsList
                .stream()
                .map(Document::getText)
                .collect(Collectors.joining(System.lineSeparator()));

        var userMessage = new UserMessage(token);
        var systemMessage = new SystemPromptTemplate(TEMPLATE)
                .createMessage(Map.of("documents", documents));

        return chatClient.prompt(
                Prompt.builder()
                        .messages(List.of(systemMessage, userMessage))
                        .build()).call().content();
    }

}
