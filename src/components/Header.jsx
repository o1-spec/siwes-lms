import { BookOpen, GraduationCap } from "lucide-react"

export default function Header({ showNavigation = false }) {
  return (
    <header className="bg-white border-b border-border shadow-sm py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LibraryMS</h1>
              <p className="text-xs text-muted-foreground">Academic Library System</p>
            </div>
          </div>

          {showNavigation && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Books
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Users
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Reports
              </a>
            </nav>
          )}

          {/* Academic Badge */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">CSC 394</span>
          </div>
        </div>
      </div>
    </header>
  )
}
