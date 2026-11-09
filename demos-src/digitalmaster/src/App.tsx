import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage.tsx'
import ProfilePage from '@/pages/ProfilePage.tsx'
import DetailsPage from '@/pages/DetailsPage.tsx'
import ClassPreview from '@/pages/ClassPreview.tsx'
import SurveyPage from '@/pages/SurveyPage.tsx'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/class" element={<ClassPreview />} />
        <Route path="/survey" element={<SurveyPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App