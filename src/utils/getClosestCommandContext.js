import dotenv from "dotenv";
dotenv.config();
import { openai } from "./getOpenAIClient.js";
import { qdrant } from "./getQdrantDB.js";

export async function getClosestCommandContext(userMessage) {

    const embeddingResp = await openai.embeddings.create({

        model: "text-embedding-3-small",
        
        input: userMessage
    
    });

    const queryVector = embeddingResp.data[0].embedding;

    const searchResults = await qdrant.search(process.env.QDRANT_COLLECTION_NAME, {
        
        vector: {
          
            name: "default",
          
            vector: queryVector,
        
        },
        
        limit: 1,
    
    });

    if (!searchResults.length) return null;

    const top = searchResults[0];

    console.log('The closest command is: ', top.payload.command_name);
    
    console.log('The similarity score is: ', top.score);
    
    return {
        
        command_name: top.payload.command_name,
        
        command_text: top.payload.systemPrompt,
        
        score: top.score,
    
    };

}