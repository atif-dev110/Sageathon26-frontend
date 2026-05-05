import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Filter, 
  Download, 
  Search, 
  MoreHorizontal, 
  Eye, 
  MessageSquare,
  AlertCircle,
  Loader2,
  X // <-- Added X icon for the modal
} from 'lucide-react';
import { cn } from '../lib/utils';

const AdminDashboard = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    weekNumber: 5, // Default to next week
    subject: 'Data Structures',
    conducted: 5,
    attended: 5,
    recentAssignment: 85
  });

  // Pulled fetch logic out so we can re-call it after adding new data!
  const fetchClassData = useCallback(async () => {
    try {
      const response = await fetch(`https://sageathon-api.onrender.com/api/admin/students`);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  const filteredStudents = students.filter(student => {
    const matchesFilter = filter === 'All' || student.risk === filter;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // --- NEW HANDLERS ---
  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Formatting the exact payload your studentRoutes.js Route 3 expects!
      const payload = {
        weekNumber: parseInt(formData.weekNumber),
        subjects: [{
          name: formData.subject,
          conducted: parseInt(formData.conducted),
          attended: parseInt(formData.attended)
        }],
        recentAssignment: parseInt(formData.recentAssignment)
      };

      // Ensure this URL matches where your studentRoutes are mounted in server.js
      // Usually it is /api/students/:id/metrics
      const response = await fetch(`https://sageathon-api.onrender.com/api/students/${selectedStudent.id}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to update metrics");

      // Success! Close modal and refresh the table to see the new Risk Scores
      setIsModalOpen(false);
      fetchClassData(); 

    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to save data. Check terminal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-primary animate-pulse">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">Loading Class Roster...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teacher Console</h2>
          <p className="text-muted-foreground">Monitor and manage student performance across classes.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            <Download size={16} /> Export Reports
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-primary/20">
            <AlertCircle size={16} /> Send Alerts
          </button>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between gap-4 items-center bg-muted/20">
          <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5 w-full md:w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search size={16} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <div className="flex bg-muted p-1 rounded-lg">
              {['All', 'Low', 'Medium', 'High'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-md transition-all",
                    filter === tag ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground bg-muted/10">
                <th className="px-6 py-4 font-bold">Student Name</th>
                <th className="px-6 py-4 font-bold">Class</th>
                <th className="px-6 py-4 font-bold text-center">Performance</th>
                <th className="px-6 py-4 font-bold text-center">Attendance</th>
                <th className="px-6 py-4 font-bold">Risk Level</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    onClick={() => handleRowClick(student)} // <-- Added Click Handler
                    className="hover:bg-muted/30 transition-colors cursor-pointer group" // <-- Added pointer and group
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.class}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              student.performance > 80 ? "bg-emerald-500" : student.performance > 60 ? "bg-amber-500" : "bg-destructive"
                            )} 
                            style={{ width: `${student.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold w-8">{student.performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium">{student.attendance}%</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
                        student.risk === 'Low' ? "bg-emerald-500/10 text-emerald-500" : 
                        student.risk === 'Medium' ? "bg-amber-500/10 text-amber-500" : 
                        "bg-destructive/10 text-destructive"
                      )}>
                        {student.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => e.stopPropagation()} // <-- Prevent modal if they click actions
                          className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()} 
                          className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- THE DATA ENTRY MODAL --- */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border shadow-2xl rounded-3xl w-full max-w-md overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/20">
              <div>
                <h3 className="font-bold text-lg">Update Records</h3>
                <p className="text-xs text-muted-foreground">Log new metrics for {selectedStudent.name}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Week Number</label>
                  <input 
                    type="number" required
                    value={formData.weekNumber}
                    onChange={(e) => setFormData({...formData, weekNumber: e.target.value})}
                    className="w-full bg-muted/50 border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Recent Assignment Score</label>
                  <input 
                    type="number" required max="100"
                    value={formData.recentAssignment}
                    onChange={(e) => setFormData({...formData, recentAssignment: e.target.value})}
                    className="w-full bg-muted/50 border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground ml-1">Subject</label>
                <input 
                  type="text" required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-muted/50 border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Classes Conducted</label>
                  <input 
                    type="number" required min="1"
                    value={formData.conducted}
                    onChange={(e) => setFormData({...formData, conducted: e.target.value})}
                    className="w-full bg-muted/50 border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Classes Attended</label>
                  <input 
                    type="number" required max={formData.conducted}
                    value={formData.attended}
                    onChange={(e) => setFormData({...formData, attended: e.target.value})}
                    className="w-full bg-muted/50 border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 outline-none text-sm"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save to Database"}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;