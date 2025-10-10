import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Plus, Trash2, RotateCcw, Copy, ArrowRight } from 'lucide-react';

// Embedded benchmark data from CSV
const BENCHMARK_DATA = [{"product":"Charge Medical","relDate":"May 2025","geozip":"100","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1789,"p60":1946,"p70":2045,"p75":2053,"p80":2246,"p85":2387,"p90":2397,"p95":2868},{"product":"Charge Medical","relDate":"May 2025","geozip":"100","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1956,"p60":2096,"p70":2361,"p75":2550,"p80":2819,"p85":2873,"p90":3067,"p95":3105},{"product":"Charge Medical","relDate":"May 2025","geozip":"103","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1442,"p60":2045,"p70":2049,"p75":2053,"p80":2053,"p85":2089,"p90":2097,"p95":2556},{"product":"Charge Medical","relDate":"May 2025","geozip":"103","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1575,"p60":2106,"p70":2361,"p75":2550,"p80":2819,"p85":2896,"p90":3015,"p95":3146},{"product":"Charge Medical","relDate":"May 2025","geozip":"104","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1664,"p60":1915,"p70":2045,"p75":2053,"p80":2194,"p85":2308,"p90":2390,"p95":2830},{"product":"Charge Medical","relDate":"May 2025","geozip":"104","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1935,"p60":2068,"p70":2295,"p75":2485,"p80":2743,"p85":2831,"p90":3018,"p95":3049},{"product":"Charge Medical","relDate":"May 2025","geozip":"105","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1789,"p60":1893,"p70":2045,"p75":2053,"p80":2167,"p85":2263,"p90":2381,"p95":2873},{"product":"Charge Medical","relDate":"May 2025","geozip":"105","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1851,"p60":2040,"p70":2295,"p75":2460,"p80":2744,"p85":2831,"p90":3018,"p95":3032},{"product":"Charge Medical","relDate":"May 2025","geozip":"106","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1727,"p60":1893,"p70":2045,"p75":2053,"p80":2219,"p85":2308,"p90":2381,"p95":2830},{"product":"Charge Medical","relDate":"May 2025","geozip":"106","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1891,"p60":2046,"p70":2295,"p75":2477,"p80":2705,"p85":2831,"p90":3018,"p95":3032},{"product":"Charge Medical","relDate":"May 2025","geozip":"107","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1789,"p60":1893,"p70":2045,"p75":2053,"p80":2203,"p85":2359,"p90":2390,"p95":2873},{"product":"Charge Medical","relDate":"May 2025","geozip":"107","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1870,"p60":2046,"p70":2361,"p75":2477,"p80":2744,"p85":2831,"p90":3018,"p95":3032},{"product":"Charge Medical","relDate":"May 2025","geozip":"109","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1762,"p60":1893,"p70":2045,"p75":2053,"p80":2219,"p85":2387,"p90":2397,"p95":2873},{"product":"Charge Medical","relDate":"May 2025","geozip":"109","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1906,"p60":2062,"p70":2361,"p75":2519,"p80":2819,"p85":2873,"p90":3067,"p95":3105},{"product":"Charge Medical","relDate":"May 2025","geozip":"110","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1789,"p60":1946,"p70":2045,"p75":2053,"p80":2246,"p85":2387,"p90":2397,"p95":2868},{"product":"Charge Medical","relDate":"May 2025","geozip":"110","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1954,"p60":2096,"p70":2361,"p75":2550,"p80":2819,"p85":2873,"p90":3067,"p95":3105},{"product":"Charge Medical","relDate":"May 2025","geozip":"111","code":"45378","description":"COLONOSCOPY FLX DX W/COLLJ SPEC WHEN PFRMD","modifier":"  ","recordType":"30","p50":1704,"p60":1915,"p70":2045,"p75":2053,"p80":2167,"p85":2387,"p90":2397,"p95":2868},{"product":"Charge Medical","relDate":"May 2025","geozip":"111","code":"45380","description":"COLONOSCOPY W/BIOPSY SINGLE/MULTIPLE","modifier":"  ","recordType":"30","p50":1891,"p60":2068,"p70":2361,"p75":2485,"p80":2819,"p85":2873,"p90":3067,"p95":3105}];

const FeeScheduleSimulator = () => {
  const [benchmarkData] = useState(BENCHMARK_DATA);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [setupGeozip, setSetupGeozip] = useState('100');
  const [setupCPTs, setSetupCPTs] = useState(['45378']);
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [compareScenarioId, setCompareScenarioId] = useState(null);
  const [nextScenarioId, setNextScenarioId] = useState(1);
  const [nextRateId, setNextRateId] = useState(1);

  const geozips = [...new Set(benchmarkData.map(d => d.geozip))].filter(g => g);
  
  const getAvailableCPTsForGeozip = (geozip) => {
    return [...new Set(benchmarkData
      .filter(d => d.geozip === geozip && d.recordType === '30')
      .map(d => d.code))];
  };

  const startAnalysis = () => {
    const initialRates = setupCPTs.map((cpt, index) => ({
      id: index + 1,
      cpt: cpt,
      proposedRate: ''
    }));

    const initialScenario = {
      id: 1,
      name: 'Current Fee Schedule',
      geozip: setupGeozip,
      recordType: '30',
      rates: initialRates
    };

    setScenarios([initialScenario]);
    setActiveScenarioId(1);
    setNextScenarioId(2);
    setNextRateId(initialRates.length + 1);
    setIsSetupComplete(true);
  };

  const addSetupCPT = () => {
    if (setupCPTs.length >= 5) return;
    
    const availableCPTs = getAvailableCPTsForGeozip(setupGeozip);
    const unusedCPT = availableCPTs.find(cpt => !setupCPTs.includes(cpt));
    
    if (unusedCPT) {
      setSetupCPTs([...setupCPTs, unusedCPT]);
    }
  };

  const removeSetupCPT = (index) => {
    if (setupCPTs.length <= 1) return;
    setSetupCPTs(setupCPTs.filter((_, i) => i !== index));
  };

  const updateSetupCPT = (index, value) => {
    const newCPTs = [...setupCPTs];
    newCPTs[index] = value;
    setSetupCPTs(newCPTs);
  };

  // Setup Screen
  if (!isSetupComplete) {
    const availableCPTs = getAvailableCPTsForGeozip(setupGeozip);
    
    return (
      <div className="w-full max-w-3xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Fee Schedule Analyzer</h1>
            <p className="text-slate-600">Compare rates against market benchmarks</p>
          </div>

          <div className="space-y-6">
            {/* GeoZip Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Step 1: Select Your GeoZip
              </label>
              <select 
                value={setupGeozip}
                onChange={(e) => setSetupGeozip(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {geozips.map(gz => (
                  <option key={gz} value={gz}>GeoZip {gz}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">Geographic region for benchmark comparison</p>
            </div>

            {/* CPT Code Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Step 2: Select CPT Codes (up to 5)
              </label>
              <div className="space-y-3">
                {setupCPTs.map((cpt, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <select
                      value={cpt}
                      onChange={(e) => updateSetupCPT(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {availableCPTs.map(code => {
                        const benchmark = benchmarkData.find(d => d.code === code && d.geozip === setupGeozip && d.recordType === '30');
                        return (
                          <option key={code} value={code}>
                            {code} - {benchmark?.description}
                          </option>
                        );
                      })}
                    </select>
                    {setupCPTs.length > 1 && (
                      <button
                        onClick={() => removeSetupCPT(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {setupCPTs.length < 5 && (
                <button
                  onClick={addSetupCPT}
                  disabled={setupCPTs.length >= availableCPTs.length}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:text-slate-400 disabled:hover:bg-transparent"
                >
                  <Plus size={16} />
                  Add CPT Code
                </button>
              )}
            </div>

            {/* Start Button */}
            <button
              onClick={startAnalysis}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Analysis
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Analysis Screen (rest of the component)
  const activeScenario = scenarios.find(s => s.id === activeScenarioId);
  const compareScenario = scenarios.find(s => s.id === compareScenarioId);
  
  const getAvailableCPTs = () => {
    if (!activeScenario) return [];
    return [...new Set(benchmarkData
      .filter(d => d.geozip === activeScenario.geozip && d.recordType === activeScenario.recordType)
      .map(d => d.code))];
  };

  const getBenchmark = (cpt) => {
    if (!activeScenario) return null;
    return benchmarkData.find(
      d => d.code === cpt && d.geozip === activeScenario.geozip && d.recordType === activeScenario.recordType
    );
  };

  const getPercentileInfo = (rate, benchmark) => {
    if (!benchmark || !rate) return null;
    
    if (rate < benchmark.p50) {
      return { level: 'Below Market', color: 'bg-red-50 text-red-700 border-red-200', icon: TrendingDown };
    }
    if (rate < benchmark.p75) {
      return { level: 'Competitive', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Minus };
    }
    return { level: 'Above Market', color: 'bg-green-50 text-green-700 border-green-200', icon: TrendingUp };
  };

  const calculateMetrics = (scenario) => {
    if (!scenario) return { revenueLift: 0, revenueLiftPercent: 0 };
    
    let totalProposedRevenue = 0;
    let totalMedianRevenue = 0;

    scenario.rates.forEach(rate => {
      if (!rate.proposedRate) return;
      
      const benchmark = benchmarkData.find(
        d => d.code === rate.cpt && d.geozip === scenario.geozip && d.recordType === scenario.recordType
      );
      if (!benchmark) return;

      const proposedRate = parseFloat(rate.proposedRate);
      totalProposedRevenue += proposedRate;
      totalMedianRevenue += benchmark.p50;
    });

    const revenueLift = totalProposedRevenue - totalMedianRevenue;
    const revenueLiftPercent = totalMedianRevenue > 0 ? ((revenueLift / totalMedianRevenue) * 100).toFixed(1) : 0;

    return { revenueLift, revenueLiftPercent };
  };

  const cloneScenario = () => {
    if (!activeScenario) return;
    
    try {
      const defaultName = `${activeScenario.name} (Copy)`;
      const newName = window.prompt('Enter a name for this version:', defaultName);
      
      // User cancelled
      if (newName === null) return;
      
      // Use default if empty
      const finalName = newName.trim() || defaultName;
      
      const newScenario = {
        ...activeScenario,
        id: nextScenarioId,
        name: finalName,
        rates: activeScenario.rates.map(r => ({ ...r, id: nextRateId + activeScenario.rates.indexOf(r) }))
      };

      setScenarios([...scenarios, newScenario]);
      setNextScenarioId(nextScenarioId + 1);
      setNextRateId(nextRateId + activeScenario.rates.length);
      setActiveScenarioId(newScenario.id);
    } catch (error) {
      console.error('Error cloning scenario:', error);
    }
  };

  const updateScenario = (updates) => {
    setScenarios(scenarios.map(s => s.id === activeScenarioId ? { ...s, ...updates } : s));
  };

  const deleteScenario = () => {
    if (scenarios.length === 1) return;
    setScenarios(scenarios.filter(s => s.id !== activeScenarioId));
    const remainingScenario = scenarios.find(s => s.id !== activeScenarioId);
    setActiveScenarioId(remainingScenario.id);
    if (compareScenarioId === activeScenarioId) {
      setCompareScenarioId(null);
    }
  };

  const addRate = () => {
    if (!activeScenario) return;
    
    const availableCPTs = getAvailableCPTs();
    const unusedCPT = availableCPTs.find(cpt => !activeScenario.rates.some(r => r.cpt === cpt));
    
    if (unusedCPT) {
      updateScenario({
        rates: [...activeScenario.rates, { id: nextRateId, cpt: unusedCPT, proposedRate: '' }]
      });
      setNextRateId(nextRateId + 1);
    }
  };

  const updateRate = (rateId, field, value) => {
    if (!activeScenario) return;
    
    updateScenario({
      rates: activeScenario.rates.map(r => r.id === rateId ? { ...r, [field]: value } : r)
    });
  };

  const removeRate = (rateId) => {
    if (!activeScenario) return;
    
    updateScenario({
      rates: activeScenario.rates.filter(r => r.id !== rateId)
    });
  };

  const resetRates = () => {
    if (confirm('Reset all rates to empty values?')) {
      updateScenario({
        rates: activeScenario.rates.map(r => ({ ...r, proposedRate: '' }))
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!activeScenario) return null;

  const metrics = calculateMetrics(activeScenario);
  const compareMetrics = compareScenario ? calculateMetrics(compareScenario) : null;
  const availableCPTs = getAvailableCPTs();

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Fee Schedule Analyzer</h1>
        <p className="text-slate-600">Compare rates against market benchmarks</p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <select
              value={activeScenarioId}
              onChange={(e) => setActiveScenarioId(parseInt(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-md font-medium focus:ring-2 focus:ring-blue-500"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={cloneScenario}
              className="px-3 py-2 text-sm bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 flex items-center gap-1"
            >
              <Copy size={14} />
              {scenarios.length === 1 ? 'Save' : 'Save this Version'}
            </button>
            <button
              onClick={resetRates}
              className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            {scenarios.length > 1 && (
              <button
                onClick={deleteScenario}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                Delete
              </button>
            )}
          </div>

          {scenarios.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Compare to:</span>
              <select
                value={compareScenarioId || ''}
                onChange={(e) => setCompareScenarioId(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {scenarios.filter(s => s.id !== activeScenarioId).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mr-2">GeoZip:</label>
            <select 
              value={activeScenario.geozip}
              onChange={(e) => updateScenario({ geozip: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              {geozips.map(gz => (
                <option key={gz} value={gz}>{gz}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-slate-500">
            Facility charges (Record Type 30)
          </div>
        </div>
      </div>

      {/* Summary */}
      {activeScenario.rates.some(r => r.proposedRate) && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-100">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-sm text-slate-600 mb-1">Revenue vs. Market</div>
              <div className={`text-4xl font-bold ${metrics.revenueLift >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.revenueLift >= 0 ? '+' : ''}{formatCurrency(metrics.revenueLift)}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {metrics.revenueLift >= 0 ? '+' : ''}{metrics.revenueLiftPercent}% vs. market median
              </div>
              {compareMetrics && (
                <div className="text-xs text-slate-500 mt-2">
                  vs. {compareScenario.name}: {formatCurrency(Math.abs(metrics.revenueLift - compareMetrics.revenueLift))} {metrics.revenueLift > compareMetrics.revenueLift ? 'higher' : 'lower'}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-2">Market Position</div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {activeScenario.rates.filter(r => r.proposedRate).map(rate => {
                    const benchmark = getBenchmark(rate.cpt);
                    const percentileInfo = benchmark && rate.proposedRate 
                      ? getPercentileInfo(parseFloat(rate.proposedRate), benchmark) 
                      : null;
                    
                    if (!percentileInfo) return null;
                    
                    const Icon = percentileInfo.icon;
                    return (
                      <div 
                        key={rate.id} 
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${percentileInfo.color} text-xs font-medium`}
                      >
                        <Icon size={12} />
                        {rate.cpt}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                CPT Code
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Your Rate
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Position
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Market Median
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Delta
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {activeScenario.rates.map((rate) => {
              const benchmark = getBenchmark(rate.cpt);
              const percentileInfo = benchmark && rate.proposedRate 
                ? getPercentileInfo(parseFloat(rate.proposedRate), benchmark) 
                : null;
              const Icon = percentileInfo?.icon;
              const delta = benchmark && rate.proposedRate 
                ? ((parseFloat(rate.proposedRate) - benchmark.p50) / benchmark.p50 * 100).toFixed(1)
                : null;

              return (
                <tr key={rate.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <select
                      value={rate.cpt}
                      onChange={(e) => updateRate(rate.id, 'cpt', e.target.value)}
                      className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      {availableCPTs.map(cpt => (
                        <option key={cpt} value={cpt}>{cpt}</option>
                      ))}
                    </select>
                    <div className="text-xs text-slate-500 mt-1 max-w-xs">
                      {benchmark?.description || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={rate.proposedRate}
                      onChange={(e) => updateRate(rate.id, 'proposedRate', e.target.value)}
                      placeholder="Enter rate"
                      className="w-32 px-3 py-2 border border-slate-300 rounded text-right focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    {percentileInfo && (
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${percentileInfo.color} text-sm font-medium whitespace-nowrap`}>
                        <Icon size={14} />
                        {percentileInfo.level}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-base font-medium text-slate-700">
                    {benchmark ? formatCurrency(benchmark.p50) : '-'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {delta && (
                      <span className={`text-base font-bold ${parseFloat(delta) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(delta) >= 0 ? '+' : ''}{delta}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => removeRate(rate.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={addRate}
            disabled={activeScenario.rates.length >= availableCPTs.length}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Plus size={18} />
            Add CPT Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeScheduleSimulator;