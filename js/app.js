/*
 * Create a list that holds all of your cards
 */
/*const deck = document.querySelector('.deck');*/
const deck = $('.deck').first();

/* Opened Cards */
let toggledCards = [];

/* Number of Moves */
let moves = 0;

/* clock state */
let clockOff = true;
let timer = 0;
let clockCounter;

/* Initial number of stars*/
let stars = 3;

/* Matched pair of cards */
let matchedPairs = 0;

/*
 * Display the cards on the page
 *   [x] shuffle the list of cards using the provided "shuffle" method below
 *   [x] loop through each card and create its HTML
 *   [x] add each card's HTML to the page
 */
function shuffleDeck() {
    const cardsToShuffle = Array.from($('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.append(card);
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
 *    [x] if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


/* set up the event listener for a card. */
deck.click('.card', function (event) {

    const target = $(event.target);

    if (isClickValid(target)) {
        /* first move, start the clock counter (timer)*/
        if (clockOff) {
            clockOff = false;
            startClock();
        }
        toggleCard(target);
        addToggleCard(target);

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

/* When clicling on modal's replay button */
$('.replay').click(replayGame);
/* When clicking on clock's restart icon */
$('.restart').click(restartGame);

/* Open a card toggling its open and show classes. */
function toggleCard(card) {
    card.toggleClass('open show');
}

/* Add a card to toggleCards array */
function addToggleCard(card) {
    toggledCards.push(card);
    console.log(toggleCard);
}

/* Get the "suit" of a card */
function getSuit(card) {
    return card.children().first().attr('class');
}

/* Check for a match */
function checkForMatch(card1, card2) {
    if (getSuit(card1) === getSuit(card2)) {
        card1.toggleClass('match');
        card2.toggleClass('match');
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
        !target.hasClass('match') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(target)
    );
}

function addMove() {
    moves++;
    $('.moves').text(moves);
}

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

function startClock() {
    clockCounter = setInterval(() => {
        timer++;
        displayTime()
    }, 1000);
}

function displayTime() {
    const clock = $('.clock');
    clock.text(timer);
}

function removeStar() {
    stars--;
    $('.stars li').filter(function() {
        return $(this).css('display') === 'inline-block';
     }).first().css('display', 'none');
}
function stopClock() {
    clearInterval(clockCounter);
}

function toggleModal() {
    $('#scoreModal').modal('toggle');
}

function refreshModalStats() {
    $('#modal__timer').text(timer);
    $('#modal__moves').text(moves);
    $('#modal__stars').text(stars);
}

function resetTimer() {
    stopClock();
    clockOff = true;
    timer = 0;
    displayTime()
}

function resetMoves() {
    moves = 0;
    $('.moves').text(moves);
}

function resetStars() {
    stars = 3;
    starList = $('.stars li').css('display', 'inline');
}

function resetCards() {
    for (let card of $('.deck li')) {
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
