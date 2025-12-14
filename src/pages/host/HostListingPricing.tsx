import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Percent, 
  Settings,
  Save,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { useFetch, usePut, usePost, useDelete } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Tabs from '../../components/ui/Tabs';
import { Listing, ListingPricing, SeasonalPrice } from '../../types/dashboard';

export default function HostListingPricing() {
  const { data: listings, loading: listingsLoading } = useFetch<Listing[]>('/host/listings');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const { data: pricing, loading: pricingLoading, refetch } = useFetch<ListingPricing>(
    selectedListing ? `/host/listings/${selectedListing}/pricing` : '',
    !!selectedListing
  );
  const { put, loading: saving } = usePut();
  const { post, loading: adding } = usePost();
  const { remove, loading: deleting } = useDelete();

  const [pricingForm, setPricingForm] = useState<Partial<ListingPricing>>({});
  const [seasonalModal, setSeasonalModal] = useState(false);
  const [seasonalForm, setSeasonalForm] = useState<Partial<SeasonalPrice>>({
    name: '',
    startDate: '',
    endDate: '',
    priceMultiplier: 1.0,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (listings && listings.length > 0 && !selectedListing) {
      setSelectedListing(listings[0].id);
    }
  }, [listings, selectedListing]);

  useEffect(() => {
    if (pricing) {
      setPricingForm(pricing);
    }
  }, [pricing]);

  const handlePricingChange = (field: keyof ListingPricing, value: number) => {
    setPricingForm({ ...pricingForm, [field]: value });
  };

  const handleSavePricing = async () => {
    if (!selectedListing) return;
    const result = await put(`/host/listings/${selectedListing}/pricing`, pricingForm);
    if (result) {
      setMessage({ type: 'success', text: 'Pricing updated successfully!' });
      refetch();
    } else {
      setMessage({ type: 'error', text: 'Failed to update pricing.' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddSeasonalPrice = async () => {
    if (!selectedListing) return;
    const result = await post(`/host/listings/${selectedListing}/pricing/seasonal`, seasonalForm);
    if (result) {
      setSeasonalModal(false);
      setSeasonalForm({ name: '', startDate: '', endDate: '', priceMultiplier: 1.0 });
      refetch();
    }
  };

  const handleDeleteSeasonalPrice = async (seasonalId: string) => {
    if (!selectedListing) return;
    await remove(`/host/listings/${selectedListing}/pricing/seasonal/${seasonalId}`);
    refetch();
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  if (listingsLoading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading listings..." />;
  }

  const tabs = [
    {
      id: 'base',
      label: 'Base Pricing',
      content: (
        <div className="pricing-section">
          <h3>Base Pricing</h3>
          <p className="section-description">Set your default nightly rate and fees</p>
          
          <div className="pricing-form">
            <div className="form-group">
              <label>
                <DollarSign size={18} />
                Base Price (per night)
              </label>
              <div className="input-with-prefix">
                <span>$</span>
                <input
                  type="number"
                  value={pricingForm.basePrice || ''}
                  onChange={(e) => handlePricingChange('basePrice', parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <Calendar size={18} />
                Weekend Price (per night)
              </label>
              <div className="input-with-prefix">
                <span>$</span>
                <input
                  type="number"
                  value={pricingForm.weekendPrice || ''}
                  onChange={(e) => handlePricingChange('weekendPrice', parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                  placeholder="Same as base"
                />
              </div>
              <span className="helper-text">Leave empty to use base price for weekends</span>
            </div>

            <div className="form-group">
              <label>Cleaning Fee</label>
              <div className="input-with-prefix">
                <span>$</span>
                <input
                  type="number"
                  value={pricingForm.cleaningFee || ''}
                  onChange={(e) => handlePricingChange('cleaningFee', parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service Fee (%)</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={pricingForm.serviceFee || ''}
                  onChange={(e) => handlePricingChange('serviceFee', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.1}
                />
                <span>%</span>
              </div>
            </div>

            <div className="form-group">
              <label>Tax Rate (%)</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={pricingForm.taxRate || ''}
                  onChange={(e) => handlePricingChange('taxRate', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.1}
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'discounts',
      label: 'Discounts',
      content: (
        <div className="pricing-section">
          <h3>Length of Stay Discounts</h3>
          <p className="section-description">Encourage longer bookings with discounts</p>
          
          <div className="pricing-form">
            <div className="form-group">
              <label>
                <Percent size={18} />
                Weekly Discount
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={pricingForm.weeklyDiscount || ''}
                  onChange={(e) => handlePricingChange('weeklyDiscount', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  placeholder="0"
                />
                <span>%</span>
              </div>
              <span className="helper-text">Applied to stays of 7+ nights</span>
            </div>

            <div className="form-group">
              <label>
                <Percent size={18} />
                Monthly Discount
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={pricingForm.monthlyDiscount || ''}
                  onChange={(e) => handlePricingChange('monthlyDiscount', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  placeholder="0"
                />
                <span>%</span>
              </div>
              <span className="helper-text">Applied to stays of 28+ nights</span>
            </div>
          </div>

          <div className="discount-preview">
            <h4>Preview</h4>
            <table>
              <tbody>
                <tr>
                  <td>1 night</td>
                  <td>{formatCurrency(pricingForm.basePrice || 0)}</td>
                </tr>
                <tr>
                  <td>7 nights</td>
                  <td>
                    {formatCurrency(
                      (pricingForm.basePrice || 0) * 7 * (1 - (pricingForm.weeklyDiscount || 0) / 100)
                    )}
                    {(pricingForm.weeklyDiscount || 0) > 0 && (
                      <span className="discount-tag">-{pricingForm.weeklyDiscount}%</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>30 nights</td>
                  <td>
                    {formatCurrency(
                      (pricingForm.basePrice || 0) * 30 * (1 - (pricingForm.monthlyDiscount || 0) / 100)
                    )}
                    {(pricingForm.monthlyDiscount || 0) > 0 && (
                      <span className="discount-tag">-{pricingForm.monthlyDiscount}%</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'seasonal',
      label: 'Seasonal Pricing',
      content: (
        <div className="pricing-section">
          <div className="section-header">
            <div>
              <h3>Seasonal Pricing</h3>
              <p className="section-description">Adjust prices for peak seasons and special events</p>
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setSeasonalModal(true)}
            >
              <Plus size={16} />
              Add Season
            </button>
          </div>

          {pricing?.seasonalPricing && pricing.seasonalPricing.length > 0 ? (
            <div className="seasonal-list">
              {pricing.seasonalPricing.map((season) => (
                <div key={season.id} className="seasonal-item">
                  <div className="seasonal-info">
                    <h4>{season.name}</h4>
                    <p>
                      {new Date(season.startDate).toLocaleDateString()} - 
                      {new Date(season.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="seasonal-price">
                    <span className="multiplier">
                      {season.priceMultiplier > 1 ? '+' : ''}
                      {((season.priceMultiplier - 1) * 100).toFixed(0)}%
                    </span>
                    <span className="calculated">
                      {formatCurrency((pricingForm.basePrice || 0) * season.priceMultiplier)}/night
                    </span>
                  </div>
                  <button 
                    className="btn-icon danger"
                    onClick={() => handleDeleteSeasonalPrice(season.id)}
                    disabled={deleting === 'loading'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-inline">
              <Calendar size={48} />
              <p>No seasonal pricing set</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setSeasonalModal(true)}
              >
                Add Your First Season
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="host-listing-pricing">
      <div className="page-header">
        <div>
          <h1>Listing Pricing</h1>
          <p>Manage pricing for your properties</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSavePricing}
          disabled={saving === 'loading' || !selectedListing}
        >
          <Save size={18} />
          {saving === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <Check size={18} />
          {message.text}
        </div>
      )}

      <div className="listing-selector">
        <label>Select Listing</label>
        <select
          value={selectedListing || ''}
          onChange={(e) => setSelectedListing(e.target.value)}
        >
          {listings?.map((listing) => (
            <option key={listing.id} value={listing.id}>
              {listing.title}
            </option>
          ))}
        </select>
      </div>

      {pricingLoading === 'loading' ? (
        <LoadingSpinner message="Loading pricing..." />
      ) : (
        <Tabs tabs={tabs} />
      )}

      <Modal
        isOpen={seasonalModal}
        onClose={() => setSeasonalModal(false)}
        title="Add Seasonal Pricing"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSeasonalModal(false)}>
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleAddSeasonalPrice}
              disabled={adding === 'loading' || !seasonalForm.name || !seasonalForm.startDate || !seasonalForm.endDate}
            >
              {adding === 'loading' ? 'Adding...' : 'Add Season'}
            </button>
          </>
        }
      >
        <form className="seasonal-form">
          <div className="form-group">
            <label>Season Name</label>
            <input
              type="text"
              value={seasonalForm.name}
              onChange={(e) => setSeasonalForm({ ...seasonalForm, name: e.target.value })}
              placeholder="e.g., Summer Peak, Holiday Season"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={seasonalForm.startDate}
                onChange={(e) => setSeasonalForm({ ...seasonalForm, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={seasonalForm.endDate}
                onChange={(e) => setSeasonalForm({ ...seasonalForm, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Price Adjustment</label>
            <div className="multiplier-input">
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.05}
                value={seasonalForm.priceMultiplier}
                onChange={(e) => setSeasonalForm({ ...seasonalForm, priceMultiplier: parseFloat(e.target.value) })}
              />
              <span className="multiplier-value">
                {((seasonalForm.priceMultiplier || 1) * 100).toFixed(0)}%
                ({seasonalForm.priceMultiplier! >= 1 ? '+' : ''}
                {(((seasonalForm.priceMultiplier || 1) - 1) * 100).toFixed(0)}%)
              </span>
            </div>
            <span className="helper-text">
              Base price: {formatCurrency(pricingForm.basePrice || 0)} | 
              Seasonal price: {formatCurrency((pricingForm.basePrice || 0) * (seasonalForm.priceMultiplier || 1))}
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
}
