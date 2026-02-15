const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: "ZIoA_xYQCamhlOHciJ5lwjlA0orcO33yICP-xBuigmk", 
    baseURL: "https://api.poe.com/v1",
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message } = req.body;

        const response = await client.chat.completions.create({
            model: "aram_awareness",
            messages: [{ role: "user", content: message }],
        });

        res.status(200).json({ 
            reply: response.choices[0].message.content 
        });
    } catch (error) {
        console.error("POE Error:", error);
        res.status(500).json({ error: error.message });
    }
};
