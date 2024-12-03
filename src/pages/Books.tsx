import React, { useState } from 'react';
import { BookCard } from '../components/BookCard';
import { BookActionModal } from '../components/BookActionModal';
import { Search, Filter } from 'lucide-react';
import type { Book } from '../types';
import { useLibraryStore } from '../hooks/useLibraryStore';

export function Books() {
  const { books, checkoutBook, checkinBook } = useLibraryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [modalBook, setModalBook] = useState<Book | null>(null);
  const [modalAction, setModalAction] = useState<'checkout' | 'checkin'>('checkout');

  const genres = ['all', ...new Set(books.map(book => book.genre))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleCheckout = (book: Book) => {
    setModalBook(book);
    setModalAction('checkout');
  };

  const handleCheckin = (book: Book) => {
    setModalBook(book);
    setModalAction('checkin');
  };

  const handleModalConfirm = (userId?: number) => {
    if (!modalBook) return;

    if (modalAction === 'checkout' && userId) {
      checkoutBook(modalBook.id, userId);
    } else if (modalAction === 'checkin') {
      checkinBook(modalBook.id);
    }

    setModalBook(null);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Books Catalog</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search books..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <BookCard 
            key={book.id} 
            book={book}
            onCheckout={handleCheckout}
            onCheckin={handleCheckin}
          />
        ))}
      </div>

      {modalBook && (
        <BookActionModal
          book={modalBook}
          isOpen={true}
          action={modalAction}
          onClose={() => setModalBook(null)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
}