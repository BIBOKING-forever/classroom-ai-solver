import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
  className: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, className, title }) => {
  return (
    <header className={`flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16 ${className}`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <span className="material-icons-outlined text-2xl">menu</span>
        </button>
        
        <div className="flex items-center gap-2 text-gray-600 hover:text-green-700 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center bg-yellow-400 rounded-sm border-2 border-green-600 relative overflow-hidden">
             <span className="material-icons text-green-700 text-xl">person</span>
          </div>
          <span className="text-xl font-normal text-gray-600 hover:underline">Classroom</span>
        </div>
        
        <span className="text-gray-500 material-icons-outlined text-lg">navigate_next</span>
        
        <h1 className="text-xl font-normal text-gray-800 truncate max-w-[200px] md:max-w-md">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <span className="material-icons-outlined">apps</span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <span className="material-icons-outlined">add</span>
        </button>
        <div className="ml-2 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;