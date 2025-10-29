import { fetchActiveBinArrayInfo } from "../utils/fetchActiveBinArrayInfo.js";
import { generateBinChart } from "../utils/chart.js";
import bot from "../utils/bot.js";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export const sendBinChart = async (userId, chatId, pair) => {

    console.log(`User: ${userId} wants to view the chart for pool: ${pair}`);

    const BOT_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    await axios.post(BOT_URL, { chat_id: chatId, text: 'Fetching liquidity information...'});

    const bins = await fetchActiveBinArrayInfo(pair);

    await axios.post(BOT_URL, { chat_id: chatId, text: 'Generating liquidity chart...'});
  
    const buffer = await generateBinChart(bins);

    await bot.sendPhoto(chatId, buffer, {
        
        caption: `Here's the liquidity distribution around the active bin for pool ${pair}`
    
    });
};