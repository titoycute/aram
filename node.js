const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: "ZIoA_xYQCamhlOHciJ5lwjlA0orcO33yICP-xBuigmk",  // or process.env.POE_API_KEY
    baseURL: "https://api.poe.com/v1",
});

const chat = await client.chat.completions.create({
    model: "aram_awareness",
    messages: [{
      role: "user",
      content: "Hello world"
    }]
});

console.log(chat.choices[0].message.content);