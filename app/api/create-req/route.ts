//add a sessionID in the text to ignore the sender who sent

import { NextResponse } from "next/server";
import connectDB from "@/connectDB"
import User from "@/schema"
import Req from "@/schema2";

export async function POST(req: Request) {
    await connectDB();
    const { email, reason } = await req.json()

    // let toRes;

    // const data = await User.findOne({ email });

    // if (data) {
    //     //user exists, just sign in

    //     toRes = {what: "have"}



    // } else {
    //     //make new user


    //     const person = new User({
    //         userName,
    //         photoURL,
    //         email,
    //         habits: [],

           
    //     })

    //     await person.save()

    //     toRes = {what: "new one"}
    // }


    // Find the user by email
    const user = await User.findOne({ email });

    if (user) {
        // Update the user's refund state to "-"
        user.refund = "-";
        await user.save();

        const newReq = new Req({ email, reason });
        await newReq.save();

        return NextResponse.json({ success: true, message: "User's refund state updated successfully." });

    }

    


    return NextResponse.json({ email, reason });
}