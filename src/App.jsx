import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import RegisterForm from './RegisterForm'
import LoginPage from './LoginPage'
import QuizPage from './QuizPage'
import ResultPage from './ResultPage'
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
      </Routes>
      <ChatBox />
    </Router>
  )
}

export default App
