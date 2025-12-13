import { useState } from 'react';
import { MessageCircle, ArrowUpRight, Zap, Sparkles, Star } from 'lucide-react';
import '../styles/pricing.css';

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('listings');

  const packages = [
    {
      title: 'Basic Listing',
      tagline: 'Ideal for small guesthouses, cafés & new tour operators.',
      price: 50000,
      period: 'month',
      discounts: [
        { duration: '3 months', price: 135000 },
        { duration: '6 months', price: 240000 }
      ],
      features: [
        '1 destination / place page on IRU Voyage.',
        'Up to 6 photos with short description.',
        'Contact details + website or booking link.',
        'Appears in relevant destination search results.',
        '1 category (Hotel, Tour, Restaurant, etc.).'
      ],
      cta: 'Ask for Basic slot',
      meta: 'Perfect starter plan to get visibility on IRU Voyage.',
      badge: null
    },
    {
      title: 'Featured Listing',
      tagline: 'For hotels, tour companies & attractions ready to stand out.',
      price: 120000,
      period: 'month',
      discounts: [
        { duration: '3 months', price: 324000 },
        { duration: '6 months', price: 576000 }
      ],
      features: [
        'Everything in Basic Listing.',
        '"Featured" badge in search and destination pages.',
        'Priority position in search results.',
        'Up to 12 photos + 1 promo video (YouTube/Reel link).',
        '2–3 categories (Hotel, Family-friendly, Beach, etc.).',
        'Highlight on city / region pages (e.g. "Top Picks in Kigali").'
      ],
      cta: 'Reserve Featured slot',
      meta: 'Our most balanced package for strong, consistent visibility.',
      badge: 'Popular choice'
    },
    {
      title: 'Premium Destination Spotlight',
      tagline: 'Built for resorts, tourism boards and flagship experiences.',
      price: 250000,
      period: 'month',
      discounts: [
        { duration: '3 months', price: 675000 },
        { duration: '6 months', price: 1200000 }
      ],
      features: [
        'Everything in Featured Listing.',
        'Placement in "Destination Spotlight" section.',
        'Appear on homepage "Discover Now" carousel.',
        'Up to 20 photos + 2 video embeds.',
        'Dedicated Book Now / WhatsApp / Email buttons.',
        'Quarterly performance report (views, clicks, top countries).'
      ],
      cta: 'Apply for Spotlight',
      meta: 'Best for destinations that want strong branding & measurable impact.',
      badge: 'High impact'
    }
  ];

  const addons = [
    {
      title: 'Homepage Hero Banner',
      price: 200000,
      period: 'week',
      description: 'Premium banner at the very top of the IRU Voyage homepage, linking directly to your listing or booking URL. Ideal for launches, peak seasons or special campaigns.'
    },
    {
      title: 'Social Media Boost',
      price: 80000,
      period: 'campaign',
      description: '3 posts + 1 reel / story set across IRU Business Group social channels (X, Instagram, LinkedIn). Includes tags, destination hashtags and a direct call-to-action.'
    },
    {
      title: 'Newsletter Highlight',
      price: 60000,
      period: 'edition',
      description: 'Featured block inside our "IRU Voyage Travel Inspiration" email. Perfect to remind past viewers and inspire new travellers to visit your place.'
    },
    {
      title: 'Sponsored Story Article',
      price: 150000,
      period: 'article',
      description: 'A dedicated long-form story like "3 Perfect Days in [Your Place]" with photos and links to your booking channels. Great for storytelling, SEO, and long-term visibility.'
    }
  ];

  const bundles = [
    {
      title: 'Silver Destination Partner',
      price: 1100000,
      period: 'year',
      badge: 'Silver Partner',
      features: [
        '12 months Basic Listing',
        '2 × Social Media Boost campaigns',
        '1 × Sponsored story article'
      ],
      description: 'A simple annual plan for consistent visibility, ideal for single properties or small destinations.'
    },
    {
      title: 'Gold Destination Partner',
      price: 2300000,
      period: 'year',
      badge: 'Gold Partner',
      features: [
        '12 months Featured Listing',
        '4 × Social Media Boost campaigns',
        '2 × Sponsored story articles',
        '2 × Newsletter highlights'
      ],
      description: 'Great for established brands and city-level tourism partners who want strong promotion throughout the year.'
    },
    {
      title: 'Platinum Destination Partner',
      price: 4500000,
      period: 'year',
      badge: 'Platinum Partner',
      features: [
        '12 months Premium Destination Spotlight',
        '8 × Social Media Boost campaigns',
        '4 × Sponsored story articles',
        '4 × Newsletter highlights',
        '4 weeks of Homepage Hero Banner (can be split across the year)'
      ],
      description: 'Designed for tourism boards, regions and major resorts that want continuous, high-impact exposure and storytelling.',
      fullWidth: true
    }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US');
  };

  return (
    <div className="pricing-page">
      <section className="pricing-section">
        <div className="pricing-header-eyebrow">
          <span className="eyebrow-dot"></span>
          IRU Voyage • Advertise Your Destination
        </div>

        <div className="pricing-heading-row">
          <div>
            <h1>
              Turn your destination into a<br />
              <span>must-visit highlight</span>
            </h1>
          </div>
          <div className="pricing-heading-sub">
            <p>
              Showcase hotels, tours, restaurants, cities or regions on IRU Voyage.
              Choose a listing that matches your ambition and add powerful promotion
              to reach explorers across the globe.
            </p>
            <div className="pricing-heading-cta">
              <div className="pricing-pill">
                From <strong>50,000 RWF</strong> / month for Basic listing
              </div>
              <div className="pricing-pill">
                <strong>Bundle discounts</strong> for 3–6 months & yearly partners
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pricing-tabs">
          <button
            className={`pricing-tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            Listing Packages
            <span className="tab-badge">per destination</span>
          </button>
          <button
            className={`pricing-tab ${activeTab === 'addons' ? 'active' : ''}`}
            onClick={() => setActiveTab('addons')}
          >
            Add-ons
            <span className="tab-badge">boost reach</span>
          </button>
          <button
            className={`pricing-tab ${activeTab === 'bundles' ? 'active' : ''}`}
            onClick={() => setActiveTab('bundles')}
          >
            Annual Partnerships
            <span className="tab-badge">best value</span>
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'listings' && (
          <div className="pricing-grid">
            {packages.map((pkg, idx) => (
              <div key={idx} className={`pricing-card ${pkg.badge ? 'featured' : ''}`}>
                {pkg.badge && <div className="card-badge">{pkg.badge}</div>}
                <div className="card-header">
                  <h3 className="card-title">{pkg.title}</h3>
                  <p className="card-tagline">{pkg.tagline}</p>
                </div>

                <div className="card-price">
                  <div className="price-main">
                    <span className="currency">RWF</span>
                    {formatPrice(pkg.price)}
                    <span className="period">/ {pkg.period}</span>
                  </div>
                  <div className="price-note">
                    {pkg.discounts.map((d, i) => (
                      <span key={i}>
                        {d.duration}: <strong>{formatPrice(d.price)} RWF</strong>
                        {i < pkg.discounts.length - 1 && ' • '}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-divider"></div>

                <ul className="card-features">
                  {pkg.features.map((feature, i) => (
                    <li key={i}>
                      <span className="feature-bullet"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="card-cta-row">
                  <button className="card-cta">
                    {pkg.cta}
                    <ArrowUpRight size={14} />
                  </button>
                  <p className="card-meta">{pkg.meta}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'addons' && (
          <div className="addons-grid">
            {addons.map((addon, idx) => (
              <div key={idx} className="addon-card">
                <h3 className="addon-title">{addon.title}</h3>
                <p className="addon-price">
                  <span className="currency">RWF</span>
                  {formatPrice(addon.price)} <span>/ {addon.period}</span>
                </p>
                <p className="addon-text">{addon.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bundles' && (
          <div className="addons-grid">
            {bundles.map((bundle, idx) => (
              <div
                key={idx}
                className="bundle-card"
                style={{ gridColumn: bundle.fullWidth ? 'span 2' : 'auto' }}
              >
                <div className="bundle-badge">
                  <span></span> {bundle.badge}
                </div>
                <h3 className="bundle-title">{bundle.title}</h3>
                <p className="bundle-price">
                  <span className="currency">RWF</span>
                  {formatPrice(bundle.price)} <span>/ {bundle.period}</span>
                </p>
                <p className="bundle-text">
                  {bundle.features.map((f, i) => (
                    <span key={i}>
                      • {f}
                      <br />
                    </span>
                  ))}
                  <br />
                  {bundle.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="pricing-footer-cta">
          <p>
            <strong>Custom needs?</strong>
            We can tailor packages for events, festivals, or multiple properties under one brand.
          </p>
          <a
            href="https://wa.me/250795381733"
            target="_blank"
            rel="noopener noreferrer"
            className="pricing-footer-btn"
          >
            <MessageCircle size={16} />
            Talk to IRU Voyage team
          </a>
        </div>
      </section>
    </div>
  );
}
