
let gridBox;

function gameBoard() {
    let gridArray = ["", "", "", "", "", "", "", "", ""];

    function resetBoard() {

        gridArray = ["", "", "", "", "", "", "", "", ""];
        const grid = gridDisplay.querySelectorAll("[data-id]")
        for (let box of grid) {
            box.textContent = '';
            box.classList.remove("blue");
            box.classList.remove("red");
        }


    }
    function isFull() {
        let isFull = true;
        for (let i = 0; i < 9; i++) {
            if (playingField.getValue[i] === "") {
                isFull = false;
                break;
            }
        }
        return isFull;
    }
    function getValue(index) {
        return gridArray[index];
    }
    function setValue(index, value) {
        gridArray[index] = value;
    }
    function isOccupied(tileNumber) {
        if (gridArray[tileNumber] === "X" || gridArray[tileNumber] === 'O') {
            console.log("occupied")
            return true;
        }
    }

    return {
        getValue,
        resetBoard,
        setValue, isFull, isOccupied

    }
}

function gameController(playingField, PlayerX, PlayerO) {

    const winArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    let TurnX = true;
    let isGameOver = false;
    let currentPlayer;

    function winCheck() {
        //win
        for (const subArray of winArray) {
            const isWinX = subArray.every(index => playingField.getValue(index) === 'X')
            if (isWinX) {

                isGameOver = true;
                return `Player ${PlayerX.name} won`;
            }
            const isWinO = subArray.every(index => playingField.getValue(index) === 'O')
            if (isWinO) {

                isGameOver = true;
                return `Player ${PlayerO.name} won`;;
            }

        }

        // tie since alrady check for win, now if all are full ,it will be tie
        let isTie = true;
        for (let i = 0; i < 9; i++) {
            if (playingField.getValue(i) === "") {
                isTie = false;
                break;
            }
        }
        //return isTie

        if (isTie) {

            isGameOver = true;
            return `it is a Tie`;;
        }


    }
    function GameOver() {
        return isGameOver;
    }

    function turnCheck(clickedTileNumber) {

        if (TurnX) {
            playingField.setValue(clickedTileNumber, PlayerX.gridSign);
            currentPlayer = PlayerX;

            TurnX = false;
        }
        else {
            playingField.setValue(clickedTileNumber, PlayerO.gridSign);

            currentPlayer = PlayerO;
            TurnX = true;

        }
        return currentPlayer;
    }
    function reset() {
        TurnX = true;
        isGameOver = false;
    }
    function isOccupiedCheck(tileNumber) {
        return playingField.isOccupied(tileNumber);
    }
    function isReset() {
        playingField.resetBoard();
    }
    return {
        winCheck, GameOver, turnCheck, reset, isOccupiedCheck, isReset
    }
}

function DisplayController(gameEngine) {
    const resetBtn = document.querySelector("#reset");

    const gridDisplay = document.querySelector("#gridDisplay")
    const statusBox = document.querySelector("#status");
    function generateBoard() {
        for (let i = 0; i < 9; i++) {

            let gridBox = document.createElement("div");
            gridBox.setAttribute("data-id", i);
            gridDisplay.append(gridBox);

        }
    }
    function updateTile(clickedTile, currentPlayer) {
        clickedTile.textContent = currentPlayer.gridSign;
        if (currentPlayer.gridSign === "X")
            clickedTile.classList.add("blue");
        else
            clickedTile.classList.add("red");

    }

    function EventManager() {
        gridDisplay.addEventListener("click", (e) => {
            const clickedTileNumber = e.target.getAttribute("data-id");
            const clickedTile = e.target;
            if (gameEngine.GameOver()) {
                statusBox.textContent = `Game Over`;
                return;
            }

            if (clickedTileNumber === null) {
                statusBox.textContent = `Invalid Tile Number`;
                return;
            }
            if (gameEngine.isOccupiedCheck(clickedTileNumber)) {
                statusBox.textContent = `Tile Occupied`;
            }
            else {
                const currentPlayer = gameEngine.turnCheck(clickedTileNumber); //current playter onject returned
                updateTile(clickedTile, currentPlayer);

                const text = gameEngine.winCheck();
                statusBox.textContent = text;
            }


        })
    }
    function resetFunction() {
        resetBtn.addEventListener("click", () => {
            gameEngine.isReset();
            gameEngine.reset();

            player1.style.display = "block";
            player2.style.display = "block";
            statusBox.textContent = "";
            count = 0;


        });
    }
    generateBoard();
    EventManager();
    resetFunction();
    return {
        generateBoard, updateTile, EventManager, resetFunction
    }
}


function Player(sign, Name) {
    let gridSign = sign;
    const name = Name;

    return { gridSign, name }
}


const playerBox = document.querySelector("#playerBox");
const player1 = document.querySelector("#player1");
const player1Text = document.querySelector("#text1");
const player2Text = document.querySelector("#text2");
const player2 = document.querySelector("#player2");
let PlayerX = Player("X", "");
let PlayerO = Player("O", "");
let count = 0;

player1.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        PlayerX.name = player1Text.value;

        player1.style.display = "none";
        count++;

    }
})
player2.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {

        PlayerO.name = player2Text.value;
        player2.style.display = "none";
        count++;

        if (count === 2) {
            const Display = DisplayController(gameEngine);
        }

    }
})




const playingField = gameBoard();
const gameEngine = gameController(playingField, PlayerX, PlayerO);







