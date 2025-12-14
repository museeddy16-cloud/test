import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Upload, 
  Shield,
  FileText,
  User,
  CreditCard
} from 'lucide-react';
import { useFetch, usePost } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface VerificationStatus {
  email: { verified: boolean; verifiedAt?: string };
  phone: { verified: boolean; verifiedAt?: string };
  identity: { verified: boolean; status: 'pending' | 'approved' | 'rejected' | 'not_submitted'; verifiedAt?: string };
  government: { verified: boolean; status: 'pending' | 'approved' | 'rejected' | 'not_submitted'; verifiedAt?: string };
}

export default function HostVerification() {
  const { data: verification, loading, refetch } = useFetch<VerificationStatus>('/host/verification');
  const { post, loading: submitting } = usePost();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'identity' | 'government' | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'identity' | 'government') => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadType(type);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadType) return;
    
    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('type', uploadType);
    
    await post(`/host/verification/${uploadType}`, formData);
    setSelectedFile(null);
    setUploadType(null);
    refetch();
  };

  const getStatusIcon = (status: string | boolean) => {
    if (status === true || status === 'approved') {
      return <CheckCircle2 size={20} className="status-icon verified" />;
    } else if (status === 'pending') {
      return <Clock size={20} className="status-icon pending" />;
    } else if (status === 'rejected') {
      return <XCircle size={20} className="status-icon rejected" />;
    }
    return <XCircle size={20} className="status-icon not-verified" />;
  };

  const getStatusText = (status: string | boolean) => {
    if (status === true || status === 'approved') return 'Verified';
    if (status === 'pending') return 'Pending Review';
    if (status === 'rejected') return 'Rejected';
    return 'Not Verified';
  };

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading verification status..." />;
  }

  const verificationItems = [
    {
      key: 'email',
      icon: FileText,
      title: 'Email Address',
      description: 'Verify your email to receive important notifications',
      status: verification?.email?.verified || false,
      action: !verification?.email?.verified ? 'Resend Email' : null,
    },
    {
      key: 'phone',
      icon: CreditCard,
      title: 'Phone Number',
      description: 'Verify your phone for two-factor authentication',
      status: verification?.phone?.verified || false,
      action: !verification?.phone?.verified ? 'Verify Phone' : null,
    },
    {
      key: 'identity',
      icon: User,
      title: 'Identity Verification',
      description: 'Upload a photo ID to verify your identity',
      status: verification?.identity?.status || 'not_submitted',
      uploadable: true,
      type: 'identity' as const,
    },
    {
      key: 'government',
      icon: Shield,
      title: 'Government ID',
      description: 'Upload a government-issued ID for additional trust',
      status: verification?.government?.status || 'not_submitted',
      uploadable: true,
      type: 'government' as const,
    },
  ];

  const completedCount = verificationItems.filter(
    item => item.status === true || item.status === 'approved'
  ).length;

  return (
    <div className="host-verification">
      <div className="page-header">
        <h1>Verification</h1>
        <p>Complete your verification to build trust with guests</p>
      </div>

      <div className="verification-progress">
        <div className="progress-header">
          <h3>Verification Progress</h3>
          <span className="progress-count">{completedCount}/{verificationItems.length} completed</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(completedCount / verificationItems.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="verification-list">
        {verificationItems.map((item) => (
          <div key={item.key} className="verification-item">
            <div className="verification-icon">
              <item.icon size={24} />
            </div>
            <div className="verification-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
            <div className="verification-status">
              {getStatusIcon(item.status)}
              <span className={`status-text ${typeof item.status === 'string' ? item.status : item.status ? 'verified' : 'not-verified'}`}>
                {getStatusText(item.status)}
              </span>
            </div>
            <div className="verification-action">
              {item.uploadable && item.status !== 'approved' && item.status !== 'pending' && (
                <label className="upload-btn">
                  <Upload size={16} />
                  <span>Upload</span>
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileSelect(e, item.type!)}
                    hidden
                  />
                </label>
              )}
              {item.action && (
                <button className="btn btn-secondary btn-sm">
                  {item.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="upload-preview">
          <div className="preview-info">
            <FileText size={20} />
            <span>{selectedFile.name}</span>
          </div>
          <div className="preview-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedFile(null);
                setUploadType(null);
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleUpload}
              disabled={submitting === 'loading'}
            >
              {submitting === 'loading' ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
