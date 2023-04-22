// pages/api/llm.js
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { question } = req.body;
            // Replace with your actual LLM backend API call
            const response = await fetch('https://your-llm-backend-api-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other required headers, e.g. API key
                },
                body: JSON.stringify({ question }),
            });

            if (response.ok) {
                const result = await response.json();
                res.status(200).json({ answer: result.answer });
            } else {
                res.status(500).json({ error: 'Error connecting to the LLM backend.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error connecting to the LLM backend.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
