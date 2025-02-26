# Match-3 Chess - Code Documentation

This document explains the code structure and functionality of the Match-3 Chess game.

For instructions on how to play the game, please see the [How to Play Guide](howto.md).

Created by [Andrew Wooldridge](https://andreww.xyz)

## File Structure

- `index.html`: The main HTML file that defines the structure of the game page
- `styles.css`: Contains all styling for the game elements
- `game.js`: Contains the game logic and mechanics

## Code Overview

### HTML (index.html)
The HTML file sets up the basic structure of the game with:
- A header containing the game title and score display
- A container for the game board
- A brief instruction section

### CSS (styles.css)
The CSS file defines:
- Color variables using CSS custom properties
- Responsive layout for the game
- Styling for the chess board and cells
- Animations for piece removal and falling
- Media queries for mobile responsiveness

### JavaScript (game.js)
The game logic is encapsulated in the `Match3Chess` class with the following key components:

1. **Board Initialization**
   - Creates an 8x8 grid
   - Randomly places chess pieces
   - Sets up event listeners

2. **Chess Movement Logic**
   - Implements valid move patterns for each chess piece:
     - Pawns: Move one square forward
     - Knights: L-shaped movement
     - Bishops: Diagonal movement
     - Rooks: Horizontal and vertical movement
     - Queens: Combination of bishop and rook movements
     - Kings: One square in any direction

3. **Match Detection**
   - Checks for horizontal, vertical, and diagonal matches of 3 or more identical pieces
   - Removes matched pieces and awards points

4. **Piece Falling Mechanism**
   - Handles gravity effect after matches are removed
   - Fills empty spaces with new random pieces
   - Triggers additional match checks after pieces fall

5. **User Interaction**
   - Handles piece selection
   - Highlights valid moves
   - Processes piece swapping

The game initializes when the page loads and creates a new instance of the Match3Chess class.
