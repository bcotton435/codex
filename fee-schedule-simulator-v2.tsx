import React, { useState, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Plus, Trash2, Copy, Calendar, BarChart3, Upload, ArrowRight, ArrowLeft, Save, FileDown, Edit3 } from 'lucide-react';

// Embedded benchmark data from CSV
const BENCHMARK_DATA = [{"product":"Charge Medical","relDate":"May 2025","geozip":"100","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1789,"p60":1946,"p70":2045,"p75":2053,"p80":2246,"p85":2387,"p90":2397,"p95":2868},{"product":"Charge Medical","relDate":"May 2025","geozip":"100","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1956,"p60":2096,"p70":2361,"p75":2550,"p80":2819,"p85":2873,"p90":3067,"p95":3105},{"product":"Charge Medical","relDate":"May 2025","geozip":"103","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1442,"p60":2045,"p70":2049,"p75":2053,"p80":2053,"p85":2089,"p90":2097,"p95":2556},{"product":"Charge Medical","relDate":"May 2025","geozip":"103","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1575,"p60":2106,"p70":2361,"p75":2550,"p80":2819,"p85":2896,"p90":3015,"p95":3146},{"product":"Charge Medical","relDate":"May 2025","geozip":"104","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1664,"p60":1915,"p70":2045,"p75":2053,"p80":2194,"p85":2308,"p90":2390,"p95":2830},{"product":"Charge Medical","relDate":"May 2025","geozip":"104","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1935,"p60":2068,"p70":2295,"p75":2485,"p80":2743,"p85":2831,"p90":3018,"p95":3049},{"product":"Charge Medical","relDate":"May 2025","geozip":"105","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1789,"p60":1893,"p70":2045,"p75":2053,"p80":2167,"p85":2263,"p90":2381,"p95":2873},{"product":"Charge Medical","relDate":"May 2025","geozip":"105","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1851,"p60":2040,"p70":2295,"p75":2460,"p80":2744,"p85":2831,"p90":3018,"p95":3032},{"product":"Charge Medical","relDate":"May 2025","geozip":"106","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1727,"p60":1893,"p70":2045,"p75":2053,"p80":2219,"p85":2308,"p90":2381,"p95":2830},{"product":"Charge Medical","relDate":"May 2025","geozip":"106","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1891,"p60":2046,"p70":2295,"p75":2477,"p80":2705,"p85":2831,"p90":3018,"p95":3032},{"product":"Charge Medical","relDate":"May 2025","geozip":"107","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1789,"p60":1893,"p70":2045,"p75":2053,"p80":2203,"p85":2359,"p90":2390,"p95":2873},{"product":"Charge Medical","relDate":"May 2025","geozip":"107","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1870,"p60":2046,"p70":2361,"p75":2477,"p80":2744,"p85":2831,"p90":3018,"p95":3032},{"product":"Charge Medical","relDate":"May 2025","geozip":"109","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1762,"p60":1893,"p70":2045,"p75":2053,"p80":2219,"p85":2387,"p90":2397,"p95":2873},{"product":"Charge Medical","relDate":"May 2025","geozip":"109","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1906,"p60":2062,"p70":2361,"p75":2519,"p80":2819,"p85":2873,"p90":3067,"p95":3105},{"product":"Charge Medical","relDate":"May 2025","geozip":"110","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1789,"p60":1946,"p70":2045,"p75":2053,"p80":2246,"p85":2387,"p90":2397,"p95":2868},{"product":"Charge Medical","relDate":"May 2025","geozip":"110","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1954,"p60":2096,"p70":2361,"p75":2550,"p80":2819,"p85":2873,"p90":3067,"p95":3105},{"product":"Charge Medical","relDate":"May 2025","geozip":"111","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1704,"p60":1915,"p70":2045,"p75":2053,"p80":2167,"p85":2387,"p90":2397,"p95":2868},{"product":"Charge Medical","relDate":"May 2025","geozip":"111","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1891,"p60":2068,"p70":2361,"p75":2485,"p80":2819,"p85":2873,"p90":3067,"p95":3105}];

const FeeScheduleSimulator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [scenario, setScenario] = useState({
    name: 'Current Fee Schedule',
    effectiveDate: '2025-05-01',
    geozip: '100',
    recordType: '30',
    rates: []
  });
  const [compareScenario, setCompareScenario] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [nextRateId, setNextRateId] = useState(1);
  const fileInputRef = useRef(null);

  const geozips = [...new Set(BENCHMARK_DATA.map(d => d.geozip))].filter(g => g);

  const getAvailableCPTs = (geozip, recordType) => {
    return [...new Set(BENCHMARK_DATA
      .filter(d => d.geozip === geozip && d.recordType === recordType)
      .map(d => d.code))];
  };

  const getBenchmark = (cpt, geozip, recordType) => {
    return BENCHMARK_DATA.find(
      d => d.code === cpt && d.geozip === geozip && d.recordType === recordType
    );
  };

  const getPercentileInfo = (rate, benchmark) => {
    if (!benchmark || !rate) return null;
    
    if (rate < benchmark.p50) {
      return { level: '<50th', color: 'bg-red-50 text-red-700 border-red-200', icon: TrendingDown };
    }
    if (rate < benchmark.p75) {
      return { level: '50th-75th', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Minus };
    }
    if (rate < benchmark.p90) {
      return { level: '75th-90th', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle };
    }
    return { level: '>90th', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: AlertCircle };
  };

  const calculateScenarioMetrics = (scenarioData) => {
    let totalProposedRevenue = 0;
    let totalMedianRevenue = 0;
    let belowMarketCount = 0;
    let competitiveCount = 0;
    let strongCount = 0;
    let pushbackCount = 0;

    scenarioData.rates.forEach(rate => {
      if (!rate.proposedRate) return;
      
      const benchmark = getBenchmark(rate.cpt, scenarioData.geozip, scenarioData.recordType);
      if (!benchmark) return;

      const proposedRate = parseFloat(rate.proposedRate);
      totalProposedRevenue += proposedRate;
      totalMedianRevenue += benchmark.p50;

      const percentileInfo = getPercentileInfo(proposedRate, benchmark);
      if (percentileInfo?.level === '<50th') belowMarketCount++;
      else if (percentileInfo?.level === '50th-75th') competitiveCount++;
      else if (percentileInfo?.level === '75th-90th') strongCount++;
      else if (percentileInfo?.level === '>90th') pushbackCount++;
    });

    const revenueLift = totalProposedRevenue - totalMedianRevenue;
    const revenueLiftPercent = totalMedianRevenue > 0 ? ((revenueLift / totalMedianRevenue) * 100).toFixed(1) : 0;

    return {
      totalProposedRevenue,
      totalMedianRevenue,
      revenueLift,
      revenueLiftPercent,
      belowMarketCount,
      competitiveCount,
      strongCount,
      pushbackCount,
      totalCPTs: scenarioData.rates.filter(r => r.proposedRate).length
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      
      const dataLines = lines.slice(1, 4);
      
      const newRates = dataLines.map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        return {
          id: nextRateId + index,
          cpt: values[2] || '',
          proposedRate: values[6] || ''
        };
      }).filter(rate => rate.cpt);

      setScenario({
        ...scenario,
        rates: newRates
      });
      setNextRateId(nextRateId + newRates.length);
    };
    reader.readAsText(file);
  };

  const addRate = () => {
    const availableCPTs = getAvailableCPTs(scenario.geozip, scenario.recordType);
    const unusedCPT = availableCPTs.find(cpt => !scenario.rates.some(r => r.cpt === cpt));
    
    if (unusedCPT) {
      setScenario({
        ...scenario,
        rates: [...scenario.rates, { id: nextRateId, cpt: unusedCPT, proposedRate: '' }]
      });
      setNextRateId(nextRateId + 1);
    }
  };

  const updateRate = (rateId, field, value) => {
    setScenario({
      ...scenario,
      rates: scenario.rates.map(r => r.id === rateId ? { ...r, [field]: value } : r)
    });
  };

  const removeRate = (rateId) => {
    setScenario({
      ...scenario,
      rates: scenario.rates.filter(r => r.id !== rateId)
    });
  };

  const updateCompareRate = (rateId, field, value) => {
    setCompareScenario({
      ...compareScenario,
      rates: compareScenario.rates.map(r => r.id === rateId ? { ...r, [field]: value } : r)
    });
  };

  const duplicateScenario = () => {
    setCompareScenario({
      ...scenario,
      name: `${scenario.name} (Copy)`,
      rates: scenario.rates.map(r => ({ ...r }))
    });
    setCurrentStep(3);
  };

  const saveScenario = () => {
    setSavedScenarios([...savedScenarios, { ...scenario, savedAt: new Date().toLocaleString() }]);
    alert('Scenario saved successfully!');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const metrics = scenario.rates.length > 0 ? calculateScenarioMetrics(scenario) : null;
  const compareMetrics = compareScenario ? calculateScenarioMetrics(compareScenario) : null;

  return (
    <div className="w-full min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Fee Schedule Scenario Simulator</h1>
          <p className="text-slate-600">Model pricing strategies and analyze market positioning before negotiations</p>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-4 mt-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white' 
                    : currentStep > step 
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {currentStep > step ? <CheckCircle size={20} /> : step}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${currentStep === step ? 'text-blue-600' : 'text-slate-600'}`}>
                    Step {step}
                  </div>
                  <div className="text-xs text-slate-500">
                    {step === 1 ? 'Upload Data' : step === 2 ? 'Review Summary' : 'Compare Scenarios'}
                  </div>
                </div>
                {step < 3 && <ArrowRight className="mx-4 text-slate-400" size={20} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Upload Data */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Step 1: Upload Current Fee Schedule</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Scenario Name</label>
                <input
                  type="text"
                  value={scenario.name}
                  onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Effective Date</label>
                <input
                  type="date"
                  value={scenario.effectiveDate}
                  onChange={(e) => setScenario({ ...scenario, effectiveDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">GeoZip</label>
                <select 
                  value={scenario.geozip}
                  onChange={(e) => setScenario({ ...scenario, geozip: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {geozips.map(gz => (
                    <option key={gz} value={gz}>{gz}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Record Type</label>
                <select 
                  value={scenario.recordType}
                  onChange={(e) => setScenario({ ...scenario, recordType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 - Facility</option>
                </select>
              </div>
            </div>

            {/* Upload Section - Only show if no rates have been added */}
            {scenario.rates.length === 0 && (
              <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 mb-6 text-center">
                <Upload className="mx-auto mb-2 text-blue-600" size={32} />
                <h3 className="text-base font-semibold text-slate-800 mb-1">Upload CSV File</h3>
                <p className="text-xs text-slate-600 mb-3">Upload a CSV with your CPT codes and proposed rates</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
                <p className="text-xs text-slate-500 mt-2">Or manually add CPT codes below</p>
              </div>
            )}

            {/* CPT Codes Table */}
            {scenario.rates.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Your CPT Codes</h3>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">CPT Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Your Rate</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Position</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Market 50th</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Market 90th</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {scenario.rates.map((rate) => {
                        const benchmark = getBenchmark(rate.cpt, scenario.geozip, scenario.recordType);
                        const percentileInfo = benchmark && rate.proposedRate ? getPercentileInfo(parseFloat(rate.proposedRate), benchmark) : null;
                        const Icon = percentileInfo?.icon;

                        return (
                          <tr key={rate.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <select
                                value={rate.cpt}
                                onChange={(e) => updateRate(rate.id, 'cpt', e.target.value)}
                                className="px-2 py-1 border border-slate-300 rounded text-xs"
                              >
                                {getAvailableCPTs(scenario.geozip, scenario.recordType).map(cpt => (
                                  <option key={cpt} value={cpt}>{cpt}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">
                              {benchmark?.description || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={rate.proposedRate}
                                onChange={(e) => updateRate(rate.id, 'proposedRate', e.target.value)}
                                placeholder="Enter rate"
                                className="w-28 px-2 py-1 border border-slate-300 rounded text-right text-xs"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              {percentileInfo && (
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${percentileInfo.color} text-xs font-medium whitespace-nowrap`}>
                                  <Icon size={12} />
                                  {percentileInfo.level}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-slate-600">
                              {benchmark ? formatCurrency(benchmark.p50) : '-'}
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-slate-600">
                              {benchmark ? formatCurrency(benchmark.p90) : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removeRate(rate.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={addRate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 mb-6"
            >
              <Plus size={16} />
              Add CPT Code Manually
            </button>

            {/* Navigation */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={scenario.rates.length === 0}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                Continue to Summary
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Negotiation Summary */}
        {currentStep === 2 && metrics && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 size={24} />
                Negotiation Summary - {scenario.name}
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-slate-600 mb-2">Total Proposed Revenue</div>
                  <div className="text-3xl font-bold text-slate-800">{formatCurrency(metrics.totalProposedRevenue)}</div>
                  <div className="text-sm text-slate-500 mt-1">{metrics.totalCPTs} CPT codes</div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-slate-600 mb-2">vs. Market Median</div>
                  <div className={`text-3xl font-bold ${metrics.revenueLift >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.revenueLift >= 0 ? '+' : ''}{formatCurrency(metrics.revenueLift)}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">({metrics.revenueLift >= 0 ? '+' : ''}{metrics.revenueLiftPercent}%)</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="text-sm font-medium text-slate-700 mb-4">Market Position Breakdown</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Below Market (&lt;50th)</span>
                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {metrics.belowMarketCount} CPTs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Competitive (50th-75th)</span>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {metrics.competitiveCount} CPTs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Strong Position (75th-90th)</span>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {metrics.strongCount} CPTs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Pushback Risk (&gt;90th)</span>
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {metrics.pushbackCount} CPTs
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="text-sm font-medium text-amber-800 mb-2">Recommended Strategy</div>
                <div className="text-sm text-amber-700">
                  {metrics.pushbackCount > metrics.strongCount 
                    ? "High pushback risk detected. Consider lowering rates on >90th percentile CPTs or prepare strong justifications."
                    : metrics.belowMarketCount > 2
                    ? "Multiple below-market rates identified. Opportunity to increase rates and capture market value."
                    : metrics.strongCount >= metrics.totalCPTs * 0.6
                    ? "Strong overall position. Maintain firm stance in negotiations with fallback to 75th percentile."
                    : "Balanced portfolio. Focus negotiations on high-volume CPTs and maintain flexibility on others."}
                </div>
              </div>
            </div>

            {/* Editable Rates Table */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Edit3 size={20} />
                  Edit Your Rates
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">CPT Code</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Your Rate</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Position</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">50th</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">75th</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">90th</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {scenario.rates.map((rate) => {
                      const benchmark = getBenchmark(rate.cpt, scenario.geozip, scenario.recordType);
                      const percentileInfo = benchmark && rate.proposedRate ? getPercentileInfo(parseFloat(rate.proposedRate), benchmark) : null;
                      const Icon = percentileInfo?.icon;

                      return (
                        <tr key={rate.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-800">{rate.cpt}</td>
                          <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">
                            {benchmark?.description || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={rate.proposedRate}
                              onChange={(e) => updateRate(rate.id, 'proposedRate', e.target.value)}
                              className="w-28 px-2 py-1 border border-slate-300 rounded text-right text-xs"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {percentileInfo && (
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${percentileInfo.color} text-xs font-medium whitespace-nowrap`}>
                                <Icon size={12} />
                                {percentileInfo.level}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-slate-600">
                            {benchmark ? formatCurrency(benchmark.p50) : '-'}
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-slate-600">
                            {benchmark ? formatCurrency(benchmark.p75) : '-'}
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-slate-600">
                            {benchmark ? formatCurrency(benchmark.p90) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-semibold"
              >
                <ArrowLeft size={20} />
                Back to Data Upload
              </button>
              <div className="flex gap-3">
                <button
                  onClick={saveScenario}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-semibold"
                >
                  <Save size={20} />
                  Save Scenario
                </button>
                <button
                  onClick={duplicateScenario}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                >
                  <Copy size={20} />
                  Duplicate & Compare
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Compare Scenarios */}
        {currentStep === 3 && compareScenario && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Original Scenario */}
              <div>
                <ScenarioComparisonPanel
                  scenario={scenario}
                  metrics={metrics}
                  onUpdateRate={updateRate}
                  getBenchmark={getBenchmark}
                  getPercentileInfo={getPercentileInfo}
                  formatCurrency={formatCurrency}
                  label="Original Scenario"
                />
              </div>

              {/* Comparison Scenario */}
              <div>
                <ScenarioComparisonPanel
                  scenario={compareScenario}
                  metrics={compareMetrics}
                  onUpdateRate={updateCompareRate}
                  getBenchmark={getBenchmark}
                  getPercentileInfo={getPercentileInfo}
                  formatCurrency={formatCurrency}
                  label="Comparison Scenario"
                  editable={true}
                  onUpdateName={(name) => setCompareScenario({ ...compareScenario, name })}
                />
              </div>
            </div>

            {/* Comparison Summary */}
            {metrics && compareMetrics && (
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 mb-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-6">Scenario Comparison</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Revenue Lift Difference</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {formatCurrency(Math.abs(metrics.revenueLift - compareMetrics.revenueLift))}
                    </div>
                    <div className={`text-sm ${metrics.revenueLift > compareMetrics.revenueLift ? 'text-green-600' : 'text-red-600'}`}>
                      Original is {metrics.revenueLift > compareMetrics.revenueLift ? 'higher' : 'lower'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Pushback Risk Difference</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {Math.abs(metrics.pushbackCount - compareMetrics.pushbackCount)} CPTs
                    </div>
                    <div className={`text-sm ${metrics.pushbackCount < compareMetrics.pushbackCount ? 'text-green-600' : 'text-orange-600'}`}>
                      Original has {metrics.pushbackCount < compareMetrics.pushbackCount ? 'lower' : 'higher'} risk
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Strong Position Difference</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {Math.abs(metrics.strongCount - compareMetrics.strongCount)} CPTs
                    </div>
                    <div className={`text-sm ${metrics.strongCount > compareMetrics.strongCount ? 'text-green-600' : 'text-slate-600'}`}>
                      Original has {metrics.strongCount > compareMetrics.strongCount ? 'more' : 'fewer'} strong positions
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-semibold"
              >
                <ArrowLeft size={20} />
                Back to Summary
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => alert('Export functionality for presentation purposes')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
                >
                  <FileDown size={20} />
                  Export Report
                </button>
                <button
                  onClick={saveScenario}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                >
                  <Save size={20} />
                  Save Both Scenarios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ScenarioComparisonPanel = ({ 
  scenario, 
  metrics,
  onUpdateRate,
  getBenchmark,
  getPercentileInfo,
  formatCurrency,
  label,
  editable = false,
  onUpdateName
}) => {
  return (
    <div>
      {/* Scenario Header */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
        <div className="text-sm font-medium text-slate-600 mb-2">{label}</div>
        {editable ? (
          <input
            type="text"
            value={scenario.name}
            onChange={(e) => onUpdateName(e.target.value)}
            className="w-full text-lg font-semibold text-slate-800 border border-slate-300 rounded px-2 py-1"
          />
        ) : (
          <div className="text-lg font-semibold text-slate-800">{scenario.name}</div>
        )}
        <div className="text-sm text-slate-600 mt-2">
          {scenario.rates.length} CPT codes • GeoZip {scenario.geozip}
        </div>
      </div>

      {/* Metrics Summary */}
      {metrics && metrics.totalCPTs > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-slate-600 mb-1">Proposed Revenue</div>
              <div className="text-xl font-bold text-slate-800">{formatCurrency(metrics.totalProposedRevenue)}</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-slate-600 mb-1">vs. Median</div>
              <div className={`text-xl font-bold ${metrics.revenueLift >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.revenueLift >= 0 ? '+' : ''}{formatCurrency(metrics.revenueLift)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <div className="text-xs font-medium text-slate-700 mb-2">Position Breakdown</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Below Market</span>
                <span className="font-medium text-red-700">{metrics.belowMarketCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Competitive</span>
                <span className="font-medium text-blue-700">{metrics.competitiveCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Strong</span>
                <span className="font-medium text-green-700">{metrics.strongCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Pushback Risk</span>
                <span className="font-medium text-purple-700">{metrics.pushbackCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rates Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold text-slate-700">CPT</th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-slate-700">Rate</th>
                <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Position</th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-slate-700">50th</th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-slate-700">90th</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {scenario.rates.map((rate) => {
                const benchmark = getBenchmark(rate.cpt, scenario.geozip, scenario.recordType);
                const percentileInfo = benchmark && rate.proposedRate ? getPercentileInfo(parseFloat(rate.proposedRate), benchmark) : null;
                const Icon = percentileInfo?.icon;

                return (
                  <tr key={rate.id} className="hover:bg-slate-50">
                    <td className="px-2 py-2 font-medium text-slate-800">{rate.cpt}</td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={rate.proposedRate}
                        onChange={(e) => onUpdateRate(rate.id, 'proposedRate', e.target.value)}
                        className="w-20 px-1 py-1 border border-slate-300 rounded text-right text-xs"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      {percentileInfo && (
                        <div className={`inline-flex items-center gap-1 px-1 py-0.5 rounded-full border ${percentileInfo.color} text-xs font-medium`}>
                          <Icon size={10} />
                          <span className="text-xs">{percentileInfo.level}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2 text-right text-slate-600">
                      {benchmark ? formatCurrency(benchmark.p50) : '-'}
                    </td>
                    <td className="px-2 py-2 text-right text-slate-600">
                      {benchmark ? formatCurrency(benchmark.p90) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeeScheduleSimulator;