import React, { useState, type JSX } from 'react';

interface PricingData {
  tooCheap: number;
  bargain: number;
  expensive: number;
  tooExpensive: number;
}

interface Results {
  opp: number;
  ipp: number;
  minPrice: number;
  maxPrice: number;
}

type Language = 'en' | 'si' | 'ta';
type Currency = 'LKR' | 'USD' | 'EUR' | 'INR';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    mainTitle: '🎢 Van Westendorp Pricing Research',
    subtitle: 'Discover the perfect price for your product through customer perceptions',
    productTitle: '📦 Product Information',
    questionsTitle: '💡 The Four Magic Questions',
    q1Title: '😬 Too Cheap - Quality Concerns',
    q1Text: 'At what price would you consider this product to be so cheap that you\'d question its quality?',
    q2Title: '🛍️ Great Value - Bargain Price',
    q2Text: 'At what price would you consider this product to be a bargain — a great buy for the money?',
    q3Title: '💸 Getting Expensive - But Still Considering',
    q3Text: 'At what price would you begin to think this product is getting expensive, but still worth considering?',
    q4Title: '💀 Too Expensive - Hard No',
    q4Text: 'At what price would you consider this product to be too expensive to buy?',
    calculateBtn: '🎯 Calculate Optimal Pricing',
    resultsTitle: '📊 Your Pricing Analysis',
    pricePointsTitle: '🎯 Key Price Points',
    oppLabel: 'Optimal Price Point (OPP):',
    ippLabel: 'Indifference Price Point (IPP):',
    rangeTitle: '📏 Acceptable Range',
    minLabel: 'Minimum Price:',
    maxLabel: 'Maximum Price:',
    recommendationsTitle: '💡 Recommendations',
    footerText: 'Developed by sarath ',
    productNamePlaceholder: 'Enter product name',
    fillAllFields: 'Please fill in all fields'
  },
  si: {
    mainTitle: '🎢 වෑන් වෙස්ටෙන්ඩෝප් මිල ගණන් පර්යේෂණය',
    subtitle: 'ගනුදෙනුකරුවන්ගේ සංජානන හරහා ඔබේ නිෂ්පාදනය සඳහා පරිපූර්ණ මිල සොයා ගන්න',
    productTitle: '📦 නිෂ්පාදන තොරතුරු',
    questionsTitle: '💡 මැජික් ප්‍රශ්න හතර',
    q1Title: '😬 ඉතා අඩු - ගුණාත්මක සැකයන්',
    q1Text: 'මේ නිෂ්පාදනය කුමන මිලකදී ඔබට එහි ගුණාත්මක භාවය ගැන සැක ඇති වේද?',
    q2Title: '🛍️ විශිෂ්ට වටිනාකම - හොඳ මිල',
    q2Text: 'මේ නිෂ්පාදනය කුමන මිලකදී ඔබට සාධාරණ මිලක් ලෙස සිතේද?',
    q3Title: '💸 මිල අධික වෙමින් - තවමත් සලකා බලමින්',
    q3Text: 'මේ නිෂ්පාදනය කුමන මිලකදී ඔබට මිල අධික යැයි සිතුණද නමුත් තවමත් සලකා බලනවාද?',
    q4Title: '💀 ඉතා මිල අධික - නිරපේක්ෂ නෑ',
    q4Text: 'මේ නිෂ්පාදනය කුමන මිලකදී ඔබට මිලදී ගැනීමට නොහැකි යැයි සිතේද?',
    calculateBtn: '🎯 ප්‍රශස්ත මිල ගණන් කරන්න',
    resultsTitle: '📊 ඔබේ මිල විශ්ලේෂණය',
    pricePointsTitle: '🎯 ප්‍රධාන මිල ලක්ෂ්‍ය',
    oppLabel: 'ප්‍රශස්ත මිල ලක්ෂ්‍යය (OPP):',
    ippLabel: 'උදාසීන මිල ලක්ෂ්‍යය (IPP):',
    rangeTitle: '📏 පිළිගත හැකි පරාසය',
    minLabel: 'අවම මිල:',
    maxLabel: 'උපරිම මිල:',
    recommendationsTitle: '💡 නිර්දේශ',
    footerText: '',
    productNamePlaceholder: 'නිෂ්පාදන නම ඇතුළත් කරන්න',
    fillAllFields: 'කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න'
  },
  ta: {
    mainTitle: '🎢 வான் வெஸ்டென்டார்ப் விலை ஆராய்ச்சி',
    subtitle: 'வாடிக்கையாளர் எண்ணங்கள் மூலம் உங்கள் தயாரிப்புக்கான சரியான விலையைக் கண்டறியுங்கள்',
    productTitle: '📦 தயாரிப்பு தகவல்',
    questionsTitle: '💡 நான்கு மந்திர கேள்விகள்',
    q1Title: '😬 மிகவும் மலிவானது - தர சந்தேகங்கள்',
    q1Text: 'எந்த விலையில் இந்த தயாரிப்பு மிகவும் மலிவானதாக கருதி அதன் தரத்தை கேள்விக்குள்ளாக்குவீர்கள்?',
    q2Title: '🛍️ சிறந்த மதிப்பு - பேரம் விலை',
    q2Text: 'எந்த விலையில் இந்த தயாரிப்பு பணத்திற்கு நல்ல வாங்கலாக கருதுவீர்கள்?',
    q3Title: '💸 விலை அதிகரித்துவருகிறது - ஆனால் இன்னும் கருத்தில் கொள்ளுங்கள்',
    q3Text: 'எந்த விலையில் இந்த தயாரிப்பு விலை அதிகமாவதாக நினைக்க ஆரம்பிப்பீர்கள், ஆனால் இன்னும் பரிசீலிக்க தகுந்ததாக இருக்கும்?',
    q4Title: '💀 மிகவும் விலை அதிகம் - கடுமையான இல்லை',
    q4Text: 'எந்த விலையில் இந்த தயாரிப்பு வாங்க முடியாத அளவுக்கு விலை அதிகமாக கருதுவீர்கள்?',
    calculateBtn: '🎯 உகந்த விலையை கணக்கிடுங்கள்',
    resultsTitle: '📊 உங்கள் விலை பகுப்பாய்வு',
    pricePointsTitle: '🎯 முக்கிய விலை புள்ளிகள்',
    oppLabel: 'உகந்த விலை புள்ளி (OPP):',
    ippLabel: 'அலட்சிய விலை புள்ளி (IPP):',
    rangeTitle: '📏 ஏற்றுக்கொள்ளத்தக்க வரம்பு',
    minLabel: 'குறைந்தபட்ச விலை:',
    maxLabel: 'அதிகபட்ச விலை:',
    recommendationsTitle: '💡 பரிந்துரைகள்',
    footerText: '',
    productNamePlaceholder: 'தயாரிப்பு பெயரை உள்ளிடவும்',
    fillAllFields: 'தயவுசெய்து அனைத்து புலங்களையும் நிரப்பவும்'
  }
};

const VanWestendorpPricingTool: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('LKR');
  const [productName, setProductName] = useState<string>('');
  const [pricingData, setPricingData] = useState<PricingData>({
    tooCheap: 0,
    bargain: 0,
    expensive: 0,
    tooExpensive: 0
  });
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const t = translations[language];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handlePricingDataChange = (field: keyof PricingData, value: string) => {
    setPricingData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculatePricing = () => {
    const { tooCheap, bargain, expensive, tooExpensive } = pricingData;

    if (tooCheap === 0 || bargain === 0 || expensive === 0 || tooExpensive === 0) {
      alert(t.fillAllFields);
      return;
    }

    // Van Westendorp calculations
    const opp = (tooCheap + tooExpensive) / 2; // Simplified OPP calculation
    const ipp = (bargain + expensive) / 2; // Simplified IPP calculation

    const calculatedResults: Results = {
      opp,
      ipp,
      minPrice: tooCheap,
      maxPrice: tooExpensive
    };

    setResults(calculatedResults);
    setShowResults(true);

    // Smooth scroll to results after state update
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const generateRecommendations = (): JSX.Element => {
    if (!results) return <div></div>;

    const { opp, minPrice } = results;

    if (language === 'si') {
      return (
        <div className="space-y-3">
          <p><strong>🎯 ප්‍රශස්ත මිල:</strong> {currency} {opp.toFixed(2)} - මෙය ඔබේ "Goldilocks" කලාපයයි!</p>
          <p><strong>📊 මිල පරාසය:</strong> {currency} {minPrice.toFixed(2)} - {currency} {results.maxPrice.toFixed(2)}</p>
          <p><strong>💡 නිර්දේශය:</strong> ඔබේ අන්තිම මිල {currency} {(opp * 0.9).toFixed(2)} - {currency} {(opp * 1.1).toFixed(2)} අතර තබන්න.</p>
          <p><strong>⚠️ අවධානය:</strong> {currency} {minPrice.toFixed(2)} ට වඩා අඩු මිලක් ගුණාත්මක සැකයන් ඇති කරයි.</p>
        </div>
      );
    } else if (language === 'ta') {
      return (
        <div className="space-y-3">
          <p><strong>🎯 உகந்த விலை:</strong> {currency} {opp.toFixed(2)} - இது உங்கள் "கோல்டிலாக்ஸ்" மண்டலம்!</p>
          <p><strong>📊 விலை வரம்பு:</strong> {currency} {minPrice.toFixed(2)} - {currency} {results.maxPrice.toFixed(2)}</p>
          <p><strong>💡 பரிந்துரை:</strong> உங்கள் இறுதி விலையை {currency} {(opp * 0.9).toFixed(2)} - {currency} {(opp * 1.1).toFixed(2)} இடையில் வைக்கவும்.</p>
          <p><strong>⚠️ எச்சரிக்கை:</strong> {currency} {minPrice.toFixed(2)} விட குறைவான விலை தர சந்தேகங்களை ஏற்படுத்தும்.</p>
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          <p><strong>🎯 Optimal Price:</strong> {currency} {opp.toFixed(2)} - This is your "Goldilocks" zone!</p>
          <p><strong>📊 Price Range:</strong> {currency} {minPrice.toFixed(2)} - {currency} {results.maxPrice.toFixed(2)}</p>
          <p><strong>💡 Recommendation:</strong> Set your final price between {currency} {(opp * 0.9).toFixed(2)} - {currency} {(opp * 1.1).toFixed(2)}.</p>
          <p><strong>⚠️ Warning:</strong> Pricing below {currency} {minPrice.toFixed(2)} may create quality concerns.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.mainTitle}
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            {t.subtitle}
          </p>
          
          {/* Language Selector */}
          <div className="flex justify-center space-x-4 mb-8">
            {(['en', 'si', 'ta'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${
                  language === lang
                    ? 'bg-green-600 bg-opacity-40 text-white'
                    : 'bg-green-600 bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'si' ? 'සිංහල' : 'தமிழ்'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Product Info Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t.productTitle}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={t.productNamePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LKR">LKR (රුපියල්)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

          {/* Pricing Questions */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {t.questionsTitle}
            </h2>
            
            {/* Question 1 */}
            <div className="mb-8 p-6 bg-red-50 rounded-xl border-l-4 border-red-400">
              <h3 className="text-lg font-semibold text-red-800 mb-3">
                {t.q1Title}
              </h3>
              <p className="text-gray-700 mb-4">
                {t.q1Text}
              </p>
              <input
                type="number"
                value={pricingData.tooCheap || ''}
                onChange={(e) => handlePricingDataChange('tooCheap', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-semibold transition-all duration-300 focus:transform focus:-translate-y-1 focus:shadow-lg"
              />
            </div>

            {/* Question 2 */}
            <div className="mb-8 p-6 bg-green-50 rounded-xl border-l-4 border-green-400">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                {t.q2Title}
              </h3>
              <p className="text-gray-700 mb-4">
                {t.q2Text}
              </p>
              <input
                type="number"
                value={pricingData.bargain || ''}
                onChange={(e) => handlePricingDataChange('bargain', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold transition-all duration-300 focus:transform focus:-translate-y-1 focus:shadow-lg"
              />
            </div>

            {/* Question 3 */}
            <div className="mb-8 p-6 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                {t.q3Title}
              </h3>
              <p className="text-gray-700 mb-4">
                {t.q3Text}
              </p>
              <input
                type="number"
                value={pricingData.expensive || ''}
                onChange={(e) => handlePricingDataChange('expensive', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-semibold transition-all duration-300 focus:transform focus:-translate-y-1 focus:shadow-lg"
              />
            </div>

            {/* Question 4 */}
            <div className="mb-8 p-6 bg-purple-50 rounded-xl border-l-4 border-purple-400">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                {t.q4Title}
              </h3>
              <p className="text-gray-700 mb-4">
                {t.q4Text}
              </p>
              <input
                type="number"
                value={pricingData.tooExpensive || ''}
                onChange={(e) => handlePricingDataChange('tooExpensive', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold transition-all duration-300 focus:transform focus:-translate-y-1 focus:shadow-lg"
              />
            </div>

            {/* Calculate Button */}
            <div className="text-center mb-8">
              <button
                onClick={calculatePricing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {t.calculateBtn}
              </button>
            </div>

            {/* Results Section */}
            {showResults && results && (
              <div id="results">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {t.resultsTitle}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Price Points */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      {t.pricePointsTitle}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{t.oppLabel}</span>
                        <span className="font-bold text-blue-600">
                          {currency} {results.opp.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{t.ippLabel}</span>
                        <span className="font-bold text-green-600">
                          {currency} {results.ipp.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                      {t.rangeTitle}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{t.minLabel}</span>
                        <span className="font-bold text-red-600">
                          {currency} {results.minPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{t.maxLabel}</span>
                        <span className="font-bold text-purple-600">
                          {currency} {results.maxPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4">
                    {t.recommendationsTitle}
                  </h3>
                  <div className="text-gray-700">
                    {generateRecommendations()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
       <div className="text-center mt-8 text-white">
  <p>{t.footerText}</p>

  <p className="text-blue-200 text-sm mt-4 flex justify-center items-center gap-2">
    <a
      href="https://www.linkedin.com/in/sarath-kumar-07aa14302"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:underline"
    >
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
        alt="LinkedIn"
        className="w-5 h-5"
      />
      Connect on LinkedIn
    </a>
  </p>

  <p className="text-gray-400 text-sm mt-2">Developed by Sarathkumar</p>
  <p className="text-gray-400 text-sm mt-1">
    Contact here:{" "}
    <a
      href="https://www.linkedin.com/in/sarath-kumar-07aa14302"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline text-blue-300"
    >
      LinkedIn
    </a>
  </p>
</div>
      </div>
    </div>
  );
};

export default VanWestendorpPricingTool;
