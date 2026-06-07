import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Lock, Star, Menu, Grid, Users, ChevronDown, ChevronUp, Gift, UserCircle, Edit3, Save, Settings, AlertTriangle, Book, Trash2, Flame } from 'lucide-react';
import { LessonMeta, ErrorItem } from '../types';
import { getCompletionStatus, getStreak, getErrors, removeError } from '../lib/storage';

export default function LessonList() {
  const [lessons, setLessons] = useState<LessonMeta[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'learn' | 'profile' | 'notebook' | 'settings'>('learn');

  useEffect(() => {
    fetch('/data/course-index.json')
      .then(res => res.json())
      .then(data => {
        setLessons(data);
        setCompletedLessons(getCompletionStatus());
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading course index:", err);
        setLoading(false);
      });
  }, []);

  // Group lessons by Chapter
  const groupedLessons = useMemo(() => {
    return lessons.reduce((acc, lesson) => {
      const chapter = lesson.chapter || 'Các bài học khác';
      if (!acc[chapter]) acc[chapter] = [];
      acc[chapter].push(lesson);
      return acc;
    }, {} as Record<string, LessonMeta[]>);
  }, [lessons]);

  // Expand active chapter on load
  useEffect(() => {
    if (Object.keys(groupedLessons).length > 0) {
      let activeChapter = '';
      for (const [chapter, stageLessons] of Object.entries(groupedLessons)) {
        const hasUncompleted = stageLessons.some(l => !completedLessons.includes(l.id));
        if (hasUncompleted) {
          activeChapter = chapter;
          break;
        }
      }
      if (!activeChapter) {
        activeChapter = Object.keys(groupedLessons).pop() || '';
      }
      setExpandedChapters(prev => ({ ...prev, [activeChapter]: true }));
    }
  }, [groupedLessons, completedLessons]);

  const toggleChapter = (chapter: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapter]: !prev[chapter]
    }));
  };

  const activeLessonId = useMemo(() => {
    for (const stageLessons of Object.values(groupedLessons)) {
      for (const lesson of stageLessons) {
        if (!completedLessons.includes(lesson.id)) {
          return lesson.id;
        }
      }
    }
    return null;
  }, [groupedLessons, completedLessons]);

  if (loading) {
    return <div className="flex w-full min-h-screen items-center justify-center text-ink/60 font-heading text-2xl">Đang tải chặng đường...</div>;
  }

  const xp = completedLessons.length * 10;

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 border-r-2 border-ink sticky top-0 h-screen shrink-0 bg-paper/50 backdrop-blur-sm">
        <div className="p-6 mt-4">
          <h1 className="text-4xl font-heading text-ink font-bold flex items-center gap-3">
            <span className="text-3xl">📝</span> My Notes
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-4 mt-8 text-ink text-lg">
          <button 
            onClick={() => setActiveTab('learn')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors sketchy-border ${activeTab === 'learn' ? 'bg-highlighter/30 shadow-sm border-ink' : 'border-transparent hover:border-ink hover:bg-black/5'}`}
          >
            <Grid className="w-6 h-6" strokeWidth={1.5} /> Học tập
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors sketchy-border ${activeTab === 'profile' ? 'bg-highlighter/30 shadow-sm border-ink' : 'border-transparent hover:border-ink hover:bg-black/5'}`}
          >
            <Users className="w-6 h-6" strokeWidth={1.5} /> Hồ sơ
          </button>
          <button 
            onClick={() => setActiveTab('notebook')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors sketchy-border ${activeTab === 'notebook' ? 'bg-highlighter/30 shadow-sm border-ink' : 'border-transparent hover:border-ink hover:bg-black/5'}`}
          >
            <Book className="w-6 h-6" strokeWidth={1.5} /> Sổ tay lỗi sai
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors sketchy-border ${activeTab === 'settings' ? 'bg-highlighter/30 shadow-sm border-ink' : 'border-transparent hover:border-ink hover:bg-black/5'}`}
          >
            <Settings className="w-6 h-6" strokeWidth={1.5} /> Cài đặt
          </button>
        </nav>
      </aside>

      {/* Main Learning Content Area */}
      <div className="flex-1 flex flex-col items-center">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 w-full bg-paper/90 backdrop-blur-md border-b-2 border-ink flex items-center justify-between px-5 py-4">
           <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span className="font-heading font-bold text-ink text-2xl">My Notes</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold text-ink">
            <div className="flex items-center gap-1.5 bg-highlighter/80 px-3 py-1.5 sketchy-border shadow-sm text-base">
              <Star className="w-5 h-5" strokeWidth={1.5} />
              <span>{xp} XP</span>
            </div>
            <Menu className="w-7 h-7" strokeWidth={1.5} />
          </div>
        </header>

        {/* Content Container */}
        <div className="w-full max-w-2xl px-4 py-8 pb-32">
          
          {/* Desktop Stats Header */}
          <div className="hidden md:flex justify-end mb-10 mt-4">
            <div className="flex items-center gap-2 bg-highlighter px-5 py-2 sketchy-border text-lg font-bold shadow-sm text-ink group cursor-pointer hover:-translate-y-0.5 transition-transform">
              <Star className="w-6 h-6 text-red-pen group-hover:animate-spin" strokeWidth={1.5} />
              <span>{xp} XP</span>
            </div>
          </div>

          {/* Map through Chapters or Profile */}
          {activeTab === 'learn' && (
            Object.entries(groupedLessons).map(([chapterName, stageLessons], chapterIndex) => {
               // Calculate chapter progress
               const chapterCompleted = stageLessons.filter(l => completedLessons.includes(l.id)).length;
               const totalInChapter = stageLessons.length;
               

               const stickyThemes = [
                 'bg-[#FFD1DC]', 
                 'bg-[#C1E1C1]', 
                 'bg-[#C1D4E3]', 
                 'bg-[#FEF08A]', 
               ];
               const bgSticky = stickyThemes[chapterIndex % stickyThemes.length];
               const isExpanded = expandedChapters[chapterName];
  
               return (
                <div key={chapterName} className="mb-20">
                  {/* Chapter Banner - Sticky Note Style */}
                  <div 
                    onClick={() => toggleChapter(chapterName)}
                    className={`${bgSticky} cursor-pointer text-ink p-6 mb-12 shadow-md relative overflow-hidden sketchy-card -rotate-1 hover:rotate-0 transition-transform duration-300 mx-2`}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-sky-200/50 backdrop-blur-sm -rotate-2 opacity-50 z-20"></div>
                    <div className="relative z-10 flex justify-between items-center">
                      <div>
                        <h2 className="text-3xl font-heading font-bold mb-2">{chapterName}</h2>
                        <p className="opacity-80">Tiến độ: {chapterCompleted}/{totalInChapter} bài đã hoàn thành.</p>
                      </div>
                      <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white/50 rounded-full sketchy-border border-ink/30">
                        {isExpanded ? <ChevronUp className="w-6 h-6 text-ink" strokeWidth={2}/> : <ChevronDown className="w-6 h-6 text-ink" strokeWidth={2}/>}
                      </div>
                    </div>
                    <BookOpenIcon className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
                  </div>
  
                  {/* Path Map */}
                  {isExpanded && (
                    <div className="relative flex flex-col items-center gap-12 animate-in fade-in slide-in-from-top-4 duration-500">
                      {/* The Line - made to look like a drawn marker line */}
                      <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-1.5 bg-ink/20 border-x border-ink/10 z-0 border-dashed"></div>
  
                      {stageLessons.map((lesson, lessonIndex) => {
                      const isComplete = completedLessons.includes(lesson.id);
                      const isLatestActive = lesson.id === activeLessonId;
                      
                      // Zig-zag alignment
                      const alignmentPattern = ['-translate-x-24', 'translate-x-0', 'translate-x-24', 'translate-x-0'];
                      const alignment = alignmentPattern[lessonIndex % 4];
  
                      // Determine colors based on state
                      let buttonBgClass = "bg-white text-ink/40 border-ink/40";
                      let InnerIcon = Lock;
  
                      if (isComplete) {
                        buttonBgClass = `bg-highlighter text-ink border-ink`;
                        InnerIcon = Check;
                      } else if (isLatestActive) {
                        buttonBgClass = `${bgSticky} text-ink border-ink group-hover:scale-110`;
                        InnerIcon = Star;
                      }
  
                      const isLocked = !isComplete && !isLatestActive;

                      return (
                        <div key={lesson.id} className={`relative z-10 flex flex-col items-center ${alignment} group`}>
                          {/* Tooltip for Active Node */}
                          {isLatestActive && (
                            <div className={`absolute -top-16 animate-bounce bg-white px-5 py-3 sketchy-border shadow-md text-sm text-ink whitespace-nowrap rotate-2 z-30 font-heading text-lg`}>
                              Let's go! 🚀
                              <div className="w-3 h-3 bg-white border-b-2 border-r-2 border-ink -rotate-45 absolute -bottom-[7px] left-1/2 -translate-x-1/2"></div>
                            </div>
                          )}
  
                          {/* Interactive Node */}
                          <button 
                            onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
                            className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center transition-all ${buttonBgClass} ${!isLocked ? 'sketchy-button' : 'cursor-not-allowed opacity-80'}`}
                            disabled={isLocked}
                          >
                            {InnerIcon === Star && isLatestActive ? (
                               <Star className="w-10 h-10 md:w-12 md:h-12 fill-highlighter text-ink drop-shadow-sm" strokeWidth={1.5} />
                            ) : (
                               <InnerIcon className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
                            )}
                          </button>
  
                          {/* Title Floating */}
                          <div className="mt-4 text-center w-48 bg-white/80 backdrop-blur-sm p-2 rounded-xl sketchy-border border-ink/20 group-hover:border-ink/60 transition-colors">
                             <h3 className={`font-semibold md:text-lg transition-colors leading-tight ${isComplete || isLatestActive ? 'text-ink' : 'text-ink/60'}`}>
                               {lesson.title}
                             </h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}
                </div>
               );
            })
          )}
          {activeTab === 'profile' && <ProfileTab completedCount={completedLessons.length} totalLessons={lessons.length} xp={xp} />}
          {activeTab === 'notebook' && <ErrorNotebookTab />}
          {activeTab === 'settings' && <SettingsTab />}

          {/* Developer Credit Footer */}
          <footer className="mt-16 text-center text-ink/40 text-sm font-medium">
            Phát triển bởi TontonYuta
          </footer>
        </div>
      </div>
    </div>
  );
}

// Simple BookOpen icon component since we hit a custom decorative import issue.
function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

function ProfileTab({ completedCount, totalLessons, xp }: { completedCount: number, totalLessons: number, xp: number }) {
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('english_profile');
    return saved ? JSON.parse(saved) : { name: 'Người học chăm chỉ', age: '', avatar: '🧑‍🎓' };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const saveProfile = () => {
    setProfile(editForm);
    localStorage.setItem('english_profile', JSON.stringify(editForm));
    setIsEditing(false);
  };

   // Streak
  const { streak } = getStreak();
  // We use currentDayInStreak for UI boxes, cap it to 14
  const currentDayInStreak = Math.min(streak, 14);

  // Calculate gifts based on XP
  const gifts = [
    { threshold: 100, name: 'Sổ tay từ mới', emoji: '📔' },
    { threshold: 200, name: 'Tẩy cao su hình thú', emoji: '🐘' },
    { threshold: 500, name: 'Bút nhớ dòng', emoji: '🖍️' },
    { threshold: 800, name: 'Túi đựng bút', emoji: '👝' },
    { threshold: 1000, name: 'Ly sứ học tập', emoji: '☕' },
    { threshold: 1500, name: 'Huy hiệu tri thức', emoji: '🏅' },
    { threshold: 2000, name: 'Áo thun "Not a blank page"', emoji: '👕' },
    { threshold: 2500, name: 'Vé xem phim tuần', emoji: '🎫' },
    { threshold: 5000, name: 'Giấy chứng nhận cao cấp', emoji: '📜' },
  ];
  
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Header */}
      <div className="bg-[#FEF08A] text-ink p-8 mb-8 shadow-md relative sketchy-card -rotate-1 mx-2 flex flex-col md:flex-row items-center gap-8">
         <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/50 backdrop-blur-sm -rotate-2 opacity-50 z-20"></div>
         <div className="w-32 h-32 shrink-0 bg-white rounded-full sketchy-border flex items-center justify-center text-6xl shadow-sm">
           {isEditing ? editForm.avatar : profile.avatar}
         </div>
         <div className="flex-1 text-center md:text-left">
           {isEditing ? (
             <div className="space-y-4 w-full max-w-sm mx-auto md:mx-0">
               <div>
                  <label className="block text-sm font-bold opacity-80 mb-1 flex items-center justify-between">
                     <span>Tên của bạn</span>
                     <span className="text-xs">Chọn Avatar</span>
                  </label>
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
                     {['🧑‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '🎒', '📚', '🧠', '🌟', '🤓', '👽', '🐶', '🐱'].map(a => (
                       <button 
                         key={a}
                         onClick={(e) => { e.preventDefault(); setEditForm({...editForm, avatar: a})}}
                         className={`shrink-0 w-12 h-12 rounded-full text-2xl flex items-center justify-center transition-all snap-center ${editForm.avatar === a ? 'bg-highlighter sketchy-border shadow-sm scale-110' : 'bg-white hover:bg-black/5'}`}
                       >
                         {a}
                       </button>
                     ))}
                  </div>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-white px-4 py-2 sketchy-border font-heading text-xl"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold opacity-80 mb-1">Tuổi</label>
                  <input 
                    type="number" 
                    value={editForm.age}
                    onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    className="w-full bg-white px-4 py-2 sketchy-border font-heading text-xl"
                  />
               </div>
               <button onClick={saveProfile} className="flex items-center justify-center w-full gap-2 bg-highlighter text-ink px-4 py-2 sketchy-button">
                 <Save className="w-5 h-5" /> Lưu Hồ Sơ
               </button>
             </div>
           ) : (
             <>
               <h2 className="text-4xl font-heading font-bold mb-2 flex flex-col md:flex-row items-center gap-2">
                 {profile.name}
                 {profile.age && <span className="text-xl opacity-80 bg-white/50 px-3 py-1 sketchy-border">👤 {profile.age} tuổi</span>}
               </h2>
               <p className="opacity-80 text-lg">Chăm chỉ học tập, thành công sẽ đến!</p>
               <button onClick={() => setIsEditing(true)} className="mt-4 flex items-center justify-center md:justify-start gap-2 text-ink hover:underline font-bold">
                 <Edit3 className="w-4 h-4" /> Chỉnh sửa thông tin
               </button>
             </>
           )}
         </div>
      </div>

      <div className="bg-[#C1D4E3] text-ink p-8 mb-8 shadow-md relative sketchy-card rotate-1 mx-2">
        <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-3 border-b-2 border-ink/20 pb-4">
          <Star className="w-8 h-8 text-ink fill-highlighter" strokeWidth={1.5} /> Thành tích của tôi
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="flex-1 bg-white p-6 sketchy-card -rotate-1 hover:rotate-0 transition-transform">
            <div className="text-xl opacity-80 mb-2">Tiến độ khóa học</div>
            <div className="text-5xl font-heading font-bold mb-4">{percent}%</div>
            
            <div className="w-full bg-ink/10 h-3 rounded-full overflow-hidden border border-ink/20">
              <div 
                className="bg-highlighter h-full border-r border-ink/20" 
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <div className="mt-4 text-ink/80 text-lg">
              Đã hoàn thành <span className="font-bold">{completedCount}</span> / {totalLessons} bài
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 sketchy-card rotate-1 hover:rotate-0 transition-transform">
            <div className="text-xl opacity-80 mb-2">Điểm XP</div>
            <div className="text-5xl font-heading font-bold flex items-center gap-3">
              {xp} <Star className="w-10 h-10 fill-highlighter text-ink drop-shadow-sm" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-ink/80 text-lg">Dùng XP để đổi quà góc dưới nhé.</p>
          </div>
        </div>
      </div>
      
      {/* Rewards Section */}
      <div className="bg-[#FFD1DC] text-ink p-8 mb-8 shadow-md relative sketchy-card -rotate-1 mx-2">
        <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-3 border-b-2 border-ink/20 pb-4">
          <Gift className="w-8 h-8 text-ink" strokeWidth={1.5} /> Quà Tặng Đạt Được
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gifts.map((gift, i) => {
            const isUnlocked = xp >= gift.threshold;
            return (
              <div key={i} className={`p-6 sketchy-card flex flex-col items-center text-center transition-all ${isUnlocked ? 'bg-white hover:-translate-y-1' : 'bg-white/40 grayscale opacity-60'}`}>
                <div className="text-5xl mb-4">{gift.emoji}</div>
                <h3 className="font-heading font-bold text-xl mb-2">{gift.name}</h3>
                <div className="mt-auto pt-4 flex items-center justify-center gap-1.5 font-bold">
                  {isUnlocked ? (
                    <span className="text-green-600 flex items-center gap-1"><Check className="w-4 h-4"/> Đã mở khóa</span>
                  ) : (
                    <span className="text-ink/60 flex items-center gap-1"><Lock className="w-4 h-4"/> Cần {gift.threshold} XP</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-[#C1E1C1] text-ink p-8 mt-12 shadow-md relative sketchy-card -rotate-1 mx-2">
        <h3 className="text-3xl font-heading font-bold mb-4 flex items-center gap-2">
          Chuỗi học tập <Flame className="w-8 h-8 text-orange-500 fill-orange-500"/> {streak} ngày
        </h3>
        <p className="text-xl opacity-80 mb-6">Mỗi ngày 1 bài học, không để "Tờ giấy trắng" biến thành "Tờ giấy thi lại"!</p>
        
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
           {[...Array(14)].map((_, i) => (
             <div key={i} className={`h-24 sketchy-card flex flex-col items-center justify-center border-2 ${i < currentDayInStreak ? 'bg-white border-ink/50' : 'bg-black/5 border-ink/20 text-ink/40'}`}>
                {i < currentDayInStreak ? (
                  <Check className="w-8 h-8 text-ink mb-1" strokeWidth={2} />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-ink/20 border-dashed mb-1"></div>
                )}
                <div className="font-heading font-bold">Ngày {i + 1}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function ErrorNotebookTab() {
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  useEffect(() => {
    setErrors(getErrors());
  }, []);

  const handleDelete = (id: string) => {
    removeError(id);
    setErrors(getErrors());
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="bg-[#FFD1DC] text-ink p-8 mb-8 shadow-md relative sketchy-card rotate-1 mx-2">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/50 backdrop-blur-sm -rotate-2 opacity-50 z-20"></div>
        <h2 className="text-4xl font-heading font-bold mb-6 flex items-center gap-3">
          <Book className="w-10 h-10 text-ink" strokeWidth={1.5} /> Sổ tay lỗi sai
        </h2>
        <p className="text-lg opacity-80 mb-8 border-b-2 border-ink/20 pb-4">
          Nơi lưu giữ những lần vấp ngã. Hãy xem lại cấu trúc hoặc từ vựng bị sai nhé!
        </p>

        {errors.length === 0 ? (
          <div className="bg-white/50 p-8 rounded-2xl sketchy-border flex flex-col items-center justify-center text-center -rotate-1">
             <div className="text-6xl mb-4">🌟</div>
             <p className="text-2xl font-bold font-heading text-ink">Thật tuyệt vời!</p>
             <p className="text-lg opacity-80 mt-2">Bạn không có bất kỳ lỗi sai nào được ghi lại.</p>
          </div>
        ) : (
          <div className="space-y-6">
             {errors.map((error, idx) => (
                <div key={error.id} className="bg-white p-6 sketchy-card -rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                       <span className="font-heading font-bold text-ink/40 uppercase tracking-widest text-sm mb-2 block">Lần sai thứ {idx + 1}</span>
                       <p className="text-xl md:text-2xl font-medium text-ink leading-relaxed font-sans mb-4">{error.question}</p>
                       
                       <div className="space-y-2 mb-4 bg-black/5 p-4 rounded-xl border border-ink/10">
                         <div className="flex items-center gap-2 text-red-600 line-through decoration-red-600/50 decoration-2">
                            <span className="font-bold shrink-0">Bạn chọn:</span> 
                            <span>{error.wrong_answer}</span>
                         </div>
                         <div className="flex items-center gap-2 text-green-700">
                            <span className="font-bold shrink-0">Đáp án đúng:</span> 
                            <span>{error.correct_answer}</span>
                         </div>
                       </div>

                       {error.explanation && (
                         <div className="mt-4 bg-[#FEF08A]/50 p-4 rounded-xl border border-ink/20 font-sans text-base text-ink relative overflow-hidden">
                           <span className="font-bold text-sm block mb-1 text-ink/80">📝 Giải thích</span>
                           <p className="whitespace-pre-wrap">{error.explanation}</p>
                         </div>
                       )}
                    </div>
                    <button 
                      onClick={() => handleDelete(error.id)}
                      className="w-10 h-10 flex shrink-0 items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors border-2 border-red-300 shadow-sm"
                      title="Đã thuộc, xóa lỗi này!"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab() {
  const handleResetProgress = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ tiến trình học tập? Hành động này không thể hoàn tác.")) {
      localStorage.removeItem('completed_lessons');
      localStorage.removeItem('daily_streak');
      localStorage.removeItem('error_notebook');
      window.location.reload();
    }
  };

  const handleResetProfile = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ? Hành động này không thể hoàn tác.")) {
      localStorage.removeItem('english_profile');
      window.location.reload();
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="bg-[#FEF08A] text-ink p-8 mb-8 shadow-md relative sketchy-card rotate-1 mx-2">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/50 backdrop-blur-sm -rotate-2 opacity-50 z-20"></div>
        <h2 className="text-4xl font-heading font-bold mb-6 flex items-center gap-3">
          <Settings className="w-10 h-10 text-ink" strokeWidth={1.5} /> Cài đặt chung
        </h2>
        
        <div className="space-y-6 mt-8">
           <div className="bg-white p-6 sketchy-card -rotate-1 hover:rotate-0 transition-transform flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl mb-1">Xóa tiến trình học tập</h3>
                <p className="opacity-80 md:w-3/4">Đưa tất cả bài học về trạng thái chưa hoàn thành.</p>
              </div>
              <button onClick={handleResetProgress} className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 sketchy-button border-red-300">
                 <AlertTriangle className="w-5 h-5" /> Xóa
              </button>
           </div>
           
           <div className="bg-white p-6 sketchy-card rotate-1 hover:rotate-0 transition-transform flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl mb-1">Xóa hồ sơ</h3>
                <p className="opacity-80 md:w-3/4">Xóa tên, tuổi và diện mạo của bạn.</p>
              </div>
              <button onClick={handleResetProfile} className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 sketchy-button border-red-300">
                 <AlertTriangle className="w-5 h-5" /> Xóa
              </button>
           </div>

           <div className="bg-[#C1D4E3] p-6 sketchy-card flex items-center gap-4 text-ink">
               <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center font-bold text-2xl sketchy-border">
                 ℹ️
               </div>
               <div>
                  <h3 className="font-heading font-bold text-xl mb-1">Ứng dụng hoạt động Offline</h3>
                  <p className="opacity-80">Do ứng dụng lưu trữ hoàn toàn trên trình duyệt của bạn nên ứng dụng hoạt động không cần mạng. Tuy nhiên, vui lòng không dọn dẹp bộ nhớ (Clear Cache) trên trình duyệt để tránh mất dữ liệu!</p>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
