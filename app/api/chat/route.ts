import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pool } from 'pg';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function POST(request: Request) {
    try {
        const {msg} = await request.json();
        const sql = `SELECT l.id, l.model, l.cpu, l.gpu, l.ram_gb, i.price_usd FROM laptops l JOIN inventory i ON i.laptop_id = l.id;`

        const {rows} = await pool.query(sql);
        const itemsJson = JSON.stringify(rows);

        const response = await openai.responses.create({
            model: "gpt-5-mini",
            input: [
                {
                    role: "developer",
                    content: "You are an assistant for an online laptop store, and will help customers to decide which laptop they should buy based on their needs, preferences, and budget. The inventory of the store is provided in the form of a JSON array, where each item has the following properties: id, model, cpu, gpu, ram_gb, and price_usd. When a user asks for a recommendation, you should analyze their requirements and suggest the most suitable laptop(s) from the inventory. You should also provide a brief explanation for your recommendation.",
                },
                {
                    role: "system",
                    content: `Inventory JSON: ${itemsJson}`,
                },
                {
                    role: "user",
                    content: msg,
                }
            ],
        })
        
        return NextResponse.json(response.output[1]);
    } catch(err: any) {
        console.error('API /api/chat error:', err);
        return NextResponse.json({error: err?.message ?? 'internal server error'}, {status: 500})
    }
    
}
