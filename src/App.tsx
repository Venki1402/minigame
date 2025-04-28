import React, { useState, useEffect } from "react";
import { Wallet, Home, CheckSquare, ChevronDown } from "lucide-react";

// Types
type Dot = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
};

type Task = {
  id: number;
  title: string;
  reward: number;
  completed: boolean;
};

// Logos for the rewards
const BitraLogo: React.FC = () => (
  <img src="./assets/bitralogo.jpg" alt="Bitra Logo" className="w-10 h-10" />
);

const TaraLogo: React.FC = () => (
  <img src="./assets/taralogo.png" alt="Tara Logo" className="w-10 h-10" />
);

// Mining animation
const MiningAnimation: React.FC = () => {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Create a new dot with random position
      const newDot: Dot = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 40 + 30,
        size: Math.random() * 10 + 5,
        opacity: 1,
      };

      setDots((prevDots) => [...prevDots, newDot]);

      // Remove the dot after animation
      setTimeout(() => {
        setDots((prevDots) => prevDots.filter((dot) => dot.id !== newDot.id));
      }, 2000);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute bg-yellow-300 rounded-full animate-pulse"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  );
};

// Main component
const MiningApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"home" | "wallet" | "tasks">(
    "home"
  );
  const [isMining, setIsMining] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete a survey", reward: 50, completed: false },
    { id: 2, title: "Refer a friend", reward: 100, completed: false },
    { id: 3, title: "Watch a video", reward: 25, completed: false },
  ]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isMining && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsMining(false);
      setTimeLeft(300);
    }
    return () => clearInterval(timer);
  }, [isMining, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Toggle mining state
  const handleMineClick = (): void => {
    setIsMining(!isMining);
  };

  // Complete a task
  const completeTask = (taskId: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === "home" && (
          <>
            {/* Top bar with rewards and timer */}
            <div className="flex justify-between mb-6">
              {/* Rewards */}
              <div className="flex items-center gap-2">
                <BitraLogo />
                <TaraLogo />
                <span className="font-bold">Rewards</span>
              </div>

              {/* Timer */}
              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <span className="font-mono text-xl">
                  {isMining ? formatTime(timeLeft) : "00:00"}
                </span>
              </div>
            </div>

            {/* Mining area */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Daily Mining</h1>
                <p className="text-gray-400">
                  Click to start mining your rewards
                </p>
              </div>

              {/* Mining animation and button */}
              <div className="w-full max-w-md bg-gray-800 rounded-lg p-4">
                {isMining ? (
                  <MiningAnimation />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ChevronDown
                        size={48}
                        className="mx-auto animate-bounce"
                      />
                      <p>Press the button to start mining</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleMineClick}
                  className={`w-full py-3 rounded-lg font-bold mt-4 ${
                    isMining
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isMining ? "Stop Mining" : "Start Mining"}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "wallet" && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your Wallet</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="block text-gray-400 mb-2">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your wallet address"
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold mt-4"
                onClick={() => alert("Wallet updated!")}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Tasks</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3
                      className={`font-bold ${
                        task.completed ? "text-gray-500 line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Reward: {task.reward} tokens
                    </p>
                  </div>
                  <button
                    onClick={() => completeTask(task.id)}
                    disabled={task.completed}
                    className={`px-4 py-2 rounded-lg ${
                      task.completed
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {task.completed ? "Completed" : "Complete"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation bar */}
      <div className="bg-gray-800 flex justify-around items-center p-4">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center ${
            activeTab === "home" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex flex-col items-center ${
            activeTab === "tasks" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <CheckSquare size={24} />
          <span className="text-xs mt-1">Tasks</span>
        </button>
        <button
          onClick={() => setActiveTab("wallet")}
          className={`flex flex-col items-center ${
            activeTab === "wallet" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <Wallet size={24} />
          <span className="text-xs mt-1">Wallet</span>
        </button>
      </div>
    </div>
  );
};

export default MiningApp;
