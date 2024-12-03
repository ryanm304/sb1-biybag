import { initWasm } from '@vlcn.io/wa-sqlite';
import { SQLite3 } from '@vlcn.io/wa-sqlite';
import type { Book, User, Employee, Loan } from '../types';
import { getCurrentTimestamp, getDueDate } from '../utils/dateUtils';

let db: SQLite3;

export const initDatabase = async () => {
  const wasmModule = await initWasm();
  db = new SQLite3('./library.db', wasmModule);
  
  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');

  // Create tables
  await db.exec(`
    -- Creating the User table
    CREATE TABLE IF NOT EXISTS User (
      UserID INTEGER PRIMARY KEY,
      Name TEXT NOT NULL,
      Email TEXT UNIQUE NOT NULL,
      MembershipDate TEXT NOT NULL,
      PhoneNumber TEXT
    );

    -- Creating the Employee table
    CREATE TABLE IF NOT EXISTS Employee (
      EmployeeID INTEGER PRIMARY KEY,
      Name TEXT NOT NULL,
      EmploymentDate TEXT NOT NULL,
      Position TEXT NOT NULL,
      Schedule TEXT,
      ContactInformation TEXT
    );

    -- Creating the Author table
    CREATE TABLE IF NOT EXISTS Author (
      AuthorName TEXT PRIMARY KEY,
      Publishes TEXT,
      Biography TEXT
    );

    -- Creating the Book table
    CREATE TABLE IF NOT EXISTS Book (
      BookID INTEGER PRIMARY KEY,
      Title TEXT NOT NULL,
      PublicationYear INTEGER,
      AvailabilityStatus TEXT NOT NULL,
      Genre TEXT,
      AuthorName TEXT,
      LastUpdated TEXT,
      CurrentLoanID INTEGER,
      FOREIGN KEY (AuthorName) REFERENCES Author(AuthorName)
    );

    -- Creating the Loan table
    CREATE TABLE IF NOT EXISTS Loan (
      LoanNumber INTEGER PRIMARY KEY,
      UserID INTEGER,
      BookID INTEGER,
      CheckoutDate TEXT NOT NULL,
      ReturnDate TEXT,
      DueDate TEXT NOT NULL,
      LastUpdated TEXT NOT NULL,
      FOREIGN KEY (UserID) REFERENCES User(UserID),
      FOREIGN KEY (BookID) REFERENCES Book(BookID)
    );
  `);

  // Insert initial data
  await insertInitialData();
};

const insertInitialData = async () => {
  // Insert Authors
  const authors = [
    ['George Orwell', 'Penguin Books', 'British writer, best known for 1984 and Animal Farm'],
    ['Jane Austen', 'Vintage Classics', 'English novelist known for Pride and Prejudice'],
    ['J.K. Rowling', 'Bloomsbury Publishing', 'Author of the Harry Potter series']
  ];

  for (const [name, publishes, bio] of authors) {
    await db.exec(
      'INSERT OR IGNORE INTO Author (AuthorName, Publishes, Biography) VALUES (?, ?, ?)',
      [name, publishes, bio]
    );
  }

  // Insert Users
  const users = [
    [1, 'John Doe', 'johndoe@example.com', '2023-01-15', '123-456-7890'],
    [2, 'Jane Smith', 'janesmith@example.com', '2023-02-20', '987-654-3210'],
    [3, 'Alice Johnson', 'alicej@example.com', '2023-03-05', '456-789-1234']
  ];

  for (const [id, name, email, date, phone] of users) {
    await db.exec(
      'INSERT OR IGNORE INTO User (UserID, Name, Email, MembershipDate, PhoneNumber) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, date, phone]
    );
  }

  // Insert Books
  const books = [
    [201, '1984', 1949, 'Available', 'Dystopian', 'George Orwell'],
    [202, 'Pride and Prejudice', 1813, 'Available', 'Romance', 'Jane Austen'],
    [203, "Harry Potter and the Sorcerer's Stone", 1997, 'Available', 'Fantasy', 'J.K. Rowling']
  ];

  for (const [id, title, year, status, genre, author] of books) {
    await db.exec(
      'INSERT OR IGNORE INTO Book (BookID, Title, PublicationYear, AvailabilityStatus, Genre, AuthorName, LastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, year, status, genre, author, getCurrentTimestamp()]
    );
  }
};

export const getAllBooks = async (): Promise<Book[]> => {
  return await db.execO('SELECT * FROM Book');
};

export const getAllUsers = async (): Promise<User[]> => {
  return await db.execO('SELECT * FROM User');
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  return await db.execO('SELECT * FROM Employee');
};

export const getAllLoans = async (): Promise<Loan[]> => {
  return await db.execO('SELECT * FROM Loan');
};

export const checkoutBook = async (bookId: number, userId: number): Promise<void> => {
  const timestamp = getCurrentTimestamp();
  const dueDate = getDueDate();
  const loanNumber = Date.now();

  await db.exec('BEGIN TRANSACTION');
  try {
    // Create new loan
    await db.exec(
      `INSERT INTO Loan (LoanNumber, UserID, BookID, CheckoutDate, ReturnDate, DueDate, LastUpdated)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [loanNumber, userId, bookId, timestamp, null, dueDate, timestamp]
    );

    // Update book status
    await db.exec(
      `UPDATE Book 
       SET AvailabilityStatus = 'Checked Out', LastUpdated = ?, CurrentLoanID = ?
       WHERE BookID = ?`,
      [timestamp, loanNumber, bookId]
    );

    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
};

export const checkinBook = async (bookId: number): Promise<void> => {
  const timestamp = getCurrentTimestamp();

  await db.exec('BEGIN TRANSACTION');
  try {
    // Update loan
    await db.exec(
      `UPDATE Loan 
       SET ReturnDate = ?, LastUpdated = ?
       WHERE BookID = ? AND ReturnDate IS NULL`,
      [timestamp, timestamp, bookId]
    );

    // Update book status
    await db.exec(
      `UPDATE Book 
       SET AvailabilityStatus = 'Available', LastUpdated = ?, CurrentLoanID = NULL
       WHERE BookID = ?`,
      [timestamp, bookId]
    );

    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
};

export const getActiveLoan = async (bookId: number): Promise<Loan | undefined> => {
  const loans = await db.execO(
    'SELECT * FROM Loan WHERE BookID = ? AND ReturnDate IS NULL',
    [bookId]
  );
  return loans[0];
};