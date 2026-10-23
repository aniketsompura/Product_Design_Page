/**
 * The story is one master timeline. These are the start times (in timeline seconds) of each
 * chapter. Scroll distance is proportional to timeline length, so a longer chapter = more scroll.
 */
export const T = {
  spark: 0,
  brainstorm: 10,
  wireframe: 24.5,
  hifi: 34,
  build: 44,
  impact: 54,
  end: 65,
} as const;

export type ChapterId = 'spark' | 'brainstorm' | 'wireframe' | 'hifi' | 'build' | 'impact';

export const CHAPTERS: { id: ChapterId; label: string }[] = [
  { id: 'spark', label: '01 Spark' },
  { id: 'brainstorm', label: '02 Brainstorm' },
  { id: 'wireframe', label: '03 Wireframe' },
  { id: 'hifi', label: '04 High fidelity' },
  { id: 'build', label: '05 Build' },
  { id: 'impact', label: '06 In people’s hands' },
];
