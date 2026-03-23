import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import Landing from './pages/Landing'
import Form from './pages/Form'
import Results from './pages/Results'

export default function App() {
  const username = useStore((s) => s.username)

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/form"
        element={username ? <Form /> : <Navigate to="/" replace />}
      />
      <Route
        path="/results"
        element={username ? <Results /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
