/*
* Create a list that holds all of your cards
*/
const deck = $('.deck');
shuffleDeck();

/* Opened cards list */
let toggledCards = [];

/* Number of moves */
let moves = 0;

/* Clock state */
let timeRunning = false;
let timer = 0;

/* Async clock counter */
let clockCounter;

/* Initial number of stars*/
let stars = 3;

/* Matched pair of cards */
let matchedPairs = 0;

/* Let us know when the game was finished */
let isGameOver = false;

/*
* Display the cards on the page
*   [x] shuffle the list of cards using the provided "shuffle" method below
*   [x] loop through each card and create its HTML
*   [x] add each card's HTML to the page
*/
function shuffleDeck() {
    const shuffledCards = shuffle(Array.from($('.deck li')));
    for (card of shuffledCards) {
        deck.append(card);
    }
}

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
*    [x] if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

/* When clicling on modal's replay button */
$('.replay').click(replayGame);

/* When clicking on clock's restart icon */
$('.restart').click(restartGame);

/* When clicking on a deck's card. */
deck.click('.card', function (event) {

    const target = $(event.target);

    if (isClickValid(target)) {
        /* first move, start the clock counter (timer)*/
        if (!timeRunning) {
            timeRunning = true;
            startClock();
        }
        /* toggle the card and add it to toggledCards list */
        toggleCard(target);
        addToggleCard(target);

        /* if we have two opened cards */
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

/**
 * @description Open a card toggling its open and show classes.
 * @param {object} card
 */
function toggleCard(card) {
    card.toggleClass('open show');
}

/**
 * @description Add a card to toggledCards list
 * @param {object} card
 */
function addToggleCard(card) {
    toggledCards.push(card);
}

/**
 * @description get the suit of a card
 * @param {object} card
 * @return {string} card's class
 */
function getSuit(card) {
    return card.children().first().attr('class');
}

/**
 * @description Check if two cards have the same class
 * @param {object} card1
 * @param {object} card2
 */
function checkForMatch(card1, card2) {
    if (getSuit(card1) === getSuit(card2)) {
        card1.toggleClass('match');
        card2.toggleClass('match');
        /* reset toggledCards list */
        toggledCards = [];
        /* increase matchePairs counter */
        matchedPairs++;
    } else {
        /* toggle both cards after a second */
        setTimeout( function () {
            toggleCard(card1);
            toggleCard(card2);
            /* reset toggledCards list */
            toggledCards = [];
        }, 1000);
    }
}

/**
 * @description Check if:
 *  - game is not finished
 *  - target is a card
 *  - target is not open
 *  - there is less than 2 cards in toggledCards list
 *  = the card in is not already in toggledCards list
 * @param {object} target card
 */
function isClickValid(target) {
    return (
        !isGameOver &&
        target.hasClass('card') &&
        !target.hasClass('open') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(target)
    );
}

/**
 * @description Increase moves score
 */
function addMove() {
    moves++;
    $('.moves').text(moves);
}

/**
 * @description Hide a star when reaching breakpoints
 */
function checkScore() {
    const starList = $('.stars li');
    if (moves === 12 ) {
        removeStar();
    } else if (moves === 18) {
        removeStar();
    } else if (moves === 22) {
        removeStar();
    }
}

/**
 * @description Start the clock timer (async counter)
 */
function startClock() {
    clockCounter = setInterval(function () {
        timer++;
        displayTime()
    }, 1000);
}

/**
 * @description Updates clock counter board
 */
function displayTime() {
    $('.clock').text(timer);
}

/**
 * @description Hide a star
 */
function removeStar() {
    stars--;
    $('.stars li').filter(function() {
        return $(this).css('display') === 'inline-block';
    }).first().css('display', 'none');
}

/**
 * @description Stop clock timer (async counter)
 */
function stopClock() {
    clearInterval(clockCounter);
}

/**
 * @description Toggle score board modal
 */
function toggleModal() {
    $('#scoreModal').modal('toggle');
}

/**
 * @description Update values for score board modal
 */
function refreshModalStats() {
    $('#modal__timer').text(timer);
    $('#modal__moves').text(moves);
    $('#modal__stars').text(stars);
}

/**
 * @description Stop the clock and reset the timer counter
 */
function resetTimer() {
    stopClock();
    timeRunning = false;
    timer = 0;
    displayTime()
}

/**
 * @description Reset the moves counter
 */
function resetMoves() {
    moves = 0;
    $('.moves').text(moves);
}

/**
 * @description Reset the stars counter and show all three stars
 */
function resetStars() {
    stars = 3;
    starList = $('.stars li').css('display', 'inline');
}

/**
 * @description Reset all cards to closed position
 */
function resetCards() {
    for (let card of $('.deck li')) {
        card.className = 'card';
    }
}

/**
 * @description Wrapper function to restart the game
 */
function restartGame() {
    matchedPairs = 0;
    isGameOver = false;
    resetStars();
    resetTimer();
    resetMoves();
    resetCards();
    shuffleDeck();
}

/**
 * @description Wrapper function to restart the game from the modal
 */
function replayGame() {
    isGameOver = false;
    restartGame();
    toggleModal();
}

/**
 * @description Wrapper function to show the score board modal
 */
function gameOver() {
    isGameOver = true;
    stopClock()
    refreshModalStats()
    toggleModal();
}
