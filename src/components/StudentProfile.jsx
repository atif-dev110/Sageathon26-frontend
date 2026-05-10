import React, { useState, useEffect } from 'react';
import { Calendar, GraduationCap, Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const StudentProfile = ({ studentId = "69f6a965466b9adf2bf693ca" }) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://sageathon-api.onrender.com/api/students/${studentId}/metrics`);
        if (!response.ok) throw new Error('Failed to fetch student profile');
        
        const json = await response.json();
        setProfileData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg font-medium text-muted-foreground animate-pulse">Loading Profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-destructive bg-destructive/10 rounded-xl border border-destructive/20 text-center">Error: {error}</div>;
  }

  // 1. Extract live data from backend
  const { studentProfile, weeklyRecords } = profileData;

  // 2. Generate placeholders for UI elements not yet in the database
  const dynamicAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${studentProfile.name}&backgroundColor=e2e8f0`;
  const dynamicEmail = `${studentProfile.name.split(' ')[0].toLowerCase()}.${studentProfile.studentId.toLowerCase().substring(0,4)}@school.com`;
  const placeholderPhone = "+91 98765 43210";
  const placeholderLocation = "New Delhi, India";

  // 3. Transform the latest week's data for the table
  const latestWeek = weeklyRecords && weeklyRecords.length > 0 
    ? weeklyRecords[weeklyRecords.length - 1] 
    : { subjects: [] };

 const subjectStats = latestWeek.subjects.map(sub => {
    // Calculate live attendance (Safe division)
    const attendancePercent = sub.conducted > 0 ? Math.round((sub.attended / sub.conducted) * 100) : 100;
    
    // Calculate live score from assignments (WITH SAFETY NET)
    let totalScore = 0;
    let totalMax = 0;
    
    // Only run the loop if assignments actually exist in the database!
    if (sub.assignments && Array.isArray(sub.assignments)) {
      sub.assignments.forEach(assignment => {
        totalScore += assignment.score;
        totalMax += assignment.maxScore;
      });
    }

    // If no assignments exist yet, default their score to 100% 
    const scorePercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 100;

    return {
      name: sub.name,
      attendance: attendancePercent,
      score: scorePercent,
      isPassing: scorePercent >= 40 
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 -mt-12 items-center sm:items-end text-center sm:text-left">
            <img 
              src={dynamicAvatar} 
              alt="Profile" 
              className="w-32 h-32 rounded-2xl border-4 border-card bg-white shadow-lg object-cover"
            />
            <div className="flex-1 pb-2">
              <h2 className="text-3xl font-bold">{studentProfile.name}</h2>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <GraduationCap size={16} />
                {studentProfile.major} - Sem {studentProfile.semester} | ID: {studentProfile.studentId}
              </p>
            </div>
            <div className="flex gap-3 pb-2">
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-6">
              <h3 className="font-bold text-lg border-b pb-2">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail size={18} className="text-primary" />
                  <span>{dynamicEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={18} className="text-primary" />
                  <span>{placeholderPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={18} className="text-primary" />
                  <span>{placeholderLocation}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h3 className="font-bold text-lg border-b pb-2">Current Subject-wise Scores</h3>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-left">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-sm">Subject</th>
                      <th className="px-4 py-3 font-semibold text-sm">Attendance</th>
                      <th className="px-4 py-3 font-semibold text-sm">Score</th>
                      <th className="px-4 py-3 font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {subjectStats.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">{sub.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{sub.attendance}%</td>
                        <td className="px-4 py-3 text-sm font-bold">{sub.score}%</td>
                        <td className="px-4 py-3">
                          {sub.isPassing ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                              <CheckCircle2 size={12} />
                              Passing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
                              <AlertCircle size={12} />
                              Warning
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;