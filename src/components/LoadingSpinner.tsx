interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

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
      <style>{`
        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .loading-spinner-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          z-index: 9999;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .loading-text {
          margin-top: 12px;
          color: #717171;
          font-size: 14px;
        }
      `}</style>
      
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
