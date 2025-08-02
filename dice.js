class DiceController {
  constructor() {
    this.pieceDie = document.getElementById('piece-die');
    this.movementDie = document.getElementById('movement-die');
    this.rollButton = document.getElementById('roll-dice');
    this.isRolling = false;
    this.rollCount = 0;
    this.isLeftArrow = true; // Track current arrow state

    this.pieceMapping = {
      1: 'Rook',
      2: 'Knight',
      3: 'Bishop',
      4: 'Queen',
      5: 'King',
      6: 'Pawn'
    };

    this.movementMapping = {
      1: 'Forward',
      2: 'Right',
      3: 'Backward',
      4: 'Left',
      5: 'Diagonal',
      6: 'Special Move'
    };

    // Check for required DOM elements
    if (!this.pieceDie || !this.movementDie || !this.rollButton) {
      console.error('DiceController: Missing required DOM elements.');
      return;
    }

    this.init();

    // Show initial left arrow when game starts
    this.showLeftArrow();
  }

  init() {
    this.rollButton.addEventListener('click', () => this.rollDice());
    this.pieceDie.addEventListener('click', () => this.rollSingleDie('piece'));
    this.movementDie.addEventListener('click', () => this.rollSingleDie('movement'));
  }

  rollDice() {
    if (this.isRolling) return;

    this.isRolling = true;
    this.rollButton.disabled = true;
    this.rollButton.textContent = 'Rolling...';

    this.pieceDie.classList.add('rolling');
    this.movementDie.classList.add('rolling');

    const rollDuration = 1000;
    const rollInterval = 100;

    const rollAnimation = setInterval(() => {
      this.updateDiceDisplay('piece', Math.floor(Math.random() * 6) + 1);
      this.updateDiceDisplay('movement', Math.floor(Math.random() * 6) + 1);
    }, rollInterval);

    setTimeout(() => {
      clearInterval(rollAnimation);

      const pieceResult = this.rollCount === 0 ? 6 : 2;
      const movementResult = this.rollCount === 0 ? 1 : 6;

      this.updateDiceDisplay('piece', pieceResult);
      this.updateDiceDisplay('movement', movementResult);

      this.pieceDie.classList.remove('rolling');
      this.movementDie.classList.remove('rolling');

      this.updateLabels(pieceResult, movementResult);

      this.isRolling = false;
      this.rollButton.disabled = false;
      this.rollButton.textContent = 'Roll Both Dice';

      this.onDiceRolled(pieceResult, movementResult);

      this.toggleArrow();

    }, rollDuration);
  }

  rollSingleDie(type) {
    if (this.isRolling) return;

    const die = type === 'piece' ? this.pieceDie : this.movementDie;
    die.classList.add('rolling');

    const rollDuration = 500;
    const rollInterval = 50;

    const rollAnimation = setInterval(() => {
      this.updateDiceDisplay(type, Math.floor(Math.random() * 6) + 1);
    }, rollInterval);

    setTimeout(() => {
      clearInterval(rollAnimation);
      const result = Math.floor(Math.random() * 6) + 1;
      this.updateDiceDisplay(type, result);
      die.classList.remove('rolling');

      if (type === 'piece') {
        this.updatePieceLabel(result);
      } else {
        this.updateMovementLabel(result);
      }
    }, rollDuration);
  }

  updateDiceDisplay(type, value) {
    const die = type === 'piece' ? this.pieceDie : this.movementDie;
    const face = die.querySelector('.dice-face');
    face.textContent = value;
  }

  updateLabels(pieceValue, movementValue) {
    this.updatePieceLabel(pieceValue);
    this.updateMovementLabel(movementValue);
  }

  updatePieceLabel(value) {
    const label = this.pieceDie.parentElement.querySelector('.dice-label');
    label.textContent = `Selects: ${this.pieceMapping[value]}`;
  }

  updateMovementLabel(value) {
    const label = this.movementDie.parentElement.querySelector('.dice-label');
    label.textContent = `Direction: ${this.movementMapping[value]}`;
  }

  onDiceRolled(pieceValue, movementValue) {
    console.log(`Dice rolled: Piece=${this.pieceMapping[pieceValue]}, Movement=${this.movementMapping[movementValue]}`);

    // Execute moves based on roll count
    if (this.rollCount === 0) {
      this.moveThirdPawn();
    } else if (this.rollCount === 1) {
      this.moveOppositeKing();
    }

    this.rollCount++;
  }

  moveOppositeKing() {
    // Move king from row 7 col 4 (wk) forward two then left
    if (typeof initialPosition !== "undefined" && initialPosition[7][4] === "wk") {
      initialPosition[7][4] = "";
      initialPosition[5][3] = "wk";
      this.updateVisualBoard();
    }
  }

  showLeftArrow() {
    // Remove any existing arrow
    const existingArrow = document.getElementById('turn-arrow');
    if (existingArrow) {
      existingArrow.remove();
    }

    // Create left turn indicator arrow
    const arrow = document.createElement('div');
    arrow.id = 'turn-arrow';
    arrow.innerHTML = '◀';
    arrow.style.cssText = `
      position: fixed;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 60px;
      color: #f20707;
      z-index: 1000;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      animation: pulse 1.5s infinite;
    `;

    // Add pulse animation only once
    if (!document.getElementById('pulse-keyframes')) {
      const style = document.createElement('style');
      style.id = 'pulse-keyframes';
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 1; transform: translateY(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateY(-50%) scale(1.1); }
          100% { opacity: 1; transform: translateY(-50%) scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(arrow);
  }

  showRightArrow() {
    // Remove any existing arrow
    const existingArrow = document.getElementById('turn-arrow');
    if (existingArrow) {
      existingArrow.remove();
    }

    // Create right turn indicator arrow
    const arrow = document.createElement('div');
    arrow.id = 'turn-arrow';
    arrow.innerHTML = '▶';
    arrow.style.cssText = `
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 60px;
      color: #f20707;
      z-index: 1000;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      animation: pulse 1.5s infinite;
    `;
    document.body.appendChild(arrow);
  }

  toggleArrow() {
    this.isLeftArrow = !this.isLeftArrow;
    if (this.isLeftArrow) {
      this.showLeftArrow();
    } else {
      this.showRightArrow();
    }
  }

  moveThirdPawn() {
    // Update the position array - move third pawn from row 1 col 2 to row 2 col 2
    if (typeof initialPosition !== "undefined" && initialPosition[1][2] === "wp") {
      initialPosition[1][2] = "";
      initialPosition[2][2] = "wp";
      this.updateVisualBoard();
    }
  }

  moveOppositeKing() {
    // Move king from row 7 col 6 (wk) to row 5 col 5
    if (typeof initialPosition !== "undefined" && initialPosition[7][6] === "wk") {
      initialPosition[7][6] = "";
      initialPosition[5][5] = "wk";
      this.updateVisualBoard();
    }
  }


  

  updateVisualBoard() {
    const board = document.getElementById("chessboard");
    if (!board) return;
    board.innerHTML = "";

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.className = "square " + ((row + col) % 2 === 0 ? "white" : "black");

        // Check if there is a piece at this position in the updated initialPosition array
        if (typeof initialPosition !== "undefined") {
          const pieceCode = initialPosition[row][col];
          if (pieceCode !== "") {
            const img = document.createElement("img");
            img.src = pieceImages[pieceCode];
            img.alt = pieceCode;
            img.className = "chess-piece";
            square.appendChild(img);
          }
        }

        board.appendChild(square);
      }
    }
  }

  getCurrentValues() {
    const pieceValue = parseInt(this.pieceDie.querySelector('.dice-face').textContent);
    const movementValue = parseInt(this.movementDie.querySelector('.dice-face').textContent);

    return {
      piece: pieceValue,
      movement: movementValue,
      pieceType: this.pieceMapping[pieceValue],
      movementType: this.movementMapping[movementValue]
    };
  }
}

// Initialize the dice controller when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.diceController = new DiceController();
});

