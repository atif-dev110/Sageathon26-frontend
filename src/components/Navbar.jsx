import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Search, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// NOTE: We added userRole and studentId as props!
const Navbar = ({ userRole, studentId, onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [profileName, setProfileName] = useState("Loading...");
  const [profileSubtitle, setProfileSubtitle] = useState("");

  useEffect(() => {
    // 1. If it's a teacher, hardcode the Admin details
    if (userRole === 'faculty') {
      setProfileName("Admin");
      setProfileSubtitle("Teacher Console");
      return;
    }

    // 2. If it's a student, fetch their real name from the backend
    if (userRole === 'student' && studentId) {
      const fetchStudentProfile = async () => {
        try {
          // IMPORTANT: Ensure this matches your live Render URL before pushing!
          const response = await fetch(`https://sageathon-api.onrender.com/api/students/${studentId}/metrics`);
          
          if (!response.ok) throw new Error("Failed to fetch");
          
          const data = await response.json();
          const name = data.studentProfile?.name || "Student";
          const major = data.studentProfile?.major || "Computer Science";
          const sem = data.studentProfile?.semester || "4";
          
          setProfileName(name);
          setProfileSubtitle(`${major} - Sem ${sem}`);
        } catch (err) {
          console.error("Navbar fetch error:", err);
          // Fallback if network fails
          setProfileName("Student Dashboard");
          setProfileSubtitle("EduAI Portal");
        }
      };

      fetchStudentProfile();
    }
  }, [userRole, studentId]);

  // Generate a random, cool-looking avatar based on the name!
  const dynamicAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileName.replace(' ', '')}&backgroundColor=c0aede,b6e3f4,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {userRole === 'student' && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors md:hidden text-muted-foreground"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="relative w-full max-w-[150px] sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder={userRole === 'faculty' ? "Search entire database..." : "Search student records..."}
            className="w-full bg-muted/50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>

        <div className="h-8 w-[1px] bg-border mx-2"></div>

        {/* DYNAMIC USER PROFILE */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block animate-fade-in">
            <p className="text-sm font-bold leading-none">{profileName}</p>
            <p className="text-xs text-muted-foreground mt-1">{profileSubtitle}</p>
          </div>
          <img 
            src={dynamicAvatarUrl} 
            alt="Profile Avatar" 
            className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 bg-muted"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;