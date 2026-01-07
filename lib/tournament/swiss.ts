export interface Player {
  id: string; // participant_id
  score: number;
}

export interface MatchPair {
  player1: Player;
  player2: Player | null; // null for BYE
}

/**
 * Basic Swiss Pairing Algorithm
 * 1. Sort players by Score (Desc)
 * 2. Pair adjacents
 * 3. Handle odd number of players (Bye)
 * 
 * NOTE: This is a simplified version. A real one handles color balancing and avoiding repeat matchups.
 */
export function generateSwissPairings(participants: Player[]): MatchPair[] {
  // 1. Sort by score
  const sorted = [...participants].sort((a, b) => b.score - a.score);
  
  const pairings: MatchPair[] = [];
  const used = new Set<string>();

  for (let i = 0; i < sorted.length; i++) {
    const p1 = sorted[i];
    if (used.has(p1.id)) continue;
    
    // Find pair
    let p2 = null;
    for (let j = i + 1; j < sorted.length; j++) {
       const candidate = sorted[j];
       if (!used.has(candidate.id)) {
         p2 = candidate;
         break;
       }
    }

    if (p2) {
      pairings.push({ player1: p1, player2: p2 });
      used.add(p1.id);
      used.add(p2.id);
    } else {
      // Bye
      pairings.push({ player1: p1, player2: null });
      used.add(p1.id);
    }
  }

  return pairings;
}
