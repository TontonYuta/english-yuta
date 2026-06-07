import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertCircle, Heart, Trophy, Star, NotebookText, Save, BookOpen } from 'lucide-react';
import { LessonMeta, LessonData, Vocabulary, QuizQuestion } from '../types';
import { markComplete, isLessonComplete } from '../lib/storage';
import { motion, AnimatePresence } from 'motion/react';

// Flat screen types for micro-learning flow (excluding theory)
type Screen = 
  | { type: 'intro'; title: string; desc: string }
  | { type: 'vocab'; vocab: Vocabulary }
  | { type: 'quiz'; question: QuizQuestion }
  | { type: 'outro' };

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Interaction states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [vocabRevealed, setVocabRevealed] = useState(false);
  
  // Mobile Theory Panel State
  const [showMobileTheory, setShowMobileTheory] = useState(false);

  // Notebook states
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [notebookContent, setNotebookContent] = useState(() => {
    return localStorage.getItem('english_notebook') || '';
  });

  const saveNotebook = (content: string) => {
    setNotebookContent(content);
    localStorage.setItem('english_notebook', content);
  };

  useEffect(() => {
    if (!id) return;
    
    fetch('/data/course-index.json')
      .then(res => res.json())
      .then((indexData: LessonMeta[]) => {
        const meta = indexData.find(l => l.id === id);
        if (!meta) throw new Error('Lesson not found');
        return Promise.all([meta, fetch(meta.content_file).then(r => r.json())]);
      })
      .then(([meta, data]: [LessonMeta, LessonData]) => {
        setLessonData(data);
        
        // Flatten constraints into single screens
        const flattenedScreens: Screen[] = [];
        
        flattenedScreens.push({ type: 'intro', title: meta.title, desc: meta.description });
        
        if (data.vocabulary) {
          data.vocabulary.forEach(v => flattenedScreens.push({ type: 'vocab', vocab: v }));
        }
        
        if (data.quiz) {
          data.quiz.forEach(q => flattenedScreens.push({ type: 'quiz', question: q }));
        }

        flattenedScreens.push({ type: 'outro' });

        setScreens(flattenedScreens);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const nextScreen = () => {
    if (currentIdx < screens.length - 1) {
      setCurrentIdx(i => i + 1);
      // Reset interaction states for next screen
      setSelectedOption(null);
      setIsAnswering(false);
      setVocabRevealed(false);
    } else {
      if (id) markComplete(id);
      navigate('/');
    }
  };

  if (loading) {
     return <div className="flex h-[100dvh] items-center justify-center text-ink/60 font-heading text-2xl bg-paper">Đang lật vở...</div>;
  }

  const currentScreen = screens[currentIdx];
  const progressPercent = (currentIdx / (screens.length - 1)) * 100;

  // Render bottom bar action button
  const renderBottomAction = () => {
    if (currentScreen.type === 'intro') {
      return (
        <div className="p-4 bg-transparent pb-8">
          <button onClick={nextScreen} className="w-full py-4 bg-highlighter hover:bg-yellow-400 text-ink font-heading text-2xl transition-all sketchy-button">
            Bắt đầu
          </button>
        </div>
      );
    }

    if (currentScreen.type === 'vocab') {
      if (!vocabRevealed) {
        return (
          <div className="p-4 bg-transparent pb-8">
            <button onClick={() => setVocabRevealed(true)} className="w-full py-4 bg-[#C1D4E3] hover:bg-blue-300 text-ink font-heading text-2xl transition-all sketchy-button">
              Lật thẻ
            </button>
          </div>
        );
      }
      return (
        <div className="p-4 bg-transparent pb-8">
           <button onClick={nextScreen} className="w-full py-4 bg-[#C1E1C1] hover:bg-green-300 text-ink font-heading text-2xl transition-all sketchy-button">
            Đã nhớ!
          </button>
        </div>
      );
    }

    if (currentScreen.type === 'quiz') {
      if (!isAnswering) {
        const disabled = !selectedOption;
        return (
          <div className="p-4 bg-transparent pb-8 max-w-2xl mx-auto w-full">
            <button 
              disabled={disabled}
              onClick={() => setIsAnswering(true)} 
              className={`w-full py-4 font-heading text-2xl transition-all sketchy-button
                ${disabled ? 'bg-white text-ink/40 border-ink/40 cursor-not-allowed shadow-none' : 'bg-[#FFD1DC] hover:bg-pink-300 text-ink'}`}
            >
              Kiểm tra
            </button>
          </div>
        );
      }
      
      const isCorrect = selectedOption === currentScreen.question.correct_answer;
      
      return (
        <div className="p-4 pb-8 bg-transparent max-w-2xl mx-auto w-full">
          <div className={`p-4 mb-4 sketchy-card rotate-1 shadow-md ${isCorrect ? 'bg-[#C1E1C1] border-ink' : 'bg-[#FFD1DC] border-ink'}`}>
             <div className={`flex items-start gap-3 text-ink`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-ink bg-white`}>
                   {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600 border-ink" strokeWidth={2}/> : <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2}/>}
                </div>
                <div className="pt-1 w-full">
                   <p className="font-heading font-bold text-xl">{isCorrect ? 'Hoàn toàn chính xác!' : 'Sai một chút rồi :('}</p>
                   {!isCorrect && (
                     <p className="opacity-80 mt-1 font-sans text-lg font-normal">Thử nghĩ lại nhé, đáp án đúng là: <span className="font-bold underline text-red-pen">{currentScreen.question.correct_answer}</span></p>
                   )}
                   {currentScreen.question.explanation && (
                     <div className="mt-3 bg-white/60 p-3 rounded-lg border border-ink/20 font-sans text-base text-ink relative overflow-hidden">
                       <span className="font-bold text-sm block mb-1 text-ink/60 uppercase tracking-widest">📝 Giải thích / Lưu ý</span>
                       <p className="whitespace-pre-wrap">{currentScreen.question.explanation}</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
           <button 
             onClick={nextScreen} 
             className={`w-full py-4 font-heading text-2xl transition-all sketchy-button bg-highlighter hover:bg-yellow-400 text-ink`}
           >
            Tiếp tục
          </button>
        </div>
      );
    }

    if (currentScreen.type === 'outro') {
      return (
        <div className="p-4 bg-transparent pb-8 max-w-2xl mx-auto w-full">
          <button onClick={nextScreen} className="w-full py-4 bg-highlighter hover:bg-yellow-400 text-ink font-heading text-2xl transition-all sketchy-button">
            Đóng vở
          </button>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-screen bg-notebook overflow-hidden text-ink font-sans selection:bg-highlighter/50 relative">
      
      {/* LEFT PANE: Theory / Reading Material */}
      {lessonData?.theory_html && (
        <div className={`w-full md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] flex-1 h-[100dvh] bg-[#FEF08A] md:border-r-2 border-ink shadow-lg z-30 transition-transform duration-300 ${showMobileTheory ? 'absolute md:relative inset-0 flex' : 'hidden md:flex'} flex-col relative shrink-0`}>
          {/* Mobile header for Theory */}

          {showMobileTheory && (
            <div className="md:hidden flex items-center justify-between p-4 border-b-2 border-ink/20 shrink-0 bg-[#FEF08A] z-40">
               <div className="font-heading font-bold text-xl flex items-center gap-2">
                 <BookOpen className="w-6 h-6" /> Lý thuyết & Bài đọc
               </div>
               <button 
                 onClick={() => setShowMobileTheory(false)} 
                 className="w-10 h-10 bg-white border-2 border-ink flex items-center justify-center rounded-xl hover:bg-black/5"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative">
             <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-sm opacity-60 z-20" style={{ transform: 'rotate(-2deg) translateY(-10px)' }}></div>
             <div className="md:hidden mb-4 border-b-2 border-ink/20 pb-4">
                <p className="text-ink/60 italic font-medium">Kéo xuống để xem toàn bộ tài liệu, sau đó đóng lại để làm bài tập nhé.</p>
             </div>
             <div className="prose prose-lg md:prose-xl max-w-none text-ink
                [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:font-bold [&>h2]:font-heading [&>h2]:text-ink [&>h2]:mb-6 [&>h2]:border-b-2 [&>h2]:border-ink/20 [&>h2]:pb-2 [&>h2]:inline-block
                [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:font-heading [&>h3]:text-ink [&>h3]:mt-6 [&>h3]:mb-4
                [&>p]:text-lg md:[&>p]:text-xl [&>p]:leading-relaxed [&>p]:mb-6
                [&>ul]:list-none [&>ul]:pl-5 [&>ul]:space-y-4 [&>ul]:mb-6 [&>ul>li]:relative [&>ul>li::before]:content-['•'] [&>ul>li::before]:absolute [&>ul>li::before]:-left-6 [&>ul>li::before]:text-ink [&>ul>li::before]:text-2xl [&>ul>li::before]:top-[-4px]
                [&>ol]:pl-6 [&>ol]:space-y-4 [&>ol]:mb-6 md:[&>ol]:text-xl
                [&>ul>li>b]:bg-highlighter [&>ul>li>b]:font-bold [&>ul>li>b]:px-1 [&>ol>li>b]:bg-highlighter [&>ol>li>b]:font-bold [&>ol>li>b]:px-1
                [&>ul>li>i]:text-ink/60 [&>ul>li>i]:block [&>ul>li>i]:mt-1
                [&>strong]:bg-highlighter [&>strong]:px-1
              " dangerouslySetInnerHTML={{ __html: lessonData.theory_html }} />
              <div className="h-20"></div> {/* Bottom padding */}
          </div>
        </div>
      )}

      {/* MIDDLE PANE: Learning Flow (Slider) */}
      <div className="flex-[2] min-w-[300px] h-[100dvh] flex flex-col relative bg-paper transition-all duration-300 z-10 overflow-hidden">
        {/* Universal Header (Progress) */}
        <header className="flex items-center gap-3 md:gap-4 px-4 py-4 pt-6 shrink-0 bg-transparent relative z-20">
          <button onClick={() => navigate('/')} className="text-ink/60 hover:text-ink transition-colors">
            <X className="w-8 h-8" strokeWidth={1.5} />
          </button>

          {/* Mobile Theory Toggle */}
          {lessonData?.theory_html && (
            <button 
              onClick={() => setShowMobileTheory(true)}
              className="md:hidden flex items-center justify-center h-10 px-4 rounded-xl bg-[#FEF08A] border-2 border-ink hover:bg-yellow-300 text-sm font-bold font-heading shrink-0 shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" /> Tài liệu
            </button>
          )}

          <div className="flex-1 bg-white border-2 border-ink h-4 sketchy-card overflow-hidden relative min-w-[60px]">
             <motion.div 
               className="absolute top-0 bottom-0 left-0 bg-highlighter border-r-2 border-ink"
               initial={{ width: 0 }}
               animate={{ width: `${progressPercent}%` }}
               transition={{ duration: 0.4 }}
             >
             </motion.div>
          </div>
          
          <button 
            onClick={() => setIsNotebookOpen(true)}
            className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl hover:bg-black/5 transition-colors text-ink ml-1"
          >
            <NotebookText className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 py-2 flex flex-col relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl mx-auto flex flex-col flex-1 pb-10"
            >
              {/* INTRO SCREEN */}
              {currentScreen.type === 'intro' && (
                <div className="my-auto text-center bg-white p-10 sketchy-card rotate-1 shadow-md max-w-sm mx-auto w-full">
                  <div className="w-28 h-28 mb-8 mx-auto text-6xl flex items-center justify-center rotate-[-5deg] bg-highlighter rounded-full sketchy-border">
                    🚀
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold font-heading text-ink mb-4">{currentScreen.title}</h1>
                  <p className="text-lg md:text-xl text-ink/80">{currentScreen.desc}</p>
                </div>
              )}

              {/* VOCAB SCREEN */}
              {currentScreen.type === 'vocab' && (
                <div className="my-auto flex flex-col items-center justify-center w-full max-w-sm mx-auto">
                  <h2 className="text-3xl font-bold text-ink mb-12 text-center w-full leading-tight font-heading pb-2">
                    Từ mới cần nhớ
                  </h2>
                  
                  {/* 3D Flip Card */}
                  <div className="relative w-full h-[320px]" style={{ perspective: '1000px' }}>
                    <div 
                      className="w-full h-full transition-all duration-500 cursor-pointer relative"
                      style={{ transformStyle: 'preserve-3d', transform: vocabRevealed ? 'rotateY(180deg)' : 'rotateY(0)' }}
                      onClick={() => setVocabRevealed(!vocabRevealed)}
                    >
                      {/* Front side */}
                      <div className="absolute inset-0 w-full h-full bg-white border-2 border-ink sketchy-card p-8 shadow-md flex flex-col items-center justify-center text-center backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-sky-200/50 backdrop-blur-sm -rotate-2 opacity-60 z-20"></div>
                        <h3 className="text-4xl md:text-5xl font-bold text-ink mb-4 font-heading">{currentScreen.vocab.word}</h3>
                        <p className="text-ink/60 font-mono text-lg md:text-xl mb-4">/{currentScreen.vocab.pronunciation}/</p>
                        <div className="mt-8 text-ink/40 font-heading animate-pulse flex items-center gap-2">
                          <span>Chạm để lật thẻ</span>
                        </div>
                      </div>

                      {/* Back side */}
                      <div className="absolute inset-0 w-full h-full bg-[#C1E1C1] border-2 border-ink sketchy-card p-8 shadow-md flex flex-col items-center justify-center text-center backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/50 backdrop-blur-sm -rotate-2 opacity-60 z-20"></div>
                        <h3 className="text-2xl md:text-3xl font-bold text-ink mb-2 font-heading opacity-50">{currentScreen.vocab.word}</h3>
                        <div className="w-16 h-[2px] bg-ink/20 my-4"></div>
                        <p className="text-xl md:text-2xl font-bold font-heading text-ink text-left w-full whitespace-pre-wrap">{currentScreen.vocab.meaning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* QUIZ SCREEN */}
              {currentScreen.type === 'quiz' && (
                <div className="flex flex-col h-full w-full">
                  <div className="mb-8 shrink-0">
                    <span className="font-heading font-bold text-ink/40 uppercase tracking-widest text-sm mb-2 block">Câu hỏi</span>
                    <div className="text-xl md:text-2xl font-medium text-ink leading-relaxed whitespace-pre-wrap font-sans">
                      {currentScreen.question.question}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-auto">
                    {currentScreen.question.options.map((opt, i) => {
                      const isSelected = selectedOption === opt;
                      
                      let btnClass = "border-2 border-ink/40 bg-white text-ink hover:border-ink hover:bg-black/5 hover:-translate-y-1 hover:shadow-sm";
                      let textClass = "font-medium text-ink";
                      let idxBg = "bg-ink/10 text-ink/60";
                      
                      if (isSelected) {
                        btnClass = "border-2 border-ink bg-highlighter text-ink shadow-sm -translate-y-1";
                        idxBg = "bg-ink text-white";
                      }

                      if (isAnswering) {
                        if (opt === currentScreen.question.correct_answer) {
                          btnClass = "border-2 border-ink bg-[#C1E1C1] text-ink font-bold shadow-sm";
                          textClass = "font-bold text-ink";
                          idxBg = "bg-ink text-white";
                        } else if (isSelected) {
                          btnClass = "border-2 border-ink bg-[#FFD1DC] text-ink opacity-80 decoration-red-pen decoration-2";
                          idxBg = "bg-red-600 text-white";
                        } else {
                          btnClass = "border-2 border-ink/20 bg-white text-ink/30 opacity-60";
                        }
                      }

                      const labels = ["A", "B", "C", "D"];

                      return (
                        <button
                          key={i}
                          disabled={isAnswering}
                          onClick={() => setSelectedOption(opt)}
                          className={`w-full text-left p-4 rounded-2xl transition-all text-lg md:text-xl flex items-center gap-4 ${btnClass}`}
                        >
                          <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex flex-col items-center justify-center font-heading font-bold transition-colors ${idxBg}`}>
                            {labels[i]}
                          </div>
                          <span className={`flex-1 ${textClass} ${isAnswering && isSelected && opt !== currentScreen.question.correct_answer ? 'line-through text-red-900' : ''}`}>
                            {opt}
                          </span>
                          
                          {isAnswering && opt === currentScreen.question.correct_answer && (
                             <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-600 shrink-0" strokeWidth={2.5} />
                          )}
                          {isAnswering && isSelected && opt !== currentScreen.question.correct_answer && (
                             <X className="w-6 h-6 md:w-8 md:h-8 text-red-600 shrink-0" strokeWidth={2.5} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* OUTRO SCREEN */}
              {currentScreen.type === 'outro' && (
                <div className="my-auto text-center pt-4 max-w-sm mx-auto">
                  <div className="w-40 h-40 md:w-48 md:h-48 bg-white border-2 border-ink sketchy-card rotate-3 flex items-center justify-center mx-auto mb-10 relative shadow-md">
                    <Trophy className="w-20 h-20 md:w-24 md:h-24 text-[#EAB308] fill-[#FEF08A] drop-shadow-sm" strokeWidth={1.5} />
                    <div className="absolute top-2 right-4 text-3xl md:text-4xl animate-bounce">✨</div>
                    <div className="absolute bottom-4 left-4 text-2xl md:text-3xl animate-bounce delay-150">🎉</div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-heading text-ink mb-6">Tuyệt vời!</h1>
                  <p className="text-lg md:text-xl text-ink/80 mb-10 px-4 font-sans leading-relaxed">Bạn vừa hoàn thành xuất sắc bài học.<br/>Hãy luôn giữ vững phong độ này nhé!</p>
                  <div className="bg-[#FEF08A] border-2 border-ink text-ink font-bold font-heading text-xl md:text-2xl px-8 py-4 sketchy-card inline-flex items-center gap-4 shadow-sm rotate-[-2deg]">
                    <Star className="w-6 h-6 md:w-8 md:h-8 fill-ink" strokeWidth={1.5} />
                    <span>+10 XP Nhận được</span>
                  </div>
                </div>
              )}
              
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Action Footer Area */}
        <footer className="mt-auto shrink-0 w-full z-20 relative bg-paper/80 backdrop-blur-sm border-t-2 border-transparent">
           {renderBottomAction()}
        </footer>
      </div>
      
      {/* Notebook Panel (Mobile Overlay) */}
      <AnimatePresence>
        {isNotebookOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden absolute inset-0 z-40 bg-ink/20 backdrop-blur-sm"
            onClick={() => setIsNotebookOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isNotebookOpen && (
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden absolute inset-y-0 right-0 w-[85%] min-w-[320px] max-w-md bg-white border-l-2 border-ink z-50 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-ink/20 shrink-0 bg-[#FEF08A]">
              <h2 className="text-2xl font-heading font-bold flex items-center gap-3">
                <NotebookText className="w-6 h-6 outline-none" /> Sổ tay
              </h2>
              <button 
                onClick={() => setIsNotebookOpen(false)} 
                className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl bg-white/50 hover:bg-white transition-colors sketchy-border"
              >
                <X className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col overflow-y-auto bg-white/50">
               <textarea 
                 className="w-full flex-1 resize-none bg-transparent outline-none font-sans text-xl leading-8 pb-10 text-ink/90 placeholder:text-ink/30"
                 placeholder="Ghi chú bài học..."
                 value={notebookContent}
                 onChange={(e) => saveNotebook(e.target.value)}
                 style={{ 
                   backgroundImage: 'linear-gradient(transparent, transparent 31px, currentColor 31px)',
                   backgroundSize: '100% 32px',
                   lineHeight: '32px',
                   color: 'rgba(var(--ink), 0.1)'
                 }}
               />
               <style dangerouslySetInnerHTML={{__html: `
                  textarea::-webkit-input-placeholder { color: rgba(15, 23, 42, 0.3); }
                  textarea { color: #0f172a !important; }
               `}} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notebook Panel (Desktop Flex Column) */}
      <AnimatePresence>
        {isNotebookOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }} 
            animate={{ width: 350, opacity: 1 }} 
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="hidden md:flex flex-col bg-white border-l-2 border-ink z-50 shadow-[-10px_0_40px_rgba(0,0,0,0.1)] shrink-0 overflow-hidden"
          >
            <div className="w-[350px] h-full flex flex-col shrink-0">
              <div className="flex items-center justify-between p-4 border-b-2 border-ink/20 shrink-0 bg-[#FEF08A]">
                <h2 className="text-2xl font-heading font-bold flex items-center gap-3">
                  <NotebookText className="w-6 h-6 outline-none" /> Sổ tay cá nhân
                </h2>
                <button 
                  onClick={() => setIsNotebookOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl bg-white/50 hover:bg-white transition-colors sketchy-border"
                >
                  <X className="w-6 h-6" strokeWidth={2} />
                </button>
              </div>
              
              <div className="flex-1 p-6 flex flex-col overflow-y-auto bg-white/50">
                 <textarea 
                   className="w-full flex-1 resize-none bg-transparent outline-none font-sans text-xl leading-8 pb-10 text-ink/90 placeholder:text-ink/30"
                   placeholder="Thêm từ mới, ngữ pháp hoặc những thứ cần nhớ vào đây..."
                   value={notebookContent}
                   onChange={(e) => saveNotebook(e.target.value)}
                   style={{ 
                     backgroundImage: 'linear-gradient(transparent, transparent 31px, currentColor 31px)',
                     backgroundSize: '100% 32px',
                     lineHeight: '32px',
                     color: 'rgba(var(--ink), 0.1)'
                   }}
                 />
                 <style dangerouslySetInnerHTML={{__html: `
                    textarea::-webkit-input-placeholder { color: rgba(15, 23, 42, 0.3); }
                    textarea { color: #0f172a !important; }
                 `}} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

