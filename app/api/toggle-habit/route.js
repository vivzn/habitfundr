import { NextResponse } from "next/server";
import connectDB from "@/connectDB";
import User from "@/schema";

export async function POST(req) {
    await connectDB();

    // Parse the request body
    const { email, habitName, date, completed } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
        return NextResponse.json({ message: "User  not found" }, { status: 404 });
    }

    // Find the habit by name
    const habit = user.habits.find(h => h.name === habitName);

    if (!habit) {
        return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    // Update the progress for the habit
    const progress = habit.progress;

    if (completed) {
        // If the habit is being marked as completed, add the date to progress
        progress.push({ date });
    } else {
        // If the habit is being marked as not completed, remove the date from progress
        const index = progress.findIndex(entry => entry.date === date);
        if (index !== -1) {
            progress.splice(index, 1);
        }
    }

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: "Habit updated successfully" });
}