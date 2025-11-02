import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ChartBuilder from './pages/ChartBuilder';
import ChartView from './pages/ChartView';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/builder" element={<ChartBuilder />} />
            <Route path="/chart/:id" element={<ChartView />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;