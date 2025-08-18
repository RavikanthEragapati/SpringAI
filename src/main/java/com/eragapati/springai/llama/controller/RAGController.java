package com.eragapati.springai.llama.controller;

import com.eragapati.springai.llama.service.RAGFeederService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RAGController {

    private final SimpleVectorStore simpleVectorStore;
    private final RAGFeederService ragFeederService;

    @PostMapping("/rag/load")
    public String load(@RequestParam("fromAbsolutePath") String loadFromPath){
        ragFeederService.loadFromFiles(simpleVectorStore,loadFromPath);
        return "SUCCESS";
    }


    @PostMapping("/rag/offloadToFile")
    public String offLoadToFile(){
        ragFeederService.offloadToFile(simpleVectorStore);
        return "SUCCESS";
    }

}
