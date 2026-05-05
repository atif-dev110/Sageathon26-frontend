// src/api/apiService.js

const BASE_URL = 'https://sageathon-api.onrender.com/api';

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