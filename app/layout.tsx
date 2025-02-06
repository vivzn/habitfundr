"use client";

import { Lexend_Deca, Poppins } from "next/font/google";
import "./globals.css";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Dashboard from "./dashboard";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase";
import { toast, ToastContainer } from "react-toastify";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Head from "next/head";

const font = Lexend_Deca({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const RootContext = createContext<any>("");

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const amount = 5.0;

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NOT DEFINED")
}


const convertToSubcurrency = (amt: any) => {
  return amt * 100;
}


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);




const CheckoutPage = ({ amount, userEmail }: any) => {

  const router = useRouter();


  const stripe = useStripe();
  const elements = useElements();
  const [clientS, setClientS] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);

  // const [user, setUser] = useContext<any>(RootContext);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) })
    }).then((res) => res.json())
      .then((data) => {
        setClientS(data?.clientSecret)
      })



  }, [amount])

  const handleSubmit = async (event: any) => {

    event.preventDefault();

    setLoading(true);


    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setLoading(false);
      toast.error(submitError.message)
      return;
    }


    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: clientS,
      confirmParams: {
        return_url: `${window?.location?.href}`
      },
      redirect: 'if_required'
    })





    if (error) {
      toast.error(error.message)
    }

    const l = toast.loading("Payment recieved, updating your account. DO NOT REFRESH.")

    const response = await fetch("/api/user-pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }), // Pass the user's email
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("You now have premium")
        mutate(`/api/get-habit?email=${userEmail}`);
        toast.dismiss(l);
        router.refresh();
        setLoading(false);
      }).catch(() => {
        toast.error("Something went wrong");
        toast.dismiss(l);
        setLoading(false);
      })








  };






  return <form className="flex flex-col space-y-4 w-[500px]" onSubmit={handleSubmit}>
    <h1 className="font-[400] text-xl">Total $5</h1>
    {clientS ? <PaymentElement /> : <div className="w-full flex justify-center"><span className="loader"></span></div>}
    <button className="text-white bg-blacky p-2 px-3 rounded-xl font-[400]" disabled={!stripe || loading}>{!loading ? `Pay $${amount}` : "Processing..."}</button>
  </form>
}



// export const metadata: Metadata = {
//   title: '...',
//   description: '...',
// }


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const pathname = usePathname();


  const isPages = pathname.trim() == "/" || pathname.trim() == "/tc" || pathname.trim() == "/privacy" || pathname.trim() == "/faq";

  const [user, setUser] = useState<any | null>(null);
  const [user_, setUser_] = useState<any | null>(null);
  const [habits, setHabits] = useState<{ name: string; createdAt?: string; progress: { date: string }[], desc: string, emoji: string, days: any[] }[] | null>();

  const { data: habitsData, error } = useSWR(
    user ? `/api/get-habit?email=${user.email}` : null,
    fetcher, { refreshInterval: 1000 }
  );

  useEffect(() => {
    router.prefetch("/tc");
    router.prefetch("/faq");
    router.prefetch("/privacy");
  }, [router])




  useEffect(() => {
    if (!habitsData || habitsData?.length === 0) return;
    console.log(habitsData)
    setHabits(habitsData?.habits?.habits);
    setUser_(habitsData?.habits)
  }, [habitsData]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);




  return (
    <html className={font.className} lang="en">
      <body className="bg-main w-screen h-screen font-[300] text-blacky">
        <head>
          <title>HabitFundr - Keep yourself habits in check</title>
          <meta
            name="description"
            content="HabitFundr helps you build better habits, stay consistent, and achieve your goals with ease. Track your progress and create a better you!"
          />
          <meta name="keywords" content="habit tracker, habit tracking app, goal setting, productivity, self-improvement, looksmaxxing" />
          <meta name="author" content="HabitFundr" />
          <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta charSet="UTF-8" />
          <link rel="icon" type="image/x-icon" href="/favicon-32x32.png"/>

          <meta property="og:title" content="HabitFundr - Build Better Habits" />
          <meta
            property="og:description"
            content="Habit Tracker helps you stay consistent and achieve your goals. Track your habits and create a better you!"
          />
          <meta property="og:image" content="/images/habit-tracker-banner.png" />
          <meta property="og:image:alt" content="Preview of the Habit Tracker app" />
          <meta property="og:url" content="https://www.example.com/" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="HabitFundr" />
          <meta property="og:locale" content="en_US" />
        </head>
        <RootContext.Provider value={{ user: [user, setUser], habits: [habits, setHabits], user_: [user_, setUser_] }}>
          <ToastContainer />
          {isPages ? (
            <>
              {children}
            </>
          ) : (
            <>
              {(user && user_) ? <Dashboard>
                {!user_?.payed ? (
                  <>
                    <div className="w-full h-full py-12 flex flex-col">
                      <h1 className="font-[400] text-3xl">Pay ${amount} to use HabitFundr</h1>







                      <p onClick={() => router.push("/tc")} className="text-xl">
                        Please re-read the{" "}
                        <span className="text-blue-500 font-[400] underline cursor-pointer">
                          Terms & Conditions
                        </span>{" "}
                        before requesting a refund.
                      </p>


                      {/* <h1 className="font-[400] text-xl mt-4">Pay and start using HabitFundr immediately</h1> */}
                      <h1 className="font-[400] text-md mt-2 text-red-500">Do not leave the site while transactions are occuring</h1>



                      <div className="w-full h-full place-content-center flex justify-center mt-6">
                        <div className="border-2 rounded-xl p-8 h-fit">
                          <Elements stripe={stripePromise} options={{ mode: "payment", amount: convertToSubcurrency(amount), currency: "usd" }}>
                            <CheckoutPage amount={amount} userEmail={user?.email} />
                          </Elements>
                        </div>
                      </div>

                    </div>
                  </>
                ) : (
                  <>
                    {children}
                  </>
                )}
              </Dashboard> : <div className="w-full h-full grid place-content-center">
                <span className="loader">

                </span>
              </div>}
            </>
          )}

        </RootContext.Provider>
      </body>
    </html>
  );
}
