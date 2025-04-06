import { Button } from "@/components/ui/ui/button";
import Link from "next/link";



export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4 ">Page Not Found <span className="animate-pulse">😓</span></h2>
      <p className="text-gray-600 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
        {/* Lawde internet chalana nahi ata kya ?? Thik se search kar  Bkl <br />
        Chutiya hai kay ?? 🤔 */}
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}