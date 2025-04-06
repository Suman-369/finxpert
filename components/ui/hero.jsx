"use client";

import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import { useEffect, useRef} from "react"
import { testimonialsData } from "@/data/landing";



const HeroSection = () => {


 const imageRef = useRef(null);

 useEffect(()=>{
    const handleScroll = ()=>{
        const scrollPosition = window.scrollY
        const scrollThreshold = 100;

        if (imageRef.current) {
            if (scrollPosition > scrollThreshold) {
                imageRef.current.classList.add("scrolled");
                
            } else {
                imageRef.current.classList.remove("scrolled");
            }
        }
    }
    window.addEventListener("scroll",handleScroll)

    return ()=> window.removeEventListener("scroll",handleScroll)
 },[])

  return (
    <div className='pb-20 px-4'>
        <div className="container mx-auto text-center">
        <h1 class="text-7xl font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-400 to-purple-500 drop-shadow-[6px_6px_12px_rgba(0,0,0,0.3)]">
    Fin<span class="text-red-600 italic drop-shadow-[4px_4px_8px_rgba(255,0,0,0.6)]">X</span> pert <br /> 
    <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-600 to-amber-600 drop-shadow-[5px_5px_12px_rgba(0,0,0,0.3)]">
        Secure Your Dream Lifestyle
    </span>
</h1>
            <p className="text-xl text-gray-600 mb-8 mt-5 max-w-2xl mx-auto">
                An AI-Powerd Financial Management Platform That helps You Track , Analyze and Optimize Your Spending With Real-Time Insights. 
            </p>

            <div className="flex justify-center space-x-4">
                <Link href="/dashboard">
                    <Button size="lg" className="px-8">Get Started</Button>
                </Link>
            </div>
            <div className="hero-image-wrapper">
                <div ref={imageRef} className="hero-image">
                    <Image src="/bannar.jpg" width={900} height={300}
                    alt="Dashboard Preview" priority className="rounded-lg shadow-2xl border mx-auto"></Image>
                  
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeroSection