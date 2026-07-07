import React, { useState, useEffect, useRef } from 'react';

interface AnimatedStatValueProps {
  value: string;
}

export const AnimatedStatValue: React.FC<AnimatedStatValueProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  const startAnimation = () => {
    if (value === 'Zero') {
      // Premium character decoding scramble effect for non-numeric stats
      const target = 'Zero';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';
      let iterations = 0;
      
      const interval = setInterval(() => {
        setDisplayValue(
          target
            .split('')
            .map((char, index) => {
              if (index < iterations) {
                return target[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        
        if (iterations >= target.length) {
          clearInterval(interval);
          setDisplayValue(target);
        }
        
        iterations += 1/4; // speed of decryption
      }, 45);
      
      return () => clearInterval(interval);
    }

    // Match numbers with possible prefixes and suffixes (e.g. "< 1.8s", "99.99%", "45M+")
    const match = value.match(/^(.*?)([0-9.]+)(.*?)$/);
    if (match) {
      const prefix = match[1];
      const numStr = match[2];
      const suffix = match[3];
      
      const targetNum = parseFloat(numStr);
      const isDecimal = numStr.includes('.');
      const decimals = isDecimal ? numStr.split('.')[1].length : 0;
      
      // Determine custom starting random values to count up/down from beautifully
      let startNum = 0;
      if (value.includes('M')) {
        startNum = Math.floor(Math.random() * 12) + 6; // e.g. start at random 6-17
      } else if (value.includes('%')) {
        startNum = parseFloat((Math.random() * 12 + 65).toFixed(decimals)); // e.g. start at random 65-77%
      } else if (value.includes('s')) {
        startNum = parseFloat((Math.random() * 1.5 + 4.0).toFixed(decimals)); // e.g. start at random 4.0-5.5s and count down to 1.8s
      } else {
        startNum = Math.floor(targetNum * 0.25);
      }
      
      const duration = 1400; // 1.4 seconds animation
      const steps = 35;
      const stepTime = duration / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        // easeOutQuad curve for smooth deceleration
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentNum = startNum + (targetNum - startNum) * easeProgress;
        
        setDisplayValue(`${prefix}${currentNum.toFixed(decimals)}${suffix}`);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayValue(value);
        }
      }, stepTime);
      
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          startAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, hasTriggered]);

  return (
    <span 
      ref={containerRef} 
      onClick={startAnimation} 
      className="cursor-pointer select-none group"
      title="Click to re-animate!"
    >
      <span className="group-hover:text-brand-primary transition-colors duration-300">
        {displayValue}
      </span>
    </span>
  );
};
