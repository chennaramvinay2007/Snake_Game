import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Drift [AI Gen]', artist: 'Null Pointer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Pulse [AI Gen]', artist: 'Byte Cruncher', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Synthwave Protocols [AI Gen]', artist: 'Overclocked', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
     if (audioRef.current) {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
     }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
         setProgress((current / duration) * 100);
      }
    }
  };

  const handleAudioEnded = () => {
    playNext();
  };

  return (
    <div className="box-glitch p-5 flex flex-col h-full w-full justify-between min-h-[300px] font-mono bg-black">
      <div className="mb-6">
         <h2 className="text-sm font-bold uppercase tracking-widest text-[#00ffff] mb-6 flex justify-between items-center border-b-2 border-[#ff00ff] pb-2">
           <span>AUDIO_SUBSYSTEM</span>
           <span className="text-[#ff00ff] text-[12px] uppercase animate-pulse">ACTIVE</span>
         </h2>
         <div className="flex items-center gap-4 mb-6 bg-[#ff00ff]/10 border border-[#ff00ff] p-2">
            <div className={`w-12 h-12 bg-black border-2 border-[#00ffff] flex-shrink-0 flex items-center justify-center ${isPlaying ? '' : ''}`}>
                <div className={`w-6 h-6 border-2 border-[#ff00ff] ${isPlaying ? 'animate-[spin_2s_linear_infinite]' : ''}`} />
            </div>
            <div className="overflow-hidden w-full">
               <div className="text-sm font-bold text-[#00ffff] truncate uppercase" title={currentTrack.title}>{currentTrack.title}</div>
               <div className="text-[10px] text-[#ff00ff] uppercase tracking-tighter truncate mt-1">SRC: {currentTrack.artist}</div>
            </div>
         </div>
         
         {/* Progress Bar */}
         <div className="w-full flex items-center gap-3 mt-6">
            <div className="flex-1 overflow-hidden bg-black border border-[#00ffff] h-4">
                <div 
                   className="bg-[#ff00ff] h-full transition-all duration-300 relative"
                   style={{ width: `${progress}%` }}
                >
                   <div className="absolute top-0 right-0 bottom-0 w-1 bg-[#00ffff]"></div>
                </div>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex justify-center items-center gap-4">
           <button onClick={playPrev} className="border-2 border-[#00ffff] bg-black text-[#00ffff] p-2 hover:bg-[#00ffff] hover:text-black transition-colors font-bold text-xs uppercase">
              [ BWD ]
           </button>
           <button onClick={togglePlay} className="border-2 border-[#ff00ff] bg-black text-[#ff00ff] px-4 py-2 hover:bg-[#ff00ff] hover:text-black transition-colors font-bold text-sm uppercase flex-1 shadow-[4px_4px_0_#00ffff] hover:shadow-none translate-x-0 hover:translate-x-[4px] hover:translate-y-[4px]">
              {isPlaying ? '[ HALT ]' : '[ PLAY ]'}
           </button>
           <button onClick={playNext} className="border-2 border-[#00ffff] bg-black text-[#00ffff] p-2 hover:bg-[#00ffff] hover:text-black transition-colors font-bold text-xs uppercase">
              [ FWD ]
           </button>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-[#00ffff]">
           <button onClick={toggleMute} className="text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff] font-bold text-xs uppercase border border-transparent hover:border-[#ff00ff] px-2 py-1 transition-colors">
              {isMuted ? 'VOL.MUTE' : 'VOL.ON'}
           </button>
           <div className="flex items-center gap-2">
             {TRACKS.map((_, idx) => (
                <div key={idx} className={`w-3 h-3 border-2 transition-all duration-300 ${idx === currentTrackIndex ? 'border-[#00ffff] bg-[#ff00ff]' : 'border-[#ff00ff] bg-black'}`} />
             ))}
           </div>
        </div>
      </div>

      <audio 
         ref={audioRef}
         src={currentTrack.url}
         onTimeUpdate={handleTimeUpdate}
         onEnded={handleAudioEnded}
         muted={isMuted}
      />
    </div>
  );
}
