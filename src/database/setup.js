import Database from 'better-sqlite3';

const db = new Database('library.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
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
const insertInitialData = () => {
  // Insert Authors
  const authors = [
    ['George Orwell', 'Penguin Books', 'British writer, best known for 1984 and Animal Farm'],
    ['Jane Austen', 'Vintage Classics', 'English novelist known for Pride and Prejudice'],
    ['J.K. Rowling', 'Bloomsbury Publishing', 'Author of the Harry Potter series']
  ];

  const insertAuthor = db.prepare('INSERT OR IGNORE INTO Author (AuthorName, Publishes, Biography) VALUES (?, ?, ?)');
  authors.forEach(author => insertAuthor.run(author));

  // Insert Users
  const users = [
    [1, 'John Doe', 'johndoe@example.com', '2023-01-15', '123-456-7890'],
    [2, 'Jane Smith', 'janesmith@example.com', '2023-02-20', '987-654-3210'],
    [3, 'Alice Johnson', 'alicej@example.com', '2023-03-05', '456-789-1234']
  ];

  const insertUser = db.prepare('INSERT OR IGNORE INTO User (UserID, Name, Email, MembershipDate, PhoneNumber) VALUES (?, ?, ?, ?, ?)');
  users.forEach(user => insertUser.run(user));

  // Insert Employees
  const employees = [
    [101, 'Emma Brown', '2022-11-01', 'Head Librarian', 'Mon-Fri 9 AM-5 PM', 'emma.brown@library.com'],
    [102, 'Liam Wilson', '2023-02-15', 'Assistant Librarian', 'Tue-Sat 10 AM-6 PM', 'liam.wilson@library.com']
  ];

  const insertEmployee = db.prepare('INSERT OR IGNORE INTO Employee (EmployeeID, Name, EmploymentDate, Position, Schedule, ContactInformation) VALUES (?, ?, ?, ?, ?, ?)');
  employees.forEach(employee => insertEmployee.run(employee));

  // Insert Books
  const books = [
    [201, '1984', 1949, 'Available', 'Dystopian', 'George Orwell', new Date().toISOString(), null],
    [202, 'Pride and Prejudice', 1813, 'Available', 'Romance', 'Jane Austen', new Date().toISOString(), null],
    [203, "Harry Potter and the Sorcerer's Stone", 1997, 'Available', 'Fantasy', 'J.K. Rowling', new Date().toISOString(), null]
  ];

  const insertBook = db.prepare('INSERT OR IGNORE INTO Book (BookID, Title, PublicationYear, AvailabilityStatus, Genre, AuthorName, LastUpdated, CurrentLoanID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  books.forEach(book => insertBook.run(book));
};

try {
  insertInitialData();
  console.log('Database setup completed successfully!');
} catch (error) {
  console.error('Error setting up database:', error);
}