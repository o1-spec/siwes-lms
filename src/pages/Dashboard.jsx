"use client"

import { useEffect, useState } from "react"
import { Book, Users, FileText, AlertTriangle, TrendingUp, Calendar, Clock } from "lucide-react"

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    overdueBooks: 0,
  })

  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    Promise.all([
      fetch("http://localhost:5000/books", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch("http://localhost:5000/borrow_records", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch("http://localhost:5000/reports/overdue", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([books, users, borrows, overdue]) => {
        setStats({
          totalBooks: books.length,
          totalUsers: users.length,
          activeBorrows: borrows.filter((b) => !b.return_date).length,
          overdueBooks: overdue.length,
        })

        const recent = borrows.sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date)).slice(0, 5)
        setRecentActivity(recent)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: Book,
      color: "from-gray-700 to-gray-800",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Active Borrows",
      value: stats.activeBorrows,
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      change: "-5%",
      changeType: "negative",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to LibraryMS Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Monitor and manage your library operations efficiently
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    card.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span >{card.change}</span>
                </div>
              </div>
              <div>
                <h3
                  className="text-sm font-medium text-gray-600 mb-1"
                  
                >
                  {card.title}
                </h3>
                <p
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-semibold text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              Recent Activity
            </h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium text-gray-900"
                      
                    >
                      Book borrowed by User #{activity.user_id}
                    </p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                      {new Date(activity.borrow_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2
            className="text-xl font-semibold text-gray-900 mb-6"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Book className="w-8 h-8 text-gray-600 mb-2" />
              <span
                className="text-sm font-medium text-gray-700"
                
              >
                Add Book
              </span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <span
                className="text-sm font-medium text-green-700"
                
              >
                Add User
              </span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
              <FileText className="w-8 h-8 text-purple-600 mb-2" />
              <span
                className="text-sm font-medium text-purple-700"
                
              >
                New Borrow
              </span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200">
              <Calendar className="w-8 h-8 text-orange-600 mb-2" />
              <span
                className="text-sm font-medium text-orange-700"
                
              >
                View Reports
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
