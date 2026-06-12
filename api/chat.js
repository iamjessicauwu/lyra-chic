export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).end();

    const { conversationHistory } = req.body;

    const SYSTEM_PROMPT = process.env.LYRA_SYSTEM_PROMPT;
    
    const filtered = conversationHistory
    .filter((m, i) => {
        if (i === 0) return m.role === 'user';
        return m.role !== conversationHistory[i - 1].role;
    });

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...filtered
                ]
            }),
        });

        const data = await response.json();

        if (response.status === 429) {
            return res.status(200).json({
                content: [{ text: "I'm a little overwhelmed right now! Please come back later, sit for a moment and try again 😊" }]
            });
        }

        const text = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";
        res.status(200).json({ content: [{ text }] });
    } catch (err) {
        console.error('Error fetching chat handler', err);
        res.status(500).json({
            error: "Something went wrong when connecting to chat API. Please try again later."
        })
    }

}
