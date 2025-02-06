//add a sessionID in the text to ignore the sender who sent

import { NextResponse } from "next/server";
import connectDB from "@/connectDB"
import User from "@/schema"

export async function POST(req) {
    await connectDB();
    const { email, name, desc, days, emoji } = await req.json()

    const newHabit = { name: name ?? "", progress: [], desc: desc ?? ".", days: days ?? [], emoji: emoji ?? "" }; // Initialize progress with the date

    const user = await User.updateOne({ email: email }, { $push: { habits: newHabit } })

    return NextResponse.json(user); // Return the newly created habit with a 201 status
}