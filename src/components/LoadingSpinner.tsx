interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

import '../styles/loading-spinner.css';

export default function LoadingSpinner({
  size = 'medium',
  color = '#FF5A5F',
  text,
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60
  };

  const spinnerSize = sizeMap[size];

  return (
    <div className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
      <svg
        className="spinner"
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80, 200"
        />
      </svg>
      
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}
