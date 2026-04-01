import {Pool} from "pg";
import {NextResponse} from "next/server";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function GET(request: Request) {

}

export async function POST(request: Request) {
    
}