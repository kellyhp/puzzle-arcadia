const wordList = [
    {
        word: "ballet",
        hint: "A classical dance form characterized by precise and graceful movements."
    },
    {
        word: "astronaut",
        hint: "A person trained to travel and work in space."
    },
    {
        word: "technology",
        hint: "The application of scientific knowledge for practical purposes."
    },
    {
        word: "rainbow",
        hint: "A meteorological phenomenon that is caused by reflection, refraction, and dispersion of light."
    },
    {
        word: "universe",
        hint: "All existing matter, space, and time as a whole."
    },
    {
        word: "piano",
        hint: "A musical instrument played by pressing keys that cause hammers to strike strings."
    },
    {
        word: "vacation",
        hint: "A period of time devoted to pleasure, rest, or relaxation."
    },
    {
        word: "rainforest",
        hint: "A dense forest characterized by high rainfall and biodiversity."
    },
    {
        word: "theater",
        hint: "A building or outdoor area in which plays, movies, or other performances are staged."
    },
    {
        word: "telephone",
        hint: "A device used to transmit sound over long distances."
    },
    {
        word: "language",
        hint: "A system of communication consisting of words, gestures, and syntax."
    },
    {
        word: "desert",
        hint: "A barren or arid land with little or no precipitation."
    },
    {
        word: "sunflower",
        hint: "A tall plant with a large yellow flower head."
    },
    {
        word: "fantasy",
        hint: "A genre of imaginative fiction involving magic and supernatural elements."
    },
    {
        word: "telescope",
        hint: "An optical instrument used to view distant objects in space."
    },
    {
        word: "oasis",
        hint: "A fertile spot in a desert where water is found."
    },
    {
        word: "photography",
        hint: "The art, process, or practice of creating images by recording light or other electromagnetic radiation."
    },
    {
        word: "safari",
        hint: "An expedition or journey, typically to observe wildlife in their natural habitat."
    },
    {
        word: "planet",
        hint: "A celestial body that orbits a star and does not produce light of its own."
    },
    {
        word: "enigma",
        hint: "Something that is mysterious, puzzling, or difficult to understand."
    },
    {
        word: "paradox",
        hint: "A statement or situation that contradicts itself or defies intuition."
    },
    {
        word: "puzzle",
        hint: "A game, toy, or problem designed to test ingenuity or knowledge."
    },
    {
        word: "whisper",
        hint: "To speak very softly or quietly, often in a secretive manner."
    },
    {
        word: "shadow",
        hint: "A dark area or shape produced by an object blocking the light."
    },
    {
        word: "curiosity",
        hint: "A strong desire to know or learn something."
    },
    {
        word: "unpredictable",
        hint: "Not able to be foreseen or known beforehand; uncertain."
    },
    {
        word: "unveil",
        hint: "To make known or reveal something previously secret or unknown."
    },
    {
        word: "illusion",
        hint: "A false perception or belief; a deceptive appearance or impression."
    },
    {
        word: "moonlight",
        hint: "The light from the moon."
    },
    {
        word: "nostalgia",
        hint: "A sentimental longing or wistful affection for the past."
    },
];

const hangmanImg = document.querySelector(".hangman-container img");
const keyboardDiv = document.querySelector(".keyboard");
const wordDisplay = document.querySelector(".word-display");
const guessesDisplay = document.querySelector(".num-incorrect");
const gameModal = document.querySelector(".modal");
const playAgainBtn = document.querySelector(".play-again");
const resetGameBtn = document.querySelector(".reset-game");

let currentWord, wrongGuessCount = 0;
let correctLetters = [];
const maxGuesses = 6;

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImg.src = `images/icons-svg/hangman-${wrongGuessCount}.svg`;
    guessesDisplay.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.textContent = '';
    const characters = currentWord.split("");
    const fragment = document.createDocumentFragment();
    characters.forEach(() => {
        const listItem = document.createElement("li");
        listItem.classList.add("letter");
        fragment.appendChild(listItem);
    });
    wordDisplay.appendChild(fragment);
    gameModal.classList.remove("appear");
}

const handleKeyboardInput = (event) => {
    const pressedKey = event.key.toLowerCase();
    const alphabetRegex = /^[a-zA-Z]$/;
    if (alphabetRegex.test(pressedKey)) {
        const pressedButton = keyboardDiv.querySelector(`button[data-letter="${pressedKey}"]`);
        if (pressedButton && !pressedButton.disabled) {
            initGame(pressedButton, pressedKey);
        }
    }
};

document.addEventListener('keypress', handleKeyboardInput);

document.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        getRandomWord();
    }
});

for (let i = 97; i <=122; i++) {
    const button = document.createElement("button");
    const letter = String.fromCharCode(i);
    button.innerText = letter;
    button.dataset.letter = letter;
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, letter));
}

const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint .hint-text").innerText = hint;
    resetGame();
}

const initGame = (button, clickedLetter) => {
    if(currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    } else {
        wrongGuessCount++;
        hangmanImg.src = `images/icons-svg/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true;
    guessesDisplay.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if(wrongGuessCount === maxGuesses) {
        return gameOver(false);
    }
    if(correctLetters.length === currentWord.length) {
        return gameOver(true);
    }
}

const gameOver = (isDone) => {
    setTimeout(() => {
        const modalText = isDone ? `You found the word: ` : `The correct word was: `;
        gameModal.querySelector("h4").innerText = `${isDone ? 'Congrats!' : 'Game Over!'}`;
        const paragraph = gameModal.querySelector("p");
        const textNode = document.createTextNode(modalText);
        const span = document.createElement("span");
        span.classList.add("correct-answer");
        const wordNode = document.createTextNode(currentWord);
        span.appendChild(wordNode);
        paragraph.textContent = '';
        paragraph.appendChild(textNode);
        paragraph.appendChild(span);
        gameModal.classList.add("appear");
    }, 300)
}

getRandomWord();

playAgainBtn.addEventListener("click", getRandomWord);
resetGameBtn.addEventListener("click", getRandomWord);