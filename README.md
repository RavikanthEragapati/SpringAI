# Spring AI project :rocket: with Ollama and Retrieval-augmented generation (RAG)

> [!NOTE]
> Ollama is an open-source platform that enables users to run LLaMA and other LLMs directly on their local machines.
> 
> Llama(Large Language Model Meta AI ) is the LLM, It is a family of open-source large language models developed by Meta.

## Objective: 
* Setup and Ollama server and ollama CLI (locally/offline).
* Download and run llama3.2 model (3B parameter, 2.0GB size).
* Interact with LLM though Chat GUI applicaiton, CLI and through API.
* Build a Spring AI project that talks to Ollama server and uses our llama3.2 model to respond to our questions.
* Impliment RAG using in-memory VectorStore(`SIMPLE`).
* Feed articles and document into VectorStore using llama3.2 Embedding model.
* __Expose 5 endpoints:__
    * `GET /chat/{ID}/ask?token={QUESTION}` - To ask a question without using RAG.
    * `GET /chat/{ID}/askUsingRAG?token={QUESTION}` - To ask a question using RAG.
    * `GET /chat/{ID}/history` - Look at last 5 chat history.
    * `POST /rag/load` - To replenish RAG with fresh new up-to-date information.
    * `POST /rag/offload` - To offload all the data in VectorStore into a JSON file and look at embeddings.
* Add In-Memory Chat Memory Repository to maintain Chat History.

## Where can I learn more about SpringAI?
There is no better place to learn from then the direct source i.e. https://docs.spring.io/spring-ai/reference/index.html

## Setup Ollama on MAC (For Windows and Linux instructions see [Winsows](https://github.com/ollama/ollama/blob/main/docs/windows.md) / [Linux](https://github.com/ollama/ollama/blob/main/docs/linux.md))

- Download and install `Ollama.dmg` from https://ollama.com/download (ollama CLI should be installed along with the Ollama chat GUI client and Ollama )
- Choose model that you would like to work with from https://ollama.com/library
  (For the sake of this demo and the limitation of laptop(MacBook Air Apple M2 8GB) I'm choosing Llama 3.2(2.0GB size, 3billion parameters)
- Open terminal and run
``` cmd
    ollama run llama3.2
```
- You are all set :thumbsup: by default Ollama server runs on port "**11434**" but if you would like to change you can do so using the below command
```cmd
launchctl setenv OLLAMA_HOST "0.0.0.0:11434"
```
- Open Ollama settings and put Ollama on AirPlane mode - This will make sure our data stays local by disabling Turbo mode and web search.
<img width="640" height="480" alt="image" src="https://github.com/user-attachments/assets/c0dde131-5536-4c03-aace-3c0dc47234b3" />


## Interacting with Ollama model
### Using Terminal
<img width="640" height="480" alt="image" src="https://github.com/user-attachments/assets/2743a64c-5e5f-483a-8e99-4daa6371617d" />

---
### Using Ollama Chat GUI client
<img width="640" height="480" alt="image" src="https://github.com/user-attachments/assets/41455b5a-42b1-45e1-be2c-44066402bb3d" />

---
### Using Ollama APIs - [Full API list](https://github.com/ollama/ollama/blob/main/docs/api.md)
<img width="640" height="480" alt="image" src="https://github.com/user-attachments/assets/0e1869a4-5c8a-42de-9300-2f57b0d178ca" />

---
### Using Spring boot applicaiton using SpringAI project 

---
## Building SpringAI project

- As always we start by open [Spring Initializr portal](https://start.spring.io/)
- Choose the following dependencies
   * Lombok
   * Spring-WebFlux or Spring-Web
   * Spring-ai-pdf-document-reader
   * Spring-ai-starter-model-ollama
   * Spring-ai-tika-document-reader
   * Spring-ai-starter-model-chat-memory (If time permits)
- Download/Generate project, unzip and follow through with me

## Additional links:
https://medium.com/@gareth.hallberg_55290/part-7-implementing-rag-part-1-embeddings-and-vector-stores-with-spring-ai-6ae97926d13e
