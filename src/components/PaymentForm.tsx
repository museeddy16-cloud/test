import { useState } from 'react';
import { CreditCard, Smartphone, Check, AlertCircle, Loader } from 'lucide-react';
import '../styles/payment-form.css';

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
