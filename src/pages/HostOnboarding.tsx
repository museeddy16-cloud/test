import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  MapPin,
  Mail,
  Languages,
  Shield,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../config/api";
import "../styles/HostOnboarding.css";

interface FormDataType {
  displayName: string;
  bio: string;
  yearsHosting: number;
  profilePhoto: File | null;
  photoPreview: string;
  country: string;
  city: string;
  sector: string;
  address: string;
  email: string;
  emailOtp: string;
  languages: string[];
  idDocument: File | null;
  idDocumentType: string;
  idPreview: string;
  selfie: File | null;
  selfiePreview: string;
  payoutMethod: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  mobileMoneyNumber: string;
}



const HostOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState<FormDataType>({
    displayName: "",
    bio: "",
    yearsHosting: 1,
    profilePhoto: null,
    photoPreview: "",
    country: "",
    city: "",
    sector: "",
    address: "",
    email: "",
    emailOtp: "",
    languages: [],
    idDocument: null,
    idDocumentType: "PASSPORT",
    idPreview: "",
    selfie: null,
    selfiePreview: "",
    payoutMethod: "BANK_TRANSFER",
    bankName: "",
    bankAccount: "",
    accountHolder: "",
    mobileMoneyNumber: "",
  });

  const languageOptions = [
    "English",
    "French",
    "Spanish",
    "German",
    "Mandarin",
    "Japanese",
    "Arabic",
    "Portuguese",
    "Russian",
    "Hindi",
    "Korean",
    "Italian",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
    setError("");
  };

  const toggleLanguage = (lang: string) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        profilePhoto: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleIdSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        idDocument: file,
        idPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSelfieSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        selfie: file,
        selfiePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSendOtp = async () => {
    if (!form.email) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        getApiUrl("/host-profile/verify-email/send-otp"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: form.email }),
        }
      );

      if (!response.ok) throw new Error("Failed to send OTP");

      const data = await response.json();
      // OTP is sent via email
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (!form.emailOtp) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        getApiUrl("/host-profile/verify-email/confirm-otp"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            otp: form.emailOtp,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to verify OTP");

      setOtpSent(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(5); // Move to Languages step
        setForm((prev) => ({ ...prev, emailOtp: "" }));
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
      setError("");
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    if (!form.displayName || !form.email || form.languages.length === 0) {
      setError("Please complete all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Update profile
      let photoUrl = "";
      if (form.profilePhoto) {
        const photoFormData = new FormData();
        photoFormData.append("file", form.profilePhoto);

        const photoResponse = await fetch(
          getApiUrl("/host-profile/photo"),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: photoFormData,
          }
        );

        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          photoUrl = photoData.photoUrl;
        }
      }

      // Step 2: Update profile info
      const profileResponse = await fetch(getApiUrl("/host-profile/"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: form.displayName,
          bio: form.bio,
          yearsHosting: form.yearsHosting,
          profilePhoto: photoUrl,
        }),
      });

      if (!profileResponse.ok) throw new Error("Failed to update profile");

      // Step 3: Update address
      const addressResponse = await fetch(
        getApiUrl("/host-profile/address"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            country: form.country,
            city: form.city,
            sector: form.sector,
            address: form.address,
          }),
        }
      );

      if (!addressResponse.ok) throw new Error("Failed to update address");

      // Step 4: Update languages
      const langResponse = await fetch(
        getApiUrl("/host-profile/languages"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ languages: form.languages }),
        }
      );

      if (!langResponse.ok) throw new Error("Failed to update languages");

      // Step 5: Upload identity documents
      if (form.idDocument) {
        const idFormData = new FormData();
        idFormData.append("file", form.idDocument);

        const idResponse = await fetch(
          getApiUrl("/host-verification/upload-id"),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: idFormData,
          }
        );

        if (!idResponse.ok) throw new Error("Failed to upload ID");
      }

      // Step 6: Upload selfie
      if (form.selfie) {
        const selfieFormData = new FormData();
        selfieFormData.append("file", form.selfie);

        const selfieResponse = await fetch(
          getApiUrl("/host-verification/upload-selfie"),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: selfieFormData,
          }
        );

        if (!selfieResponse.ok) throw new Error("Failed to upload selfie");
      }

      // Step 7: Setup payout
      const payoutData =
        form.payoutMethod === "BANK_TRANSFER"
          ? {
              paymentMethod: "BANK_TRANSFER",
              bankName: form.bankName,
              accountNumber: form.bankAccount,
              accountHolderName: form.accountHolder,
            }
          : {
              paymentMethod: "MOBILE_MONEY",
              mobileMoneyNumber: form.mobileMoneyNumber,
            };

      const payoutResponse = await fetch(
        getApiUrl("/host-payout/account"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payoutData),
        }
      );

      if (!payoutResponse.ok) {
        const errorData = await payoutResponse.json();
        throw new Error(errorData.error || "Failed to setup payout");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard/listings");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="host-onboarding">
        <div className="error-container">
          <AlertCircle size={48} />
          <p>You must be logged in to access this page</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="host-onboarding">
        <div className="success-container">
          <Check size={64} color="#48bb78" />
          <h2>Onboarding Complete!</h2>
          <p>Your host account has been successfully set up.</p>
          <p>You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: "Role Confirmation",
      icon: <Home size={24} />,
      description: "Confirm you want to become a host",
      content: (
        <div className="step-content-inner">
          <h3>Become a Host</h3>
          <p>Start hosting and earn money by sharing your space.</p>
          <div className="confirmation-message">
            <Check color="#48bb78" size={20} />
            <span>You are about to upgrade your account to Host status</span>
          </div>
        </div>
      ),
    },
    {
      title: "Profile Setup",
      icon: <FileText size={24} />,
      description: "Complete your profile information",
      content: (
        <div className="step-content-inner">
          <h3>Profile Information</h3>
          <div className="form-group">
            <label>Display Name *</label>
            <input
              type="text"
              name="displayName"
              placeholder="Your display name"
              value={form.displayName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              placeholder="Tell guests about yourself..."
              value={form.bio}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Years Hosting</label>
              <input
                type="number"
                name="yearsHosting"
                value={form.yearsHosting}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Profile Photo</label>
            <div
              className="photo-upload"
              onClick={() => photoInputRef.current?.click()}
            >
              {form.photoPreview ? (
                <img src={form.photoPreview} alt="Preview" />
              ) : (
                <>
                  <Upload size={32} />
                  <p>Click to upload your photo</p>
                </>
              )}
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Address",
      icon: <MapPin size={24} />,
      description: "Provide your hosting address",
      content: (
        <div className="step-content-inner">
          <h3>Hosting Address</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sector</label>
              <input
                type="text"
                name="sector"
                placeholder="Neighborhood/Sector"
                value={form.sector}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Full Address *</label>
            <textarea
              name="address"
              placeholder="Street address, building, apartment number, etc."
              value={form.address}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>
        </div>
      ),
    },
    {
      title: "Email Verification",
      icon: <Mail size={24} />,
      description: "Verify your email address",
      content: (
        <div className="step-content-inner">
          <h3>Email Verification</h3>
          {!otpSent ? (
            <>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <p className="info-text">
                We've sent an OTP to {form.email}
              </p>
              <div className="form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  name="emailOtp"
                  placeholder="000000"
                  value={form.emailOtp}
                  onChange={handleInputChange}
                  maxLength={6}
                />
              </div>
              <button
                type="button"
                onClick={handleConfirmOtp}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Languages",
      icon: <Languages size={24} />,
      description: "Select languages you speak",
      content: (
        <div className="step-content-inner">
          <h3>Languages Spoken</h3>
          <p className="form-hint">Select all languages you can communicate in</p>
          <div className="languages-grid">
            {languageOptions.map(lang => (
              <button
                key={lang}
                type="button"
                className={`language-btn ${
                  form.languages.includes(lang) ? "selected" : ""
                }`}
                onClick={() => toggleLanguage(lang)}
              >
                {form.languages.includes(lang) && (
                  <Check size={16} className="mr-2" />
                )}
                {lang}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Identity Verification",
      icon: <Shield size={24} />,
      description: "Upload identification documents",
      content: (
        <div className="step-content-inner">
          <h3>Identity Verification</h3>
          <div className="form-group">
            <label>ID Document Type</label>
            <select
              name="idDocumentType"
              value={form.idDocumentType}
              onChange={handleInputChange}
            >
              <option value="PASSPORT">Passport</option>
              <option value="DRIVER_LICENSE">Driver's License</option>
              <option value="NATIONAL_ID">National ID</option>
            </select>
          </div>
          <div className="form-group">
            <label>ID Document</label>
            <div
              className="photo-upload"
              onClick={() => idInputRef.current?.click()}
            >
              {form.idPreview ? (
                <img src={form.idPreview} alt="ID Preview" />
              ) : (
                <>
                  <Upload size={32} />
                  <p>Upload your ID document</p>
                </>
              )}
            </div>
            <input
              ref={idInputRef}
              type="file"
              accept="image/*"
              onChange={handleIdSelect}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-group">
            <label>Selfie with ID</label>
            <div
              className="photo-upload"
              onClick={() => selfieInputRef.current?.click()}
            >
              {form.selfiePreview ? (
                <img src={form.selfiePreview} alt="Selfie Preview" />
              ) : (
                <>
                  <Upload size={32} />
                  <p>Take a selfie holding your ID</p>
                </>
              )}
            </div>
            <input
              ref={selfieInputRef}
              type="file"
              accept="image/*"
              onChange={handleSelfieSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Payout Setup",
      icon: <DollarSign size={24} />,
      description: "Configure your payment method",
      content: (
        <div className="step-content-inner">
          <h3>Payout Method</h3>
          <div className="form-group">
            <label>Payment Method *</label>
            <select
              name="payoutMethod"
              value={form.payoutMethod}
              onChange={handleInputChange}
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
            </select>
          </div>

          {form.payoutMethod === "BANK_TRANSFER" ? (
            <>
              <div className="form-group">
                <label>Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  placeholder="Your bank name"
                  value={form.bankName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Account Number *</label>
                <input
                  type="text"
                  name="bankAccount"
                  placeholder="Account number"
                  value={form.bankAccount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Account Holder Name *</label>
                <input
                  type="text"
                  name="accountHolder"
                  placeholder="Full name on account"
                  value={form.accountHolder}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Mobile Money Number *</label>
              <input
                type="tel"
                name="mobileMoneyNumber"
                placeholder="+1234567890"
                value={form.mobileMoneyNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="host-onboarding">
      <div className="onboarding-container">
        {/* Step Indicators */}
        <div className="steps-indicator">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`step-indicator ${step === i + 1 ? "active" : ""} ${
                i < step ? "completed" : ""
              }`}
              onClick={() => i < step && setStep(i + 1)}
            >
              {i < step ? (
                <Check size={16} />
              ) : (
                <span className="step-number">{i + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <FileText size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Current Step */}
        <form onSubmit={step === 7 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <div className="step-header">
            <span className="step-icon">{steps[step - 1].icon}</span>
            <div>
              <h2>{steps[step - 1].title}</h2>
              <p>{steps[step - 1].description}</p>
            </div>
          </div>

          <div className="step-content">{steps[step - 1].content}</div>

          {/* Navigation Buttons */}
          <div className="form-actions">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-secondary"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                "Loading..."
              ) : step === 7 ? (
                <>
                  <Check size={20} />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostOnboarding;
