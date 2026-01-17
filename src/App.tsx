import React from 'react';
import { TimeMachine } from './components/TimeMachine';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-50 w-full max-w-2xl">
        <TimeMachine />
      </div>
    </div>
  );
};

export default App;