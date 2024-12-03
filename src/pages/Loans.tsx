import React, { useState } from 'react';
import { Search, Calendar, AlertCircle } from 'lucide-react';
import { useLibraryStore } from '../hooks/useLibraryStore';
import { format, isPast } from 'date-fns';

export function Loans() {
  const { loans, books } = useLibraryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'returned'>('all');

  const enrichedLoans = loans.map(loan => {
    const book = books.find(b => b.id === loan.bookId);
    return {
      ...loan,
      book: book!
    };
  });

  const filteredLoans = enrichedLoans.filter(loan => {
    const matchesSearch = 
      loan.book.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && !loan.returnDate) ||
      (filter === 'returned' && loan.returnDate);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Book Loans</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search loans..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'returned')}
          >
            <option value="all">All Loans</option>
            <option value="active">Active Loans</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLoans.map((loan) => (
              <tr key={loan.loanNumber} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{loan.book.title}</div>
                  <div className="text-sm text-gray-500">By: {loan.book.authorName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Checkout: {format(new Date(loan.checkoutDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Due: {format(new Date(loan.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {loan.returnDate ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Returned on {format(new Date(loan.returnDate), 'MMM d, yyyy')}
                    </span>
                  ) : isPast(new Date(loan.dueDate)) ? (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Overdue</span>
                    </div>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}