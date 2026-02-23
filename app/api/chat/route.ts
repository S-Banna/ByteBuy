import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
    const {msg} = await request.json();

    const response = await openai.responses.create({
        model: "gpt-5 mini",
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
    })

    return NextResponse.json(response);
}
