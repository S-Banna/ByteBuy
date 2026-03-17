import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pool } from "pg";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let cachedItems: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; 

async function getInventory() {
  if (!cachedItems || Date.now() - lastFetchTime > CACHE_DURATION) {
    console.log("Fetching inventory from DB...");

    const sql = `
      SELECT
        l.id,
        b.name AS brand,
        l.model,
        s.name AS store,
        l.cpu,
        l.gpu,
        l.ram_gb,
        l.storage_gb,
        l.storage_type,
        l.screen_size,
        l.os,
        i.price_usd,
        i.quantity
      FROM laptops l
      JOIN brands b ON l.brand_id = b.brand_id
      JOIN stores s ON l.store_id = s.id
      JOIN inventory i ON i.laptop_id = l.id AND i.store_id = l.store_id
      ORDER BY brand, model;
    `;

    const { rows } = await pool.query(sql);

    cachedItems = rows;
    lastFetchTime = Date.now();
  } else {
    console.log("Using cached inventory...");
  }

  return cachedItems;
}

export async function POST(request: Request) {
  try {
    const { message, previousMessageId } = await request.json();

    const items = await getInventory();
    const itemsJson = JSON.stringify(items);

    const gptRequest: any = {
      model: "gpt-5-mini",
      input: [
        {
          role: "developer",
          content: `You are an assistant for an online computer hardware store. Help customers choose products based on their needs, preferences, and budget. Only recommend products that are in stock. Inventory JSON: ${itemsJson}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    if (previousMessageId) {
      gptRequest.previous_response_id = previousMessageId;
    }
    const response = await openai.responses.create(gptRequest);

    const reply = response.output_text ?? "";

    return NextResponse.json({
      reply,
      responseId: response.id,
    });

  } catch (err: any) {
    console.error("API /api/chat error:", err);

    return NextResponse.json(
      { error: err?.message ?? "internal server error" },
      { status: 500 }
    );
  }
}
