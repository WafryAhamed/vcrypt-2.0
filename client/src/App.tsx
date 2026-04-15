import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate } from
'react-router-dom';
import { MeshProvider } from './context/MockMeshContext';
// Layouts
import Layout from './components/Layout';
// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import VehicleRegistration from './pages/VehicleRegistration';
import VehicleVerification from './pages/VehicleVerification';
import VehicleTransfer from './pages/VehicleTransfer';
import Login from './pages/Login';
// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
export function App() {
  return (
    <ThemeProvider>
      <MeshProvider>
        <AuthProvider>
          <ChatProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/register" element={<VehicleRegistration />} />
                  <Route path="/verify" element={<VehicleVerification />} />
                  <Route path="/transfer" element={<VehicleTransfer />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </Router>
          </ChatProvider>
        </AuthProvider>
      </MeshProvider>
    </ThemeProvider>);

}