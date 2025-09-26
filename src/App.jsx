import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Books from './pages/Books';
import BorrowRecords from './pages/BorrowRecords';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { ToastProvider } from './components/ui/toast';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        {token ? (
          <>
            <Route
              path='/'
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path='/users'
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
            <Route
              path='/books'
              element={
                <Layout>
                  <Books />
                </Layout>
              }
            />
            <Route
              path='/borrow-records'
              element={
                <Layout>
                  <BorrowRecords />
                </Layout>
              }
            />
            <Route
              path='/reports'
              element={
                <Layout>
                  <Reports />
                </Layout>
              }
            />
            <Route
              path='/profile'
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route path='*' element={<NotFound />} />
          </>
        ) : (
          <Route path='*' element={<Navigate to='/login' />} />
        )}
      </Routes>
      <ToastProvider />
    </Router>
  );
}

export default App;
