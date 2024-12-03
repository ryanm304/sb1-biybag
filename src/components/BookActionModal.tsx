import React, { useState } from 'react';
import { X, BookOpen, User, Calendar } from 'lucide-react';
import type { Book, User as UserType } from '../types';
import { formatDate, getDueDate } from '../utils/dateUtils';

interface BookActionModalProps {
  book: Book;
  isOpen: boolean;
  action: 'checkout' | 'checkin';
  onClose: () => void;
  onConfirm: (userId?: number) => void;
}

const mockUsers: UserType[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
    membershipDate: '2023-01-15',
    phoneNumber: '123-456-7890'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    membershipDate: '2023-02-20',
    phoneNumber: '987-654-3210'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alicej@example.com',
    membershipDate: '2023-03-05',
    phoneNumber: '456-789-1234'
  }
];

export function BookActionModal({ book, isOpen, action, onClose, onConfirm }: BookActionModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const dueDate = getDueDate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (action === 'checkout' && !selectedUserId) return;
    onConfirm(action === 'checkout' ? Number(selectedUserId) : undefined);
    setSelectedUserId('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {action === 'checkout' ? 'Check Out Book' : 'Check In Book'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-4">
            <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="font-medium">{book.title}</span>
          </div>
          
          {action === 'checkout' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Member
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a member...</option>
                  {mockUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Due Date Information</p>
                    <p className="text-sm text-yellow-700">
                      This book will be due on: <span className="font-semibold">{formatDate(dueDate)}</span>
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      All books must be returned within 7 days of checkout
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={action === 'checkout' && !selectedUserId}
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm {action === 'checkout' ? 'Check Out' : 'Check In'}
          </button>
        </div>
      </div>
    </div>
  );
}