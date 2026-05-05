export const mockStudentData = {
  id: "STU12345",
  name: "Akshita Yadav",
  class: "Grade 12 - Section A",
  attendance: 92,
  overallPerformance: 88,
  riskLevel: "Low",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Akshita",
  performanceTrends: [
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 85 },
    { month: "May", score: 88 },
  ],
  subjectPerformance: [
    { subject: "Mathematics", score: 92, average: 78 },
    { subject: "Physics", score: 85, average: 72 },
    { subject: "Chemistry", score: 88, average: 75 },
    { subject: "Computer Science", score: 95, average: 82 },
    { subject: "English", score: 80, average: 70 },
  ],
  predictedScores: [
    { exam: "Final Exam", subject: "Math", predicted: 94, current: 92 },
    { exam: "Final Exam", subject: "Physics", predicted: 89, current: 85 },
    { exam: "Final Exam", subject: "Chemistry", predicted: 91, current: 88 },
  ],
  recommendations: [
    {
      id: 1,
      title: "Focus on weak subjects",
      description: "Spend 2 more hours on English grammar and literature.",
      icon: "BookOpen",
      color: "blue",
    },
    {
      id: 2,
      title: "Revise Unit 3 - Physics",
      description: "AI detected a slight dip in 'Electromagnetism' quiz scores.",
      icon: "Zap",
      color: "purple",
    },
    {
      id: 3,
      title: "Prepare for Math Olympiad",
      description: "Based on your high performance, we suggest taking the Olympiad.",
      icon: "Trophy",
      color: "amber",
    },
  ],
  alerts: [
    { id: 1, type: "warning", message: "Chemistry quiz next week", date: "2026-05-10" },
    { id: 2, type: "info", message: "Attendance dropped by 2% this week", date: "2026-05-01" },
  ]
};

export const mockAllStudents = [
  { id: 1, name: "Akshita Yadav", class: "12-A", performance: 88, risk: "Low", attendance: 92 },
  { id: 2, name: "Rahul Sharma", class: "12-A", performance: 65, risk: "Medium", attendance: 78 },
  { id: 3, name: "Sanya Gupta", class: "12-B", performance: 95, risk: "Low", attendance: 98 },
  { id: 4, name: "Vikram Singh", class: "12-A", performance: 42, risk: "High", attendance: 65 },
  { id: 5, name: "Priya Patel", class: "12-C", performance: 72, risk: "Medium", attendance: 85 },
];
