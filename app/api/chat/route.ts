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
        const {message, conversationHistory} = await request.json();
        const sql = `SELECT l.id, l.model, l.cpu, l.gpu, l.ram_gb, i.price_usd FROM laptops l JOIN inventory i ON i.laptop_id = l.id;`

        const {rows} = await pool.query(sql);
        const itemsJson = JSON.stringify(rows);
        
        const messages = [
                {
                    role: "developer",
                    content: `You are an assistant for an online computer hardware store, and will help customers to decide what to buy based on their needs, preferences, and budget. The inventory of the store may contain different products such as laptops, desktops, individual CPUs, GPUs, RAM modules, etc, and each product has a price in USD with its specifications. The inventory is provided in JSON format. Only recommend products that are in stock. Inventory JSON: ${itemsJson}`,
                },
                ...(conversationHistory || []),
                {
                    role: "user",
                    content: message,
                },
            ]

        const response = await openai.responses.create({
            model: "gpt-5-mini",
            input: messages
        })
        
        return NextResponse.json(response);
    } catch(err: any) {
        console.error('API /api/chat error:', err);
        return NextResponse.json({error: err?.message ?? 'internal server error'}, {status: 500})
    }
    
}
