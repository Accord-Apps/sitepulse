import React from 'react';

interface ScoreDialProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  grade?: string;
  subtext?: string;
}

export const ScoreDial: React.FC<ScoreDialProps> = ({
  score,
  label,
  size = 'md',
  grade,
  subtext,
}) => {
  // Determine color scheme
  let colorClass = 'text-red-500 border-red-500/30 bg-red-950/20';
  let strokeColor = '#ef4444';
  let badgeBg = 'bg-red-500/10 text-red-400 border-red-500/20';

  if (score >= 90) {
    colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    strokeColor = '#34d399';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score >= 70) {
    colorClass = 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    strokeColor = '#fbbf24';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  const radius = size === 'lg' ? 44 : size === 'md' ? 36 : 26;
  const stroke = size === 'lg' ? 7 : size === 'md' ? 5 : 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const dim = radius * 2;

  return (
    <div className="flex flex-col items-center text-center p-3">
      <div className="relative flex items-center justify-center">
        <svg height={dim} width={dim} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="rgba(255,255,255,0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold tracking-tight ${
              size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-lg'
            }`}
          >
            {score}
          </span>
          {grade && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border uppercase tracking-wider ${badgeBg}`}
            >
              {grade}
            </span>
          )}
        </div>
      </div>

      <span className="mt-2 text-xs font-medium text-slate-300">{label}</span>
      {subtext && <span className="text-[11px] text-slate-500">{subtext}</span>}
    </div>
  );
};
