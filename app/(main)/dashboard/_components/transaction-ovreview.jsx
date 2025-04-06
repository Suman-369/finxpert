"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/ui/select";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = [
  "#A52A2A", "#2E8B57", "#007B7F", "#4B8DA6", "#D4AF37",
  "#8B5A5A", "#4682B4", "#C68A2C", "#4B0082", "#FFD700"
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );
  const [groupByCategory, setGroupByCategory] = useState(false);

  const accountTransactions = transactions?.filter(
    (t) => t?.accountId === selectedAccountId
  ) || [];

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b?.date) - new Date(a?.date))
    .slice(0, 5);

  const transactionsData = accountTransactions.map((t) => ({
    name: t.description || "Untitled Transaction",
    value: Math.abs(t.amount),
    type: t.type,
    category: t.category,
    date: t.date
  }));

  let pieChartData = groupByCategory
    ? Object.entries(
        transactionsData.reduce((acc, t) => {
          if (!acc[t.category]) acc[t.category] = 0;
          acc[t.category] += t.value;
          return acc;
        }, {})
      ).map(([category, amount]) => ({
        name: category,
        value: amount
      }))
    : transactionsData;

  // Limit to top 10 by value
  pieChartData = pieChartData
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {/* Recent Transactions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 shadow-lg">
            Recent Transactions
          </CardTitle>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId} className="border-2 border-blue-500 rounded-lg shadow-md">
            <SelectTrigger className="w-[140px] bg-blue-100 hover:bg-blue-200 transition duration-200">
              <SelectValue placeholder="Select Account" className="text-gray-700" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-lg">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="hover:bg-blue-200 transition duration-150">
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center  py-4 font-bold text-destructive">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1 p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-md">
                    <p className="text-sm font-semibold leading-none truncate max-w-[160px] text-gray-800">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center",
                        transaction.type === "EXPENSE"
                          ? "text-red-600"
                          : "text-green-600"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
            Transaction Breakdown
          </CardTitle>
          <button 
            onClick={() => setGroupByCategory(!groupByCategory)}
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 cursor-pointer py-2 px-4 rounded-md transition-colors"
          >
            {groupByCategory ? "Show Individual" : "Group by Category"}
          </button>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-destructive font-bold py-4">
              No transactions to display
            </p>
          ) : (
            <div className="min-h-[250px] max-h-[400px] h-[60vh]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                  <Pie 
                    data={pieChartData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    minAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name.slice(0, 12)}${name.length > 12 ? '...' : ''} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false} className="text-sm"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ 
                      paddingTop: '10px',
                      fontSize: '12px',
                      overflowX: 'auto',
                      maxWidth: '100%',
                      whiteSpace: 'nowrap'
                    }}
                    formatter={(value) => value.length > 10 ? `${value.slice(0, 8)}...` : value}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardOverview;
