import React from 'react';
import { ClassData } from '../types';

interface SidebarProps {
  isOpen: boolean;
  classes: ClassData[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
}

const SidebarItem: React.FC<{ 
  icon?: string; 
  label: string; 
  subLabel?: string; 
  active?: boolean; 
  avatarColor?: string; 
  letter?: string;
  onClick?: () => void;
}> = ({ 
  icon, label, subLabel, active, avatarColor, letter, onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
    >
      {letter ? (
         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${avatarColor || 'bg-gray-500'}`}>
           {letter}
         </div>
      ) : (
        <span className={`material-icons-outlined ${active ? 'text-blue-700' : 'text-gray-500'}`}>{icon || 'class'}</span>
      )}
      <div className="flex flex-col overflow-hidden">
        <span className={`text-sm font-medium truncate ${active ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
        {subLabel && <span className="text-xs text-gray-500 truncate">{subLabel}</span>}
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, classes, selectedClassId, onSelectClass }) => {
  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 sidebar-scroll overflow-y-auto ${
        isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full'
      }`}
    >
      <div className="py-2">
        <SidebarItem 
          icon="home" 
          label="Home" 
          active={selectedClassId === 'home'} 
          onClick={() => onSelectClass('home')}
        />
        <SidebarItem icon="calendar_today" label="Calendar" />
      </div>
      
      <div className="border-t border-gray-200 my-1 pt-2">
        <div className="px-6 py-2 flex items-center justify-between cursor-pointer group">
           <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Enrolled</span>
           <span className="material-icons-outlined text-gray-500 text-sm">expand_less</span>
        </div>
        
        <SidebarItem icon="assignment" label="To-do" />
        
        {classes.map((cls) => (
          <SidebarItem 
            key={cls.id}
            letter={cls.initial} 
            avatarColor={cls.avatarColor} 
            label={cls.name} 
            subLabel={cls.section} 
            active={selectedClassId === cls.id}
            onClick={() => onSelectClass(cls.id)}
          />
        ))}
      </div>
       <div className="border-t border-gray-200 my-1 pt-2">
           <SidebarItem icon="archive" label="Archived classes" />
           <SidebarItem icon="settings" label="Settings" />
       </div>
    </aside>
  );
};

export default Sidebar;