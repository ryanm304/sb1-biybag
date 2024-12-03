import React from 'react';
import { BookOpen, ArrowLeftRight, CheckCircle } from 'lucide-react';
import { useLibraryStore } from '../hooks/useLibraryStore';
import { getTimeAgo } from '../utils/dateUtils';

export function RecentActivity() {
  const { loans, books } = useLibraryStore();

  // Sort loans by last updated timestamp
  const sortedLoans = [...loans].sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  ).slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {sortedLoans.map((loan) => {
          const book = books.find(b => b.id === loan.bookId);
          const isReturn = loan.returnDate;

          return (
            <div key={loan.loanNumber} className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full ${isReturn ? 'bg-green-100' : 'bg-indigo-100'} flex items-center justify-center`}>
                    {isReturn ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowLeftRight className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {isReturn ? 'Book returned' : 'Book checked out'}
                  </p>
                  <p className="text-sm text-gray-500">
                    "{book?.title}" - {isReturn ? 'Returned' : `Due ${getTimeAgo(loan.dueDate)}`}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {getTimeAgo(loan.lastUpdated)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}