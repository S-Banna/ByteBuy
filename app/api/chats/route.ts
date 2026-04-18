import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { rows } = await pool.query(
        `SELECT id, title, created_at FROM chats WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { title } = await req.json();
    const { rows } = await pool.query(
        `INSERT INTO chats (user_id, title, created_at) VALUES ($1, $2, NOW()) RETURNING id, title`,
        [userId, title]
    );
    return NextResponse.json(rows[0]);
}