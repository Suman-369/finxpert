"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";


import { useEffect } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/ui/card"; // Corrected import path
import Link from "next/link";
 // Corrected import path

// Corrected import path
import { updateDefaultAccount } from "@/actions/account";
import useFetch from "@/hooks/useFetch";
import { Switch } from "@/components/ui/ui/switch";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold capitalize bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105" style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            transform: 'translateZ(20px)',
            transformStyle: 'preserve-3d',
            transition: 'all 0.3s ease'
          }}>
            {name}
          </CardTitle>
          <div className="relative">
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
              className="cursor-pointer"
            />
            {updateDefaultLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                <div className="w-4 h-4 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
          ₹ {parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs font-medium tracking-wide" style={{
            background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
            transform: 'translateZ(10px)',
            transformStyle: 'preserve-3d',
            transition: 'all 0.3s ease'
          }}>
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

export default AccountCard;
