import React from 'react';
import { Book } from '../types';
import { BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getTimeAgo } from '../utils/dateUtils';

interface BookCardProps {
  book: Book;
  onCheckout: (book: Book) => void;
  onCheckin: (book: Book) => void;
}

export function BookCard({ book, onCheckout, onCheckin }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
          <p className="text-sm text-gray-600">by {book.authorName}</p>
          <p className="text-sm text-gray-500 mt-2">
            <BookOpen className="inline-block w-4 h-4 mr-1" />
            Published in {book.publicationYear}
          </p>
          <p className="text-sm text-gray-500 mt-1">Genre: {book.genre}</p>
          {book.lastUpdated && (
            <p className="text-xs text-gray-400 mt-2 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Last updated {getTimeAgo(book.lastUpdated)}
            </p>
          )}
        </div>
        <div className="ml-4">
          {book.availabilityStatus === 'Available' ? (
            <div className="flex flex-col items-end">
              <div className="flex items-center text-green-600 mb-2">
                <CheckCircle className="w-5 h-5 mr-1" />
                <span className="text-sm">Available</span>
              </div>
              <button
                onClick={() => onCheckout(book)}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
              >
                Check Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <div className="flex items-center text-red-600 mb-2">
                <XCircle className="w-5 h-5 mr-1" />
                <span className="text-sm">Checked Out</span>
              </div>
              <button
                onClick={() => onCheckin(book)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                Check In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}