import { useState } from 'react';
import { CreditCard, Smartphone, Check, AlertCircle, Loader } from 'lucide-react';

type PaymentProvider = 'STRIPE' | 'MTN_MOMO' | 'AIRTEL_MONEY';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onSubmit: (provider: PaymentProvider, details: PaymentDetails) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

interface PaymentDetails {
  provider: PaymentProvider;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  phoneNumber?: string;
}

export default function PaymentForm({
  amount,
  currency = 'USD',
  onSubmit,
  loading = false,
  error = null
}: PaymentFormProps) {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('STRIPE');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedProvider === 'STRIPE') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setFormError('Please enter a valid card number');
        return;
      }
      if (!expiryDate || expiryDate.length < 5) {
        setFormError('Please enter a valid expiry date');
        return;
      }
      if (!cvv || cvv.length < 3) {
        setFormError('Please enter a valid CVV');
        return;
      }
    } else {
      if (!phoneNumber || phoneNumber.length < 10) {
        setFormError('Please enter a valid phone number');
        return;
      }
    }

    await onSubmit(selectedProvider, {
      provider: selectedProvider,
      cardNumber: selectedProvider === 'STRIPE' ? cardNumber.replace(/\s/g, '') : undefined,
      expiryDate: selectedProvider === 'STRIPE' ? expiryDate : undefined,
      cvv: selectedProvider === 'STRIPE' ? cvv : undefined,
      phoneNumber: selectedProvider !== 'STRIPE' ? phoneNumber : undefined
    });
  };

  const providers = [
    { id: 'STRIPE' as PaymentProvider, name: 'Credit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'MTN_MOMO' as PaymentProvider, name: 'MTN Mobile Money', icon: Smartphone, description: 'Pay with MTN MoMo' },
    { id: 'AIRTEL_MONEY' as PaymentProvider, name: 'Airtel Money', icon: Smartphone, description: 'Pay with Airtel Money' }
  ];

  const displayError = error || formError;

  return (
    <div className="payment-form">
      <style>{`
        .payment-form {
          max-width: 480px;
        }
        .payment-amount {
          text-align: center;
          padding: 24px;
          background: #f7f7f7;
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .payment-amount span {
          display: block;
          color: #717171;
          font-size: 14px;
          margin-bottom: 4px;
        }
        .payment-amount h2 {
          margin: 0;
          font-size: 32px;
        }
        .provider-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .provider-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 2px solid #ddd;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }
        .provider-option:hover {
          border-color: #999;
        }
        .provider-option.selected {
          border-color: #222;
          background: #f7f7f7;
        }
        .provider-icon {
          width: 48px;
          height: 48px;
          background: #f0f0f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .provider-option.selected .provider-icon {
          background: #222;
          color: white;
        }
        .provider-info {
          flex: 1;
        }
        .provider-info h4 {
          margin: 0 0 4px;
          font-size: 16px;
        }
        .provider-info p {
          margin: 0;
          font-size: 13px;
          color: #717171;
        }
        .provider-check {
          width: 24px;
          height: 24px;
          border: 2px solid #ddd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .provider-option.selected .provider-check {
          background: #222;
          border-color: #222;
          color: white;
        }
        .payment-fields {
          margin-bottom: 24px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #222;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff3f3;
          color: #c00;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }
        .btn-pay {
          width: 100%;
          padding: 16px;
          background: #FF5A5F;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .btn-pay:hover:not(:disabled) {
          background: #e04a4f;
        }
        .btn-pay:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .security-note {
          text-align: center;
          font-size: 12px;
          color: #717171;
          margin-top: 16px;
        }
      `}</style>

      <div className="payment-amount">
        <span>Total Amount</span>
        <h2>{currency} {amount.toFixed(2)}</h2>
      </div>

      <div className="provider-options">
        {providers.map(provider => (
          <div
            key={provider.id}
            className={`provider-option ${selectedProvider === provider.id ? 'selected' : ''}`}
            onClick={() => setSelectedProvider(provider.id)}
          >
            <div className="provider-icon">
              <provider.icon size={24} />
            </div>
            <div className="provider-info">
              <h4>{provider.name}</h4>
              <p>{provider.description}</p>
            </div>
            <div className="provider-check">
              {selectedProvider === provider.id && <Check size={14} />}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="payment-fields">
          {selectedProvider === 'STRIPE' ? (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+250 7XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          )}
        </div>

        {displayError && (
          <div className="error-message">
            <AlertCircle size={18} />
            {displayError}
          </div>
        )}

        <button type="submit" className="btn-pay" disabled={loading}>
          {loading ? (
            <>
              <Loader size={20} className="spinner" />
              Processing...
            </>
          ) : (
            `Pay ${currency} ${amount.toFixed(2)}`
          )}
        </button>
      </form>

      <p className="security-note">
        Your payment information is encrypted and secure.
      </p>
    </div>
  );
}
