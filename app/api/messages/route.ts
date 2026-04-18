import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    if (!chatId) return NextResponse.json({ error: "Missing chatId" }, { status: 400 });

    const { rows } = await pool.query(
        `SELECT id, content, role FROM messages WHERE chat_id = $1 ORDER BY created_at ASC`,
        [chatId]
    );
    return NextResponse.json(rows);
}

export async function POST(request: Request) {
    const { chatId, content, role } = await request.json();
    await pool.query(
        `INSERT INTO messages (chat_id, content, role, created_at) VALUES ($1, $2, $3, NOW())`,
        [chatId, content, role]
    );
    return NextResponse.json({ message: "Message added successfully" });
}