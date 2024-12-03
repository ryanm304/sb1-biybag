import { create } from 'zustand';
import type { Book, Loan } from '../types';
import * as db from '../database/db';

interface LibraryStore {
  books: Book[];
  loans: Loan[];
  initialized: boolean;
  updateBookStatus: (bookId: number, status: 'Available' | 'Checked Out', userId?: number) => Promise<void>;
  checkoutBook: (bookId: number, userId: number) => Promise<void>;
  checkinBook: (bookId: number) => Promise<void>;
  getActiveLoan: (bookId: number) => Promise<Loan | undefined>;
  refreshData: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  books: [],
  loans: [],
  initialized: false,

  initialize: async () => {
    if (!get().initialized) {
      await db.initDatabase();
      await get().refreshData();
      set({ initialized: true });
    }
  },

  refreshData: async () => {
    const [books, loans] = await Promise.all([
      db.getAllBooks(),
      db.getAllLoans()
    ]);
    set({ books, loans });
  },

  updateBookStatus: async (bookId, status, userId) => {
    if (status === 'Checked Out' && userId) {
      await db.checkoutBook(bookId, userId);
    } else {
      await db.checkinBook(bookId);
    }
    await get().refreshData();
  },

  checkoutBook: async (bookId, userId) => {
    await db.checkoutBook(bookId, userId);
    await get().refreshData();
  },

  checkinBook: async (bookId) => {
    await db.checkinBook(bookId);
    await get().refreshData();
  },

  getActiveLoan: async (bookId) => {
    return await db.getActiveLoan(bookId);
  }
}));