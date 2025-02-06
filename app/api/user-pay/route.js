import { NextResponse } from "next/server";
import connectDB from "@/connectDB";
import User from "@/schema";

export async function POST(req) {
    await connectDB();

    // Parse the request body
    const { email } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });

    if(!user) {
        return NextResponse.json({ message: "No USER" });
    }

    user.payed = true;

    // Update the progress for the habit
   

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: "Habit updated successfully" });
}