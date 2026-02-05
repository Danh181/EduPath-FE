import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import RegisterForm from './RegisterForm'
import LoginPage from './LoginPage'
import QuizPage from './QuizPage'
import ChatBox from './ChatBox'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
      <ChatBox />
    </Router>
  )
}

export default App
