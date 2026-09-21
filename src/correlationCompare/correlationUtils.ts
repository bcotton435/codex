export type GeographyLevel = 'state' | 'county';

export type DiseasePrevalenceRow = {
  geographyId: string;
  geographyName: string;
  geographyLevel: GeographyLevel;
  disease: string;
  year: number;
  value: number | null;
  unit?: string;
};

export type SdohRow = {
  geographyId: string;
  geographyName: string;
  geographyLevel: GeographyLevel;
  measure: string;
  year: number;
  value: number | null;
  unit?: string;
  higherIsAdverse?: boolean;
};

export type JoinedCorrelationRow = {
  geographyId: string;
  geographyName: string;
  geographyLevel: GeographyLevel;
  disease: string;
  diseaseYear: number;
  diseaseValue: number;
  diseaseUnit?: string;
  sdohMeasure: string;
  sdohYear: number;
  sdohValue: number;
  sdohUnit?: string;
  diseasePercentile: number;
  sdohPercentile: number;
  diseaseBucket: BivariateBucket;
  sdohBucket: BivariateBucket;
  combinedCategory: string;
};

export type BivariateBucket = 'low' | 'medium' | 'high';

export type CorrelationResult = {
  pearson: number | null;
  spearman: number | null;
  matchedCount: number;
  diseaseYear: number | null;
  sdohYear: number | null;
  rows: JoinedCorrelationRow[];
};

export type CorrelationSelection = {
  geographyLevel: GeographyLevel;
  disease: string;
  diseaseYear: number;
  sdohMeasure: string;
  sdohYear?: number;
};

const rounded = (value: number) => Number(value.toFixed(3));

const bucketFromPercentile = (percentile: number): BivariateBucket => {
  if (percentile < 33.333) return 'low';
  if (percentile < 66.667) return 'medium';
  return 'high';
};

export const formatCorrelation = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return 'Not enough data';
  return value.toFixed(2);
};

export const describeCorrelation = (
  value: number | null,
  disease: string,
  sdohMeasure: string,
) => {
  if (value === null || Number.isNaN(value)) {
    return `Not enough matched geographies to compare ${disease} with ${sdohMeasure}.`;
  }

  const strength = Math.abs(value) >= 0.7
    ? 'strong'
    : Math.abs(value) >= 0.4
      ? 'moderate'
      : Math.abs(value) >= 0.2
        ? 'weak'
        : 'very weak';
  const direction = value > 0 ? 'higher' : 'lower';

  return `${sdohMeasure} is ${strength}ly associated with ${direction} ${disease} prevalence across matched geographies.`;
};

export const chooseSdohYear = (rows: SdohRow[], requestedYear?: number) => {
  const years = [...new Set(rows.map((row) => row.year))].sort((a, b) => a - b);
  if (years.length === 0) return null;
  if (requestedYear === undefined) return years[years.length - 1];
  return years.reduce((closest, year) => (
    Math.abs(year - requestedYear) < Math.abs(closest - requestedYear) ? year : closest
  ), years[0]);
};

const percentileMap = (values: Array<{ id: string; value: number }>) => {
  const sorted = [...values].sort((a, b) => a.value - b.value);
  const denominator = Math.max(sorted.length - 1, 1);

  return new Map(sorted.map((item, index) => [
    item.id,
    sorted.length === 1 ? 100 : (index / denominator) * 100,
  ]));
};

const ranks = (values: number[]) => {
  const sorted = values
    .map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value);
  const result = Array(values.length).fill(0);

  for (let index = 0; index < sorted.length;) {
    let end = index;
    while (end + 1 < sorted.length && sorted[end + 1].value === sorted[index].value) end += 1;
    const averageRank = (index + end + 2) / 2;
    for (let cursor = index; cursor <= end; cursor += 1) {
      result[sorted[cursor].index] = averageRank;
    }
    index = end + 1;
  }

  return result;
};

export const pearsonCorrelation = (xValues: number[], yValues: number[]) => {
  if (xValues.length !== yValues.length || xValues.length < 2) return null;

  const xMean = xValues.reduce((sum, value) => sum + value, 0) / xValues.length;
  const yMean = yValues.reduce((sum, value) => sum + value, 0) / yValues.length;
  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;

  xValues.forEach((xValue, index) => {
    const xOffset = xValue - xMean;
    const yOffset = yValues[index] - yMean;
    numerator += xOffset * yOffset;
    xVariance += xOffset ** 2;
    yVariance += yOffset ** 2;
  });

  const denominator = Math.sqrt(xVariance * yVariance);
  return denominator === 0 ? null : rounded(numerator / denominator);
};

export const spearmanCorrelation = (xValues: number[], yValues: number[]) => {
  if (xValues.length !== yValues.length || xValues.length < 2) return null;
  return pearsonCorrelation(ranks(xValues), ranks(yValues));
};

export const buildCorrelationResult = (
  diseaseRows: DiseasePrevalenceRow[],
  sdohRows: SdohRow[],
  selection: CorrelationSelection,
): CorrelationResult => {
  const diseaseMatches = diseaseRows.filter((row) => (
    row.geographyLevel === selection.geographyLevel
    && row.disease === selection.disease
    && row.year === selection.diseaseYear
    && typeof row.value === 'number'
  ));
  const sdohCandidates = sdohRows.filter((row) => (
    row.geographyLevel === selection.geographyLevel
    && row.measure === selection.sdohMeasure
    && typeof row.value === 'number'
  ));
  const sdohYear = chooseSdohYear(sdohCandidates, selection.sdohYear ?? selection.diseaseYear);
  const sdohMatches = sdohCandidates.filter((row) => row.year === sdohYear);
  const sdohByGeography = new Map(sdohMatches.map((row) => [row.geographyId, row]));

  const baseRows = diseaseMatches
    .map((diseaseRow) => ({ diseaseRow, sdohRow: sdohByGeography.get(diseaseRow.geographyId) }))
    .filter((row): row is { diseaseRow: DiseasePrevalenceRow; sdohRow: SdohRow } => Boolean(row.sdohRow));

  const diseasePercentiles = percentileMap(baseRows.map(({ diseaseRow }) => ({
    id: diseaseRow.geographyId,
    value: diseaseRow.value as number,
  })));
  const higherIsAdverse = baseRows[0]?.sdohRow.higherIsAdverse ?? true;
  const sdohPercentiles = percentileMap(baseRows.map(({ sdohRow }) => ({
    id: sdohRow.geographyId,
    value: higherIsAdverse ? sdohRow.value as number : -(sdohRow.value as number),
  })));

  const rows = baseRows.map(({ diseaseRow, sdohRow }) => {
    const diseasePercentile = diseasePercentiles.get(diseaseRow.geographyId) ?? 0;
    const sdohPercentile = sdohPercentiles.get(sdohRow.geographyId) ?? 0;
    const diseaseBucket = bucketFromPercentile(diseasePercentile);
    const sdohBucket = bucketFromPercentile(sdohPercentile);

    return {
      geographyId: diseaseRow.geographyId,
      geographyName: diseaseRow.geographyName,
      geographyLevel: diseaseRow.geographyLevel,
      disease: diseaseRow.disease,
      diseaseYear: diseaseRow.year,
      diseaseValue: diseaseRow.value as number,
      diseaseUnit: diseaseRow.unit,
      sdohMeasure: sdohRow.measure,
      sdohYear: sdohRow.year,
      sdohValue: sdohRow.value as number,
      sdohUnit: sdohRow.unit,
      diseasePercentile: rounded(diseasePercentile),
      sdohPercentile: rounded(sdohPercentile),
      diseaseBucket,
      sdohBucket,
      combinedCategory: `${diseaseBucket} disease + ${sdohBucket} adverse SDOH`,
    };
  });

  const xValues = rows.map((row) => row.sdohValue);
  const yValues = rows.map((row) => row.diseaseValue);

  return {
    pearson: pearsonCorrelation(xValues, yValues),
    spearman: spearmanCorrelation(xValues, yValues),
    matchedCount: rows.length,
    diseaseYear: selection.diseaseYear,
    sdohYear,
    rows,
  };
};

export const joinedRowsToCsv = (rows: JoinedCorrelationRow[]) => {
  const headers = [
    'Location',
    'Geography ID',
    'Disease',
    'Disease Year',
    'Disease Value',
    'Disease Percentile',
    'SDOH Measure',
    'SDOH Year',
    'SDOH Value',
    'SDOH Percentile',
    'Combined Category',
  ];
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const body = rows.map((row) => [
    row.geographyName,
    row.geographyId,
    row.disease,
    row.diseaseYear,
    row.diseaseValue,
    row.diseasePercentile,
    row.sdohMeasure,
    row.sdohYear,
    row.sdohValue,
    row.sdohPercentile,
    row.combinedCategory,
  ].map(escape).join(','));

  return [headers.map(escape).join(','), ...body].join('\n');
};
