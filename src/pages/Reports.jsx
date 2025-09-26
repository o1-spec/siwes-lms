'use client';

/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

function Reports() {
  const [reports, setReports] = useState({
    mostBorrowed: [],
    activeUsers: [],
    overdue: [],
  });

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      try {
        const [mostBorrowedRes, activeUsersRes, overdueRes] = await Promise.all(
          [
            fetch('http://localhost:5000/reports/most-borrowed', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('http://localhost:5000/reports/active-users', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('http://localhost:5000/reports/overdue', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]
        );

        const mostBorrowed = await mostBorrowedRes.json();
        const activeUsers = await activeUsersRes.json();
        const overdue = await overdueRes.json();

        setReports({ mostBorrowed, activeUsers, overdue });
      } catch (error) {
        toast.error('Failed to load reports.');
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Reports</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6'>
        <Card>
          <CardHeader>
            <CardTitle>Most Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Borrow Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.mostBorrowed.map((book) => (
                  <TableRow key={book.book_id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.borrow_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Borrows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.activeUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.borrow_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Overdue Books</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Overdue Days</TableHead>
                <TableHead>Fine ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.overdue.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.full_name}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.due_date}</TableCell>
                  <TableCell>{item.overdue_days}</TableCell>
                  <TableCell>{item.fine}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Reports;
