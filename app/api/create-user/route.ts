//add a sessionID in the text to ignore the sender who sent

import { NextResponse } from "next/server";
import connectDB from "@/connectDB"
import User from "@/schema"

export async function POST(req: Request) {
    await connectDB();
    const { userName, photoURL, email } = await req.json()

    let toRes;

    const data = await User.findOne({ email });

    if (data) {
        //user exists, just sign in

        toRes = {what: "have"}



    } else {
        //make new user


        const person = new User({
            userName,
            photoURL,
            email,
            habits: [],
            refund: "x",
            payed: false,

           
        })

        await person.save()

        toRes = {what: "new one"}
    }



    return NextResponse.json({ toRes });
}