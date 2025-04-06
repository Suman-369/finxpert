
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import Transactiontable from '../_Components/transaction';
import { BarLoader, BeatLoader } from 'react-spinners';
import AccountChart from '../_Components/account-chart';
import { getAccountWithTransactions } from '@/actions/account';

export default async function AccountsPage ({ params}){
    const accountData = await getAccountWithTransactions(params.id);

    if (!accountData) {
      notFound();
    }
  
    // Destructure data safely
    const { transactions, balance , ...account } = accountData;

    return (
        <div className="space-y-8 px-5">
            {/* Account Details */}
            <div className="flex gap-4 items-end justify-between">
                <div>
                    <h1 className="text-5xl font-bold sm:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text capitalize">
                        {account?.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {account?.type ? `${account.type.charAt(0).toUpperCase()}${account.type.slice(1).toLowerCase()} Account` : 'Unknown Account'}
                    </p>
                </div>

                {/* Balance & Transactions */}
                <div className="text-right pb-2">
                    <div className="text-xl sm:text-2xl font-bold">₹ {parseFloat(balance).toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">{account?._count?.transactions || 0} Transactions</p>
                </div>
            </div>

            {/* charAt section */}
            <Suspense fallback={<BeatLoader className="mt-4" width={"100%"} color="#9333ea" />}>
                <AccountChart transactions={transactions}></AccountChart>
            </Suspense>

            {/* Transaction Table */}
            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
         <Transactiontable transactions={transactions}>

         </Transactiontable>
            </Suspense>
        </div>
    );
};


