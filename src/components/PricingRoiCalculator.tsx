import React, { useState } from 'react';
import { Clock, DollarSign, Leaf, Zap, HelpCircle } from 'lucide-react';

export default function PricingRoiCalculator() {
  const [pagesCount, setPagesCount] = useState(450);
  const [averageTime, setAverageTime] = useState(8); // in minutes saved per document
  const [hourlyRate, setHourlyRate] = useState(45); // USD per hour

  // Compute stats
  const documentsCount = Math.round(pagesCount / 3); // assume avg 3 pages per doc
  const hoursSaved = Math.round((documentsCount * averageTime) / 60 * 10) / 10;
  const monetarySavings = Math.round(hoursSaved * hourlyRate);
  const paperSavedKg = Math.round(pagesCount * 0.005 * 10) / 10; // 5g per A4 sheet

  return (
    <div className="w-full glass-card border border-brand-border/40 p-8 rounded-[28px] shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-border/40 pb-6 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold font-sans">
            <Zap className="w-3 h-3" /> ROI Calculator
          </span>
          <h4 className="font-display font-extrabold text-brand-text text-xl mt-2">
            Calculate Your Efficiency Savings
          </h4>
          <p className="text-xs text-brand-gray mt-1">
            See how much time, capital, and carbon offset you unlock by migrating to Naughty PDF.
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-brand-gray font-semibold uppercase tracking-wider">PROJECTED MONTHLY SAVINGS</p>
          <p className="text-3xl font-display font-black text-brand-primary mt-1">
            ${monetarySavings.toLocaleString()} /mo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Sliders Control Panel */}
        <div className="flex flex-col gap-6">
          {/* Slider 1: Pages Count */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-brand-text">
                Pages Processed / Month
              </label>
              <span className="text-xs font-mono font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-lg">
                {pagesCount.toLocaleString()} pages
              </span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="5000" 
              step="50"
              value={pagesCount} 
              onChange={(e) => setPagesCount(Number(e.target.value))}
              className="w-full accent-brand-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-brand-gray">
              <span>50</span>
              <span>2,500</span>
              <span>5,000</span>
            </div>
          </div>

          {/* Slider 2: Wasted Time on Legacy Platforms */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-brand-text">
                Legacy Friction Delay / Doc
              </label>
              <span className="text-xs font-mono font-bold text-brand-secondary bg-brand-secondary/10 px-2.5 py-0.5 rounded-lg">
                {averageTime} minutes
              </span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="30" 
              step="1"
              value={averageTime} 
              onChange={(e) => setAverageTime(Number(e.target.value))}
              className="w-full accent-brand-secondary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-brand-gray">
              <span>2m</span>
              <span>15m</span>
              <span>30m</span>
            </div>
          </div>

          {/* Slider 3: Hourly Rate */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-brand-text">
                Average Team Blended Rate
              </label>
              <span className="text-xs font-mono font-bold text-brand-accent bg-brand-accent/10 px-2.5 py-0.5 rounded-lg">
                ${hourlyRate} / hr
              </span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="150" 
              step="5"
              value={hourlyRate} 
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-brand-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-brand-gray">
              <span>$15/hr</span>
              <span>$80/hr</span>
              <span>$150/hr</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Stat 1: Time Saved */}
          <div className="bg-brand-primary/[0.03] border border-brand-primary/10 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-2xl font-mono font-black text-brand-text">{hoursSaved} hrs</p>
              <p className="text-[10px] text-brand-gray font-semibold uppercase mt-0.5">Time Saved / mo</p>
            </div>
          </div>

          {/* Stat 2: Capital Saved */}
          <div className="bg-brand-success/[0.03] border border-brand-success/10 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-brand-success/10 text-brand-success flex items-center justify-center mb-4">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-2xl font-mono font-black text-brand-success">${monetarySavings}</p>
              <p className="text-[10px] text-brand-gray font-semibold uppercase mt-0.5">Retained Capital</p>
            </div>
          </div>

          {/* Stat 3: Carbon Offset */}
          <div className="bg-brand-accent/[0.03] border border-brand-accent/10 p-5 rounded-2xl flex flex-col justify-between shadow-sm col-span-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                <Leaf className="w-4.5 h-4.5" />
              </div>
              <span className="text-[9px] font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full uppercase">Green Tech</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-mono font-black text-brand-text">{paperSavedKg} kg</p>
              <p className="text-[10px] text-brand-gray font-semibold uppercase mt-0.5">
                Eco-Paper Saved / Month (Estimated {Math.round(pagesCount / 500)} reams)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
