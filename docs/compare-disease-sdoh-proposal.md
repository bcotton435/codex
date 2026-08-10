# Compare Disease Prevalence with Social Determinants of Health

## Problem

The current Compare experience places disease prevalence and Social Determinants of Health (SDOH) maps side by side. This helps users visually inspect two distributions, but it does not calculate whether the selected disease and SDOH measure move together across states or counties. Users have to infer correlation manually, which is slow, inaccessible, and easy to misread because each map uses an independent color scale.

## Recommended solution: Correlation Compare view

Add a new Compare mode that keeps both filter groups on one screen but produces a joined analytical result from the two selected datasets. Instead of asking users to visually compare two maps, the screen should answer: **“Where do the disease measure and SDOH measure overlap, and how strong is the relationship?”**

### Screen structure

1. **Left filter column: Health outcome**
   - Topic: Disease Prevalence
   - Geography: State or County
   - Disease
   - Year

2. **Right filter column: Social determinant**
   - Topic: Social Determinants of Health
   - Same geography level as the health outcome, or clearly flag when the datasets cannot be joined
   - SDOH measure
   - Year, defaulting to the closest available SDOH year when exact year matching is unavailable

3. **Center results area**
   - Correlation summary card
   - Bivariate map
   - Scatterplot with regression line
   - Ranked location table

## Primary outputs

### 1. Correlation summary card

Show a compact result above the visualizations:

- **Pearson correlation (r)** for linear association
- **Spearman correlation (ρ)** for ranked association
- **Number of matched geographies (n)**
- **Year pairing**, for example: `Disease: 2025 · SDOH: 2023`
- Plain-language interpretation, such as: `Higher median household income is moderately associated with lower diabetes prevalence across states.`

Use cautious language. The card should say “associated with,” not “causes.”

### 2. Bivariate choropleth map

Replace the two independent maps with a single map that encodes both variables together:

- Disease prevalence percentile: low, medium, high
- SDOH percentile: low, medium, high
- 3×3 color legend showing all combinations

This immediately identifies places such as:

- High disease + low income
- High disease + high poverty
- Low disease + high access
- Outlier combinations worth further investigation

For accessibility, each map tooltip should include the raw values, percentile buckets, and the combined category label.

### 3. Scatterplot

Add a scatterplot beside or below the map:

- X-axis: selected SDOH measure
- Y-axis: selected disease prevalence
- Each point: state or county
- Optional labels for selected or outlier geographies
- Regression line with confidence band if statistically appropriate

Clicking a point should select the same location on the map and table. Clicking a geography on the map should highlight the point in the scatterplot.

### 4. Ranked comparison table

Add a table with one row per matched geography:

| Location | Disease prevalence | Disease percentile | SDOH value | SDOH percentile | Combined category |
| --- | ---: | ---: | ---: | ---: | --- |

Default sort should prioritize the most actionable overlap, for example `High disease + adverse SDOH`. Include CSV download for the joined result so researchers can continue analysis outside the application.

## Data joining approach

1. Normalize both datasets to a common geography key:
   - State: FIPS state code
   - County: FIPS county code

2. Match records by:
   - geography key
   - selected disease
   - selected disease year
   - selected SDOH measure
   - selected SDOH year or nearest available SDOH year

3. Exclude rows where either value is missing from correlation calculations, but show unmatched geographies in the map/table with a clear unavailable state.

4. Calculate percentiles independently for each selected variable within the matched geography set.

5. Reverse the SDOH direction where needed so “adverse SDOH” is consistent. For example:
   - Higher poverty = more adverse
   - Lower median household income = more adverse
   - Lower insurance coverage = more adverse

## Interaction details

- Add a Compare method toggle:
  - `Side-by-side maps`
  - `Correlation analysis` recommended default
- Lock geography level between panels once correlation mode is selected.
- Warn users when selected years differ: `Exact SDOH data is unavailable for 2025; using 2023 SDOH estimates.`
- Add a `Top overlaps` chip group: `High disease + adverse SDOH`, `High disease + favorable SDOH`, `Low disease + adverse SDOH`, `Outliers`.
- Preserve the existing side-by-side map as an exploratory fallback, but make the analytical view the primary Compare workflow.

## Minimum viable implementation

1. Add a joined data endpoint or client selector that returns matched disease and SDOH rows by geography.
2. Compute Pearson, Spearman, percentiles, and bivariate categories in a shared utility.
3. Render a summary card, bivariate map layer, scatterplot, and joined table on the Compare screen.
4. Add CSV export for the joined result.

## Why this improves the UX

This approach turns Compare from a visual inspection task into an analytical workflow. Users can still see geography, but they also get numerical evidence, outlier detection, ranked overlap, and a downloadable joined dataset on the same screen.
