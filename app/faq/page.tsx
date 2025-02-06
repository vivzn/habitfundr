"use client";

import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/navigation';
import React from 'react';

function Page() {

    const router = useRouter();
    return (
        <div className='w-screen h-screen flex flex-col items-center py-8 '>


            <div className='flex space-x-4 items-center mb-8'>
                
                <div onClick={() => {
                    router.back();
                }} className="bg-zinc-800 p-2 cursor hover:bg-black hover px-3 rounded-xl flex space-x-2 items-center">
                    <ArrowLeft weight='bold' className="size-6 text-white" />
                    <span className='font-[400] text-xl text-white'>Back</span>
                </div>
                <h1 className='text-2xl font-[500]'>HabitFundr</h1>
                <span className='text-2xl'>FAQ</span>
            </div>
            <div className='w-full max-w-2xl p-6 border-2 border-primary rounded-lg'>
                <h2 className='text-xl font-semibold mb-4'>Frequently Asked Questions</h2>
                <div className='space-y-4'>
                    <div>
                        <h3 className='text-lg font-medium'>What is HabitFundr?</h3>
                        <p className='text-gray-600'>
                            HabitFundr is a habit-tracking app that rewards you for building positive habits. If you maintain a 50-day streak, you get your money refunded.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>How does HabitFundr work?</h3>
                        <p className='text-gray-600'>
                            1. Set a habit you want to build. <br />
                            2. Commit a small amount of money. <br />
                            3. Track your progress daily. <br />
                            4. Earn your refund after completing a 50-day streak.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>What happens if I miss a day?</h3>
                        <p className='text-gray-600'>
                            If you miss a day, your streak resets, and you’ll need to start over to qualify for the refund.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>How do I get my refund?</h3>
                        <p className='text-gray-600'>
                            Once you complete a 50-day streak on any habit, your refund will be processed manually and a moderator will reach out to you with ways of repayment.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>Is there a limit to the number of habits I can track?</h3>
                        <p className='text-gray-600'>
                            No, you can track as many habits as you like.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;