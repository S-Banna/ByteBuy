// THIS WILL RETURN USER CHATS -- placeholder for build
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { rows } = await pool.query(
        "SELECT id, email FROM users WHERE id = $1",
        [userId]
    );
    if (!rows[0]) return NextResponse.json({ error: "User not found" }, { status: 401 });

    return NextResponse.json(rows[0]);
}