import { NextResponse } from "next/server";
import connectDB from "@/connectDB";
import User from "@/schema";

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const user = await User.findOne({ email });
    const habits = user ?? {};

    return NextResponse.json({ habits }); // Return the habits
}