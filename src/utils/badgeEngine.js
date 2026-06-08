export const BADGES = [
  {
    id: 'hundred_helper',
    label: '🏅 Hundred Helper',
    desc: 'Completed Wonder + Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'block_builder',
    label: '🥈 Block Builder',
    desc: 'Completed all 3 Simulate stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'place_value_pro',
    label: '🥇 Place Value Pro',
    desc: 'Scored 80%+ overall in Play phase',
    condition: (s) => {
      const filled = s.worldScores.filter((w) => w !== null);
      if (filled.length < 10) return false;
      const total = filled.reduce((sum, w) => sum + w, 0);
      return total >= 80;
    },
  },
  {
    id: 'perfect_hundred',
    label: '💎 Perfect Hundred',
    desc: 'Scored 10/10 in any single world',
    condition: (s) => s.worldScores.some((w) => w === 10),
  },
  {
    id: 'streak_champ',
    label: '🔥 Streak Champ',
    desc: 'Achieved a streak of 10+ correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'number_explorer',
    label: '🌟 Number Explorer',
    desc: 'Completed all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
];

export function checkBadges(state) {
  const newBadges = [];
  for (const badge of BADGES) {
    if (!state.badges.includes(badge.id) && badge.condition(state)) {
      newBadges.push(badge.id);
    }
  }
  return newBadges;
}
