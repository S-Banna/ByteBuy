import { NextResponse } from "next/server";
import OpenAI from "openai";
import { pool } from "@/lib/db";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let cachedItems: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000;

async function getInventory() {
    if (!cachedItems || Date.now() - lastFetchTime > CACHE_DURATION) {
        const { rows } = await pool.query(`
            SELECT
                p.name,
                p.product_type,
                p.cpu_model,
                p.gpu_model,
                p.ram_gb,
                p.storage_gb,
                p.vram_gb,
                p.specs,
                b.name AS brand,
                s.name AS shop,
                i.price_usd,
                i.quantity,
                i.product_url
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            JOIN inventory i ON i.product_id = p.id
            JOIN shops s ON i.shop_id = s.id
            WHERE i.quantity > 0
            ORDER BY b.name, p.name
        `);
        cachedItems = rows;
        lastFetchTime = Date.now();
    }
    return cachedItems;
}

export async function POST(request: Request) {
    try {
        const { message, history } = await request.json();
        // history is array of {role: "user"|"assistant", content: string}

        const items = await getInventory();
        const itemsJson = JSON.stringify(items);

        const messages = [
            {
                role: "system" as const,
                content: `You are an assistant for ByteBuy, an online computer hardware store. Help customers find products based on their needs and budget. Only recommend products that are in stock. Here is the current inventory: ${itemsJson}`
            },
            ...history,
            { role: "user" as const, content: message }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            stream: false,  // flip to true when you're ready to wire streaming
        });

        const reply = response.choices[0].message.content ?? "";
        return NextResponse.json({ reply });

    } catch (err: any) {
        console.error("API /api/chat error:", err);
        return NextResponse.json({ error: err?.message ?? "internal server error" }, { status: 500 });
    }
}