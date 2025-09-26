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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

function BorrowRecords() {
  const [records, setRecords] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    book_id: '',
    due_date: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const token = localStorage.getItem('token');
    const data = await fetch('http://localhost:5000/borrow_records', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
    setRecords(data);
  };

  const handleReturn = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/borrow_records/${id}/return`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Book returned successfully!');
      fetchRecords();
    } catch (_error) {
      toast.error('Failed to return book.');
    }
  };

  const handleBorrow = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:5000/borrow_records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      toast.success('Book borrowed successfully!');
      setIsDialogOpen(false);
      setFormData({ user_id: '', book_id: '', due_date: '' });
      fetchRecords();
    } catch (error) {
      toast.error('Failed to borrow book.');
    }
  };
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/borrow_records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Record deleted successfully!'); 
      fetchRecords();
    } catch (error) {
      toast.error('Failed to delete record.'); 
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Borrow Records</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className='mb-4'>Borrow Book</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Borrow a Book</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>User ID</Label>
              <Input
                value={formData.user_id}
                onChange={(e) =>
                  setFormData({ ...formData, user_id: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Book ID</Label>
              <Input
                value={formData.book_id}
                onChange={(e) =>
                  setFormData({ ...formData, book_id: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type='date'
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </div>
            <Button onClick={handleBorrow}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Book ID</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Returned</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.record_id}>
              <TableCell>{record.user_id}</TableCell>
              <TableCell>{record.book_id}</TableCell>
              <TableCell>{record.borrow_date}</TableCell>
              <TableCell>{record.due_date}</TableCell>
              <TableCell>{record.returned ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {!record.returned && (
                  <Button onClick={() => handleReturn(record.record_id)}>
                    Return
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive' className='ml-2'>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(record.record_id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default BorrowRecords;
