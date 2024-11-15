import React from 'react';

interface MatchScoreProps {
  score: number;
}

export function MatchScore({ score }: MatchScoreProps) {
  // Normalize score to 0-100 range
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  // Calculate circle properties
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-gray-400';
  };

  const getTrackColor = (score: number) => {
    if (score >= 90) return 'text-emerald-100';
    if (score >= 75) return 'text-blue-100';
    if (score >= 60) return 'text-yellow-100';
    return 'text-gray-100';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-16 h-16 transform -rotate-90">
        {/* Background track */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          strokeWidth="8"
          stroke="currentColor"
          fill="none"
          className={getTrackColor(normalizedScore)}
        />
        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          strokeWidth="8"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          className={`${getScoreColor(normalizedScore)} transition-all duration-1000 ease-out`}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${getScoreColor(normalizedScore)}`}>
          {Math.round(normalizedScore)}%
        </span>
      </div>
    </div>
  );
}