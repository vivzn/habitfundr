"use client";

import { Leaf, Tree } from '@phosphor-icons/react';
import { CheckSquareOffset, Headset, Plant, SignOut, UsersThree } from '@phosphor-icons/react/dist/ssr';
import { getAuth, signOut, User } from 'firebase/auth';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { RootContext } from './layout';
import { usePathname, useRouter } from 'next/navigation';

const Dashboard: React.FC<any> = ({ children }) => {
    const [user, setUser] = useContext(RootContext).user;
    const [user_, setUser_] = useContext(RootContext).user_;
    const [habits, setHabits] = useContext(RootContext).habits;

    const pathname = usePathname();

    const router = useRouter();

    useEffect(() => {
        router.prefetch("/req")
        router.prefetch("/dash")
    }, [router])

    return (
        <div className='w-screen h-screen flex px-[15vw] space-x-[72px] text-zinc-700'>
            <div className="flex flex-col justify-between space-y-2 pt-14 pb-14 items-end">
                <div className='flex flex-col space-y-2'>
                    <p className='font-[500]'>HabitFundr</p>
                    <div onClick={() => router.push("/dash")} className={`flex items-center gap-4 p-3 px-4 rounded-xl hover hover:bg-primary ${pathname == "/dash" ? "bg-primary" : ""}`}>
                        {pathname == "/dash" && <div className='w-2 h-8 rounded-[3px] bg-greeny absolute translate-x-[-32px]'>

                        </div>}
                        {pathname == "/dash" ? <Plant weight='fill' className='w-7 h-7 text-greyy' /> : <Plant weight='regular' className='w-7 h-7 text-greyy' />}
                        
                        <p className='text-[22px]'>Habits</p>
                    </div>

                    <div onClick={() => router.push("/req")} className={`flex items-center gap-4 p-3 px-4 rounded-xl hover hover:bg-primary ${pathname == "/req" ? "bg-primary" : ""}`}>
                        {pathname == "/req" && <div className='w-2 h-8 rounded-[3px] bg-greeny absolute translate-x-[-32px]'>

                        </div>}
                        {pathname == "/req" ? <Headset weight='fill' className='w-7 h-7 text-greyy' /> : <Headset weight='regular' className='w-7 h-7 text-greyy' />}
                        <p className='text-[22px]'>Refund</p>
                    </div>
                </div>

                <div onClick={() => {
                    const yon = window.confirm("Do you want to log out?")

                    if (!yon) return;

                    signOut(getAuth())
                        .then(function () {
                            setUser(null);
                            setHabits(null);
                            router.push("/");
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }} className='flex space-x-4 hover items-center rounded-lg justify-between w-fit border-2 border-secondary px-4 p-4'>
                    <Image className='rounded-lg' width={40} height={40} src={user?.photoURL} alt='user pfp' />
                    <SignOut weight='fill' className='size-6 text-greyy' />
                </div>
            </div>
            <div className='w-full h-full'>
                {children}
            </div>
        </div>
    )
}

export default Dashboard