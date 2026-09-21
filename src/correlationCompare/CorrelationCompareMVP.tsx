import React, { useMemo, useState } from 'react';
import {
  buildCorrelationResult,
  describeCorrelation,
  formatCorrelation,
  joinedRowsToCsv,
  type CorrelationSelection,
  type DiseasePrevalenceRow,
  type JoinedCorrelationRow,
  type SdohRow,
} from './correlationUtils';

export type CorrelationCompareMVPProps = {
  diseaseRows: DiseasePrevalenceRow[];
  sdohRows: SdohRow[];
  selection: CorrelationSelection;
  onSelectLocation?: (row: JoinedCorrelationRow) => void;
};

const colors = {
  low: { low: '#e8eef8', medium: '#bfd3eb', high: '#8bb6dd' },
  medium: { low: '#d8c7e8', medium: '#a78ac8', high: '#7558a8' },
  high: { low: '#ead0d3', medium: '#c57987', high: '#8f2f4b' },
};

const getColor = (row: JoinedCorrelationRow) => colors[row.diseaseBucket][row.sdohBucket];

const downloadCsv = (rows: JoinedCorrelationRow[]) => {
  const csv = joinedRowsToCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'correlation-compare.csv';
  link.click();
  URL.revokeObjectURL(url);
};

const BivariateLegend = () => (
  <div className="cc-legend" aria-label="Bivariate legend">
    <div className="cc-legend-axis">Higher disease prevalence ↑</div>
    {(['high', 'medium', 'low'] as const).map((diseaseBucket) => (
      <div className="cc-legend-row" key={diseaseBucket}>
        {(['low', 'medium', 'high'] as const).map((sdohBucket) => (
          <span
            className="cc-legend-cell"
            key={`${diseaseBucket}-${sdohBucket}`}
            style={{ background: colors[diseaseBucket][sdohBucket] }}
            title={`${diseaseBucket} disease + ${sdohBucket} adverse SDOH`}
          />
        ))}
      </div>
    ))}
    <div className="cc-legend-axis">Adverse SDOH →</div>
  </div>
);

const BivariateMap = ({ rows, onSelectLocation }: Pick<CorrelationCompareMVPProps, 'onSelectLocation'> & { rows: JoinedCorrelationRow[] }) => (
  <section className="cc-panel">
    <div className="cc-panel-header">
      <h3>Bivariate map</h3>
      <BivariateLegend />
    </div>
    <div className="cc-map" role="list" aria-label="Bivariate geography results">
      {rows.map((row) => (
        <button
          className="cc-map-tile"
          key={row.geographyId}
          onClick={() => onSelectLocation?.(row)}
          style={{ background: getColor(row) }}
          title={`${row.geographyName}: ${row.diseaseValue} ${row.diseaseUnit ?? ''}; ${row.sdohValue} ${row.sdohUnit ?? ''}`}
          type="button"
        >
          <strong>{row.geographyName}</strong>
          <span>{row.combinedCategory}</span>
        </button>
      ))}
    </div>
  </section>
);

const Scatterplot = ({ rows, onSelectLocation }: Pick<CorrelationCompareMVPProps, 'onSelectLocation'> & { rows: JoinedCorrelationRow[] }) => {
  const xValues = rows.map((row) => row.sdohValue);
  const yValues = rows.map((row) => row.diseaseValue);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const scale = (value: number, min: number, max: number, size: number) => (
    max === min ? size / 2 : ((value - min) / (max - min)) * size
  );

  return (
    <section className="cc-panel">
      <h3>Scatterplot</h3>
      <svg className="cc-scatter" viewBox="0 0 640 360" role="img" aria-label="Scatterplot of SDOH value and disease prevalence">
        <line x1="56" x2="600" y1="304" y2="304" stroke="#554987" />
        <line x1="56" x2="56" y1="24" y2="304" stroke="#554987" />
        {rows.map((row) => {
          const x = 56 + scale(row.sdohValue, xMin, xMax, 544);
          const y = 304 - scale(row.diseaseValue, yMin, yMax, 280);
          return (
            <circle
              cx={x}
              cy={y}
              fill={getColor(row)}
              key={row.geographyId}
              onClick={() => onSelectLocation?.(row)}
              r="7"
              stroke="#2f275f"
            >
              <title>{`${row.geographyName}: ${row.sdohValue} ${row.sdohUnit ?? ''}, ${row.diseaseValue} ${row.diseaseUnit ?? ''}`}</title>
            </circle>
          );
        })}
        <text x="328" y="344" textAnchor="middle">Selected SDOH measure</text>
        <text x="18" y="164" textAnchor="middle" transform="rotate(-90 18 164)">Disease prevalence</text>
      </svg>
    </section>
  );
};

const RankedTable = ({ rows, onSelectLocation }: Pick<CorrelationCompareMVPProps, 'onSelectLocation'> & { rows: JoinedCorrelationRow[] }) => (
  <section className="cc-panel">
    <h3>Ranked results</h3>
    <table className="cc-table">
      <thead>
        <tr>
          <th>Location</th>
          <th>Disease prevalence</th>
          <th>Disease percentile</th>
          <th>SDOH value</th>
          <th>SDOH percentile</th>
          <th>Combined category</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.geographyId} onClick={() => onSelectLocation?.(row)}>
            <td>{row.geographyName}</td>
            <td>{row.diseaseValue.toLocaleString()} {row.diseaseUnit}</td>
            <td>{row.diseasePercentile.toFixed(1)}</td>
            <td>{row.sdohValue.toLocaleString()} {row.sdohUnit}</td>
            <td>{row.sdohPercentile.toFixed(1)}</td>
            <td>{row.combinedCategory}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export const CorrelationCompareMVP = ({
  diseaseRows,
  sdohRows,
  selection,
  onSelectLocation,
}: CorrelationCompareMVPProps) => {
  const [mode, setMode] = useState<'correlation' | 'sideBySide'>('correlation');
  const result = useMemo(
    () => buildCorrelationResult(diseaseRows, sdohRows, selection),
    [diseaseRows, sdohRows, selection],
  );
  const rankedRows = [...result.rows].sort((a, b) => (
    b.diseasePercentile + b.sdohPercentile - (a.diseasePercentile + a.sdohPercentile)
  ));

  if (mode === 'sideBySide') {
    return (
      <div className="cc-shell">
        <button className="cc-button" onClick={() => setMode('correlation')} type="button">Use correlation analysis</button>
        <div className="cc-side-by-side">
          <section className="cc-panel"><h3>Disease map</h3><p>Existing disease map renders here.</p></section>
          <section className="cc-panel"><h3>SDOH map</h3><p>Existing SDOH map renders here.</p></section>
        </div>
      </div>
    );
  }

  return (
    <div className="cc-shell">
      <div className="cc-toolbar">
        <div>
          <h2>Correlation Compare</h2>
          <p>{describeCorrelation(result.pearson, selection.disease, selection.sdohMeasure)}</p>
        </div>
        <div className="cc-actions">
          <button className="cc-button" onClick={() => setMode('sideBySide')} type="button">Side-by-side fallback</button>
          <button className="cc-button cc-button-primary" onClick={() => downloadCsv(rankedRows)} type="button">Download CSV</button>
        </div>
      </div>

      <section className="cc-summary" aria-label="Correlation summary">
        <div><strong>Pearson r</strong><span>{formatCorrelation(result.pearson)}</span></div>
        <div><strong>Spearman ρ</strong><span>{formatCorrelation(result.spearman)}</span></div>
        <div><strong>Matched places</strong><span>{result.matchedCount}</span></div>
        <div><strong>Years</strong><span>Disease {result.diseaseYear} · SDOH {result.sdohYear}</span></div>
      </section>

      <div className="cc-grid">
        <BivariateMap rows={rankedRows} onSelectLocation={onSelectLocation} />
        <Scatterplot rows={rankedRows} onSelectLocation={onSelectLocation} />
      </div>
      <RankedTable rows={rankedRows} onSelectLocation={onSelectLocation} />
    </div>
  );
};

export default CorrelationCompareMVP;
