import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import Books from "./pages/Books"
import BorrowRecords from "./pages/BorrowRecords"
import Reports from "./pages/Reports"
import Login from "./pages/Login" // Add this import

function App() {
  const token = localStorage.getItem("token")

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {token ? (
          <>
            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
            <Route
              path="/books"
              element={
                <Layout>
                  <Books />
                </Layout>
              }
            />
            <Route
              path="/borrow-records"
              element={
                <Layout>
                  <BorrowRecords />
                </Layout>
              }
            />
            <Route
              path="/reports"
              element={
                <Layout>
                  <Reports />
                </Layout>
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
