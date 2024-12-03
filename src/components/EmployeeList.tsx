import React from 'react';
import { User, Calendar, Clock } from 'lucide-react';
import { Employee } from '../types';
import { format } from 'date-fns';

const employees: Employee[] = [
  {
    id: 101,
    name: 'Emma Brown',
    employmentDate: '2022-11-01',
    position: 'Head Librarian',
    schedule: 'Mon-Fri 9 AM-5 PM',
    contactInformation: 'emma.brown@library.com'
  },
  {
    id: 102,
    name: 'Liam Wilson',
    employmentDate: '2023-02-15',
    position: 'Assistant Librarian',
    schedule: 'Tue-Sat 10 AM-6 PM',
    contactInformation: 'liam.wilson@library.com'
  }
];

export function EmployeeList() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {employees.map((employee) => (
          <div key={employee.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Started {format(new Date(employee.employmentDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{employee.schedule}</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {employee.contactInformation}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}