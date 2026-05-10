import React from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  BrainCircuit, 
  Lightbulb, 
  Bell, 
  Users, 
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      "sidebar-item",
      active && "active"
    )}
  >
    <Icon size={20} />
    <span className="flex-1">{label}</span>
    {active && <ChevronRight size={16} className="opacity-50" />}
  </div>
);

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Student Profile', icon: UserCircle },
    { id: 'predictions', label: 'Predictions', icon: BrainCircuit },
    { id: 'recommendations', label: 'AI Insights', icon: Lightbulb },
    // { id: 'admin', label: 'Admin View', icon: Users },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 transform w-64 border-r bg-card h-screen flex flex-col transition-transform duration-300 md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <BrainCircuit size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight gradient-text">EduAI</h1>
          </div>
          <button 
            className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.id}
            {...item}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="sidebar-item text-destructive hover:bg-destructive/10 hover:text-destructive">
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
