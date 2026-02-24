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
    const {msg} = await request.json();

    const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: [
            {
                role: "developer",
                content: "You are an assistant for an online laptop store, and will help customers to decide which laptop they should buy based on their needs, preferences, and budget.",
            },
            {
                role: "user",
                content: msg,
            }
        ],
        max_output_tokens: 500,
    })

    return NextResponse.json(response);
}
