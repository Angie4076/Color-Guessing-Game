// DOM Elements
const colorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptions = document.querySelector('.color-options');
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreElement = document.querySelector('[data-testid="score"]');
const newGameButton = document.querySelector('[data-testid="newGameButton"]');

// Game State
let score = 0;
let targetColor;

// Predefined Colors
const baseColors = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
  "#FF00FF", "#00FFFF", "#FFA500", "#800080"
];

// Helper Functions

/**
 * Checks if a color is red-based by analyzing its RGB values.
 * @param {string} color - Hex color code.
 * @returns {boolean} - True if the color is red-based.
 */
function isRed(color) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return r > 200 && g < 100 && b < 100;
}

/**
 * Generates 5 shades of red based on a base red color.
 * @param {string} baseRed - Base red color in hex format.
 * @returns {string[]} - Array of 5 red shades.
 */
function generateRedShades(baseRed) {
  const shades = [];
  const [r, g, b] = [
    parseInt(baseRed.slice(1, 3), 16),
    parseInt(baseRed.slice(3, 5), 16),
    parseInt(baseRed.slice(5, 7), 16)
  ];

  // Create variations by adjusting RGB values
  for (let i = 0; i < 5; i++) {
    const newR = Math.max(r - (i * 40), 0);
    const newG = Math.min(g + (i * 20), 255);
    const newB = Math.min(b + (i * 20), 255);
    shades.push(
      `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    );
  }
  return shades;
}

/**
 * Generates color options for the game.
 * If the target color is red, it generates shades of red.
 * Otherwise, it selects distinct colors from the baseColors array.
 * @returns {string[]} - Array of 6 color options.
 */
function generateColorOptions() {
  const options = [];
  targetColor = baseColors[Math.floor(Math.random() * baseColors.length)];
  colorBox.style.backgroundColor = targetColor;

  // Add target color to options
  options.push(targetColor);

  // Generate color options based on target
  if (isRed(targetColor)) {
    // Add 5 red shades
    const redShades = generateRedShades(targetColor);
    options.push(...redShades.filter(shade => shade !== targetColor).slice(0, 5));
  } else {
    // Add 5 distinct colors
    const distinctColors = baseColors
      .filter(color => color !== targetColor)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    options.push(...distinctColors);
  }

  return options.sort(() => Math.random() - 0.5);
}

/**
 * Renders the color options as buttons in the DOM.
 */
function renderColorOptions() {
  colorOptions.innerHTML = '';
  const options = generateColorOptions();

  options.forEach(color => {
    const button = document.createElement('button');
    button.style.backgroundColor = color;
    button.addEventListener('click', () => checkGuess(color));
    colorOptions.appendChild(button);
  });
}

/**
 * Checks if the selected color matches the target color.
 * Updates the game status and score accordingly.
 * @param {string} selectedColor - The color selected by the player.
 */
function checkGuess(selectedColor) {
  if (selectedColor === targetColor) {
    gameStatus.textContent = "Correct!";
    gameStatus.classList.add('correct');
    score++;
    scoreElement.textContent = score;
    setTimeout(() => {
      renderColorOptions();
      gameStatus.textContent = '';
      gameStatus.classList.remove('correct');
    }, 1000);
  } else {
    gameStatus.textContent = "Wrong! Try again.";
    gameStatus.classList.add('wrong');
    setTimeout(() => {
      gameStatus.textContent = '';
      gameStatus.classList.remove('wrong');
    }, 1000);
  }
}

/**
 * Resets the game to its initial state.
 */
function resetGame() {
  score = 0;
  scoreElement.textContent = score;
  gameStatus.textContent = '';
  renderColorOptions();
}

// Event Listeners
newGameButton.addEventListener('click', resetGame);

// Initialize the game
resetGame();