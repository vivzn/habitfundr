"use client";

import React, { useContext, useState } from "react";
import { RootContext } from "../layout";
import { useRouter } from "next/navigation";
import { PaypalLogo } from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function Req() {
    const [user, setUser] = useContext(RootContext)?.user;
    const [habits, setHabits] = useContext(RootContext)?.habits;
    const [user_, setUser_] = useContext(RootContext)?.user_;
    const router = useRouter();
    const [loadi, setLoadi] = useState(false);

    const [reason, setReason] = useState<string>("");

    // Function to calculate streak for a habit
    const calculateStreak = (habit: any) => {
        const completedDays = habit.progress.map((entry: any) => entry.date);
        const today = new Date().toLocaleDateString("en-CA");
        const sortedDays = [...completedDays].sort();
        let streak = 0;

        for (let i = sortedDays.length - 1; i >= 0; i--) {
            const day = new Date(sortedDays[i]).toLocaleDateString("en-CA");
            const expectedStreakDate = new Date();
            expectedStreakDate.setDate(expectedStreakDate.getDate() - streak);

            if (day !== expectedStreakDate.toLocaleDateString("en-CA")) {
                break;
            }
            streak++;
        }

        return streak;
    };

    // Check if the user has a habit with a 50-day streak
    const has50DayStreak = habits?.some((habit: any) => calculateStreak(habit) >= 50);

    const handleRequest = () => {
        if (!reason.trim()) return;

        setLoadi(true);

        axios
            .post("/api/create-req", { email: user?.email, reason })
            .then((data: any) => {
                if (data?.data) {
                    console.log(data?.data);
                    toast.success("Successfully added a Request");

                    mutate(`/api/get-habit?email=${user?.email}`);

                    // Update the user_ state to reflect the refund request
                    setUser_({ ...user_, refund: "-" });

                    router.refresh();
                } else throw new Error("Something went wrong in the API");
            })
            .catch((error) => {
                // Handle Errors here.
                const errorMessage = error.message;
                toast.error("Failed. Try again later: " + errorMessage);
                setLoadi(false);
                router.refresh();
            });
    };

    // Check the refund status
    

    return (
        <div className="py-12 w-full h-full flex flex-col space-y-6 mx-auto">
           
            <div>
                <h1 className="font-[400] text-3xl text-blacky">Request Refund</h1>
            </div>
            <p onClick={() => router.push("/tc")} className="text-xl">
                Please re-read the{" "}
                <span className="text-blue-500 font-[400] underline cursor-pointer">
                    Terms & Conditions
                </span>{" "}
                before requesting a refund.
            </p>

            {(user_ && user_?.refund == "x" && has50DayStreak) && (
                <div className="flex flex-col space-y-4">
                    <p className="text-lg bg-green-200 p-3 px-4 rounded-xl border-2 border-green-400 text-green-600">
                        Congratulations! You have a habit with a 50+ day streak. You are eligible for a refund. We are glad we helped you develop a habit.
                    </p>
                    <div className="flex flex-col space-y-4">
                        {(user_ && user_?.refund == "x") && <>
                            <label htmlFor="reason" className="text-lg font-[400] text-blacky">
                                Please add the following info in the box. Your information will be kept safe.
                            </label>
                            <ol className="list-disc">
                                <li>Name of the Habit with 50+ streak</li>
                                <li>COUNTRY CODE + Phone Number </li>
                                <li>Email</li>
                            </ol>
                            <label htmlFor="reason" className="text-lg font-[400] text-blacky">
                                A moderator will reach out to you if (view T&C) and arrange payment accordingly through PayPal or other arranged means. You will not lose access to your HabitFundr account.
                            </label>

                            <span className="flex space-x-2 items-center text-xl">
                                <PaypalLogo className="size-8" weight="fill" />
                            </span>
                        </>}



                    
                        <textarea
                            id="reason"
                            name="reason"
                            maxLength={100}
                            onChange={(e) => setReason(e.target.value)}
                            value={reason}
                            placeholder="Name of Habit with 50+ streak, Phone Number, and Email"
                            required
                            className="p-2 border-2 border-black/10 rounded-md"
                            rows={4}
                        />
                        <button
                            disabled={!reason.trim() || loadi || user_?.refund !== "x"}
                            onClick={handleRequest}
                            type="submit"
                            className="w-fit p-3 disabled:brightness-75 disabled:bg-zinc-600 hover:bg-black px-4 grad2 bg-blacky rounded-xl text-white flex space-x-4 items-center"
                        >
                            <span className="text-lg font-[400]">Submit Request</span>
                        </button>

                    </div>
                </div>
            )}

            {(user_ && user_?.refund == "x" && !has50DayStreak) && (
                <>
                    <p className="text-lg p-4 px-5 bg-red-200 border-2 rounded-xl font-[400] border-red-400 text-red-600">
                        You need to maintain a 50-day streak in any of your habits to request a refund. Your account does not have any.
                    </p>
                    <span
                        onClick={() => router.push("https://forms.gle/v8HM9uXcJ59cnZEC6")}
                        className="text-md cursor-pointer hover:underline"
                    >
                        Have a 50+ streak and it does not show here?
                    </span>
                    
                </>
            )}

            {(user_ && user_?.refund == "-") && (
                <p className="text-lg p-4 px-5 bg-amber-200 border-2 rounded-xl  font-[400] border-amber-400 text-amber-600">
                    You had a 50+ streak and your request is being reviewed manually. Expect a email to your inbox in 2 - 5 business days.
                </p>
            )}


            {(user_ && user_?.refund == "y") && (
                <p className="text-lg text-blacky p-4 px-5 bg-green-200 border-2  font-[400] rounded-xl border-green-400 text-green-600">
                    You have recieved your refund payment. We are glad we helped you make a habit
                </p>
            )}


            {/* Display refund status message */}

        </div>
    );
}

export default Req;

{/* <div className="flex flex-col space-y-4">
                    <p className="text-lg text-blacky p-4 px-5 bg-red-200 border-2 rounded-xl border-red-400 text-red-600">
                        You need to maintain a 50-day streak in any of your habits to request a refund. Your account does not have any.
                    </p>
                    <span
                        onClick={() => router.push("https://forms.gle/v8HM9uXcJ59cnZEC6")}
                        className="text-md cursor-pointer hover:underline"
                    >
                        Have a 50+ streak and it doesn't show here?
                    </span>
                    <button
                        onClick={() => router.push("/dash")}
                        className="w-fit p-3 hover:bg-black px-4 grad2 bg-zinc-800 rounded-xl text-white flex space-x-4 items-center"
                    >
                        <span className="text-lg font-[400]">Go Back</span>
                    </button>
                </div> */}