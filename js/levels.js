/**
 * 关卡配置
 */
const LEVELS = [
  {
    id: 1,
    name: '初入宝石',
    rows: 7,
    cols: 7,
    targetScore: 600,
    maxMoves: 20,
    gemTypes: 5,
    bgGradient: ['#1a1a2e', '#16213e'],
    starScores: [600, 900, 1200]
  },
  {
    id: 2,
    name: '宝石学徒',
    rows: 7,
    cols: 7,
    targetScore: 1200,
    maxMoves: 22,
    gemTypes: 5,
    bgGradient: ['#0f3460', '#533483'],
    starScores: [1200, 1800, 2400]
  },
  {
    id: 3,
    name: '宝石猎人',
    rows: 8,
    cols: 8,
    targetScore: 2000,
    maxMoves: 25,
    gemTypes: 6,
    bgGradient: ['#2d1b69', '#11998e'],
    starScores: [2000, 3000, 4000]
  },
  {
    id: 4,
    name: '宝石大师',
    rows: 8,
    cols: 8,
    targetScore: 3200,
    maxMoves: 25,
    gemTypes: 6,
    bgGradient: ['#4a0e0e', '#1a5276'],
    starScores: [3200, 4800, 6400]
  },
  {
    id: 5,
    name: '宝石传奇',
    rows: 9,
    cols: 9,
    targetScore: 4500,
    maxMoves: 28,
    gemTypes: 7,
    bgGradient: ['#0c0c1d', '#614385'],
    starScores: [4500, 6750, 9000]
  },
  {
    id: 6,
    name: '无尽挑战',
    rows: 9,
    cols: 9,
    targetScore: 6000,
    maxMoves: 30,
    gemTypes: 7,
    bgGradient: ['#141e30', '#243b55'],
    starScores: [6000, 9000, 12000]
  }
];

const GEM_CONFIGS = [
  { symbol: '💎', color: '#00d4ff', glow: '#00d4ff', name: '钻石' },
  { symbol: '❤️', color: '#ff4757', glow: '#ff4757', name: '红宝石' },
  { symbol: '💚', color: '#2ed573', glow: '#2ed573', name: '翡翠' },
  { symbol: '⭐', color: '#ffa502', glow: '#ffa502', name: '黄玉' },
  { symbol: '💜', color: '#a55eea', glow: '#a55eea', name: '紫晶' },
  { symbol: '🔵', color: '#3742fa', glow: '#3742fa', name: '蓝宝石' },
  { symbol: '🩷', color: '#ff6b9d', glow: '#ff6b9d', name: '珍珠' }
];
