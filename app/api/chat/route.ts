import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pool } from 'pg';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        require: true,
    }
})

export async function POST(request: Request) {
    try {
        const {message, previousMessageId} = await request.json();
        const sql = `SELECT l.id, l.model, l.cpu, l.gpu, l.ram_gb, i.price_usd FROM laptops l JOIN inventory i ON i.laptop_id = l.id;`

        const {rows} = await pool.query(sql);
        const itemsJson = JSON.stringify(rows);
        let response;
        if (previousMessageId) {
            response = await openai.responses.create({
                model: "gpt-5-mini",
                input: [
                    {
                        role: "developer",
                        content: `You are an assistant for an online computer hardware store, and will help customers to decide what to buy based on their needs, preferences, and budget. The inventory of the store may contain different products such as laptops, desktops, individual CPUs, GPUs, RAM modules, etc, and each product has a price in USD with its specifications. The inventory is provided in JSON format. Only recommend products that are in stock. Inventory JSON: ${itemsJson}`,
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
                previous_response_id: previousMessageId,
            })
        } else {
            response = await openai.responses.create({
                model: "gpt-5-mini",
                input: [
                    {
                        role: "developer",
                        content: `You are an assistant for an online computer hardware store, and will help customers to decide what to buy based on their needs, preferences, and budget. The inventory of the store may contain different products such as laptops, desktops, individual CPUs, GPUs, RAM modules, etc, and each product has a price in USD with its specifications. The inventory is provided in JSON format. Only recommend products that are in stock. Inventory JSON: ${itemsJson}`,
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
            })
        }
        const output = {response: response.output[1].content[0].text, responseId: response.id};
        return NextResponse.json(output);
    } catch(err: any) {
        console.error('API /api/chat error:', err);
        return NextResponse.json({error: err?.message ?? 'internal server error'}, {status: 500})
    }
    
}
