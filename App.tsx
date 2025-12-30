
import React, { useState, useEffect, useCallback } from 'react';
import { DecisionResult } from './types';
import { executeDecision } from './utils/logic';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DecisionResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('who_monolith_data');
    if (saved) setInput(saved);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    localStorage.setItem('who_monolith_data', val);
  };

  const handleDecide = () => {
    const decision = executeDecision(input);
    if (decision) {
      setResult(decision);
    }
  };

  const handleReset = () => {
    setResult(null);
    setInput('');
    localStorage.removeItem('who_monolith_data');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-10 select-none">
      <div className="w-full max-w-3xl h-[85vh] md:h-[90vh] flex flex-col gap-6 md:gap-10">
        
        {/* Header */}
        <header className="flex justify-between items-end px-2">
          <div className="font-extrabold text-sm md:text-base tracking-[0.4em] uppercase text-[#475569]">
            Who
          </div>
          <div className="font-mono text-[10px] md:text-xs text-[#475569] uppercase">
            {result ? 'Outcome Fixed' : 'Paste names separated by lines'}
          </div>
        </header>

        {/* Main Monolith Surface */}
        <main className="flex-grow relative bg-[#121212] border border-[rgba(255,255,255,0.08)] rounded-sm flex flex-col overflow-hidden imprint transition-all duration-700">
          
          {!result ? (
            <textarea
              value={input}
              onChange={handleInputChange}
              className="flex-grow bg-transparent border-none outline-none text-[#e2e8f0] font-mono text-base md:text-lg leading-relaxed p-6 md:p-10 resize-none placeholder-[#262626]"
              placeholder={`Enter names...\n\nCommands:\n'split 2' to group\n'pick 1' to select winner`}
              spellCheck={false}
            />
          ) : (
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col overflow-y-auto animate-imprint bg-[#121212] z-10">
              <ResultDisplay result={result} />
            </div>
          )}

          {/* Controls Footer */}
          {!result && (
            <div className="border-t border-[rgba(255,255,255,0.08)]">
              <button
                onClick={handleDecide}
                className="w-full py-8 md:py-10 bg-transparent text-[#f8fafc] font-bold text-xs md:text-sm tracking-[0.3em] uppercase hover:bg-[#e2e8f0] hover:text-[#0d0d0d] active:opacity-70 transition-all duration-300"
              >
                Decide
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Reset Button */}
      {result && (
        <button
          onClick={handleReset}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 px-4 md:px-6 py-2 md:py-3 border border-[rgba(255,255,255,0.08)] bg-[#121212] text-[#f8fafc] font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#e2e8f0] hover:text-[#0d0d0d] transition-colors z-50 imprint"
        >
          Reset
        </button>
      )}

      {/* Footer Branding */}
      <div className="fixed bottom-4 left-4 text-[10px] text-[#262626] lowercase transition-colors hover:text-[#475569]">
        a page from <a href="https://pageshyt.vercel.app" className="hover:underline">pageshyt</a>
      </div>
    </div>
  );
};

const ResultDisplay: React.FC<{ result: DecisionResult }> = ({ result }) => {
  if (result.mode === 'split') {
    const teams = result.data as string[][];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {teams.map((members, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="font-extrabold text-[10px] uppercase tracking-[0.2em] text-[#475569] mb-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
              Group {idx + 1}
            </div>
            <div className="flex flex-col gap-3">
              {members.map((m, i) => (
                <ResultItem key={i} text={m} delay={i * 50 + idx * 100} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (result.mode === 'pick') {
    const winners = result.data as string[];
    return (
      <div className="flex flex-col gap-6">
        <div className="font-extrabold text-[10px] uppercase tracking-[0.2em] text-[#475569] mb-2">Selected</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {winners.map((m, i) => (
            <ResultItem key={i} text={m} prefix="Winner" delay={i * 100} />
          ))}
        </div>
      </div>
    );
  }

  const list = result.data as string[];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
      {list.map((m, i) => (
        <ResultItem key={i} text={m} prefix={`${i + 1}`} delay={i * 30} />
      ))}
    </div>
  );
};

const ResultItem: React.FC<{ text: string; prefix?: string; delay: number }> = ({ text, prefix, delay }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`font-mono text-sm md:text-base p-4 border-l border-[#475569] transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
      }`}
    >
      {prefix && <span className="text-[#475569] mr-4 text-xs">{prefix}</span>}
      <span className="text-[#e2e8f0] font-medium">{text}</span>
    </div>
  );
};

export default App;
