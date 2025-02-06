import { NextResponse } from "next/server";
import connectDB from "@/connectDB";
import User from "@/schema";

export async function POST(req) {
    await connectDB();

    const { email, _id } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove the habit with the given _id from the user's habits array
    user.habits = user.habits.filter(habit => habit._id.toString() !== _id);

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: "Habit removed successfully" }, { status: 200 });
}