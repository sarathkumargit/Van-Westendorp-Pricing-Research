import { useState, useMemo } from 'react';

interface CustomerResponse {
  id: number;
  tooCheap: number;
  bargain: number;
  expensive: number;
  tooExpensive: number;
}

interface VanWestendorpResults {
  opp: number | null;
  ipp: number | null;
  pmch: number | null;
  pme: number | null;
  chartData: Array<{
    price: number;
    tooCheapCumulative: number;
    notCheapCumulative: number;
    expensiveCumulative: number;
    notExpensiveCumulative: number;
  }>;
}

type Language = 'en' | 'si' | 'ta';
type Currency = 'LKR' | 'USD' | 'EUR' | 'INR';

const translations = {
  en: {
    mainTitle: '🎢 Van Westendorp Pricing Research',
    subtitle: 'Professional pricing analysis using customer survey data',
    dataEntryTitle: '📊 Customer Response Data Entry',
    customerLabel: 'Customer',
    q1Label: 'Too Cheap',
    q2Label: 'Bargain',
    q3Label: 'Expensive', 
    q4Label: 'Too Expensive',
    addCustomer: '➕ Add Customer',
    removeCustomer: '🗑️',
    calculateBtn: '🎯 Analyze Pricing',
    resultsTitle: '📊 Van Westendorp Analysis Results',
    pricePointsTitle: '🎯 Key Price Points',
    oppLabel: 'Optimal Price Point (OPP):',
    ippLabel: 'Indifference Price Point (IPP):',
    pmchLabel: 'Point of Marginal Cheapness (PMC):',
    pmeLabel: 'Point of Marginal Expensiveness (PME):',
    chartTitle: '📈 Price Sensitivity Curves',
    interpretationTitle: '💡 Interpretation & Recommendations',
    needMoreData: 'Need at least 5 customer responses for reliable Van Westendorp analysis',
    clearData: '🗑️ Clear',
    sampleData: '📝 Sample',
    exportData: '💾 Export',
    importData: '📂 Import',
    customerCount: 'Responses:',
    validationError: 'Please ensure all price values are valid numbers and follow the logical order: Too Cheap ≤ Bargain ≤ Expensive ≤ Too Expensive',
    acceptableRange: 'Acceptable Price Range:',
    pricingRecommendation: '💰 Pricing Recommendation',
    getRecommendation: '💡 Get Pricing Advice',
    modalTitle: '🎯 Professional Pricing Recommendation',
    modalClose: 'Close',
    recommendationOptimal: 'Optimal Strategy',
    recommendationGood: 'Good Strategy',
    recommendationCaution: 'Caution Required',
    recommendationDanger: 'High Risk',
    questionGuide: '📋 Question Guide',
    q1Guide: 'At what price would you consider the product to be so cheap that you would question its quality?',
    q2Guide: 'At what price would you consider the product to be a bargain — a great buy for the money?',
    q3Guide: 'At what price would you begin to think the product is getting expensive, but still worth considering?',
    q4Guide: 'At what price would you consider the product to be too expensive to buy?'
  },
  si: {
    mainTitle: '🎢 වෑන් වෙස්ටෙන්ඩෝප් මිල ගණන් පර්යේෂණය',
    subtitle: 'ගනුදෙනුකරුවන්ගේ සමීක්ෂණ දත්ත භාවිතා කරමින් වෘත්තීය මිල විශ්ලේෂණය',
    dataEntryTitle: '📊 ගනුදෙනුකරු ප්‍රතිචාර දත්ත ඇතුළත් කිරීම',
    customerLabel: 'ගනුදෙනුකරු',
    q1Label: 'ඉතා අඩු',
    q2Label: 'සාධාරණ',
    q3Label: 'මිල අධික',
    q4Label: 'ඉතා අධික',
    addCustomer: '➕ එක් කරන්න',
    removeCustomer: '🗑️',
    calculateBtn: '🎯 මිල විශ්ලේෂණය',
    resultsTitle: '📊 වෑන් වෙස්ටෙන්ඩෝප් විශ්ලේෂණ ප්‍රතිඵල',
    pricePointsTitle: '🎯 ප්‍රධාන මිල ලක්ෂ්‍ය',
    oppLabel: 'ප්‍රශස්ත මිල ලක්ෂ්‍යය (OPP):',
    ippLabel: 'උදාසීන මිල ලක්ෂ්‍යය (IPP):',
    pmchLabel: 'සීමාන්ත මිල අඩු ලක්ෂ්‍යය (PMC):',
    pmeLabel: 'සීමාන්ත මිල අධික ලක්ෂ්‍යය (PME):',
    chartTitle: '📈 මිල සංවේදනීයතා වක්‍ර',
    interpretationTitle: '💡 අර්ථ නිරූපණය සහ නිර්දේශ',
    needMoreData: 'විශ්වාසනීය වෑන් වෙස්ටෙන්ඩෝප් විශ්ලේෂණයක් සඳහා අවම වශයෙන් ගනුදෙනුකරුවන් 5 දෙනෙකුගේ ප්‍රතිචාර අවශ්‍යය',
    clearData: '🗑️ මකන්න',
    sampleData: '📝 නිදර්ශක',
    exportData: '💾 නිර්යාත',
    importData: '📂 ආයාත',
    customerCount: 'ප්‍රතිචාර:',
    validationError: 'කරුණාකර සියලු මිල අගයන් වලංගු සංඛ්‍යා බව සහ තාර්කික අනුපිළිවෙල අනුගමනය කරන බව සහතික කරන්න',
    acceptableRange: 'පිළිගත හැකි මිල පරාසය:',
    pricingRecommendation: '💰 මිල නිර්දේශය',
    getRecommendation: '💡 මිල උපදෙස් ලබාගන්න',
    modalTitle: '🎯 වෘත්තීය මිල නිර්දේශය',
    modalClose: 'වසන්න',
    recommendationOptimal: 'ප්‍රශස්ත උපායමාර්ගය',
    recommendationGood: 'හොඳ උපායමාර්ගය',
    recommendationCaution: 'සැලකිල්ල අවශ්‍ය',
    recommendationDanger: 'ඉහළ අවදානම',
    questionGuide: '📋 ප්‍රශ්න මාර්ගෝපදේශය',
    q1Guide: 'නිෂ්පාදනය එහි ගුණාත්මක භාවය ප්‍රශ්න කරන තරම් අඩු මිලක් ලෙස ඔබ සලකන්නේ කුමන මිලටද?',
    q2Guide: 'නිෂ්පාදනය සාධාරණ - මුදල් සඳහා විශිෂ්ට මිලදී ගැනීමක් ලෙස ඔබ සලකන්නේ කුමන මිලටද?',
    q3Guide: 'නිෂ්පාදනය මිල අධික වෙමින් පවතින නමුත් තවමත් සලකා බැලිය හැකි බව ඔබ සිතන්නේ කුමන මිලටද?',
    q4Guide: 'නිෂ්පාදනය මිලදී ගැනීමට නොහැකි තරම් මිල අධික බව ඔබ සලකන්නේ කුමන මිලටද?'
  },
  ta: {
    mainTitle: '🎢 வான் வெஸ்டென்டார்ப் விலை ஆராய்ச்சி',
    subtitle: 'வாடிக்கையாளர் கணக்கெடுப்பு தகவல்களைப் பயன்படுத்தி தொழில்முறை விலை பகுப்பாய்வு',
    dataEntryTitle: '📊 வாடிக்கையாளர் பதில் தரவு உள்ளீடு',
    customerLabel: 'வாடிக்கையாளர்',
    q1Label: 'மிகவும் மலிவானது',
    q2Label: 'பேரம்',
    q3Label: 'விலை அதிகம்',
    q4Label: 'மிகவும் அதிகம்',
    addCustomer: '➕ சேர்க்கவும்',
    removeCustomer: '🗑️',
    calculateBtn: '🎯 விலை பகுப்பாய்வு',
    resultsTitle: '📊 வான் வெஸ்டென்டார்ப் பகுப்பாய்வு முடிவுகள்',
    pricePointsTitle: '🎯 முக்கிய விலை புள்ளிகள்',
    oppLabel: 'உகந்த விலை புள்ளி (OPP):',
    ippLabel: 'அலட்சிய விலை புள்ளி (IPP):',
    pmchLabel: 'விளிம்புநிலை மலிவு புள்ளி (PMC):',
    pmeLabel: 'விளிம்புநிலை விலையுயர்வு புள்ளி (PME):',
    chartTitle: '📈 விலை உணர்திறன் வளைவுகள்',
    interpretationTitle: '💡 விளக்கம் மற்றும் பரிந்துரைகள்',
    needMoreData: 'நம்பகமான வான் வெஸ்டென்டார்ப் பகுப்பாய்விற்கு குறைந்தபட்சம் 5 வாடிக்கையாளர் பதில்கள் தேவை',
    clearData: '🗑️ அழிக்கவும்',
    sampleData: '📝 மாதிரி',
    exportData: '💾 ஏற்றுமதி',
    importData: '📂 இறக்குமதி',
    customerCount: 'பதில்கள்:',
    validationError: 'அனைத்து விலை மதிப்புகளும் சரியான எண்கள் என்பதையும் தருக்க வரிசையைப் பின்பற்றுவதையும் உறுதிசெய்யவும்',
    acceptableRange: 'ஏற்றுக்கொள்ளக்கூடிய விலை வரம்பு:',
    pricingRecommendation: '💰 விலை பரிந்துரை',
    getRecommendation: '💡 விலை ஆலோசனை பெறுங்கள்',
    modalTitle: '🎯 தொழில்முறை விலை பரிந்துரை',
    modalClose: 'மூடு',
    recommendationOptimal: 'உகந்த உத்தி',
    recommendationGood: 'நல்ல உத்தி',
    recommendationCaution: 'கவனம் தேவை',
    recommendationDanger: 'அதிக ஆபத்து',
    questionGuide: '📋 கேள்வி வழிகாட்டி',
    q1Guide: 'பொருளின் தரத்தை கேள்விக்குள்ளாக்கும் அளவுக்கு மலிவானது என்று நீங்கள் கருதும் விலை என்ன?',
    q2Guide: 'பொருள் ஒரு பேரம் - பணத்திற்கு ஒரு சிறந்த வாங்குதல் என்று நீங்கள் கருதும் விலை என்ன?',
    q3Guide: 'பொருள் விலை அதிகமாகிறது, ஆனால் இன்னும் பரிசீலிக்க மதிப்புள்ளது என்று நீங்கள் நினைக்கத் தொடங்கும் விலை என்ன?',
    q4Guide: 'பொருளை வாங்க முடியாத அளவுக்கு விலை அதிகம் என்று நீங்கள் கருதும் விலை என்ன?'
  }
};

const VanWestendorpPricingTool = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('LKR');
  const [customers, setCustomers] = useState<CustomerResponse[]>([
    { id: 1, tooCheap: 0, bargain: 0, expensive: 0, tooExpensive: 0 }
  ]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);

  const t = translations[language];

  // Van Westendorp analysis calculation
  const vanWestendorpResults: VanWestendorpResults = useMemo(() => {
    if (customers.length < 5) {
      return { opp: null, ipp: null, pmch: null, pme: null, chartData: [] };
    }

    const validCustomers = customers.filter(customer => {
      const { tooCheap, bargain, expensive, tooExpensive } = customer;
      return tooCheap > 0 && bargain > 0 && expensive > 0 && tooExpensive > 0 &&
             tooCheap <= bargain && bargain <= expensive && expensive <= tooExpensive;
    });

    if (validCustomers.length < 5) {
      return { opp: null, ipp: null, pmch: null, pme: null, chartData: [] };
    }

    const allPrices = new Set<number>();
    validCustomers.forEach(customer => {
      allPrices.add(customer.tooCheap);
      allPrices.add(customer.bargain);
      allPrices.add(customer.expensive);
      allPrices.add(customer.tooExpensive);
    });

    const sortedPrices = Array.from(allPrices).sort((a, b) => a - b);
    const totalCustomers = validCustomers.length;
    
    const chartData = sortedPrices.map(price => {
      // Too Cheap: % who think this price or higher is too cheap (cumulative from left)
      const tooCheapCount = validCustomers.filter(c => c.tooCheap >= price).length;
      
      // Not Cheap: % who think this price or higher is NOT cheap (price >= bargain)
      const notCheapCount = validCustomers.filter(c => c.bargain <= price).length;
      
      // Expensive: % who think this price or higher is expensive (price >= expensive)
      const expensiveCount = validCustomers.filter(c => c.expensive <= price).length;
      
      // Not Expensive: % who think this price or lower is NOT too expensive (price <= tooExpensive)
      const notExpensiveCount = validCustomers.filter(c => c.tooExpensive >= price).length;

      return {
        price,
        tooCheapCumulative: (tooCheapCount / totalCustomers) * 100,
        notCheapCumulative: (notCheapCount / totalCustomers) * 100,
        expensiveCumulative: (expensiveCount / totalCustomers) * 100,
        notExpensiveCumulative: (notExpensiveCount / totalCustomers) * 100
      };
    });

    const findIntersection = (
      data: typeof chartData,
      curve1Key: keyof typeof chartData[0],
      curve2Key: keyof typeof chartData[0]
    ): number | null => {
      for (let i = 0; i < data.length - 1; i++) {
        const curr = data[i];
        const next = data[i + 1];
        
        const curr1 = curr[curve1Key] as number;
        const curr2 = curr[curve2Key] as number;
        const next1 = next[curve1Key] as number;
        const next2 = next[curve2Key] as number;
        
        // Check if curves cross between current and next point
        if ((curr1 >= curr2 && next1 <= next2) || (curr1 <= curr2 && next1 >= next2)) {
          // Linear interpolation to find exact intersection
          if (Math.abs(next.price - curr.price) < 0.001) {
            return curr.price;
          }
          const slope1 = (next1 - curr1) / (next.price - curr.price);
          const slope2 = (next2 - curr2) / (next.price - curr.price);
          
          if (Math.abs(slope1 - slope2) < 0.001) {
            return curr.price;
          }
          
          const intersectionPrice = curr.price + (curr2 - curr1) / (slope1 - slope2);
          return intersectionPrice;
        }
      }
      return null;
    };

    // Calculate key price points according to Van Westendorp methodology
    const opp = findIntersection(chartData, 'tooCheapCumulative', 'notExpensiveCumulative');
    const ipp = findIntersection(chartData, 'notCheapCumulative', 'expensiveCumulative');
    const pmch = findIntersection(chartData, 'tooCheapCumulative', 'expensiveCumulative');
    const pme = findIntersection(chartData, 'notCheapCumulative', 'notExpensiveCumulative');

    return { opp, ipp, pmch, pme, chartData };
  }, [customers]);

  const addCustomer = () => {
    const newId = Math.max(...customers.map(c => c.id), 0) + 1;
    setCustomers([...customers, { 
      id: newId, 
      tooCheap: 0, 
      bargain: 0, 
      expensive: 0, 
      tooExpensive: 0 
    }]);
  };

  const removeCustomer = (id: number) => {
    if (customers.length > 1) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const updateCustomer = (id: number, field: keyof Omit<CustomerResponse, 'id'>, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, [field]: numValue } : customer
    ));
  };

  const loadSampleData = () => {
    const sampleData: CustomerResponse[] = [
      { id: 1, tooCheap: 50, bargain: 100, expensive: 200, tooExpensive: 300 },
      { id: 2, tooCheap: 60, bargain: 120, expensive: 220, tooExpensive: 350 },
      { id: 3, tooCheap: 40, bargain: 90, expensive: 180, tooExpensive: 280 },
      { id: 4, tooCheap: 70, bargain: 130, expensive: 250, tooExpensive: 400 },
      { id: 5, tooCheap: 55, bargain: 110, expensive: 210, tooExpensive: 320 },
      { id: 6, tooCheap: 45, bargain: 95, expensive: 190, tooExpensive: 290 },
      { id: 7, tooCheap: 65, bargain: 125, expensive: 240, tooExpensive: 380 },
      { id: 8, tooCheap: 35, bargain: 85, expensive: 170, tooExpensive: 270 },
      { id: 9, tooCheap: 75, bargain: 140, expensive: 260, tooExpensive: 420 },
      { id: 10, tooCheap: 50, bargain: 105, expensive: 205, tooExpensive: 310 }
    ];
    setCustomers(sampleData);
  };

  const clearData = () => {
    setCustomers([{ id: 1, tooCheap: 0, bargain: 0, expensive: 0, tooExpensive: 0 }]);
    setShowResults(false);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(customers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'van_westendorp_data.json');
    link.click();
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event: any) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (Array.isArray(importedData) && importedData.length > 0) {
            setCustomers(importedData);
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const calculateResults = () => {
    if (customers.length < 5) {
      alert(t.needMoreData);
      return;
    }

    const validCount = customers.filter(customer => {
      const { tooCheap, bargain, expensive, tooExpensive } = customer;
      return tooCheap > 0 && bargain > 0 && expensive > 0 && tooExpensive > 0 &&
             tooCheap <= bargain && bargain <= expensive && expensive <= tooExpensive;
    }).length;

    if (validCount < 5) {
      alert(t.validationError);
      return;
    }

    setShowResults(true);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const generatePricingRecommendation = () => {
    const { opp, ipp, pmch, pme } = vanWestendorpResults;
    
    if (!opp && !ipp && !pmch && !pme) {
      return {
        type: 'error',
        title: 'Insufficient Data',
        message: 'Unable to generate pricing recommendation. Please ensure you have valid analysis results.',
        recommendation: 'Add more customer responses for accurate analysis.'
      };
    }

    // Use available data points, even if some are missing
    const availablePoints = [opp, ipp, pmch, pme].filter(point => point !== null);
    
    if (availablePoints.length === 0) {
      return {
        type: 'error',
        title: 'No Valid Price Points',
        message: 'Unable to find valid price intersections in the data.',
        recommendation: 'Try adjusting your customer response data or adding more responses.'
      };
    }

    // Calculate ranges with available data
    const minPrice = Math.min(...availablePoints);
    const maxPrice = Math.max(...availablePoints);
    const optimalPrice = opp || ipp || minPrice;
    const safeMin = pmch || minPrice;
    const safeMax = pme || maxPrice;
    
    const acceptableRange = `${currency} ${Math.min(safeMin, safeMax).toFixed(2)} - ${currency} ${Math.max(safeMin, safeMax).toFixed(2)}`;

    // Generate recommendation based on available data
    let recommendation = {
      type: 'optimal',
      title: t.recommendationOptimal,
      message: '',
      recommendation: ''
    };

    if (language === 'si') {
      recommendation = {
        type: 'optimal',
        title: t.recommendationOptimal,
        message: `🎯 ඔබේ නිෂ්පාදනය සඳහා නිර්දේශිත මිල: ${currency} ${optimalPrice.toFixed(2)}`,
        recommendation: `
          📊 විශ්ලේෂණ ප්‍රතිඵල:
          ${opp ? `• ප්‍රශස්ත මිල ලක්ෂ්‍යය (OPP): ${currency} ${opp.toFixed(2)}` : ''}
          ${ipp ? `• උදාසීන මිල ලක්ෂ්‍යය (IPP): ${currency} ${ipp.toFixed(2)}` : ''}
          ${pmch ? `• සීමාන්ත මිල අඩු ලක්ෂ්‍යය (PMC): ${currency} ${pmch.toFixed(2)}` : ''}
          ${pme ? `• සීමාන්ත මිල අධික ලක්ෂ්‍යය (PME): ${currency} ${pme.toFixed(2)}` : ''}
          • නිර්දේශිත පරාසය: ${acceptableRange}
          
          💡 නිර්දේශ:
          • ${currency} ${optimalPrice.toFixed(2)} ආසන්නයේ මිල ගණන් කරන්න
          • ${acceptableRange} පරාසය තුළ රැඳී සිටින්න
          ${pmch ? `• ${currency} ${pmch.toFixed(2)} ට වඩා අඩු මිලක් ගුණාත්මක ප්‍රශ්න ඇති කරයි` : ''}
          ${pme ? `• ${currency} ${pme.toFixed(2)} ට වඩා වැඩි මිලක් ගනුදෙනුකරුවන් අහිමි කරයි` : ''}
          
          ⚠️ මතක තබාගන්න: මෙම විශ්ලේෂණය ගනුදෙනුකරුවන්ගේ මිල සංවේදනීයතාව මත පදනම් වේ.
        `
      };
    } else if (language === 'ta') {
      recommendation = {
        type: 'optimal',
        title: t.recommendationOptimal,
        message: `🎯 உங்கள் தயாரிப்பிற்கான பரிந்துரைக்கப்பட்ட விலை: ${currency} ${optimalPrice.toFixed(2)}`,
        recommendation: `
          📊 பகுப்பாய்வு முடிவுகள்:
          ${opp ? `• உகந்த விலை புள்ளி (OPP): ${currency} ${opp.toFixed(2)}` : ''}
          ${ipp ? `• அலட்சிய விலை புள்ளி (IPP): ${currency} ${ipp.toFixed(2)}` : ''}
          ${pmch ? `• விளிம்புநிலை மலிவு புள்ளி (PMC): ${currency} ${pmch.toFixed(2)}` : ''}
          ${pme ? `• விளிம்புநிலை விலையுயர்வு புள்ளி (PME): ${currency} ${pme.toFixed(2)}` : ''}
          • பரிந்துரைக்கப்பட்ட வரம்பு: ${acceptableRange}
          
          💡 பரிந்துரைகள்:
          • ${currency} ${optimalPrice.toFixed(2)} அருகே விலை நிர்ணயம் செய்யுங்கள்
          • ${acceptableRange} வரம்பிற்குள் இருங்கள்
          ${pmch ? `• ${currency} ${pmch.toFixed(2)} விட குறைவான விலை தர கேள்விகளை எழுப்பும்` : ''}
          ${pme ? `• ${currency} ${pme.toFixed(2)} விட அதிக விலை வாடிக்கையாளர்களை இழக்கும்` : ''}
          
          ⚠️ நினைவில் கொள்ளுங்கள்: இந்த பகுப்பாய்வு வாடிக்கையாளர்களின் விலை உணர்திறனை அடிப்படையாகக் கொண்டது.
        `
      };
    } else {
      recommendation = {
        type: 'optimal',
        title: t.recommendationOptimal,
        message: `🎯 Your recommended price: ${currency} ${optimalPrice.toFixed(2)}`,
        recommendation: `
          📊 Analysis Results:
          ${opp ? `• Optimal Price Point (OPP): ${currency} ${opp.toFixed(2)}` : ''}
          ${ipp ? `• Indifference Price Point (IPP): ${currency} ${ipp.toFixed(2)}` : ''}
          ${pmch ? `• Point of Marginal Cheapness (PMC): ${currency} ${pmch.toFixed(2)}` : ''}
          ${pme ? `• Point of Marginal Expensiveness (PME): ${currency} ${pme.toFixed(2)}` : ''}
          • Recommended Range: ${acceptableRange}
          
          💡 Recommendations:
          • Price near ${currency} ${optimalPrice.toFixed(2)} for best results
          • Stay within range ${acceptableRange}
          ${pmch ? `• Pricing below ${currency} ${pmch.toFixed(2)} raises quality concerns` : ''}
          ${pme ? `• Pricing above ${currency} ${pme.toFixed(2)} loses customers` : ''}
          
          ⚠️ Remember: This analysis is based on customer price sensitivity data.
        `
      };
    }

    return recommendation;
  };

  const openPricingModal = () => {
    setShowPricingModal(true);
  };

  const closePricingModal = () => {
    setShowPricingModal(false);
  };

  const generateInterpretation = () => {
    const { opp, ipp, pmch, pme } = vanWestendorpResults;
    
    if (language === 'si') {
      return (
        <div className="space-y-3 text-sm sm:text-base">
          <p><strong>🎯 ප්‍රශස්ත මිල:</strong> {opp ? `${currency} ${opp.toFixed(2)}` : 'N/A'} - මෙය ගනුදෙනුකරුවන්ගේ මිල සංවේදනීයතාවේ "මැද ලක්ෂ්‍යය"</p>
          <p><strong>🤝 උදාසීන මිල ලක්ෂ්‍යය:</strong> {ipp ? `${currency} ${ipp.toFixed(2)}` : 'N/A'} - ගුණාත්මක සහ මිල සමතුලිත වන ස්ථානය</p>
          <p><strong>🛡️ පිළිගත හැකි මිල පරාසය:</strong> {pmch && pme ? `${currency} ${pmch.toFixed(2)} - ${currency} ${pme.toFixed(2)}` : 'N/A'}</p>
          <p><strong>💡 නිර්දේශ:</strong> ඔබේ නිෂ්පාදනය OPP ආසන්නයේ මිල ගණන් කරන්න.</p>
        </div>
      );
    } else if (language === 'ta') {
      return (
        <div className="space-y-3 text-sm sm:text-base">
          <p><strong>🎯 உகந்த விலை:</strong> {opp ? `${currency} ${opp.toFixed(2)}` : 'N/A'} - இது வாடிக்கையாளர்களின் விலை உணர்வின் "இனிய புள்ளி"</p>
          <p><strong>🤝 அலட்சிய விலை புள்ளி:</strong> {ipp ? `${currency} ${ipp.toFixed(2)}` : 'N/A'} - தரம் மற்றும் விலை சமநிலையடையும் இடம்</p>
          <p><strong>🛡️ ஏற்றுக்கொள்ளக்கூடிய விலை வரம்பு:</strong> {pmch && pme ? `${currency} ${pmch.toFixed(2)} - ${currency} ${pme.toFixed(2)}` : 'N/A'}</p>
          <p><strong>💡 பரிந்துரை:</strong> உங்கள் தயாரிப்பை OPP க்கு அருகில் விலை நிர்ணயம் செய்யுங்கள்.</p>
        </div>
      );
    } else {
      return (
        <div className="space-y-3 text-sm sm:text-base">
          <p><strong>🎯 Optimal Price Point:</strong> {opp ? `${currency} ${opp.toFixed(2)}` : 'N/A'} - This is the "sweet spot" for pricing</p>
          <p><strong>🤝 Indifference Price Point:</strong> {ipp ? `${currency} ${ipp.toFixed(2)}` : 'N/A'} - Quality and price balance point</p>
          <p><strong>🛡️ Acceptable Price Range:</strong> {pmch && pme ? `${currency} ${pmch.toFixed(2)} - ${currency} ${pme.toFixed(2)}` : 'N/A'}</p>
          <p><strong>💡 Recommendation:</strong> Price your product near the OPP for maximum market acceptance.</p>
        </div>
      );
    }
  };

  const renderChart = () => {
    const { chartData } = vanWestendorpResults;
    if (!chartData || chartData.length === 0) return null;

    const maxPrice = Math.max(...chartData.map(d => d.price));
    const minPrice = Math.min(...chartData.map(d => d.price));

    return (
      <div className="relative h-full w-full">
        <div className="absolute left-0 top-0 text-xs text-gray-600">100%</div>
        <div className="absolute left-0 top-1/2 text-xs text-gray-600">50%</div>
        <div className="absolute left-0 bottom-0 text-xs text-gray-600">0%</div>
        
        <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
          <line x1="40" y1="0" x2="40" y2="260" stroke="#e5e5e5" strokeWidth="1"/>
          <line x1="40" y1="260" x2="380" y2="260" stroke="#e5e5e5" strokeWidth="1"/>
          
          {chartData.length > 1 && (
            <>
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                points={chartData.map((d, i) => {
                  const x = 40 + (i / (chartData.length - 1)) * 340;
                  const y = 260 - (d.tooCheapCumulative / 100) * 240;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points={chartData.map((d, i) => {
                  const x = 40 + (i / (chartData.length - 1)) * 340;
                  const y = 260 - (d.notCheapCumulative / 100) * 240;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                points={chartData.map((d, i) => {
                  const x = 40 + (i / (chartData.length - 1)) * 340;
                  const y = 260 - (d.expensiveCumulative / 100) * 240;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                points={chartData.map((d, i) => {
                  const x = 40 + (i / (chartData.length - 1)) * 340;
                  const y = 260 - (d.notExpensiveCumulative / 100) * 240;
                  return `${x},${y}`;
                }).join(' ')}
              />
            </>
          )}
          
          <text x="40" y="280" className="text-xs fill-gray-600">{minPrice.toFixed(0)}</text>
          <text x="380" y="280" className="text-xs fill-gray-600" textAnchor="end">{maxPrice.toFixed(0)}</text>
        </svg>
        
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Too Cheap</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Not Cheap</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Expensive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Not Expensive</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 px-2">
            {t.mainTitle}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-blue-100 mb-4 sm:mb-6 px-2">
            {t.subtitle}
          </p>
          
          <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
            {(['en', 'si', 'ta'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm ${
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

        <div className="max-w-7xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="LKR">LKR (රුපියල්)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
              </select>
              <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                {t.customerCount} {customers.length}
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
                {t.dataEntryTitle}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={loadSampleData}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                >
                  {t.sampleData}
                </button>
                <button
                  onClick={clearData}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                >
                  {t.clearData}
                </button>
                <button
                  onClick={exportData}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                >
                  {t.exportData}
                </button>
                <button
                  onClick={importData}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm"
                >
                  {t.importData}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">{t.questionGuide}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-red-600">Q1:</span> {t.q1Guide}</p>
                <p><span className="font-medium text-green-600">Q2:</span> {t.q2Guide}</p>
                <p><span className="font-medium text-yellow-600">Q3:</span> {t.q3Guide}</p>
                <p><span className="font-medium text-purple-600">Q4:</span> {t.q4Guide}</p>
              </div>
            </div>

            <div className="block sm:hidden space-y-4 mb-6">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Customer {customer.id}</h3>
                    <button
                      onClick={() => removeCustomer(customer.id)}
                      disabled={customers.length === 1}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {t.removeCustomer}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-red-600 mb-1">{t.q1Label}</label>
                      <input
                        type="number"
                        value={customer.tooCheap || ''}
                        onChange={(e) => updateCustomer(customer.id, 'tooCheap', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 text-sm"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-green-600 mb-1">{t.q2Label}</label>
                      <input
                        type="number"
                        value={customer.bargain || ''}
                        onChange={(e) => updateCustomer(customer.id, 'bargain', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 text-sm"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-yellow-600 mb-1">{t.q3Label}</label>
                      <input
                        type="number"
                        value={customer.expensive || ''}
                        onChange={(e) => updateCustomer(customer.id, 'expensive', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 text-sm"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-purple-600 mb-1">{t.q4Label}</label>
                      <input
                        type="number"
                        value={customer.tooExpensive || ''}
                        onChange={(e) => updateCustomer(customer.id, 'tooExpensive', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 text-sm"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">{t.customerLabel}</th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-red-600 text-xs sm:text-sm">{t.q1Label}</th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-green-600 text-xs sm:text-sm">{t.q2Label}</th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-yellow-600 text-xs sm:text-sm">{t.q3Label}</th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-purple-600 text-xs sm:text-sm">{t.q4Label}</th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 sm:p-3 font-semibold text-xs sm:text-sm">{customer.id}</td>
                      <td className="border border-gray-300 p-1 sm:p-2">
                        <input
                          type="number"
                          value={customer.tooCheap || ''}
                          onChange={(e) => updateCustomer(customer.id, 'tooCheap', e.target.value)}
                          className="w-full p-1 sm:p-2 border rounded focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                        />
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2">
                        <input
                          type="number"
                          value={customer.bargain || ''}
                          onChange={(e) => updateCustomer(customer.id, 'bargain', e.target.value)}
                          className="w-full p-1 sm:p-2 border rounded focus:ring-2 focus:ring-green-500 text-xs sm:text-sm"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                        />
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2">
                        <input
                          type="number"
                          value={customer.expensive || ''}
                          onChange={(e) => updateCustomer(customer.id, 'expensive', e.target.value)}
                          className="w-full p-1 sm:p-2 border rounded focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                        />
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2">
                        <input
                          type="number"
                          value={customer.tooExpensive || ''}
                          onChange={(e) => updateCustomer(customer.id, 'tooExpensive', e.target.value)}
                          className="w-full p-1 sm:p-2 border rounded focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                        />
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-center">
                        <button
                          onClick={() => removeCustomer(customer.id)}
                          disabled={customers.length === 1}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
                        >
                          {t.removeCustomer}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-8 mb-6 sm:mb-8">
              <button
                onClick={addCustomer}
                className="w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                {t.addCustomer}
              </button>

              <button
                onClick={calculateResults}
                disabled={customers.length < 5}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base font-semibold"
              >
                {t.calculateBtn}
              </button>
            </div>

            {showResults && vanWestendorpResults.opp && (
              <div id="results">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  {t.resultsTitle}
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">
                      {t.pricePointsTitle}
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-700">{t.oppLabel}</span>
                        <span className="font-bold text-blue-600">
                          {vanWestendorpResults.opp ? `${currency} ${vanWestendorpResults.opp.toFixed(2)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-700">{t.ippLabel}</span>
                        <span className="font-bold text-green-600">
                          {vanWestendorpResults.ipp ? `${currency} ${vanWestendorpResults.ipp.toFixed(2)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-700">{t.pmchLabel}</span>
                        <span className="font-bold text-orange-600">
                          {vanWestendorpResults.pmch ? `${currency} ${vanWestendorpResults.pmch.toFixed(2)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-700">{t.pmeLabel}</span>
                        <span className="font-bold text-red-600">
                          {vanWestendorpResults.pme ? `${currency} ${vanWestendorpResults.pme.toFixed(2)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-blue-200">
                        <div className="text-xs sm:text-sm">
                          <span className="text-gray-700 font-medium">{t.acceptableRange}</span>
                          <span className="font-bold text-blue-700 block">
                            {vanWestendorpResults.pmch && vanWestendorpResults.pme 
                              ? `${currency} ${vanWestendorpResults.pmch.toFixed(2)} - ${currency} ${vanWestendorpResults.pme.toFixed(2)}`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4">
                      {t.chartTitle}
                    </h3>
                    <div className="h-64 sm:h-80 bg-white rounded-lg p-3 sm:p-4 border">
                      {renderChart()}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-orange-800">
                      {t.interpretationTitle}
                    </h3>
                    <button
                      onClick={openPricingModal}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm font-medium"
                    >
                      {t.getRecommendation}
                    </button>
                  </div>
                  <div className="text-gray-700">
                    {generateInterpretation()}
                  </div>
                </div>

                {vanWestendorpResults.chartData.length > 0 && (
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                      📊 Cumulative Analysis Data (Sample)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-1 sm:p-2 text-left">Price ({currency})</th>
                            <th className="p-1 sm:p-2 text-center text-red-600">Too Cheap %</th>
                            <th className="p-1 sm:p-2 text-center text-green-600">Not Cheap %</th>
                            <th className="p-1 sm:p-2 text-center text-yellow-600">Expensive %</th>
                            <th className="p-1 sm:p-2 text-center text-purple-600">Not Expensive %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vanWestendorpResults.chartData.slice(0, 8).map((row, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-1 sm:p-2 font-semibold">{row.price.toFixed(2)}</td>
                              <td className="p-1 sm:p-2 text-center">{row.tooCheapCumulative.toFixed(1)}%</td>
                              <td className="p-1 sm:p-2 text-center">{row.notCheapCumulative.toFixed(1)}%</td>
                              <td className="p-1 sm:p-2 text-center">{row.expensiveCumulative.toFixed(1)}%</td>
                              <td className="p-1 sm:p-2 text-center">{row.notExpensiveCumulative.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {vanWestendorpResults.chartData.length > 8 && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Showing first 8 of {vanWestendorpResults.chartData.length} price points
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {customers.length < 5 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mx-1 sm:mx-0">
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start">
                  <div className="text-yellow-600 text-xl sm:text-2xl mr-0 sm:mr-3 flex-shrink-0 self-center sm:self-start">⚠️</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-800 mb-2 sm:mb-3 leading-tight">
                      Van Westendorp Method Requirements
                    </h3>
                    <p className="text-yellow-700 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                      {t.needMoreData}
                    </p>
                    <div className="bg-yellow-100 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-yellow-800 mb-2">
                        📋 How it works:
                      </p>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div className="flex items-start space-x-2">
                            <span className="text-yellow-600 mt-0.5 flex-shrink-0">•</span>
                            <span className="text-xs sm:text-sm text-yellow-700 leading-tight">
                              Survey multiple customers with 4 price perception questions
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-yellow-600 mt-0.5 flex-shrink-0">•</span>
                            <span className="text-xs sm:text-sm text-yellow-700 leading-tight">
                              Plot cumulative curves for each question response
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-yellow-600 mt-0.5 flex-shrink-0">•</span>
                            <span className="text-xs sm:text-sm text-yellow-700 leading-tight">
                              Find intersections to determine optimal price points
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-yellow-600 mt-0.5 flex-shrink-0">•</span>
                            <span className="text-xs sm:text-sm text-yellow-700 leading-tight">
                              Analyze customer price sensitivity patterns
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 sm:mt-4 pt-3 border-t border-yellow-200">
                          <p className="text-xs sm:text-sm font-medium text-yellow-800 mb-2">
                            🎯 Key Price Points:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="bg-white bg-opacity-50 rounded p-2 sm:p-3">
                              <span className="font-semibold text-blue-700">OPP:</span>
                              <span className="text-yellow-700 block sm:inline sm:ml-1">
                                Where "too cheap" meets "not expensive"
                              </span>
                            </div>
                            <div className="bg-white bg-opacity-50 rounded p-2 sm:p-3">
                              <span className="font-semibold text-green-700">IPP:</span>
                              <span className="text-yellow-700 block sm:inline sm:ml-1">
                                Where "not cheap" meets "expensive"
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4 bg-green-100 border border-green-200 rounded-lg p-2 sm:p-3">
                          <p className="text-xs sm:text-sm font-medium text-green-800 mb-1">
                            💡 Quick Start Tip:
                          </p>
                          <p className="text-xs sm:text-sm text-green-700">
                            Click the "📝 Sample" button above to load 10 example customer responses and see the analysis in action!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8 text-white px-4">
          <p className="text-blue-200 text-xs sm:text-sm mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
            <a
              href="https://www.linkedin.com/in/sarath-kumar-07aa14302"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                alt="LinkedIn"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              Connect on LinkedIn
            </a>
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Developed by Sarathkumar</p>
        </div>
      </div>

      {/* Pricing Recommendation Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {t.modalTitle}
                </h2>
                <button
                  onClick={closePricingModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {(() => {
                const recommendation = generatePricingRecommendation();
                return (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-l-4 ${
                      recommendation.type === 'optimal' ? 'bg-green-50 border-green-500' :
                      recommendation.type === 'good' ? 'bg-blue-50 border-blue-500' :
                      recommendation.type === 'caution' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-red-50 border-red-500'
                    }`}>
                      <h3 className={`font-semibold text-lg mb-2 ${
                        recommendation.type === 'optimal' ? 'text-green-800' :
                        recommendation.type === 'good' ? 'text-blue-800' :
                        recommendation.type === 'caution' ? 'text-yellow-800' :
                        'text-red-800'
                      }`}>
                        {recommendation.title}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        recommendation.type === 'optimal' ? 'text-green-700' :
                        recommendation.type === 'good' ? 'text-blue-700' :
                        recommendation.type === 'caution' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {recommendation.message}
                      </p>
                      <div className={`text-sm whitespace-pre-line ${
                        recommendation.type === 'optimal' ? 'text-green-600' :
                        recommendation.type === 'good' ? 'text-blue-600' :
                        recommendation.type === 'caution' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {recommendation.recommendation}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">📈 Quick Reference:</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">OPP:</span>
                          <span className="font-medium text-blue-600">
                            {vanWestendorpResults.opp ? `${currency} ${vanWestendorpResults.opp.toFixed(2)}` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IPP:</span>
                          <span className="font-medium text-green-600">
                            {vanWestendorpResults.ipp ? `${currency} ${vanWestendorpResults.ipp.toFixed(2)}` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PMC:</span>
                          <span className="font-medium text-orange-600">
                            {vanWestendorpResults.pmch ? `${currency} ${vanWestendorpResults.pmch.toFixed(2)}` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PME:</span>
                          <span className="font-medium text-red-600">
                            {vanWestendorpResults.pme ? `${currency} ${vanWestendorpResults.pme.toFixed(2)}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closePricingModal}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t.modalClose}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VanWestendorpPricingTool;
