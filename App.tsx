import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CreatePost from './components/CreatePost';
import StreamPost from './components/StreamPost';
import { StreamPostData, Tab, ClassData } from './types';
import { solveHomework } from './services/geminiService';

// Data from the screenshot
const CLASSES: ClassData[] = [
  {
    id: 'home',
    name: 'Class of 2027',
    section: 'Homeroom',
    themeColor: 'bg-green-600',
    subjectContext: 'General High School student matters, school announcements, and general advice',
    initial: 'H',
    avatarColor: 'bg-slate-700'
  },
  {
    id: 'spanish',
    name: 'Español 2',
    section: 'P.6',
    themeColor: 'bg-purple-600',
    subjectContext: 'Spanish Language, grammar, vocabulary, and culture. Reply in a mix of Spanish and English to help the student learn.',
    initial: 'E',
    avatarColor: 'bg-purple-600'
  },
  {
    id: 'chemistry',
    name: '2026 2nd Hr Chemistry B',
    section: 'Science Dept',
    themeColor: 'bg-purple-400',
    subjectContext: 'High School Chemistry, stoichiometry, periodic table, and chemical equations.',
    initial: '2',
    avatarColor: 'bg-purple-400'
  },
  {
    id: 'economics',
    name: '1st Economics',
    section: 'SOC312-7',
    themeColor: 'bg-green-200',
    subjectContext: 'High School Economics, supply and demand, macroeconomics, and microeconomics.',
    initial: '1',
    avatarColor: 'bg-green-200 text-green-800'
  },
  {
    id: 'precalc',
    name: 'AP Precalculus',
    section: 'Math Dept',
    themeColor: 'bg-blue-400',
    subjectContext: 'AP Precalculus and preparation for AP Calculus. Cover limits, derivatives, integrals, trigonometry, logarithms, exponential functions, polynomial functions, rational functions, graphing transformations, asymptotes, continuity, rates of change, optimization, related rates, area under curves, and all foundational calculus concepts. Show all work step-by-step with clear mathematical notation.',
    initial: 'P',
    avatarColor: 'bg-blue-400'
  },
  {
    id: 'theatre',
    name: 'IB Theatre Arts 11',
    section: '2027 Cohort',
    themeColor: 'bg-pink-300',
    subjectContext: 'Theatre Arts, acting techniques, theatre history, and stage production.',
    initial: 'I',
    avatarColor: 'bg-pink-300'
  },
  {
    id: 'publications',
    name: 'Online Publications',
    section: '2025-2026',
    themeColor: 'bg-purple-300',
    subjectContext: 'Journalism, Media Studies, and Online Publishing.',
    initial: 'O',
    avatarColor: 'bg-purple-300'
  },
  {
    id: 'aal',
    name: 'p7 AAL/AC 2025-2026',
    section: '',
    themeColor: 'bg-blue-200',
    subjectContext: 'Academic Lab, Study Skills, and general homework help.',
    initial: 'P',
    avatarColor: 'bg-blue-200 text-blue-800'
  },
  {
    id: 'yearbook',
    name: 'Wahawk Yearbook',
    section: '2025-2026',
    themeColor: 'bg-cyan-600',
    subjectContext: 'Yearbook Design, Photography, and Layout.',
    initial: 'W',
    avatarColor: 'bg-cyan-600'
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity',
    section: 'Credit Recovery',
    themeColor: 'bg-orange-500',
    subjectContext: 'Ingenuity online learning platform for credit recovery. Handle ANY subject: English Language Arts (reading comprehension, essays, grammar, literature analysis), Mathematics (Algebra 1 & 2, Geometry, Pre-Algebra, Statistics), Science (Biology, Chemistry, Physics, Earth Science, Environmental Science), Social Studies (US History, World History, Government, Geography, Civics), Health, Physical Education concepts, Career readiness, and electives. Questions are typically multiple choice, short answer, or essay format. Provide the correct answer directly. For multiple choice, state which option (A, B, C, or D) is correct and why. For essays, write a complete response ready to submit.',
    initial: 'IN',
    avatarColor: 'bg-orange-500'
  }
];

const INITIAL_POSTS: StreamPostData[] = [
  {
    id: '1',
    classId: 'home',
    authorName: 'Benjamin Hirdler',
    authorAvatar: 'https://picsum.photos/id/64/100/100',
    date: '12:07 PM',
    content: `Students, please see the following announcement regarding National Honor Society (NHS) and also National Society of High School Scholars (NSHSS):

National Society of High School Scholars (NSHSS) and Honor Society are not associated with West High in any way. Membership in these groups is not recognized by West High, and any items purchased from these sites are not allowed to be worn at graduation.

National Honor Society (NHS) is the only organization that we work with to recognize academic achievement. The national organization for NHS will not reach out to students asking for money.`
  },
  {
    id: '2',
    classId: 'spanish',
    authorName: 'Señor Rodriguez',
    date: 'Yesterday',
    content: '¡Hola clase! Reminder that your conjugation worksheet for preterite tense is due this Friday.'
  },
  {
    id: '3',
    classId: 'chemistry',
    authorName: 'Mrs. White',
    date: '2 days ago',
    content: 'Please bring your safety goggles tomorrow. We are doing the titration lab.'
  }
];

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STREAM);
  const [posts, setPosts] = useState<StreamPostData[]>(INITIAL_POSTS);
  const [isSolving, setIsSolving] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('home');

  const currentClass = CLASSES.find(c => c.id === selectedClassId) || CLASSES[0];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setActiveTab(Tab.STREAM); // Reset to stream on class change
    // On mobile we might want to close sidebar, but keeping desktop behavior for now
  };

  const handleNewPost = async (content: string, attachment?: string, attachmentName?: string, attachmentMimeType?: string) => {
    // 1. Add user post
    const newPost: StreamPostData = {
      id: Date.now().toString(),
      classId: selectedClassId,
      authorName: 'You',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: content,
      attachment: attachment,
      attachmentName: attachmentName,
      attachmentMimeType: attachmentMimeType
    };
    
    setPosts(prev => [newPost, ...prev]);

    // 2. Trigger AI Solver with Context
    setIsSolving(true);
    // Use the prompt content or a default if only file is provided
    const prompt = content || `Please analyze this ${attachmentName ? 'file' : 'image'} and help me solve the problem in it.`;
    
    // Pass the file type to gemini service
    const aiResponse = await solveHomework(prompt, currentClass.subjectContext, attachment, attachmentMimeType);
    setIsSolving(false);

    // 3. Add AI Response
    const aiPost: StreamPostData = {
      id: (Date.now() + 1).toString(),
      classId: selectedClassId,
      authorName: `${currentClass.name} AI Helper`,
      date: 'Now',
      content: aiResponse.text,
      sources: aiResponse.sources,
      isAi: true
    };
    setPosts(prev => [aiPost, ...prev]);
  };

  const visiblePosts = useMemo(() => {
    return posts.filter(post => post.classId === selectedClassId);
  }, [posts, selectedClassId]);

  return (
    <div className="min-h-screen bg-white">
      <Header toggleSidebar={toggleSidebar} className="" title={currentClass.name} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        classes={CLASSES.filter(c => c.id !== 'home')} // Pass all except home since Sidebar handles home separately
        selectedClassId={selectedClassId}
        onSelectClass={handleClassSelect}
      />
      
      <main 
        className={`pt-20 transition-all duration-300 ease-in-out px-4 md:px-8 max-w-[1000px] mx-auto ${
          isSidebarOpen ? 'ml-72' : 'ml-0'
        }`}
        style={{ marginLeft: isSidebarOpen ? '18rem' : 'auto', marginRight: 'auto', width: isSidebarOpen ? 'calc(100% - 18rem)' : '100%', maxWidth: '1000px' }}
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-200 mb-4 sticky top-16 bg-white z-30 pt-2">
          <button 
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === Tab.STREAM ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab(Tab.STREAM)}
          >
            Stream
          </button>
          <button 
             className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === Tab.CLASSWORK ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
             onClick={() => setActiveTab(Tab.CLASSWORK)}
          >
            Classwork
          </button>
          <button 
             className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === Tab.PEOPLE ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
             onClick={() => setActiveTab(Tab.PEOPLE)}
          >
            People
          </button>
        </div>

        {activeTab === Tab.STREAM ? (
          <div className="animate-fade-in">
            {/* Banner */}
            <div className={`relative w-full h-60 rounded-xl overflow-hidden mb-6 shadow-sm group ${currentClass.themeColor}`}>
              {/* Illustration Background */}
              <div className={`absolute inset-0 ${currentClass.themeColor}`}>
                  <svg className="absolute right-0 bottom-0 h-full w-auto" viewBox="0 0 400 240" preserveAspectRatio="xMaxYMax" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M280 40 L350 80 L320 180 L250 140 Z" fill="white" opacity="0.1"/>
                      <path d="M360 120 L420 150 L390 220 L330 190 Z" fill="white" opacity="0.2"/>
                      <rect x="300" y="80" width="80" height="100" transform="rotate(-20 340 130)" fill="white" opacity="0.15" />
                      <path d="M310 90 L380 90 L380 95 L310 95 Z" fill="white" opacity="0.3"/>
                      <path d="M380 180 L440 210 L410 280 L350 250 Z" fill="white" opacity="0.1"/>
                  </svg>
              </div>
              
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-4xl font-normal">{currentClass.name}</h2>
                {currentClass.section && <p className="text-xl mt-2 opacity-90">{currentClass.section}</p>}
              </div>
              
              <button className="absolute bottom-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-icons">edit</span>
              </button>
            </div>

            {/* Content Columns */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              
              {/* Left Column - Upcoming */}
              <div className="hidden md:block">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm text-gray-700">Upcoming</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 mt-4">Woohoo, no work due soon!</p>
                  <div className="flex justify-end">
                    <button className="text-green-700 text-sm font-medium hover:bg-green-50 px-3 py-2 rounded transition-colors">
                      View all
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Stream */}
              <div>
                <CreatePost 
                  onPost={handleNewPost} 
                  isSolving={isSolving} 
                  classNameStr={currentClass.name}
                />
                
                {visiblePosts.length > 0 ? (
                  visiblePosts.map(post => (
                    <StreamPost key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <span className="material-icons-outlined text-4xl mb-2 text-gray-400">forum</span>
                    <p>No posts yet in this class. Start the conversation!</p>
                  </div>
                )}
                
                {/* Floating Action Help Button (just for effect) */}
                 <div className="fixed bottom-6 right-6">
                    <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                        <span className="material-icons-outlined">help_outline</span>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
             <span className="material-icons-outlined text-6xl text-gray-300 mb-4">school</span>
             <h3 className="text-xl font-medium text-gray-700">Classwork Section</h3>
             <p className="max-w-md mx-auto mt-2">
               This is where assignments would appear for {currentClass.name}.
             </p>
             <button onClick={() => setActiveTab(Tab.STREAM)} className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">
               Go to Stream
             </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;