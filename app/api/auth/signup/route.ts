import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // for now, sign ins only for "buyer" role
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email",
      [email, hashedPassword, "buyer"]
    );

    const user = result.rows[0];

    return NextResponse.json(user);

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: "User may already exist" },
      { status: 500 }
    );
  }
}