import {Pool} from "pg";
import {NextResponse} from "next/server";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function GET(request: Request) {
    try {
        const { chatId } = await request.json();

        const sql = `SELECT chat_id, content, role FROM messages WHERE chat_id = ${chatId} ORDER BY created_at ASC;`;
    
        const { rows } = await pool.query(sql);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

}

export async function POST(request: Request) {
    
}