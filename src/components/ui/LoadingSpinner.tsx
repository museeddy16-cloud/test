import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ size = 32, message, fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <div className="loading-spinner-container">
      <Loader2 size={size} className="loading-spinner-icon" />
      {message && <p className="loading-spinner-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-spinner-fullscreen">{content}</div>;
  }

  return content;
}
