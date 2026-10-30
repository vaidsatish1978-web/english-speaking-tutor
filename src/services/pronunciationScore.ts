/**
 * Computes pronunciation similarity score between expected sentence and user's spoken transcript.
 */
export function calculatePronunciationScore(
  expected: string,
  spoken: string
): { score: number; feedbackKey: 'excellent' | 'goodJob' | 'keepTrying'; missingWords: string[] } {
  const cleanExp = expected.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
  const cleanSpk = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);

  if (cleanExp.length === 0 || cleanSpk.length === 0) {
    return { score: 0, feedbackKey: 'keepTrying', missingWords: cleanExp };
  }

  // Count word matches
  let matchedCount = 0;
  const missingWords: string[] = [];

  cleanExp.forEach((expWord) => {
    // Check exact or close phonetic match (e.g., Levenshtein <= 1 for short words, <= 2 for long)
    const found = cleanSpk.some((spkWord) => {
      if (spkWord === expWord) return true;
      if (Math.abs(spkWord.length - expWord.length) <= 2) {
        return levenshteinDistance(spkWord, expWord) <= 1;
      }
      return false;
    });

    if (found) {
      matchedCount++;
    } else {
      missingWords.push(expWord);
    }
  });

  const wordScore = (matchedCount / cleanExp.length) * 100;
  
  // Character level similarity
  const fullExp = cleanExp.join(' ');
  const fullSpk = cleanSpk.join(' ');
  const maxLen = Math.max(fullExp.length, fullSpk.length);
  const charDistance = levenshteinDistance(fullExp, fullSpk);
  const charScore = Math.max(0, ((maxLen - charDistance) / maxLen) * 100);

  // Blended score
  const finalScore = Math.round(wordScore * 0.7 + charScore * 0.3);

  let feedbackKey: 'excellent' | 'goodJob' | 'keepTrying' = 'keepTrying';
  if (finalScore >= 80) {
    feedbackKey = 'excellent';
  } else if (finalScore >= 50) {
    feedbackKey = 'goodJob';
  }

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    feedbackKey,
    missingWords
  };
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
