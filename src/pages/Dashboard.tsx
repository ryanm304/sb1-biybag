import React from 'react';
import { BookOpen, Users, Calendar, Clock } from 'lucide-react';
import { useLibraryStore } from '../hooks/useLibraryStore';
import { getTimeAgo } from '../utils/dateUtils';
import { RecentActivity } from '../components/RecentActivity';
import { EmployeeList } from '../components/EmployeeList';

export function Dashboard() {
  const { books, loans } = useLibraryStore();
  const activeLoans = loans.filter(loan => !loan.returnDate);
  const overdueLoans = activeLoans.filter(loan => new Date(loan.dueDate) < new Date());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-semibold text-gray-900">{books.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-semibold text-gray-900">{activeLoans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Returns</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loans.filter(loan => loan.returnDate && 
                  new Date(loan.returnDate).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">{overdueLoans.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <RecentActivity />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Library Staff</h2>
          <EmployeeList />
        </div>
      </div>
    </div>
  );
}