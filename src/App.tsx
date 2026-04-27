import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-sans flex flex-col p-4 lg:p-8 overflow-hidden scanlines static-noise relative selection:bg-[#ff00ff] selection:text-black">
      <div className="absolute inset-0 pointer-events-none z-50 mix-blend-screen bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,255,0.05)_1px,transparent_1px)] bg-[size:4px_4px] opacity-20"></div>
      
      <header className="flex justify-between items-center mb-8 w-full max-w-6xl mx-auto z-10 border-b-4 border-[#ff00ff] pb-4 px-2 bg-black">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black border-2 border-[#00ffff] flex items-center justify-center shadow-[4px_4px_0_#ff00ff]">
            <svg className="w-8 h-8 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="none" strokeLinejoin="miter" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          </div>
          <div className="flex flex-col">
             <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter text-[#00ffff] glitch-text font-mono" data-text="SYS.CORE_V1.9.84">SYS.CORE_V1.9.84</h1>
             <span className="text-xs text-[#ff00ff] uppercase tracking-widest font-mono select-none bg-black">AUTHORIZED_PERSONNEL_ONLY :: RESTRICTED</span>
          </div>
        </div>
      </header>
      
      <main className="flex flex-col lg:flex-row flex-1 gap-8 w-full max-w-6xl mx-auto z-10 overflow-hidden relative">
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col relative group z-20">
           <MusicPlayer />
        </aside>
        <div className="flex-1 w-full relative flex items-center justify-center box-glitch lg:min-h-0 min-h-[400px] z-20 overflow-hidden">
           <div className="absolute top-0 right-0 bg-[#ff00ff] text-black px-3 py-1 text-xs font-bold font-mono border-b-2 border-l-2 border-[#00ffff] z-30 pointer-events-none">_MAXIMIZE</div>
           <SnakeGame />
        </div>
      </main>
    </div>
  );
}
