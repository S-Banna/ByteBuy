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

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
    });

    response.cookies.set("user_id", user.id, {
      httpOnly: true,   
      secure: true,     
      sameSite: "strict",
      path: "/",
    });

    return response;

  } catch (err: any) {
    console.error("Login error:", err);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}