import React from 'react'

import{SignedOut,SignUpButton,SignedIn,UserButton }from "@clerk/nextjs"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header =async () => {
  await checkUser();
  return (
    <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b'>

    <nav className='container mx-auto px-4 py-0 flex items-center justify-between'>
        <Link href="/"> 
        <Image src={"/logo.png"} alt="welth logo" height={80} width={240}
        className='h-26 w-auto object-contain'
        /> 
        </Link>



      <div className='flex items-center space-x-4'>

      <SignedIn>
  <Link href={"/dashboard"} className='text-gray-600 hover:text-blue-600 flex items-center gap-2' >
    <Button variant="outline">
    <LayoutDashboard size={18} />
    <span className="hidden md:inline cursor-pointer">Dashboard</span>
    </Button>
  </Link>

  <Link href={"/transaction/create"}>
    <Button className="flex items-center gap-2">
    <PenBox size={18} />
    <span className="hidden md:inline cursor-pointer">Add Transaction</span>
    </Button>
  </Link>
</SignedIn>

    <SignedOut>
    <SignUpButton forceRedirectUrl='/dashboard'>
    <Button 
  variant="outline" 
  className="px-6 py-2 rounded-lg border border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg">Log In</Button>
    </SignUpButton>
    </SignedOut>
     <SignedIn>
     <UserButton 
  appearance={{
    elements: {
      avatarBox: "w-26 h-26 !important", 
    },
  }} 
/>
      </SignedIn>

      </div>
      </nav>
</div>

  )
}

export default Header
