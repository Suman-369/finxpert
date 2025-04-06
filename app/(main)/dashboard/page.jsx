import React, { Suspense } from 'react';
import { Plus } from 'lucide-react';
import Accountcard from './_components/account-card';
import BudgetProgress from './_components/budget-progress';
import { getCurrentBudget } from "@/actions/budget";
import { getDashboardData, getUserAccount } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/ui/create-account-drawer";
import { Card, CardContent } from "@/components/ui/ui/card";
import DashboardOverview from './_components/transaction-ovreview';

async function DashboardPage() {
    const accounts = await getUserAccount();
    const defaultAccount = accounts?.find((account) => account.isDefault);
    let budgetData = null;
    
    if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id);
    }
    
    const transaction = await getDashboardData();
    
    return (
        <div className='space-y-8'>
            {/* budget progress */}
            {defaultAccount && (
                <BudgetProgress
                    initialBudget={budgetData?.budget}
                    currentExpenses={budgetData?.currentExpenses || 0}
                />
            )}

            {/* Overview */}
            <Suspense fallback={"Loading Overview...."}>
                <DashboardOverview
                    accounts={accounts}
                    transactions={transaction || []}
                />
            </Suspense>

            {/* account grid */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <CreateAccountDrawer>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                        <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                            <Plus className='h-10 w-10 mb-2' />
                            <p className='text-sm font-medium'>
                                Add new Account
                            </p>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>
                
                {accounts.length > 0 && accounts?.map((account) => (
                    <Accountcard key={account.id} account={account} />
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;
