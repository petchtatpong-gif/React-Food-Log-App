import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import ShowAllFood from './pages/ShowAllFood'
import AddFood from './pages/AddFood'
import EditFood from './pages/EditFood'

function isLoggedIn() {
  return sessionStorage.getItem('food_auth') === 'true'
}

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1>⚠️ Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.href = '/'} style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}>
            Go to Home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/showallfood" element={<ProtectedRoute><ShowAllFood /></ProtectedRoute>} />
        <Route path="/addfood" element={<ProtectedRoute><AddFood /></ProtectedRoute>} />
        <Route path="/editfood/:id" element={<ProtectedRoute><EditFood /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
