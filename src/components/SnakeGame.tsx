import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [dir, setDir] = useState<Point>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);

  useEffect(() => { dirRef.current = dir; }, [dir]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDir({ x: 0, y: -1 });
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
  };

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, [generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
         e.preventDefault();
      }
      
      const currentDir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDir({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDir({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDir({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDir({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameOver) {
             resetGame();
          } else if (gameStarted) {
             setIsPaused(p => !p);
          } else {
             resetGame();
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, gameStarted]);

  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      const currentSnake = snakeRef.current;
      const head = currentSnake[0];
      const currentDir = dirRef.current;

      const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return;
      }

      const newSnake = [newHead, ...currentSnake];
      const currentFood = foodRef.current;

      // Check food collision
      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        const newScore = scoreRef.current + 10;
        setScore(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // remove tail if no food eaten
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, INITIAL_SPEED - Math.min(scoreRef.current, 80)); 
    return () => clearInterval(intervalId);
  }, [gameStarted, isPaused, gameOver, generateFood]);

  const handleGameOver = () => {
    setGameOver(true);
    setGameStarted(false);
    if (scoreRef.current > highScore) {
       setHighScore(scoreRef.current);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 relative bg-black font-mono">
      <div className="absolute top-4 left-6 flex items-center gap-2">
        <span className="w-4 h-4 bg-[#ff00ff] animate-pulse border-2 border-[#00ffff]"></span>
        <span className="text-[12px] text-[#00ffff] font-bold uppercase tracking-widest hidden sm:inline">LINK_ESTABLISHED</span>
      </div>
      <div className="absolute top-4 right-6 flex gap-8 z-20">
         <div className="text-left border-l-4 border-[#ff00ff] pl-2">
             <div className="text-[10px] uppercase tracking-[0.2em] text-[#00ffff]">SYS.CYCLES</div>
             <div className="text-2xl font-mono text-[#ff00ff] leading-none">{score.toString().padStart(6, '0')}</div>
         </div>
         <div className="text-left border-l-4 border-[#00ffff] pl-2">
             <div className="text-[10px] uppercase tracking-[0.2em] text-[#ff00ff]">PEAK.CYCLES</div>
             <div className="text-2xl font-mono text-[#00ffff] leading-none">{highScore.toString().padStart(6, '0')}</div>
         </div>
      </div>

      <div className="relative mt-16 z-10 w-full max-w-[400px] border-4 border-[#00ffff] p-1 bg-[#ff00ff]/10">
         <div 
           className="w-full bg-black"
           style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gap: '0',
              aspectRatio: '1 / 1'
           }}
         >
           {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
             const x = i % GRID_SIZE;
             const y = Math.floor(i / GRID_SIZE);
             
             const isSnakeHead = snake[0].x === x && snake[0].y === y;
             const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
             const isFood = food.x === x && food.y === y;

             let cellClass = "bg-transparent border border-[#00ffff]/10";
             if (isSnakeHead) cellClass = "bg-[#00ffff] border border-black z-10";
             else if (isSnakeBody) cellClass = "bg-[#00ffff]/70 border border-black";
             else if (isFood) cellClass = "bg-[#ff00ff] animate-pulse border-2 border-black";

             return (
               <div key={i} className={`w-full h-full ${cellClass}`} />
             );
           })}
         </div>

         {/* Overlays */}
         {(!gameStarted || gameOver || isPaused) && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center border-4 border-[#ff00ff] m-4">
               <div className="text-center font-mono p-6 bg-black border-2 border-[#00ffff] shadow-[4px_4px_0_#ff00ff]">
                  {gameOver ? (
                     <>
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#ff00ff] mb-2 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h3>
                        <p className="text-[#00ffff] mb-6 tracking-widest uppercase">COLLISION_DETECTED</p>
                        <button onClick={resetGame} className="border-2 border-[#00ffff] bg-black px-6 py-3 uppercase text-sm hover:bg-[#00ffff] hover:text-black transition-colors flex items-center justify-center mx-auto text-[#00ffff] shadow-[4px_4px_0_#ff00ff] hover:shadow-none translate-x-0 hover:translate-x-[4px] hover:translate-y-[4px]">
                           [ REBOOT_SEQUENCE ]
                        </button>
                     </>
                  ) : !gameStarted ? (
                     <>
                        <h3 className="text-xl lg:text-2xl font-bold text-[#00ffff] mb-6 tracking-widest pb-2 uppercase">AWAITING_INPUT...</h3>
                        <button onClick={resetGame} className="border-2 border-[#ff00ff] bg-black px-8 py-3 uppercase font-bold text-sm hover:bg-[#ff00ff] hover:text-black transition-colors flex items-center justify-center mx-auto text-[#ff00ff] shadow-[4px_4px_0_#00ffff] hover:shadow-none translate-x-0 hover:translate-x-[4px] hover:translate-y-[4px]">
                           [ EXECUTE ]
                        </button>
                     </>
                  ) : (
                     <>
                        <h3 className="text-2xl font-bold text-[#ff00ff] mb-6 tracking-[0.2em] animate-pulse">EXECUTION_SUSPENDED</h3>
                        <button onClick={() => setIsPaused(false)} className="border-2 border-[#00ffff] bg-black px-6 py-3 uppercase text-sm hover:bg-[#00ffff] hover:text-black transition-colors flex items-center justify-center mx-auto text-[#00ffff] shadow-[4px_4px_0_#00ffff] hover:shadow-none translate-x-0 hover:translate-x-[4px] hover:translate-y-[4px]">
                           [ RESUME ]
                        </button>
                     </>
                  )}
               </div>
            </div>
         )}
      </div>
      
      <div className="absolute bottom-4 flex justify-between w-full px-8 text-[12px] text-[#ff00ff] font-bold font-mono tracking-widest uppercase z-20">
         <span className="bg-black px-2 border border-[#00ffff] hidden sm:inline">CONTROL_VECTOR=WASD_ARROWS</span>
         <span className="bg-black px-2 border border-[#ff00ff] hidden sm:inline">INTERRUPT=SPACE</span>
      </div>
    </div>
  );
}
