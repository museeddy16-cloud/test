import { FileText, AlertCircle, Check } from 'lucide-react';
import '../styles/shared-pages.css';

export default function Terms() {
  return (
    <div className="shared-page-container">
      <div className="shared-page-hero">
        <h1>Terms & Conditions</h1>
        <p>Last updated: December 2024</p>
      </div>

      <div className="shared-page-content legal-content">
        <section className="legal-section">
          <h2><FileText size={24} /> Agreement to Terms</h2>
          <p>
            By accessing and using this IRU Voyage platform, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, 
            please do not use this service.
          </p>
        </section>

        <section className="legal-section">
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) 
            on IRU Voyage for personal, non-commercial transitory viewing only. This is the grant of a license, 
            not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Disclaimer</h2>
          <p>
            The materials on IRU Voyage are provided "as is". IRU Voyage makes no warranties, expressed or implied, 
            and hereby disclaims and negates all other warranties including, without limitation, implied warranties 
            or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property 
            or other violation of rights.
          </p>
        </section>

        <section className="legal-section">
          <h2><AlertCircle size={24} /> Limitations</h2>
          <p>
            In no event shall IRU Voyage or its suppliers be liable for any damages (including, without limitation, 
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
            to use the materials on IRU Voyage.
          </p>
        </section>

        <section className="legal-section">
          <h2>Accuracy of Materials</h2>
          <p>
            The materials appearing on IRU Voyage could include technical, typographical, or photographic errors. 
            IRU Voyage does not warrant that any of the materials on the platform are accurate, complete, or current. 
            IRU Voyage may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section className="legal-section">
          <h2><Check size={24} /> User Responsibilities</h2>
          <p>As a user of IRU Voyage, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of your account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Not engage in fraud, harassment, or illegal activities</li>
            <li>Respect the rights and property of others</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Contact Information</h2>
          <p>
            For any questions regarding these Terms & Conditions, please contact us at:<br/>
            <strong>Email:</strong> legal@iruVoyage.com<br/>
            <strong>Address:</strong> IRU Voyage Inc., Legal Department
          </p>
        </section>
      </div>
    </div>
  );
}
