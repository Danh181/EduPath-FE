import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import RegisterForm from './RegisterForm'
import LoginPage from './LoginPage'
import QuizPage from './QuizPage'
import ResultPage from './ResultPage'
import MyProfile from './MyProfile'
import Dashboard from './Dashboard'
import UserManagement from './UserManagement'
import UniversityManagement from './UniversityManagement'
import PersonalTraitManagement from './PersonalTraitManagement'
import OrganizationDashboard from './OrganizationDashboard'
import ChatBox from './ChatBox'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/universities" element={<UniversityManagement />} />
        <Route path="/personal-traits" element={<PersonalTraitManagement />} />
        <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
      </Routes>
      <ChatBox />
    </Router>
  )
}

export default App
