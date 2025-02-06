"use client";

import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/navigation';
import React from 'react';

function Page() {
    const router = useRouter();
    return (
        <div className='w-screen h-screen flex flex-col items-center py-8'>
            <div className='flex space-x-4 items-center mb-8'>
                <div
                    onClick={() => {
                        router.back();
                    }}
                    className="bg-zinc-800 p-2 cursor hover:bg-black hover px-3 rounded-xl flex space-x-2 items-center"
                >
                    <ArrowLeft weight='bold' className="size-6 text-white" />
                    <span className='font-[400] text-xl text-white'>Back</span>
                </div>
                <h1 className='text-2xl font-[500]'>HabitFundr</h1>
                <span className='text-2xl'>Terms and Conditions</span>
            </div>
            <div className='w-full max-w-2xl p-6 border-2 border-primary rounded-lg'>
              
                <h2 className='text-xl font-semibold mb-4'>Terms and Conditions</h2>

                <h3 className='text-lg font-medium mt-6'>This agreement takes effect on the date on which you first use the HabitFundr application.

                <p className='text-gray-600 mt-6'>
                    By using HabitFundr, you acknowledge that you have read, understood, and agree to these Terms and Conditions. If you have any questions, please contact us before using our services.
                </p>
                
                </h3>
                <div className='space-y-4 mt-6'>
                    <div>
                        <h3 className='text-lg font-medium '>1. Acceptance of Terms</h3>
                        <p className='text-gray-600'>
                            By accessing or using HabitFundr, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>2. No Liability</h3>
                        <p className='text-gray-600'>
                            HabitFundr and its affiliates are not liable for any damages, losses, or injuries arising from the use of our services. This includes, but is not limited to, client errors, technical issues, or any other unforeseen circumstances.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>3. No Guarantees</h3>
                        <p className='text-gray-600'>
                            HabitFundr does not guarantee any specific outcomes, including but not limited to habit formation, refunds, or rewards. The success of your habit-building efforts depends solely on your commitment and consistency.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>4. Refund Policy</h3>
                        <p className='text-gray-600'>
                            While HabitFundr aims to provide refunds for successful 50-day streaks, we do not guarantee refunds under any circumstances. Refunds are subject to manual review and processing, and HabitFundr reserves the right to deny refunds at its sole discretion.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>5. User Responsibility</h3>
                        <p className='text-gray-600'>
                            You are solely responsible for your use of HabitFundr. This includes ensuring the accuracy of your habit tracking and understanding that HabitFundr is not responsible for any errors or omissions on your part.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>6. Indemnification</h3>
                        <p className='text-gray-600'>
                            You agree to indemnify and hold harmless HabitFundr, its affiliates, and its employees from any claims, liabilities, damages, or expenses arising from your use of our services.
                        </p>
                    </div>
                   
                    <div>
                        <h3 className='text-lg font-medium'>8. Governing Law</h3>
                        <p className='text-gray-600'>
                            These Terms and Conditions are governed by the laws of the jurisdiction in which HabitFundr operates. Any disputes will be resolved in accordance with these laws.
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Page;