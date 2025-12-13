import { AlertTriangle, CheckCircle, MapPin, Users, Phone } from 'lucide-react';
import '../styles/shared-pages.css';

export default function Safety() {
  const safetyTips = [
    {
      icon: AlertTriangle,
      title: 'Before Your Stay',
      tips: [
        'Always book through the platform - never pay outside of it',
        'Read reviews and host information carefully',
        'Verify the listing is authentic by checking photos and location',
        'Review the cancellation policy before booking',
        'Communicate with your host through the app'
      ]
    },
    {
      icon: MapPin,
      title: 'During Your Stay',
      tips: [
        'Share your itinerary with someone you trust',
        'Keep emergency contacts readily available',
        'Be aware of your surroundings',
        'Follow local laws and customs',
        'Report any issues immediately to support'
      ]
    },
    {
      icon: CheckCircle,
      title: 'After Your Stay',
      tips: [
        'Leave an honest review based on your experience',
        'Report any concerns or issues within 24 hours',
        'Verify charges on your statement',
        'Keep receipts and booking confirmation',
        'Provide feedback to help other travelers'
      ]
    },
    {
      icon: Users,
      title: 'Verified Hosts',
      tips: [
        'All hosts undergo background verification',
        'ID verification is mandatory',
        'Host history and reviews are public',
        'Superhost status indicates quality and reliability',
        'Trust and Safety team monitors all listings'
      ]
    }
  ];

  return (
    <div className="shared-page-container">
      <div className="shared-page-hero">
        <h1>Your Safety is Our Priority</h1>
        <p>We're committed to creating a safe community</p>
      </div>

      <div className="shared-page-content">
        <div className="safety-grid">
          {safetyTips.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="safety-card">
                <div className="safety-header">
                  <Icon size={32} />
                  <h3>{section.title}</h3>
                </div>
                <ul className="safety-tips">
                  {section.tips.map((tip, idx) => (
                    <li key={idx}>
                      <span className="tip-dot"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="safety-contact">
          <h2>Report a Safety Concern</h2>
          <p>If you have any safety concerns, please contact us immediately</p>
          <div className="contact-methods">
            <div className="method">
              <Phone size={24} />
              <span>24/7 Support Line</span>
            </div>
            <div className="method">
              <AlertTriangle size={24} />
              <span>Emergency Report Form</span>
            </div>
          </div>
          <button className="btn-primary">Report Issue</button>
        </div>
      </div>
    </div>
  );
}
