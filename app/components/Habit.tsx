import React, { useContext, useState } from "react";
import { ArrowElbowDownRight, CaretRight } from "@phosphor-icons/react";
import { ArrowLeftCircleIcon, CheckIcon } from "@heroicons/react/24/outline";
import { ArrowLeft, ArrowRight, CaretLeft, Copy, CurrencyCircleDollar, Headset, InstagramLogo, Money, Plant, Trash, Tree, TreeEvergreen, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { FireIcon, TrashIcon } from "@heroicons/react/24/solid";
import Moment from "react-moment";
import axios from "axios";
import { RootContext } from "../layout";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

function Habit({ habit, habitIndex, clicked, selectedDate, completed, _id }: any) {
    const [currentDate, setCurrentDate] = useState(new Date()); // Controls the displayed month
    const completedDays = habit.progress.map((entry: any) => entry.date); // List of completed dates
    const [habits, setHabits] = useContext(RootContext)?.habits;
    const [user_, setUser_] = useContext(RootContext)?.user_;

    const isCompleted = habit.progress.some(
        (entry: any) => entry.date === selectedDate.toLocaleDateString("en-CA") // Ensure local date format
    );

    const [user, setUser] = useContext(RootContext)?.user;

    const deleteHabit = () => {
        const yon = window.confirm("Would you like to delete this?");
        if (!yon) return;

        // Optimistically remove the habit locally
        const updatedHabits = habits.filter((_: any, index: any) => index !== habitIndex);

        setHabits(updatedHabits);

        axios
            .post("/api/delete-habit", {
                email: user?.email,
                _id,
            })
            .then(() => {
                toast.success("Deleted habit");
            })
            .catch((error) => {
                +     // Revert the changes if the request fails
                    toast.error("Error deleting habit");
                setHabits(habits);
            })
            .finally(() => {
                +     // Revalidate SWR to ensure data is synced with the server
                    mutate(`/api/get-habit?email=${user?.email}`);
            });
    };

    function getStreakDays() {
        const today = new Date().toLocaleDateString("en-CA");
        const sortedDays = [...completedDays].sort(); // Sort completed days in ascending order
        const streakDays = [];
        let streak = 0;

        // Traverse backward from today to find the streak
        for (let i = sortedDays.length - 1; i >= 0; i--) {
            const day = new Date(sortedDays[i]).toLocaleDateString("en-CA");
            const expectedStreakDate = new Date();
            expectedStreakDate.setDate(expectedStreakDate.getDate() - streak);

            // If the streak is broken
            if (day !== expectedStreakDate.toLocaleDateString("en-CA")) {
                break;
            }

            streak++;
            streakDays.push(day);
        }

        return streakDays; // Return the list of streak days
    }

    // Helper to calculate the current streak
    function calculateStreak() {
        const today = new Date().toLocaleDateString("en-CA"); // Use local date
        const sortedDays = [...completedDays].sort(); // Sort completed days in ascending order
        let streak = 0;

        // Traverse backward from today to find the streak
        for (let i = sortedDays.length - 1; i >= 0; i--) {
            const day = new Date(sortedDays[i]).toLocaleDateString("en-CA");
            const expectedStreakDate = new Date();
            expectedStreakDate.setDate(expectedStreakDate.getDate() - streak);

            // If the streak is broken
            if (day !== expectedStreakDate.toLocaleDateString("en-CA")) {
                break;
            }
            streak++;
        }

        return streak;
    }

    const currentStreak = calculateStreak();

    // Helper to format the days of the week
    function formatDays(days: any) {
        const allWeekdays = ["mo", "tu", "we", "th", "fr"];
        const allWeekend = ["sa", "su"];

        // Check if all weekdays
        if (days.length === 5 && days.every((day: any) => allWeekdays.includes(day))) {
            return "Weekdays";
        }

        // Check if all weekend
        if (days.length === 2 && days.every((day: any) => allWeekend.includes(day))) {
            return "Weekends";
        }

        // If it's not all weekdays or weekend, format the output
        const formattedDays = days
            .map((day: any) => {
                switch (day) {
                    case "mo":
                        return "Mon";
                    case "tu":
                        return "Tue";
                    case "we":
                        return "Wed";
                    case "th":
                        return "Thu";
                    case "fr":
                        return "Fri";
                    case "sa":
                        return "Sat";
                    case "su":
                        return "Sun";
                    default:
                        return "";
                }
            })
            .join(", ");

        return `On ${formattedDays}`;
    }

    // Function to generate a calendar-like view for a given month
    function renderCalendar() {
        const streakDays = getStreakDays(); // Get the list of streak days
        const daysInMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        ).getDate();
        const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        ).getDay();
        const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
            <div className="w-fit gap-2 grid grid-cols-7 mt-4">
                {/* Render empty cells for days before the 1st of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="w-6 h-6"></div>
                ))}
                {/* Render days */}
                {calendarDays.map((day) => {
                    const date = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                    ).toLocaleDateString("en-CA");

                    const isDayCompleted = completedDays.includes(date);
                    const isPartOfCurrentStreak = streakDays.includes(date); // Check if the day is part of the current streak

                    return (
                        <div
                            key={day}
                            className={`w-6 h-6 flex items-center justify-center rounded-md text-sm ${isDayCompleted
                                ? "bg-bluey text-white font-[400]"
                                : "border-2 border-black/10 text-zinc-600 font-[300]"
                                }`}
                        >
                            {isPartOfCurrentStreak ? (
                                <span className="flex items-center justify-center">
                                    <FireIcon className="size-[18px] text-white" />
                                </span>
                            ) : (
                                day
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Handlers to move between months
    function goToPreviousMonth() {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    }

    function goToNextMonth() {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    }

    // function calculateLevel(streak: number) {
    //     if (streak === 0) return 0;
    //     if (streak >= 1 && streak <= 2) return 1; // Level 1: 1-2 days
    //     if (streak >= 3 && streak <= 7) return 2; // Level 2: 3-7 days
    //     if (streak >= 8 && streak <= 15) return 3; // Level 3: 8-15 days
    //     if (streak >= 16 && streak <= 30) return 4; // Level 4: 16-30 days
    //     if (streak >= 31 && streak <= 50) return 5; // Level 5: 31-50 days
    //     if (streak >= 51 && streak <= 75) return 6; // Level 6: 51-75 days
    //     if (streak >= 76 && streak <= 100) return 7; // Level 7: 76-100 days
    //     if (streak >= 101 && streak <= 130) return 8; // Level 8: 101-130 days
    //     if (streak >= 131 && streak <= 165) return 9; // Level 9: 131-165 days
    //     if (streak >= 166) return 10; // Level 10: 166+ days
    //     return 0;
    // }

    function getEmoji(level: number) {
        switch (level) {
            case 0: return "💀";
            case 1: return "🌱";
            case 2: return "🌿";
            case 3: return "🌴";
            case 4: return "🌳";
            case 5: return "🌲";
            case 6: return "🍂";
            case 7: return "🍁";
            case 8: return "🍄";
            case 9: return "🌸";
            case 10: return "🌺";
            default: return "🌱";
        }
    }

    // function getProgressToNextLevel(streak: any) {
    //     const levelThresholds = [0, 1, 3, 8, 16, 31, 51, 76, 101, 131, 166]; // Thresholds for each level
    //     // const currentLevel = calculateLevel(streak);

    //     if (currentLevel >= 10) return 100; // Max level progress is always 100%

    //     const currentThreshold = levelThresholds[currentLevel]; // Start of the current level
    //     const nextThreshold = levelThresholds[currentLevel + 1]; // Start of the next level

    //     const daysInCurrentLevel = nextThreshold - currentThreshold; // Total days required to complete this level
    //     const daysProgressedInCurrentLevel = streak - currentThreshold; // Days completed in this level

    //     const progress = (daysProgressedInCurrentLevel / daysInCurrentLevel) * 100; // Calculate percentage progress
    //     return Math.round(progress);
    // }

   
    // Helper to get the fact based on the streak
    function getFact(level: number) {
        switch (level) {
            case 0: return "Your tree is dead";
            case 1: return "It's a small seedling";
            case 2: return "It's    ";
            case 3: return "It looks like a shrub";
            case 4: return "Your tree is growing";
            case 5: return "It has become a grown tree";
            case 6: return "Your tree is fully grown";
            case 7: return "Your tree is part of a ecosystem";
            case 8: return "It has become a tiny forest";
            case 9: return "A huge forest that covers all";
            case 10: return "An amazon that is vital for all";
            default: return "Keep growing your habit!";
        }
    }

    function getName(level: number) {
        switch (level) {
            case 0: return "Dead Sapling";
            case 1: return "Seedling";
            case 2: return "Sapling";
            case 3: return "Sprout";
            case 4: return "Young Tree";
            case 5: return "Growing Tree";
            case 6: return "Flourishing Tree";
            case 7: return "Grand Tree";
            case 8: return "Small Forest";
            case 9: return "Large Woodland";
            case 10: return "Eternal Amazon";
            default: return "Build you habits";
        }
    }

    function getNextLevelName(currentLevel: number) {
        const levelNames = [
            "Dead Sapling", // Level 0
            "Seedling",      // Level 1
            "Sappling",      // Level 2
            "Sprout",    // Level 3
            "Young Tree",  // Level 4
            "Growing Tree",   // Level 5
            "Flourishing Tree", // Level 6
            "Grand Tree",    // Level 7
            "Small Forest",  // Level 8
            "Large Woodland", // Level 9
            "Eternal Amazon" // Level 10
        ];

        // If the user is at the max level, return null or a message
        if (currentLevel >= 10) return "Max Level Reached";

        // Return the name of the next level
        return levelNames[currentLevel + 1];
    }


    const router = useRouter();



    // const currentLevel = calculateLevel(currentStreak);

    // Helper to calculate weight (2kg per day)
    const weight = currentStreak * 2;

    // Helper to get the first completed day (planted date)
    const plantedDate = completedDays.length > 0
        ? new Date(completedDays[0]).toLocaleDateString()
        : "Not yet planted";

    return (
        <div
            key={habitIndex}
            onClick={clicked}
            className={`flex h-fit flex-col w-full items-center rounded-2xl p-4 pb-0 border-primary border-2`}
        >
            <div className="w-full text-white flex flex-col justify-between items-center">
                {/* Habit Header */}
                <div className="flex space-x-2 w-full justify-between items-center p-2">
                    <div className="flex space-x-6 items-center">

                        <span className="text-[48px]">{habit?.emoji}</span>
                        <div className="flex flex-col space-y-2">
                            <h1
                                className={`text-2xl flex flex-col space-x-2 font-[300] text-zinc-800`}
                            >
                                <span className={`font-[400] text-2xl ${isCompleted && "line-through"}`}>{habit?.name}</span>{" "}
                                <span className="text-lg flex space-x-[6px]">
                                    <ArrowElbowDownRight className="size-3 mt-[6px]" />
                                    <span className="text-black/50">{habit?.desc}</span>
                                </span>
                            </h1>
                            {/* <div className="w-full flex items-center">
                                <span className="text-sm">
                                    <span
                                        className={`font-[300] text p-[3px] w-fit px-[8px] text-black rounded-md text-[12px] bg-black/5`}
                                    >
                                        {formatDays(habit?.days)}
                                    </span>
                                </span>
                            </div> */}
                        </div>

                    </div>
                    <div className="flex space-x-4 cursor-pointer items-center justify-center">
                        <Trash onClick={deleteHabit} weight="regular" className="size-6 translate-y-1    text-greyy" />
                        <div onClick={completed}>
                            <div
                                title={
                                    isCompleted
                                        ? "You can't undo this habit"
                                        : "Click to complete"
                                }
                                className={`mt-2 w-14 h-14 rounded-xl transition duration-100 ease-in grid place-content-center ${isCompleted
                                    ? "bg-greeny text-white cursor-not-allowed"
                                    : "bg-primary animate-bounce text-transparent cursor-transprent pointer hover scale:1.05"
                                    }`}
                            >
                                <CheckIcon className="w-8 h-8 stroke-[3]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Streak Information */}


                {/* Month Navigation */}
                <div className="flex space-x-2 w-full justify-between">
                    <div className="w-full self-center flex flex-col px-4 w-full justify-center items-start my-4 justify-between">
                        <div className="flex justify-center items-center space-x-4">
                            <p className="text-xl text-zinc-800 font-[400]">
                                {currentDate.toLocaleString("default", { month: "short" })}{" "}
                                {currentDate.getFullYear()}
                            </p>
                            <button
                                onClick={goToPreviousMonth}
                                className="p-2 hover hover:scale-110 rounded-md text-blacky bg-primary"
                            >
                                <CaretLeft className="size-4 text-blacky" />
                            </button>

                            <button
                                onClick={goToNextMonth}
                                className="p-2
                                 hover hover:scale-110 rounded-md text-blacky bg-primary"
                            >
                                <CaretRight className="size-4 text-blacky" />
                            </button>


                        </div>

                        {renderCalendar()}



                    </div>

                    <div className="flex flex-col text-zinc-800 w-full">
                        <fieldset className={`hover group rounded-xl w-full p-2 pt-0 ${currentStreak === 0 && "pointer-events-none"}`}>
                            <legend className="text-xs text-greyy font-[400]">Streak Started</legend>
                            <p className="font-[300] text-[16px] group-hover:hidden ">{currentStreak >= 1 ? <Moment className="text-blacky" format="D MMM YYYY">{getStreakDays()[0]}</Moment> : "Not started"}</p>
                            {currentStreak >= 1 && <p className="font-[300] text-blacky text-[16px] hidden group-hover:block">
                                <Moment fromNow>{getStreakDays()[0]}</Moment>
                            </p>}
                        </fieldset>
                        <div className="h-[12px]">


                        </div>

                        <fieldset className={`hover group rounded-xl w-full p-2 pt-0 ${currentStreak === 0 && "pointer-events-none"}`}>
                            <legend className="text-xs text-greyy font-[400]">Streak Length</legend>

                            {currentStreak <= 0 ? "Never" : currentStreak + " day(s)"}
                        </fieldset>

                        <div className="h-[12px]">


                        </div>

                        <div className="h-[16px]">

                        </div>

                        {/* <div onClick={deleteHabit} className="bg-[#dbca9a] hover hover:bg-[#c7b685] rounded-xl w-full p-2">

                            <div className="flex w-full justify-center items-center space-x-2 text-sm text-[#766126]">
                                <TrashIcon className="size-3" />
                                <span>Delete Tree</span>
                            </div>
                        </div> */}

                    </div>

                </div>



                <div className="mt-2 w-full flex flex-grow-[1] space-x-2 justify-between items-center">
                    {/* Calendar */}



                    <div className="flex w-full flex-col items-end justify-center space-y-4">

                        <div className="flex space-x-4 w-full items-center">



                            <div className="flex flex-col space-y-2">
                                {currentStreak >= 50 ? (
                                    <>
                                        <p className="text-blacky text-2xl">Congrats on 50+ streak 🥳🎉</p>
                                        <button onClick={() => router.push("/req")} className="w-fit p-3 hover hover:bg-black px-4 grad2 bg-zinc-800 rounded-xl text-white flex space-x-4 items-center">
                                            <Headset weight="fill" className="size-[22px]" />
                                            <span className="text-lg font-[400]">Request Refund</span>
                                        </button>

                                    </>
                                ) : (
                                    <>
                                        {user_ && user_?.refund == "x" && <>
                                        <div className="text-blacky italic flex space-x-2 items-center">
                                            <FireIcon className="size-6 text-bluey translate-y-[-4px]" />
                                            <h1 className="text-xl text-blacky self-start leading-4"><span className="font-[400]">50</span> day streak for Refund</h1>
                                        </div>
                                        <div className="text-blacky italic flex space-x-2 items-center">
                                            <CurrencyCircleDollar weight="fill" className="size-5 text-greyy" />
                                            <span>{50 - currentStreak} days till Refund</span>
                                        </div>
                                        </>}
                                    </>
                                )}

                            </div>

                        </div>
                        {currentStreak >= 50 ? (<></>) : (
                            <>
                                {user_ && user_?.refund == "x" ? (<>
                                <div className="w-full flex space-x-4 items-center">
                                    <span className="font-[400] w-[100px] py-[2px] flex justify-center bg-primary rounded-xl text-blacky">{currentStreak} / 50</span>

                                    <div className="w-full bg-primary rounded-xl h-2">

                                        <div
                                            className="bg-bluey h-2 rounded-xl"
                                            style={{ width: `${(((currentStreak > 50 ? 50 : currentStreak) / 50) * 100)}%` }}
                                        ></div>

                                    </div>

                                </div>
                                </>) : (
                                    <div className="text-blacky font-[400]">
                                    {((user_ && user_?.refund == "-") ? (<p>Your refund is already being processed</p>) : <p>You have claimed this accounts refund</p>)}
                                    </div>
                                )}
                                
                                </>
                        )}
                        <div className="flex space-x-8 items-center">
                            {/* <div className="p-5 border-2 border-black/5 rounded-xl text-4xl">
                                {getEmoji(currentLevel)}
                            </div>
                            <ol className="flex list-disc text-sm text-black/60 flex-col items-start text-zinc-800">
                                <ol className="flex list-disc text-sm text-black/60 flex-col items-start text-zinc-800">
                                    <li>{getFact(currentLevel)}</li>
                                    <li>Planted on: {plantedDate}</li>
                                    <li>Weight: {weight}kg</li>
                                    <li>Days until next level: {getDaysUntilNextLevel(currentStreak)}</li>
                                </ol>
                            </ol> */}


                        </div>

                    </div>

                    {/* <div className="text-lg text-black flex space-x-2 items-center">
                        <Plant className="size-[22px]" /> <span className="text-lg">{currentStreak} day old </span>
                    </div> */}
                </div>
            </div >
        </div >
    );
}

export default Habit;