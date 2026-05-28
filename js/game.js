/**
 * Match3 消消乐 - 游戏引擎
 */
class Match3Engine {
  constructor() {
    this.board = [];
    this.rows = 0;
    this.cols = 0;
    this.gemTypes = 0;
    this.score = 0;
    this.moves = 0;
    this.maxMoves = 0;
    this.targetScore = 0;
    this.combo = 0;
    this.isAnimating = false;
    this.selectedGem = null;
    this.onScoreUpdate = null;
    this.onMovesUpdate = null;
    this.onGemRemove = null;
    this.onGemMove = null;
    this.onGemCreate = null;
    this.onGameOver = null;
    this.onCombo = null;
  }

  init(level) {
    this.rows = level.rows;
    this.cols = level.cols;
    this.gemTypes = level.gemTypes;
    this.maxMoves = level.maxMoves;
    this.targetScore = level.targetScore;
    this.score = 0;
    this.moves = 0;
    this.combo = 0;
    this.selectedGem = null;
    this.isAnimating = false;
    this.board = [];
    for (let r = 0; r < this.rows; r++) {
      this.board[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.board[r][c] = this._randomTypeNoMatch(r, c);
      }
    }
    let matches = this.findMatches();
    let safety = 0;
    while (matches.length > 0 && safety < 100) {
      for (const {r, c} of matches) {
        this.board[r][c] = this._randomTypeNoMatch(r, c);
      }
      matches = this.findMatches();
      safety++;
    }
  }
  _randomTypeNoMatch(row, col) {
    const forbidden = new Set();
    if (col >= 2 && this.board[row][col-1] === this.board[row][col-2]) {
      forbidden.add(this.board[row][col-1]);
    }
    if (row >= 2 && this.board[row-1] && this.board[row-2] &&
        this.board[row-1][col] === this.board[row-2][col]) {
      forbidden.add(this.board[row-1][col]);
    }
    const candidates = [];
    for (let i = 0; i < this.gemTypes; i++) {
      if (!forbidden.has(i)) candidates.push(i);
    }
    if (candidates.length === 0) {
      for (let i = 0; i < this.gemTypes; i++) candidates.push(i);
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  findMatches() {
    const matched = new Set();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 2; c++) {
        if (this.board[r][c] !== -1 &&
            this.board[r][c] === this.board[r][c+1] &&
            this.board[r][c] === this.board[r][c+2]) {
          matched.add(r + "," + c);
          matched.add(r + "," + (c+1));
          matched.add(r + "," + (c+2));
        }
      }
    }
    for (let r = 0; r < this.rows - 2; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c] !== -1 &&
            this.board[r][c] === this.board[r+1][c] &&
            this.board[r][c] === this.board[r+2][c]) {
          matched.add(r + "," + c);
          matched.add((r+1) + "," + c);
          matched.add((r+2) + "," + c);
        }
      }
    }
    return [...matched].map(s => {
      const parts = s.split(",");
      return {r: parseInt(parts[0]), c: parseInt(parts[1])};
    });
  }

  isAdjacent(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }
  async trySwap(r1, c1, r2, c2) {
    if (this.isAnimating) return false;
    if (!this.isAdjacent(r1, c1, r2, c2)) return false;
    if (this.moves >= this.maxMoves) return false;

    this.isAnimating = true;

    // Swap in data
    const temp = this.board[r1][c1];
    this.board[r1][c1] = this.board[r2][c2];
    this.board[r2][c2] = temp;

    // Animate swap
    if (this.onGemMove) {
      await Promise.all([
        this.onGemMove(r1, c1, r2, c2),
        this.onGemMove(r2, c2, r1, c1)
      ]);
    }

    // Check for matches
    let matches = this.findMatches();
    if (matches.length === 0) {
      // Swap back - no match
      const temp2 = this.board[r1][c1];
      this.board[r1][c1] = this.board[r2][c2];
      this.board[r2][c2] = temp2;
      if (this.onGemMove) {
        await Promise.all([
          this.onGemMove(r1, c1, r2, c2),
          this.onGemMove(r2, c2, r1, c1)
        ]);
      }
      this.isAnimating = false;
      return false;
    }

    // Valid move
    this.moves++;
    if (this.onMovesUpdate) this.onMovesUpdate(this.moves, this.maxMoves);
    this.combo = 0;

    // Process chain reactions
    await this._processMatches();

    this.isAnimating = false;

    // Check game over
    if (this.score >= this.targetScore) {
      if (this.onGameOver) this.onGameOver(true);
    } else if (this.moves >= this.maxMoves) {
      if (this.onGameOver) this.onGameOver(false);
    }

    return true;
  }
  async _processMatches() {
    let matches = this.findMatches();
    while (matches.length > 0) {
      this.combo++;
      const matchScore = matches.length * 10 * this.combo;
      this.score += matchScore;
      if (this.onScoreUpdate) this.onScoreUpdate(this.score, matchScore, this.combo);
      if (this.combo > 1 && this.onCombo) this.onCombo(this.combo);

      // Remove matched gems
      if (this.onGemRemove) await this.onGemRemove(matches, this.combo);
      for (const {r, c} of matches) {
        this.board[r][c] = -1;
      }

      // Drop gems down
      const moves = this._dropGems();
      if (this.onGemMove) {
        await Promise.all(moves.map(m => this.onGemMove(m.fromR, m.fromC, m.toR, m.toC)));
      }

      // Fill empty spots from top
      const creates = this._fillEmpty();
      if (this.onGemCreate) {
        await Promise.all(creates.map(c => this.onGemCreate(c.r, c.c, c.type, c.fromR)));
      }

      matches = this.findMatches();
    }
  }
  _dropGems() {
    const moves = [];
    for (let c = 0; c < this.cols; c++) {
      let writeRow = this.rows - 1;
      for (let r = this.rows - 1; r >= 0; r--) {
        if (this.board[r][c] !== -1) {
          if (r !== writeRow) {
            this.board[writeRow][c] = this.board[r][c];
            this.board[r][c] = -1;
            moves.push({fromR: r, fromC: c, toR: writeRow, toC: c});
          }
          writeRow--;
        }
      }
    }
    return moves;
  }

  _fillEmpty() {
    const creates = [];
    for (let c = 0; c < this.cols; c++) {
      let emptyCount = 0;
      for (let r = this.rows - 1; r >= 0; r--) {
        if (this.board[r][c] === -1) emptyCount++;
      }
      for (let r = 0; r < this.rows; r++) {
        if (this.board[r][c] === -1) {
          const type = Math.floor(Math.random() * this.gemTypes);
          this.board[r][c] = type;
          creates.push({r, c, type, fromR: -(emptyCount - r)});
        }
      }
    }
    return creates;
  }

  hasValidMoves() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        // Try swap right
        if (c < this.cols - 1) {
          this._swapData(r, c, r, c+1);
          if (this.findMatches().length > 0) {
            this._swapData(r, c, r, c+1);
            return true;
          }
          this._swapData(r, c, r, c+1);
        }
        // Try swap down
        if (r < this.rows - 1) {
          this._swapData(r, c, r+1, c);
          if (this.findMatches().length > 0) {
            this._swapData(r, c, r+1, c);
            return true;
          }
          this._swapData(r, c, r+1, c);
        }
      }
    }
    return false;
  }

  _swapData(r1, c1, r2, c2) {
    const temp = this.board[r1][c1];
    this.board[r1][c1] = this.board[r2][c2];
    this.board[r2][c2] = temp;
  }
}