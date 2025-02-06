"use client";

import React, { useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/firebase";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, CalendarDateRangeIcon } from "@heroicons/react/24/solid";
import Moment from "react-moment";
import axios from "axios";
import useSWR, { mutate } from "swr";
import Habit from "../components/Habit";
import { ArrowLeft, CaretLeft, CaretRight, Plant, PlusCircle, Tree } from "@phosphor-icons/react/dist/ssr";
import { RootContext } from "../layout";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";


const Dash: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  
  const [user, setUser] = useContext(RootContext).user;
  const [habits, setHabits] = useContext(RootContext).habits;
  // const [user, setUser] = useState<User | null>(null);
  // const [habits, setHabits] = useState<{ name: string; createdAt?: string; progress: { date: string }[], desc: string, emoji: string, days: any[] }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // const { data: habitsData, error } = useSWR(
  //   user ? `/api/get-habit?email=${user.email}` : null,
  //   fetcher
  // );




  const getCurrentDay = (date: Date): string => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const toggleHabitProgress = (habitIndex: number, date: string) => {
    if (!habits || !habits[habitIndex]) return; // Ensure habits and the specific habit exist
  
    const isCompleted = habits[habitIndex].progress.some((entry: any) => entry.date === date);
  
    if (isCompleted) return;
  
    const confirm = window.confirm("You cannot undo checking this habit");
    if (!confirm) return;

    
  
    // Optimistically update habits locally
    const updatedHabits = [...habits]; // Copy the habits array
    updatedHabits[habitIndex] = {
      ...updatedHabits[habitIndex], // Copy the specific habit
      progress: [...updatedHabits[habitIndex].progress, { date }] // Add the new progress date
    };
  
    setHabits(updatedHabits); // Update state with the new habits array
  
    axios
      .post("/api/toggle-habit", {
        email: user?.email,
        habitName: habits[habitIndex].name,
        date,
        completed: !isCompleted,
      })
      .catch((error) => {
        // Revert the changes if the request fails
        toast.error("Error toggling habit");
        setHabits(habits); // Restore the previous state
      })
      .finally(() => {
        // Revalidate SWR to ensure data is synced with the server
        toast.success("You completed this habit for today!")
        mutate(`/api/get-habit?email=${user?.email}`);
      });
  };

  const resetDialog = () => {
    setDialogState(false);
    setEmoji("🎯");
    setHabitDesc("");
    setHabitName("");
  }

  const handleAdd = () => {
    if (emoji && habitDesc.trim() && habitName.trim()) {
      const newHabit = {
        name: habitName,
        desc: habitDesc,
        emoji,
        progress: [],
        days: [],
      };
  
  +   // Optimistically update habits locally
      setHabits((prev: any) => [...prev, newHabit]);
  
      axios
        .post("/api/create-habit", {
          email: user?.email,
          name: habitName ?? "",
          progress: [],
          desc: habitDesc ?? ".",
          days: [],
          emoji: emoji ?? "",
        })
        .then(() => {
          router.refresh();
        })
        .catch((error) => {
  +       // Revert the changes if the request fails
          toast.error("Error creating habit");
          setHabits((prev: any) => prev.filter((habit: any) => habit.name !== habitName));
        })
        .finally(() => {
  +       // Revalidate SWR to ensure data is synced with the server
          mutate(`/api/get-habit?email=${user?.email}`);
        });
    }
  
    resetDialog();
    toast.success("Added Habit");
  };

  const [emoji, setEmoji] = useState<any>("🎯");

  const [habitDesc, setHabitDesc] = useState<any>("");
  const [habitName, setHabitName] = useState<any>("");

  const [dialogState, setDialogState] = useState<boolean>(false)

  return (


    <div className="w-full h-full flex flex-col border-b border-zinc-200">


      <Dialog open={dialogState} onClose={() => resetDialog()} className="relative z-[100]">
        <div className="fixed inset-0 w-screen overflow-y-auto p-6 bg-black/15">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel className="max-w-lg space-y-6 bg-[#ffffff] p-12 rounded-xl">
              <DialogTitle className="font-[400] text-3xl">Add a Everyday Habit</DialogTitle>
              <Description className="font-[300] text-lg">🚀 Your streak grows every day<br /> ⚰️ If you miss a day your streak resets <br
              />💵 Reach 50 days streak and get your Refund</Description>

              <div className="flex gap-6 items-center">
                <div onClick={() => setEmoji("-")} className="rounded-xl border-2 w-14 h-fit py-2 pt-1 border-greyy hover hover:bg-black/5 grid place-content-center">
                  <span className="text-2xl">{emoji}</span>

                </div>
                <div className="absolute z-[100000]">
                  {emoji == "-" && <EmojiPicker onEmojiClick={(e) => {
                    setEmoji(e?.emoji)
                  }} />}
                </div>
                <input maxLength={22} value={habitName} onChange={(e) => {
                  setHabitName(e?.target?.value)
                }} className="px-3 p-2 bg-primary placeholder:text-zinc-500 outline-none rounded-xl w-full focus:outline-2 focus:outline-bluey" placeholder="Habit Name" />
              </div>
              <input value={habitDesc} onChange={(e) => {
                setHabitDesc(e?.target?.value)
              }} maxLength={30} className="px-3 p-2 bg-primary placeholder:text-zinc-500 outline-none rounded-xl w-full focus:outline-2 focus:outline-bluey" placeholder="1 Line Description" />
              <div className="flex gap-6">

                <button onClick={handleAdd} disabled={!emoji || !habitDesc.trim() || !habitName.trim()} className="p-3 hover disabled:cursor-not-allowed disabled:brightness-90 hover:bg-black px-8 grad2 bg-zinc-800 rounded-xl text-white flex space-x-4 items-center">
                  <PlusCircle weight="fill" className="size-[22px]" />
                  <span className="text-lg font-[400]">Create It</span>
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <div className="w-full h-full flex">
        <div className="w-full h-full pt-12 space-x-8 flex overflow-y-auto">
          <div className="w-full h-full flex flex flex-col space-y-4">
            <div className="flex w-full justify-between h-fit">
              <h1 className="font-[400] text-3xl text-blacky">Your habits</h1>
             
              <div className="flex flex-col space-y-4 items-end">
                <div className="flex space-x-4 w-fit h-fit">
                  <button onClick={() => setDialogState(true)} className="p-3 hover hover:bg-black px-8 grad2 bg-zinc-800 rounded-xl text-white flex space-x-4 items-center">
                    <Plant weight="fill" className="size-[22px]" />
                    <span className="text-lg font-[400]">New Habit</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-greyy text-xl">🚀 Get a streak of 50 on any habit and recieve your payment refund</p>

            <div className="flex w-full justify-center">
              {!habits && <span className="loader"></span>}
              {(habits && habits?.length == 0) && <span className="text-blacky text-2xl font-[400]">You have no Habits yet 😔</span>}
            </div>

            

            <div className="flex flex-col space-y-4 justify-center pb-12">




              <div className="grid gap-6 grid-cols-2">

                {habits?.map((habit: any, habitIndex: any) => {
                  const isCompleted = habit.progress.some(
                    (entry: any) => entry.date === selectedDate.toISOString().split("T")[0]
                  );


                  return (
                    <Habit
                      key={habitIndex}
                      clicked={() => console.log(habit)}
                      habit={habit}
                      habitIndex={habitIndex}
                      completed={() => toggleHabitProgress(habitIndex, selectedDate.toISOString().split("T")[0])}
                      selectedDate={selectedDate}
                      _id={habit?._id}
                    />
                  );

                })}
              </div>



            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash;