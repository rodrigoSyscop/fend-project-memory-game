/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector('.deck');

/* Opened Cards */
let toggledCards = [];

/* Number of Moves */
let moves = 0;

/* clock state */
let clockOff = true;
let timer = 0;
let clockCounter;

/* stars */
let stars = 3;

/* matched pair of cards */
let matchedPairs = 0;

/*
 * Display the cards on the page
 *   [x] shuffle the list of cards using the provided "shuffle" method below
 *   [x] loop through each card and create its HTML
 *   [x] add each card's HTML to the page
 */
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}
shuffleDeck();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  [x] display the card's symbol (put this functionality in another function that you call from this one)
 *  [x] add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  [x] if the list already has another card, check to see if the two cards match
 *    [x] if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    [x] if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    [x] increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    [ ] if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


/* set up the event listener for a card. */
deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) {
        /* first move */
        if (clockOff) {
            clockOff = false;
            startClock();
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);

        if (toggledCards.length === 2) {
            checkForMatch(toggledCards[0], toggledCards[1]);
            addMove();
            checkScore();
            if (matchedPairs === 8) {
                gameOver();
            }
        }
    }
});


$('.replay')[0].addEventListener('click', replayGame);
$('.restart')[0].addEventListener('click', restartGame);

/* Open a card toggling its open and show classes. */
function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

/* Add a card to toggleCards array */
function addToggleCard(card) {
    toggledCards.push(card);
    console.log(toggleCard);
}

/* Get the "suit" of a card */
function getSuit(card) {
    return card.firstElementChild.className;
}

/* Check for a match */
function checkForMatch(card1, card2) {
    if (getSuit(card1) === getSuit(card2)) {
        card1.classList.toggle('match');
        card2.classList.toggle('match');
        toggledCards = [];
        matchedPairs++;
    } else {
        setTimeout( () => {
            toggleCard(card1);
            toggleCard(card2);
            toggledCards = [];
        }, 1000);
    }
}

/* Check if:
    - is a card.
    - is not a matched card.
    - opened cards is less than 2
    - is not a opened card
*/
function isClickValid(target) {
    return (
        target.classList.contains('card') &&
        !target.classList.contains('match') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(target)
    );
}

function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function checkScore() {
    const starList = document.querySelectorAll('.stars li');
    if (moves === 18 ) {
        starList[2].style.display = 'none';
        stars--;
    } else if (moves === 25) {
        starList[1].style.display = 'none';
        stars--;
    } else if (moves === 30) {
        starList[0].style.display = 'none';
        stars--;
    }
}


function startClock() {
    clockCounter = setInterval(() => {
        timer++;
        displayTime()
    }, 1000);
}

function displayTime() {
    const clock = document.querySelector('.clock');
    clock.innerHTML = timer;
}

function stopClock() {
    clearInterval(clockCounter);
}

function toggleModal() {
    $('#scoreModal').modal('toggle');
}

function refreshModalStats() {
    const timerStat = $('#modal__timer')[0];
    const movesStat = $('#modal__moves')[0];
    const starsStat = $('#modal__stars')[0];

    timerStat.innerHTML = timer;
    starsStat.innerHTML = stars;
    movesStat.innerHTML = moves;

}

function resetTimer() {
    stopClock();
    clockOff = true;
    timer = 0;
    displayTime()
}

function resetMoves() {
    moves = 0;
    $('.moves')[0].innerHTML = moves;
}

function resetStars() {
    stars = 3;
    starList = $('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

function resetCards() {
    const cards = $('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

function restartGame() {
    resetStars();
    resetTimer();
    resetMoves();
    resetCards();
    matchedPairs = 0;
    shuffleDeck();
}
function replayGame() {
    restartGame();
    toggleModal();
}
function gameOver() {
    stopClock()
    refreshModalStats()
    toggleModal();
}
