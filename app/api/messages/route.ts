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
        const { userID } = await request.json();

        const sql = `SELECT id, content, role FROM chats WHERE chat_id = ${userID} ORDER BY created_at ASC;`;
    
        const { rows } = await pool.query(sql);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

}

export async function POST(request: Request) {
    try {
        const {chatId, userID, content, role} = await request.json();

        const sql = `INSERT INTO messages (id, user_id, content, role, created_at) VALUES (${chatId}, ${userID}, '${content}', '${role}', NOW())`;

        await pool.query(sql);

        return NextResponse.json({ message: "Message added successfully" });
    } catch (error) {
        console.error("Error adding message:", error);
        return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
    }
}