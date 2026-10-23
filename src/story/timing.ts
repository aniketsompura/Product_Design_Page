/**
 * The story is one master timeline. These are the start times (in timeline seconds) of each
 * chapter. Scroll distance is proportional to timeline length, so a longer chapter = more scroll.
 */
export const T = {
  spark: 0,
  brainstorm: 10,
  synthesize: 24.5,
  prototype: 35,
  build: 46.5,
  impact: 57,
  end: 69,
} as const;

export type ChapterId = 'spark' | 'brainstorm' | 'synthesize' | 'prototype' | 'build' | 'impact';

export const CHAPTERS: { id: ChapterId; label: string }[] = [
  { id: 'spark', label: '01 Spark' },
  { id: 'brainstorm', label: '02 Brainstorm' },
  { id: 'synthesize', label: '03 Synthesize with AI' },
  { id: 'prototype', label: '04 Prototype with AI' },
  { id: 'build', label: '05 Build' },
  { id: 'impact', label: '06 In people’s hands' },
];
