/**
 * Match3Chess - A game that combines chess piece movements with match-3 mechanics
 */
class Match3Chess {
    /**
     * Initializes a new Match3Chess game
     * Creates the game board, sets up initial state and event listeners
     */
    constructor() {
        this.board = [];
        this.selectedCell = null;
        this.score = 0;
        this.pieces = ['♟️', '♞', '♝', '♜', '♛', '♚'];
        this.boardElement = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.initializeBoard();
    }

    /**
     * Creates the initial 8x8 game board with random chess pieces
     * Sets up the DOM elements and event listeners for each cell
     */
    initializeBoard() {
        // Create 8x8 board
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = `cell ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                cell.dataset.row = row;
                cell.dataset.col = col;

                // Add random piece
                const piece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
                cell.textContent = piece;
                this.board[row][col] = piece;

                cell.addEventListener('click', () => this.handleCellClick(row, col));
                this.boardElement.appendChild(cell);
            }
        }
    }

    /**
     * Handles user clicks on board cells
     * Manages piece selection, movement, and game state updates
     *
     * @param {number} row - The row index of the clicked cell
     * @param {number} col - The column index of the clicked cell
     */
    handleCellClick(row, col) {
        const cell = this.getCellElement(row, col);

        if (this.selectedCell) {
            if (this.isValidMove(this.selectedCell, { row, col })) {
                this.swapPieces(this.selectedCell, { row, col });
                this.clearHighlights();
                this.selectedCell = null;
            } else {
                this.clearHighlights();
                this.selectCell(row, col);
            }
        } else {
            this.selectCell(row, col);
        }
    }

    /**
     * Marks a cell as selected and highlights valid moves
     *
     * @param {number} row - The row index of the cell to select
     * @param {number} col - The column index of the cell to select
     */
    selectCell(row, col) {
        const cell = this.getCellElement(row, col);
        cell.classList.add('selected');
        this.selectedCell = { row, col };
        this.highlightValidMoves(row, col);
    }

    /**
     * Highlights all valid moves for the piece at the specified position
     *
     * @param {number} row - The row index of the piece
     * @param {number} col - The column index of the piece
     */
    highlightValidMoves(row, col) {
        const piece = this.board[row][col];
        const moves = this.getValidMoves(row, col, piece);

        moves.forEach(move => {
            const cell = this.getCellElement(move.row, move.col);
            cell.classList.add('valid-move');
        });
    }

    /**
     * Determines all valid moves for a chess piece based on its type and position
     *
     * @param {number} row - The row index of the piece
     * @param {number} col - The column index of the piece
     * @param {string} piece - The chess piece emoji character
     * @returns {Array<{row: number, col: number}>} Array of valid move positions
     */
    getValidMoves(row, col, piece) {
        const moves = [];

        switch (piece) {
            case '♟️': // Pawn
                if (row > 0) moves.push({ row: row - 1, col });
                break;
            case '♞': // Knight
                const knightMoves = [
                    { row: row - 2, col: col - 1 }, { row: row - 2, col: col + 1 },
                    { row: row - 1, col: col - 2 }, { row: row - 1, col: col + 2 },
                    { row: row + 1, col: col - 2 }, { row: row + 1, col: col + 2 },
                    { row: row + 2, col: col - 1 }, { row: row + 2, col: col + 1 }
                ];
                moves.push(...knightMoves.filter(move => this.isOnBoard(move.row, move.col)));
                break;
            case '♝': // Bishop
                moves.push(...this.getDiagonalMoves(row, col));
                break;
            case '♜': // Rook
                moves.push(...this.getStraightMoves(row, col));
                break;
            case '♛': // Queen
                moves.push(...this.getDiagonalMoves(row, col));
                moves.push(...this.getStraightMoves(row, col));
                break;
            case '♚': // King
                for (let r = -1; r <= 1; r++) {
                    for (let c = -1; c <= 1; c++) {
                        if (r === 0 && c === 0) continue;
                        if (this.isOnBoard(row + r, col + c)) {
                            moves.push({ row: row + r, col: col + c });
                        }
                    }
                }
                break;
        }

        return moves;
    }

    /**
     * Calculates all possible diagonal moves from a position
     * Used for bishop, queen movement patterns
     *
     * @param {number} row - The starting row index
     * @param {number} col - The starting column index
     * @returns {Array<{row: number, col: number}>} Array of valid diagonal move positions
     */
    getDiagonalMoves(row, col) {
        const moves = [];
        const directions = [[-1,-1], [-1,1], [1,-1], [1,1]];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            while (this.isOnBoard(r, c)) {
                moves.push({ row: r, col: c });
                r += dr;
                c += dc;
            }
        }

        return moves;
    }

    /**
     * Calculates all possible straight (horizontal/vertical) moves from a position
     * Used for rook, queen movement patterns
     *
     * @param {number} row - The starting row index
     * @param {number} col - The starting column index
     * @returns {Array<{row: number, col: number}>} Array of valid straight move positions
     */
    getStraightMoves(row, col) {
        const moves = [];
        const directions = [[-1,0], [1,0], [0,-1], [0,1]];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            while (this.isOnBoard(r, c)) {
                moves.push({ row: r, col: c });
                r += dr;
                c += dc;
            }
        }

        return moves;
    }

    /**
     * Checks if a position is within the game board boundaries
     *
     * @param {number} row - The row index to check
     * @param {number} col - The column index to check
     * @returns {boolean} True if the position is on the board, false otherwise
     */
    isOnBoard(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    /**
     * Swaps two pieces on the board and checks for matches
     *
     * @param {Object} from - The source position {row, col}
     * @param {Object} to - The destination position {row, col}
     */
    swapPieces(from, to) {
        // Swap pieces in data structure
        const temp = this.board[from.row][from.col];
        this.board[from.row][from.col] = this.board[to.row][to.col];
        this.board[to.row][to.col] = temp;

        // Swap pieces in DOM
        const fromCell = this.getCellElement(from.row, from.col);
        const toCell = this.getCellElement(to.row, to.col);
        const tempContent = fromCell.textContent;
        fromCell.textContent = toCell.textContent;
        toCell.textContent = tempContent;

        // Check for matches after swap
        setTimeout(() => this.checkMatches(), 300);
    }

    /**
     * Checks the entire board for matches of three or more identical pieces
     * Looks for horizontal, vertical, and diagonal matches
     *
     * @returns {boolean} True if matches were found, false otherwise
     */
    checkMatches() {
        const matches = new Set();

        // Check horizontal matches
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {
                if (this.board[row][col] &&
                    this.board[row][col] === this.board[row][col + 1] &&
                    this.board[row][col] === this.board[row][col + 2]) {
                    matches.add(`${row},${col}`);
                    matches.add(`${row},${col + 1}`);
                    matches.add(`${row},${col + 2}`);
                }
            }
        }

        // Check vertical matches
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] &&
                    this.board[row][col] === this.board[row + 1][col] &&
                    this.board[row][col] === this.board[row + 2][col]) {
                    matches.add(`${row},${col}`);
                    matches.add(`${row + 1},${col}`);
                    matches.add(`${row + 2},${col}`);
                }
            }
        }

        // Check diagonal matches (top-left to bottom-right)
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                if (this.board[row][col] &&
                    this.board[row][col] === this.board[row + 1][col + 1] &&
                    this.board[row][col] === this.board[row + 2][col + 2]) {
                    matches.add(`${row},${col}`);
                    matches.add(`${row + 1},${col + 1}`);
                    matches.add(`${row + 2},${col + 2}`);
                }
            }
        }

        // Check diagonal matches (top-right to bottom-left)
        for (let row = 0; row < 6; row++) {
            for (let col = 2; col < 8; col++) {
                if (this.board[row][col] &&
                    this.board[row][col] === this.board[row + 1][col - 1] &&
                    this.board[row][col] === this.board[row + 2][col - 2]) {
                    matches.add(`${row},${col}`);
                    matches.add(`${row + 1},${col - 1}`);
                    matches.add(`${row + 2},${col - 2}`);
                }
            }
        }

        if (matches.size > 0) {
            this.removeMatches(matches);
            return true;
        }

        return false;
    }

    /**
     * Removes matched pieces from the board and updates the score
     * Triggers the falling animation for pieces above
     *
     * @param {Set<string>} matches - Set of position strings ("row,col") to remove
     */
    removeMatches(matches) {
        // Update score
        this.score += matches.size * 100;
        this.scoreElement.textContent = this.score;

        // Track number of pieces being removed
        let piecesToRemove = matches.size;
        let piecesRemoved = 0;

        // Remove matched pieces
        for (const pos of matches) {
            const [row, col] = pos.split(',').map(Number);
            const cell = this.getCellElement(row, col);
            cell.classList.add('pop');
            this.board[row][col] = null;

            setTimeout(() => {
                cell.textContent = '';
                cell.classList.remove('pop');
                piecesRemoved++;

                // Only proceed with falling pieces after all matches are removed
                if (piecesRemoved === piecesToRemove) {
                    this.handleFalling();
                }
            }, 300);
        }
    }

    /**
     * Handles the falling animation of pieces after matches are removed
     * Fills empty spaces with new random pieces
     */
    handleFalling() {
        let piecesToFall = 0;
        let piecesFallen = 0;

        // First pass: count how many pieces need to fall
        for (let col = 0; col < 8; col++) {
            let emptySpaces = 0;
            for (let row = 7; row >= 0; row--) {
                if (this.board[row][col] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    piecesToFall++;
                }
            }
            piecesToFall += emptySpaces; // Count new pieces that need to be added
        }

        if (piecesToFall === 0) return;

        // Second pass: handle falling pieces
        for (let col = 0; col < 8; col++) {
            let emptySpaces = 0;

            // Start from bottom, count consecutive empty spaces
            for (let row = 7; row >= 0; row--) {
                if (this.board[row][col] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    // Move this piece down by the number of empty spaces
                    this.board[row + emptySpaces][col] = this.board[row][col];
                    this.board[row][col] = null;

                    const targetCell = this.getCellElement(row + emptySpaces, col);
                    const sourceCell = this.getCellElement(row, col);

                    targetCell.textContent = sourceCell.textContent;
                    sourceCell.textContent = '';
                    targetCell.classList.add('fall');

                    setTimeout(() => {
                        targetCell.classList.remove('fall');
                        piecesFallen++;
                        if (piecesFallen === piecesToFall) {
                            this.checkMatches();
                        }
                    }, 500);
                }
            }

            // Fill empty spaces with new pieces
            for (let row = 0; row < 8; row++) {
                if (this.board[row][col] === null) {
                    const newPiece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
                    this.board[row][col] = newPiece;

                    const cell = this.getCellElement(row, col);
                    cell.textContent = newPiece;
                    cell.classList.add('fall');

                    setTimeout(() => {
                        cell.classList.remove('fall');
                        piecesFallen++;
                        if (piecesFallen === piecesToFall) {
                            this.checkMatches();
                        }
                    }, 500);
                }
            }
        }
    }

    /**
     * Gets the DOM element for a cell at the specified position
     *
     * @param {number} row - The row index of the cell
     * @param {number} col - The column index of the cell
     * @returns {HTMLElement} The DOM element for the specified cell
     */
    getCellElement(row, col) {
        return this.boardElement.children[row * 8 + col];
    }

    /**
     * Removes all highlighting from cells on the board
     * Clears 'selected' and 'valid-move' CSS classes
     */
    clearHighlights() {
        const cells = this.boardElement.getElementsByClassName('cell');
        for (const cell of cells) {
            cell.classList.remove('selected', 'valid-move');
        }
    }

    /**
     * Checks if a move from one position to another is valid
     * Based on the chess piece's movement rules
     *
     * @param {Object} from - The source position {row, col}
     * @param {Object} to - The destination position {row, col}
     * @returns {boolean} True if the move is valid, false otherwise
     */
    isValidMove(from, to) {
        const moves = this.getValidMoves(from.row, from.col, this.board[from.row][from.col]);
        return moves.some(move => move.row === to.row && move.col === to.col);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Match3Chess();
});
