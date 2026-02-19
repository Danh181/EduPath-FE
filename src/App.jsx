import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './HomePage'
import RegisterForm from './RegisterForm'
import LoginPage from './LoginPage'
import QuizPage from './QuizPage'
import ResultPage from './ResultPage'
import MyProfile from './MyProfile'
import Dashboard from './Dashboard'
import UserManagement from './UserManagement'
import UniversityManagement from './UniversityManagement'
import PricingPage from './PricingPage'
import ChatBox from './ChatBox'
import NewsListPage from './pages/News/NewsListPage'
import NewsDetailPage from './pages/News/NewsDetailPage'

function MainLayout() {
  const location = useLocation();
  const hideChatBoxPaths = ['/login', '/register'];
  const showChatBox = !hideChatBoxPaths.includes(location.pathname);

  return (
    <>
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
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
      </Routes>
      {showChatBox && <ChatBox />}
    </>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  )
}

export default App
