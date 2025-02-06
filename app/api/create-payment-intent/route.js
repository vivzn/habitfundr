//add a sessionID in the text to ignore the sender who sent

import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export async function POST(req) {
    try {
        const { amount } = await req.json()


        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        })




        console.log({ clientSecret: paymentIntent.client_secret })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("internal error", error)

        return NextResponse.json({ error }, { status: 500 });
    }
}