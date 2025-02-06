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
                <span className='text-2xl'>Privacy Policy</span>
            </div>
            <div className='w-full max-w-2xl p-6 border-2 border-primary rounded-lg'>
                <h2 className='text-xl font-semibold mb-4'>Privacy Policy</h2>
                <p className='text-gray-600 mb-4'>
                    This Privacy Policy explains how HabitFundr collects, uses, and protects your personal information. By using our services, you agree to the practices described in this policy.
                </p>
                <div className='space-y-4'>
                    <div>
                        <h3 className='text-lg font-medium'>1. Information We Collect</h3>
                        <p className='text-gray-600'>
                            We may collect personal information such as your name, email address, payment details, and habit-tracking data. This information is necessary to provide and improve our services.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>2. How We Use Your Information</h3>
                        <p className='text-gray-600'>
                            We use your information to:
                            <br />- Provide and maintain our services.
                            <br />- Process payments and refunds.
                            <br />- Communicate with you about your account and our services.
                            <br />- Improve and personalize your experience.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>3. Data Security</h3>
                        <p className='text-gray-600'>
                            We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>4. Third-Party Services</h3>
                        <p className='text-gray-600'>
                            We may use third-party services to process payments, analyze data, or provide other functionalities. These services have their own privacy policies, and we are not responsible for their practices.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>5. Data Retention</h3>
                        <p className='text-gray-600'>
                            We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time via email.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>6. Your Rights</h3>
                        <p className='text-gray-600'>
                            You have the right to:
                            <br />- Access the personal information we hold about you.
                            <br />- Request correction or deletion of your data.
                            <br />- Opt-out of receiving promotional communications.
                        </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium'>7. Changes to This Policy</h3>
                        <p className='text-gray-600'>
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and your continued use of our services constitutes acceptance of the updated policy.
                        </p>
                    </div>
                   
                </div>
                <p className='text-gray-600 mt-6'>
                    By using HabitFundr, you acknowledge that you have read, understood, and agree to this Privacy Policy.
                </p>
            </div>
        </div>
    );
}

export default Page;