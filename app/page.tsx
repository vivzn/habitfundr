"use client";

import { provider } from "@/firebase";
import axios from "axios";
import { getAuth, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { RootContext } from "./layout";
import { GoogleLogo, PaperPlaneRight, Star, StarHalf } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { StarFour } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function Home() {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useContext(RootContext).user;
  const [dia, setDia] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);
    });
    return () => unsubscribe(); // Clean up the subscription
  }, [auth]);

  const onRealSignUp = () => {
    provider.setCustomParameters({
      prompt: "select_account",
    });

    
    signInWithPopup(auth, provider)
      .then((res) => {
        console.log(res?.user);
        const toastId = toast.loading('Loading...');
        axios
          .post("/api/create-user", {
            userName: res?.user?.displayName,
            photoURL: res?.user?.photoURL,
            email: res?.user?.email,
          })
          .then((data) => {
            if (data?.data) {
              toast.success("Welcome");
              toast.dismiss(toastId);
              router.push("/dash");
              
            } else throw new Error("Something went wrong in the API");
          });
      })
      .catch((error) => {
        console.error(error.message);
        
        toast.error("Something went wrong with the pop up. Try again");
      });
  }

  const onSignUp = () => {
    if(user) {
      router.push("/dash")
    } else {
      setDia(true);
    }

    
  };

  useEffect(() => {
    if(user) {
      router.prefetch("/dash")
    }
  }, [user, router])


  return (
    <div className="w-screen min-h-screen flex items-center flex-col px-[15vw] py-8">
      <Dialog open={dia} onClose={() => setDia(false)} className="relative z-50 ">
        <div className="fixed inset-0 flex h-screen w-screen items-center bg-blacky/15 justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-xl  ">
            <h1 className="text-2xl font-[500] text-gray-800">Have an account?</h1>
            <button
              onClick={onRealSignUp}
              className="p-3 px-5 bg-blacky hover:bg-black text-white rounded-xl flex items-center space-x-3"
            >
              <GoogleLogo weight="fill" className="w-6 h-6" />
              <span className="font-[400] text-md">Log in with Google</span>
            </button>
            <h1 className="text-2xl font-[500] text-gray-800">Create new account</h1>
            <button
              onClick={onRealSignUp}
              className="p-3 px-5 bg-blacky hover:bg-black text-white rounded-xl flex items-center space-x-3"
            >
              <GoogleLogo weight="fill" className="w-6 h-6" />
              <span className="font-[400] text-md">Sign up with Google</span>
            </button>
            {/* ... */}
          </DialogPanel>
        </div>
      </Dialog>
      {/* Header */}
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-[500] text-gray-800">HabitFundr</h1>
        <div className="flex items-center space-x-12 font-[400] text-blacky">
          <span onClick={() => {
            router.push("/faq")
          }} className="cursor-pointer hover:underline">FAQ</span>
          <span onClick={() => {
            // router.push("")
            const y = (document?.getElementById("pricing")!).getBoundingClientRect().top + window.scrollY;
            window.scroll({
              top: y,
              behavior: 'smooth'
            });
          }} className="cursor-pointer hover:underline">Pricing</span>
          <button
            onClick={onSignUp}
            className="p-3 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center space-x-3"
          >
            <PaperPlaneRight weight="fill" className="w-5 h-5" />
            <span className="font-[400] text-md">{user ? "Go to dashboard" : "Start Your Habit Journey"}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}

      <p className="text-md text-red-500 p-1 px-3 rounded-full bg-red-100 font-[400] mt-[90px]">
        $5 Price Chinese New Year Sale
      </p>
      <h1 className="font-[500] leading-[60px] text-[70px] text-gray-900 text-center mt-8">
        The only habit tracker that <br /> <span className="text-greeny">pays you</span> back.
      </h1>
      <p className="text-xl text-gray-600 font-[400] mt-10">
        Pay $5 to start. Complete a 50-day streak, and we’ll refund your $5.
      </p>
      <button
        onClick={onSignUp}
        className="mt-8 p-3 px-5 bg-blue-600 w-fit hover:bg-blue-700 text-white rounded-xl flex items-center space-x-3"
      >
        <PaperPlaneRight weight="fill" className="w-5 h-5" />
        <span className="font-[400] text-md">{user ? "Go to dashboard" : "Start Your Habit Journey"}</span>
      </button>

      <div className="flex items-center space-x-8 mt-8 translate-x-[36px]">
        <div className="flex items-center">

          <Image alt="" height={52} width={52} src={"/user1.jpg"} className="w-[52px] h-[52px] rounded-full border-[3px] border-white" />
          <Image alt="" height={52} width={52} src={"/user2.jpg"} className="w-[52px] translate-x-[-20px] h-[52px] rounded-full border-[3px] border-white" />
          <Image alt="" height={52} width={52} src={"/user3.jpg"} className="w-[52px] translate-x-[-40px] h-[52px] rounded-full border-[3px] border-white" />
          <Image alt="" height={52} width={52} src={"/user4.jpg"} className="w-[52px] translate-x-[-60px] h-[52px] rounded-full border-[3px] border-white" />
          <Image alt="" height={52} width={52} src={"/user5.jpg"} className="w-[52px] translate-x-[-80px] h-[52px] rounded-full border-[3px] border-white" />
        </div>

        <div className="flex flex-col space-y-2 translate-x-[-80px]">
          <div className="flex items-center space-x-2">
            <Star weight="fill" className="size-6 text-amber-400" />
            <Star weight="fill" className="size-6 text-amber-400" />
            <Star weight="fill" className="size-6 text-amber-400" />
            <Star weight="fill" className="size-6 text-amber-400" />
            <StarHalf weight="fill" className="size-6 text-amber-400" />
          </div>
          <div className="flex space-x-2">
            <span className="font-[500]">4.7/5</span>
            <span>from 1,127 users</span>
          </div>
        </div>

      </div>



      {/* How It Works */}

      <div className="mt-16">
        <h2 className="text-2xl font-[400] text-gray-900 mb-8">Tired of not being kept accountable?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center border-2 rounded-xl p-6">
            <div className="w-16 h-16 bg-greeny/20 text-green-500 text-primaryt rounded-xl flex items-center justify-center text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-[500] mt-4">Invest $5</h3>
            <p className="text-gray-600 mt-2">
              Commit to your goals by investing $5 to start your habit journey.
            </p>
          </div>
          <div className="flex flex-col items-center text-center border-2 rounded-xl p-6">
            <div className="w-16 h-16 bg-greeny/20 text-green-500 text-primaryt rounded-xl flex items-center justify-center text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-[500] mt-4">Track Your Habits</h3>
            <p className="text-gray-600 mt-2">
              Mark your progress daily in a intiuitive dashboard to stay consistent.
            </p>
          </div>
          <div className="flex flex-col items-center text-center border-2 rounded-xl p-6">
            <div className="w-16 h-16 bg-greeny/20 text-green-500 text-primaryt rounded-xl flex items-center justify-center text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-[500] mt-4">Get Your Refund</h3>
            <p className="text-gray-600 mt-2">
              Complete a 50-day streak and receive your $5 refund  and still keep the account.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-[500] text-gray-900 self-start mt-8">Pricing</h2>
      <div id="pricing" className="mt-8">

        <div className="flex flex-col items-center border-2 border-primary rounded-xl p-6">
          <h3 className="text-xl"><span className="text-4xl font-[400]">$5</span><span className="text-greyy">/ forever</span></h3>
          <p className="text-blacky mt-2">Just $5 to kickstart your habit journey.</p>

          <button
            onClick={onSignUp}
            className="my-6 p-3 px-5 bg-blue-600 w-fit hover:bg-blue-700 text-white rounded-xl flex items-center space-x-3"

          >

            <PaperPlaneRight weight="fill" className="w-5 h-5" />
            <span className="font-[400] text-md">{user ? "Go to dashboard" : "Start Your Habit Journey"}</span>
          </button>

          <ul className="list-disc pl-6 text-blacky/80">
            <li>📅 Daily habit tracking to maintain consistency</li>
            <li>👦 User-friendly no B.S dashboard.</li>
            <li>💲 Refund upon completing a 50-day streak.</li>
            <li>🔨 Build sustainable habits with accountability.</li>
          </ul>
        </div>

      </div>

      <h2 className="text-2xl font-[500] text-gray-900 self-start mt-8">Simple & Intuiuative</h2>
      

      <img src="/landing.png" className="w-full h-auto mt-6 border-2 border-primary rounded-xl" />



      {/* Features Section */}
      {/* <div className="mt-16">
        <h2 className="text-3xl font-[500] text-gray-900 mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              🎯
            </div>
            <div>
              <h3 className="text-xl font-[500]">Daily Habit Tracking</h3>
              <p className="text-gray-600 mt-2">
                Stay on track with easy-to-use daily tracking tools.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              🔥
            </div>
            <div>
              <h3 className="text-xl font-[500]">Motivational Streaks</h3>
              <p className="text-gray-600 mt-2">
                Build momentum and unlock streak rewards.
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Testimonials */}


      {/* Footer */}
      <footer className="mt-16 border-t pt-8 w-full">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">© 2025 HabitFundr</span>
          <div className="flex space-x-4 text-gray-600 text-sm">
            <span className="hover:underline cursor-pointer" onClick={() => {
              router.push("/tc")
            }}>Terms & Conditions</span>
            <span className="hover:underline cursor-pointer" onClick={() => {
              router.push("/privacy")
            }}>Privacy</span>
            <span className="hover:underline cursor-pointer" onClick={() => {
              window.open("mailto:vivaancut@gmail.com");
              toast.success("Email copied to clipboard and opened")
            }}>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}