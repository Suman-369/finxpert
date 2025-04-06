"use client";

import { bulkDeleteTransactions } from '@/actions/account';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/ui/badge';
import { Button } from '@/components/ui/ui/button';
import { Checkbox } from '@/components/ui/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/ui/dropdown-menu';
import { Input } from '@/components/ui/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/ui/tooltip';
import { categoryColors } from '@/data/categories';
import useFetch from '@/hooks/useFetch';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, Delete, Edit, Edit2Icon, Edit3, MoreHorizontal, RefreshCw, Search, Trash, Trash2Icon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "date", direction: "desc" });

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.field] > b[sortConfig.field] ? 1 : -1;
    } else {
      return a[sortConfig.field] < b[sortConfig.field] ? 1 : -1;
    }
  });

  const [searchTerm , setSearchTerm] = useState("");
  const [typeFilter , setTypeFilter] = useState("");
  const [recurringFilter , setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage,totalPages] = useState(1);


  const{
    loading:deleteLoading,
    fn:deleteFn,
    data:deleted,
  } = useFetch(bulkDeleteTransactions)

  
  const handleBulkDelete =async ()=>{

    if(!window.confirm(
      `Are you sure you want to delete ${selectedIds.length} transactions?`
    )){
      return
    }
    const response = await deleteFn(selectedIds);
    if (response.success) {
        toast.success("Transactions deleted successfully");
        // Optionally, refresh the transactions or update the state here
    } else {
        toast.error("Failed to delete transactions: " + response.error);
    }
  }

  useEffect(()=>{
    if(deleted && !deleteLoading){
      toast.error("Transaction deleted successfully");
    }
  },[deleted , deleteLoading])

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...sortedTransactions];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) => 
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    if (recurringFilter) {
      result = result.filter((transaction) =>
        recurringFilter === "recurring" ? transaction.isRecurring : !transaction.isRecurring
      );
    }


    // Apply Shorting

    result.sort((a,b)=>{
      let comparison = 0;
    switch (sortConfig.field) {
      case "date":
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      
    
      default:
        comparison=0;
    }

    return sortConfig.direction === "asc" ? comparison : -comparison;

    })


    return result;
  }, [sortedTransactions, searchTerm, typeFilter, recurringFilter]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === sortedTransactions.length ? [] : sortedTransactions.map((t) => t.id)
    );
  };


  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };
  return (
    <div className='space-y-4'>

      { deleteLoading && (
        <BarLoader className='mt-4' width={"100%"} color='Red'></BarLoader>
      )}
      
      {/* filters */}

      <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input 
            className='pl-8' 
            placeholder='Search Transactions...' 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className='flex gap-2'>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className='cursor-pointer font-bold'>
              <SelectValue placeholder='All Types' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='INCOME'>Income</SelectItem>
              <SelectItem value='EXPENSE'>Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className='w-[160px] cursor-pointer font-bold'>
              <SelectValue placeholder='All Transactions' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='recurring'>Recurring Only</SelectItem>
              <SelectItem value='non-recurring'>Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length>0 && (
            <div className='flex gap-2 items-center'>
              <Button onClick={handleBulkDelete} variant="destructive" className="cursor-pointer" size="sm"><Trash2Icon className='h-4 w-4 mr-2'></Trash2Icon>Delete Selected ( {selectedIds.length} )</Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button className="cursor-pointer" variant='outline' size='icon' onClick={handleClearFilters} title='Clear Filters'>
              <Delete className='h-4 w-5 text-destructive' />
            </Button>
          )}
        </div>
      </div>
    </div>

      {/* transaction */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Checkbox className='cursor-pointer'
                  onCheckedChange={handleSelectAll}
                  checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0}
                />
              </TableHead>
              <TableHead className='cursor-pointer' onClick={() => handleSort('date')}>
                Date {sortConfig.field === "date" && (sortConfig.direction === "asc" ? <ChevronUp className='inline h-4 w-4 ml-1' /> : <ChevronDown className='inline h-4 w-4 ml-1' />)}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className='cursor-pointer' onClick={() => handleSort('category')}>
                Category {sortConfig.field === "category" && (sortConfig.direction === "asc" ? <ChevronUp className='inline h-4 w-4 ml-1' /> : <ChevronDown className='inline h-4 w-4 ml-1' />)}
              </TableHead>
              <TableHead className='cursor-pointer text-right' onClick={() => handleSort('amount')}>
                <span className='inline-block'>Amount</span>
                {sortConfig.field === "amount" && (sortConfig.direction === "asc" ? <ChevronUp className='inline h-4 w-4 ml-1' /> : <ChevronDown className='inline h-4 w-4 ml-1' />)}
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      className="cursor-pointer"
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span style={{ background: categoryColors[transaction.category] }} className='px-2 py-1 rounded text-white text-sm'>
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium" style={{ color: transaction.type === "EXPENSE" ? "red" : "green" }}>
                    {transaction.type === "EXPENSE" ? "- " : "+ "}₹ {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer">
                              <RefreshCw className='h-3 w-3' />
                              {RECURRING_INTERVALS[transaction.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className='text-sm'>
                              <div className='font-medium'>Next Date:</div>
                              <div>{format(new Date(transaction.nextRecurringDate), 'PP')}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className='h-3 w-3' />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
                         className="font-bold text-blue-600 cursor-text">Fin<span className='italic text-destructive tracking-tighter'>X</span>pert<Edit2Icon className='h-1 w-1'></Edit2Icon></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive cursor-pointer"
                         onClick={()=>deleteFn([transaction.id])}
                        > <Trash className='text-destructive'></Trash>Delete
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-black text-md cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/transaction/create?edit=${transaction.id}`
                          )
                        }
                        > <Edit3></Edit3> Edit
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>



            {/* PaginationTransactionTable */}
      <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(prev => prev - 1);
                }
              }}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink 
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-primary text-white" : "cursor-pointer"}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(prev => prev + 1);
                }
              }}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      </div>
    </div>
  );
};

export default TransactionTable;
