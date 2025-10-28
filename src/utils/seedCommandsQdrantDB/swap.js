import dotenv from "dotenv";
dotenv.config();
import { openai } from "../getOpenAIClient.js";
import { qdrant } from "../getQdrantDB.js";

const collectionName = process.env.QDRANT_COLLECTION_NAME;

const collections = await qdrant.getCollections();

const exists = collections.collections.some(c => c.name === collectionName);

if(!exists) {

    await qdrant.createCollection(collectionName, {

        vectors: {

            default: {

                size: 1536,

                distance: "Cosine"

            }
        }
    
    });

    console.log(`Created collection: ${collectionName}`);

} else {

    console.log(`Collection: ${collectionName} already exists!`);
}

const text = process.env.SWAP_TEXT;

const embeddingResp = await openai.embeddings.create({

    model: "text-embedding-3-small",
        
    input: text
    
});

const vector = embeddingResp.data[0].embedding;

await qdrant.upsert(collectionName, {

    points: [

        {

            id: 5,

            vector: { default: vector },

            payload: {

                command_id: 5,

                command_name: "swap",
                    
                systemPrompt: process.env.SWAP_PROMPT
            }
        }
    ]

});

console.log("Seeded swap command into Qdrant DB.");