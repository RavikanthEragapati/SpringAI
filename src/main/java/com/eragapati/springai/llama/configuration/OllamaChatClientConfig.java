package com.eragapati.springai.llama.configuration;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OllamaChatClientConfig {

    @Bean
    ChatClient buildOllamaChatClient(ChatModel chatModel){
        return ChatClient.builder(chatModel).build();
    }
}
