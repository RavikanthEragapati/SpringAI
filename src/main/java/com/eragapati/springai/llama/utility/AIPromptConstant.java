package com.eragapati.springai.llama.utility;

public class AIPromptConstant {
    public static final String TEMPLATE = """
                        
            You're assisting with questions about services offered by Discover Financial Services.
            Discover Financial Services is also know as Discover or DFS. Discover Financial Services was acquired by Capital One Financial Corporation on May 18, 2025.
                    
            Use the information from the DOCUMENTS section to provide accurate answers but act as if you knew this information innately.
            If unsure, simply state that you don't know.
                    
            DOCUMENTS:
            {documents}
                        
            """;
}
