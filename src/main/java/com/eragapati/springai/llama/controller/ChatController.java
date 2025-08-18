package com.eragapati.springai.llama.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatClient chatClient;

    @GetMapping("/chat/{id}/ask")
    public Map<String,String> ask(
            @RequestParam(value = "token", defaultValue = "Tell me a joke")
            String token,
            @PathVariable
            long id) {
        return Map.of("response",this.chatClient.prompt().user(token).call().content());
    }
}
