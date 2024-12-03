import React from 'react';
import { NavLink } from 'react-router-dom';
import { Library } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Library className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">Library Management</span>
          </div>
          <div className="flex space-x-4">
            <NavLink 
              to="/" 
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/books" 
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`
              }
            >
              Books
            </NavLink>
            <NavLink 
              to="/users" 
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`
              }
            >
              Users
            </NavLink>
            <NavLink 
              to="/loans" 
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`
              }
            >
              Loans
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}