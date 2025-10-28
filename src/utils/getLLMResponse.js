import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import axios from "axios";

export const getLLMResponse = async (systemPrompt, chatId, userMessage) => {

    const BOT_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    await axios.post(BOT_URL, { chat_id: chatId, text: 'Thinking..' });

    const finalPrompt = `###System: ${systemPrompt} ###User : ${userMessage}`;

    const inferenceUrl = process.env.INFERENCE_URL;

    const model = process.env.MODEL;

    const llmResp = await fetch(inferenceUrl, {
        
        method: 'POST',
        
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({
          
            model: model,
          
            prompt: finalPrompt,
          
            stream: false
        
        })
    
    });

    const json = await llmResp.json();

    const llmOutput = json.response.trim();

    return llmOutput;

}