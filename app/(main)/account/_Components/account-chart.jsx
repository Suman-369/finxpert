"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/ui/select';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last 30 Days", days: 30 },
  "3M": { label: "Last 90 Days", days: 90 },
  "6M": { label: "Last 180 Days", days: 180 },
  ALL: { label: "All Time", days: null }
};

const AccountChart = ({ transactions }) => {
  const [dateRange, setDateRange] = useState("1M");

  const { filteredData, totals } = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    const totals = filtered.reduce(
      (acc, transaction) => {
        if (transaction.type === "INCOME") {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return {
      filteredData: Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date)),
      totals
    };
  }, [transactions, dateRange]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal text-[#008000] dark:text-[#00ff00] transform hover:translate-z-2 hover:shadow-lg transition-transform duration-200" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>Transaction Overview</CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className='flex justify-around mb-6 text-sm'>
        <div className="text-center">
          <p className="text-muted-foreground">Total Income</p>
          <p className="text-lg font-bold text-green-500">
          ₹ {totals.income.toFixed(2)}
          </p>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">Total Expenses</p>
          <p className="text-lg font-bold text-red-500">
          ₹ {totals.expense.toFixed(2)}
          </p>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">Net</p>
          <p className={`text-lg font-bold ${
            totals.income - totals.expense >=0?
            'text-green-500' : 'text-red-500'
          }`}>
            ₹ {(totals.income - totals.expense).toFixed(2)}
          </p>
        </div>
        </div>

        <div className='h-[300px]'>


        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3"  vertical={false}/>
            <XAxis dataKey="date" />
            <YAxis 
            className='font-bold' 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹ ${value}`}/>
            <Tooltip formatter={(value) => [`₹ ${value}`,undefined]} />
            <Legend />
            <Bar dataKey="income"  name = " Income" fill="green" radius={[4,4,0,0]}/>
            <Bar dataKey="expense" name="Expense" fill="red"  radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>

        
</div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;
