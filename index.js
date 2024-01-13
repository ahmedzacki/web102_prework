/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");
let count = 0;
// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  // looping over each item in the data

  for (const game of games) {
    // Creating a new div element for the game card
    const gameCard = document.createElement("div");
    // Adding a class to style the game card
    gameCard.classList.add("game-card");

    // Using a template literal to set the inner HTML of the game card
    gameCard.innerHTML = `
      <img src="${game.img}" alt="${game.name}" class="game-img" />
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <p>Pledged: $${game.pledged.toLocaleString()}</p>
      <p>Goal: $${game.goal.toLocaleString()}</p>
      <p>Backers: ${game.backers.toLocaleString()}</p>
    `;

    // Appending the game card to the games-container
    gamesContainer.appendChild(gameCard);
  }
}

// Call the addGamesToPage function with the GAMES_JSON data
addGamesToPage(GAMES_JSON);

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => {
  return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((acc, game) => {
  return acc + game.pledged;
}, 0);

raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;
// set inner HTML using template literal

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

gamesCard.innerHTML = `${GAMES_JSON.length.toLocaleString()}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  const unFundedGames = GAMES_JSON.filter((game) => {
    return game.goal > game.pledged;
  });

  // use the function we previously created to add the unfunded games to the DOM
  addGamesToPage(unFundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  const fundedGames = GAMES_JSON.filter((game) => {
    return game.pledged >= game.goal;
  });

  // use the function we previously created to add unfunded games to the DOM
  addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);

  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button

unfundedBtn.addEventListener("click", () => filterUnfundedOnly());
fundedBtn.addEventListener("click", () => filterFundedOnly());
allBtn.addEventListener("click", () => showAllGames());

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games

const numOfUnfundedGames = GAMES_JSON.reduce((acc, game) => {
  return game.goal > game.pledged ? acc + 1 : acc + 0;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString()} has been raised for ${
  GAMES_JSON.length
} games. Currently, ${numOfUnfundedGames} games remain unfunded. We need your help to fund this amazing games!`;

// create a new DOM element containing the template string and append it to the description container

const gamesInfo = document.createElement("p");
gamesInfo.innerHTML = `${displayStr}`;
descriptionContainer.appendChild(gamesInfo);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...others] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const mostFundedGame = document.createElement("p");
mostFundedGame.innerText = firstGame.name;
firstGameContainer.appendChild(mostFundedGame);

// do the same for the runner up item
const secondMostFundedGame = document.createElement("p");
secondMostFundedGame.innerText = secondGame.name;
secondGameContainer.appendChild(secondMostFundedGame);

// Some Additional Features
/************************************************************************************
 * Here I am adding a search bar that users can use to find games quickly without having to lick the buttons
 */

// This function filters the games based on the input string and returns a list of filtered games
function filteredGames(inputString) {
  // Use the filter method on the GAMES_JSON array to filter games
  const filteredGameList = GAMES_JSON.filter((game) => {
    // Check if the lowercase version of the game name starts with the lowercase input string
    return game.name.toLowerCase().startsWith(inputString);
  });
  // Return the list of filtered games
  return filteredGameList;
}

// Create a new paragraph element to display a message when no matching games are found
const displayNotFoundString = document.createElement("p");
displayNotFoundString.innerText =
  "Sorry, we don't have that game now. Please, check back later :)";

// Not Found Message styles
displayNotFoundString.style.fontFamily = "Arial, sans-serif";
displayNotFoundString.style.fontSize = "16px";
displayNotFoundString.style.color = "#555";
displayNotFoundString.style.backgroundColor = "#f8f8f8";
displayNotFoundString.style.border = "1px solid #ddd";
displayNotFoundString.style.borderRadius = "8px";
displayNotFoundString.style.padding = "15px";
displayNotFoundString.style.margin = "20px 0";
displayNotFoundString.style.textAlign = "center";

// Get the input field with the id "search-input"
const searchField = document.getElementById("searchInput");

// Add an event listener to the input field to respond to input changes
searchField.addEventListener("input", (event) => {
  // Get the lowercase version of the input value so we can find accurate matching
  const inputValue = event.target.value.toLowerCase();

  // Remove all child elements from the gamesContainer
  deleteChildElements(gamesContainer);

  // Check if there are filtered games based on the input
  // If yes, display the filtered games using addGamesToPage
  // If no, display the sorry message
  return filteredGames(inputValue).length > 0
    ? addGamesToPage(filteredGames(inputValue))
    : gamesContainer.appendChild(displayNotFoundString);
});
