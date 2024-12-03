export interface User {
  id: number;
  name: string;
  email: string;
  membershipDate: string;
  phoneNumber: string;
}

export interface Employee {
  id: number;
  name: string;
  employmentDate: string;
  position: string;
  schedule: string;
  contactInformation: string;
}

export interface Book {
  id: number;
  title: string;
  publicationYear: number;
  availabilityStatus: 'Available' | 'Checked Out';
  genre: string;
  authorName: string;
  lastUpdated?: string;
  currentLoanId?: number;
}

export interface Loan {
  loanNumber: number;
  userId: number;
  bookId: number;
  checkoutDate: string;
  returnDate: string | null;
  dueDate: string;
  lastUpdated: string;
}