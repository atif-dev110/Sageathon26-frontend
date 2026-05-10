// src/api/apiService.js

const BASE_URL = import.meta.env.VITE_API_BASE || 'https://sageathon-api.onrender.com/api';

export const fetchStudentDashboard = async (studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/students/${studentId}/metrics`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json(); 
    // Returns: { studentProfile, currentRiskLevel, currentRiskScore, weeklyRecords }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const generateAiInsights = async (studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/insights/${studentId}/generate`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to generate AI insights');
    return await response.json();
    // Returns: { aiActionPlan: { weakestSubject, actionSteps } }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const chatWithStudent = async (studentId, message, history = []) => {
  try {
    const response = await fetch(`${BASE_URL}/chat/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to get chat response');
    }
    return await response.json();
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};