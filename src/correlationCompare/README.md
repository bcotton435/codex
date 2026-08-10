# Correlation Compare MVP

This module implements the MVP described in `docs/compare-disease-sdoh-proposal.md` as a portable React component and reusable TypeScript utilities.

## Use

```tsx
import { CorrelationCompareMVP } from './src/correlationCompare';
import './src/correlationCompare/correlationCompare.css';

<CorrelationCompareMVP
  diseaseRows={diseaseRows}
  sdohRows={sdohRows}
  selection={{
    geographyLevel: 'state',
    disease: 'Diabetes',
    diseaseYear: 2025,
    sdohMeasure: 'Median Household Income',
  }}
/>
```

## Expected data shape

Both datasets need a shared `geographyId`, such as a state or county FIPS code. The component joins rows by that key, selected geography level, selected disease, selected disease year, selected SDOH measure, and the nearest available SDOH year.

## Included outputs

- Correlation summary card with Pearson `r`, Spearman `ρ`, matched geography count, and year pairing.
- Bivariate map-style geography tiles using the same 3-by-3 disease/adverse-SDOH buckets described in the proposal.
- Scatterplot linking SDOH value on the x-axis to disease prevalence on the y-axis.
- Ranked results table sorted toward high disease plus adverse SDOH overlap.
- CSV export for the joined analytical result.
- Side-by-side fallback placeholder so the existing maps can be retained when this module is integrated into the real Atlas app.
