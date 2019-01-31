// A lot of the ideas I had for this part was from a video on youtube.com https://www.youtube.com/watch?v=pTHCwUdGFkc 
// My code starts out declaring two constants. The first is for the elements that I will render later, I could have used JSX instead but there would
//  have been more configuring on the user’s part. the next constant is an array of all the winning combos that I will use later to 
//  check for a winner and to make smart A.I. moves.
"use strict";


const e = React.createElement;
const winningCombos = [[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[6, 4, 2]
];

// This is where I declare my class Game and set the state.  The first three properties help determine which view to render. The next three deal with the settings,
//  what difficulty level, 2 player or play against the pc, and what character to play as. The next three help keep up with who’s turn it is. 
// Then the next three are for the score and then finally the last one calls a function that creates a blank board by using an array with empty strings.

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameStarted: false,
            help: false,
            settings: false,
            difficulty: 3,
            playPC: true,
            playerOne: 'X',
            pcPlayer: 'O',
            playerTwo: 'O',
            currentTurn: 'X',
            xScore: 0,
            oScore: 0,
            ties: 0,
            board: this.getNewBoard()
        };
    }


    getNewBoard() {
        return [
            "", "", "", "", "", "", "", "", ""
        ]
    }

    // This function searches through the winning combos array and uses the board array saved in the state to determine if there are three matching 
    // characters aligned on the board according to the indexes in the winning combos array. If there are, then the variable “ans” is changed to the matching 
    // character and if there are none then the variable remains as an empty string.

    checkForWinner() {
        var board = this.state.board
        var ans = ''
        winningCombos.find((combo) => {
            if (board[combo[0]] === board[combo[1]] &&
                board[combo[1]] === board[combo[2]] && board[combo[0]] !== '') {
                ans = board[combo[0]]
            }
        })

        // If the variable is still an empty string, then the function cycles through the board to see if there are any empty 
        // strings left to determine if the game has ended in a tie.
        if (ans === '') {
            var count = 0
            board.forEach(element => {
                if (element !== '') {
                    count++
                }
                if (count >= 9) {

                    ans = 'tie'
                }
            })
        }

        // Here it determines what answer to return based off the value in “ans” and according to if this is a two-player game or one player.
        if (this.state.playPC) {
            if (this.state.playerOne === ans) {
                
                return 'You Won'
            } else if (this.state.pcPlayer === ans) {
                
                return 'Oh No You Lost'
            } else if (ans === 'tie') {
                return 'Its A Tie'
            } else {
                return ''
            }
        } else if (ans === 'X') {
            
            return 'X Wins'
        } else if (ans === 'O') {
            
            return 'O Wins'
        } else if (ans === 'tie') {
            return "Its A Tie"
        } else {
            return ''
        }
    }

    // This function clears the board and resets the current turn to X, because as stated in the Game rules, X always goes first. 
    restart() {

        this.setState({
            currentTurn: 'X',
            board: this.getNewBoard()
        })
    }

    // This function clears the board and resets the necessary state properties to end the game and return to the home screen.
    endGame() {
        this.setState({
            currentTurn: 'X',
            board: this.getNewBoard(),
            gameStarted: false,
            xScore: 0,
            oScore: 0,
            ties: 0
        })

    }

    // This function updates the state of the board and the current turn. 
    updateboard() {

        this.setState({
            board: this.state.board,
            currentTurn: this.state.currentTurn === this.state.playerOne ? this.state.playerTwo : this.state.playerOne,
        })

    }

    // This function is called when the player clicks on a square on the board and it take the index of that 
    // square as the parameter and sets the character that is presently stored in the current turn property and then 
    // calls a function to update the state of the board.
    handleClick(index) {

        this.state.board[index] = this.state.currentTurn
        this.updateboard()


    }

    // This is the function for deciding the computer’s move. It also has several functions that are called 
    // according to the level of difficulty.
    pcMove() {
        var board = this.state.board
        var move = 0;

        // This function cycles through the winning combos and finds any matching two of the character passed through the parameter "player"
        function smartMove(player) {
            winningCombos.find((combo) => {
                combo.forEach(element => {
                    if (board[element] === "" && ((board[combo[0]] === player && board[combo[1]] === player) ||
                        (board[combo[1]] === player && board[combo[2]] === player) || (board[combo[0]] === player && board[combo[2]] === player))) {
                        if (board[combo[0]] === board[combo[1]] || board[combo[1]] ===
                            board[combo[2]] || board[combo[0]] === board[combo[2]]) {
                            move = element
                        }
                    }
                })

            })
        }

        // This is to make a move no matter what. It loops through until it finds an empty string on the board by generating a 
        // random number under 9 and then checking it.
        function dumbMove() {
            var bool = true;
            
                while (bool) {
                    move = Math.floor(Math.random(0) * 9)
                    if (board[move] === '') {
                        bool = false;
                    }
                }
            
        }

        // The first moves are the most critical. So, depending on the difficulty, this function chooses the best first moves.
        function firstMoves(playerOne, difficulty) {
            function checkCorners() {
                // all variables are declared here for this function
                var i = 0,
                    bool = true,
                    insideOne = 0,
                    insideTwo = 0,
                    corners = [0, 2, 6, 8], // this is an array of the corner positions on the board
                    inside = [1, 3, 5, 7], // this is an array of the inside positions on the board

                    //this is a function to determine if the opponent’s character is at any of these inside positions.
                    isInside = (i) => {
                        switch (i) {
                            case board[1]:
                                return 1
                                break;
                            case board[3]:
                                return 3
                                break;
                            case board[5]:
                                return 5
                                break;
                            case board[7]:
                                return 7
                                break;
                            default:
                                return 0
                                break;
                        }

                    };

                 // this is a loop to determine if opponent has two inside moves
                inside.forEach(element => {
                    if (board[element] === playerOne) {
                        if (insideOne === 0) {
                            insideOne = element
                        } else if (insideTwo === 0) {
                            insideTwo = element
                        }
                    }

                })

                // if there are two inside moves by the player, then they are added together and subtracted by four. 
                // For example: if 1 and 3 are occupied by the opponent, then they are added and subtracted by 4 to give 0. 
                // If board[0] is empty then the pc move is 0 to block the opponent
                if (insideOne !== 0 && insideTwo !== 0) {
                    var insideCombo = (insideOne + insideTwo) - 4;
                    corners.forEach(element => {
                        if (element === insideCombo) {
                            if (board[element] === '')
                                move = element
                        }
                    })
                }

                // this loop checks for corner combinations by the opponent. It just loops through twice giving the variable “i” the value 0 and then 1.
                while (i < 2) {
                    var x = (i + 2) * 3,
                        bottomCorners = (x > 8) ? 8 : x; // if the expression is greater than 8, then it is set to 8

                    //this condition determines if the opponent occupies a corner and an inside. The first time around the loop it looks at corners 0 and 6. 
                    // Then the second time it looks at 2 and 8. If one of the corners and an inside is taken by the opponent then the pc moves to either the 0 or 8 
                    // position based on where the inside move from the opponent is.
                    if (board[i * 2] === playerOne || board[bottomCorners] === playerOne) {
                        if (isInside(playerOne) > 0) {
                            if (isInside(playerOne) < 4 && board[0] === '') {
                                move = 0
                            }
                            else if (board[8] === '') {
                                move = 8
                            }
                        }
                    }

                    // also, this loop checks if the opponent has two corner moves that are diagonal from each other. The first round checks the combinations 0 and 8.
                    //  The second round checks the combination 2 and 6. If there are a matching combination then it loops through to find a random inside move that is empty. 
                    if (board[i * 2] === board[8 - (i * 2)]) {
                        if (board[i * 2] === playerOne) {
                            while (bool) {
                                move = Math.floor(Math.random(0) * 9)
                                if ((board[move] === '') && ((move % 2) === 1)) {
                                    bool = false;
                                }
                            }
                        }
                    }
                    i++;
                }
            }

            // This function always chooses the middle if it is open and then a corner move if it is not.
            function centerMove() {
                if (board[4] === '') {
                    move = 4
                } else if (board[4] === playerOne) {
                    if (board[0] === '') {
                        move = 0
                    } else if (board[2] === '') {
                        move = 2
                    }
                }
            }

            // centerMove is called first and if the difficulty level is at the highest then the checkCorners function is called as well.
            centerMove();
            if (difficulty > 2) {
                checkCorners();
            }


        }

        // This is the call to the dumbMove function no matter what and the rest have conditions depending on the level of difficulty.
        dumbMove();
        if (this.state.difficulty > 1) {
            firstMoves(this.state.playerOne, this.state.difficulty);
        }

        // It is worth mentioning here that the playerOne character is passed first so that 
        // if there are two matching playerOne characters and two matching pcPlayer characters, 
        // then pcPlayer character will be the last one saved to the variable.
        if (this.state.difficulty > 0) {
            smartMove(this.state.playerOne);
            smartMove(this.state.pcPlayer);
        }

        // Lastly, the state of the board is updated with the pcPlayer character with whatever index was saved last in the move variable.
        this.state.board[move] = this.state.pcPlayer
        this.updateboard();
    }

    // This checks for a winner and displays the popup message with the winner.
    check() {
        var check = this.checkForWinner()
        if(check !== ''){
                var el = document.querySelector('body');
                var el2 = document.getElementById('winner');
                el.classList.add('dialogIsOpen');
                    el2.innerText = check; 
                    el2.classList.add('winner')
                setTimeout(function(){
                    el.classList.remove('dialogIsOpen')
                    el2.innerText = '';
                    
                }, 2000)
                
            }

    }

    // This updates and returns the scores. It uses a switch based on whatever is returned from checkWinner().
    score() {
        switch (this.checkForWinner()){
            case 'Its A Tie':
            if(this.state.pcPlayer === 'X'){
                this.state.ties += .5
            }else{
                this.state.ties += 1
            }
            break;
            case 'You Won':
            this.state.xScore += 1
            break;
            case 'X Wins':
            this.state.xScore += 1
            break;
            case 'Oh No You Lost':
            this.state.oScore += .5
            break;
            case 'O Wins':
            this.state.oScore +=1
            break;
            default:
            break;
        }

        // These conditions return two different strings based on the mode of the game.
        if (this.state.playPC) {
            return e(
                'div',
                null,
                e(
                    'h2',
                    null,
                    `YOU ${this.state.xScore} \u2002 A.I. ${this.state.oScore} \u2002 TIE ${this.state.ties}`
                )
            )
        }else{
            return e(
                'div',
                null,
                e(
                    'h2',
                    null,
                    `X:${this.state.xScore} \u2002 O:${this.state.oScore} \u2002 Tie:${this.state.ties}`
                )
            )
        }

    }

    // This function handles the settings rendered portion. When it is called it is passed a value to help choose which element was clicked. It puts all three selections in 
    // settings in an array and loops through them toggling their display attribute and if it is not the selected one then it is toggled to “none” so that is not displayed.
    displaySettings(select) {
        var a = document.getElementById("mode"),
            b = document.getElementById("character"),
            c = document.getElementById("difficulty"),
            settingsMenu = [a, b, c],
            element = settingsMenu[select]
        settingsMenu.forEach(e => {
            if (e === element) {
                if (element.style.display === "none") {
                    element.style.display = "block";
                } else {
                    element.style.display = "none";
                }
            } else {
                e.style.display = 'none';
            }
        })




    }

    // This is the rendered section. It has four parts and the first three are only rendered if the correlated button on the home screen is pressed setting the state 
    // of the correlated property to true. They always have an exit button that returns the property to false rendering the home screen that is the last part of the render function.
    render() {

        // If the help property in the state object is true, then it renders the help information.
        if (this.state.help) {
            return e(
                'div',
                null,
                e(
                    'h1',
                    null,
                    'Game Rules'
                ),
                e(
                    'ul',
                    null,
                    e(
                        'li',
                        null,
                        'The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner.'
                    ),
                    e(
                        'li',
                        null,
                        'X always goes first. '
                    ),
                    e(
                        'li',
                        null,
                        'When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a tie.'
                    )
                ),
                e(
                    'h1',
                    null,
                    'Directions'
                ),
                e(
                    'h3',
                    null,
                    'How to Play'
                ),
                e(
                    'ul',
                    null,
                    e(
                        'li',
                        null,
                        'To start a game click on the "Play" button on the home screen. Note: The default dificulty is set to Hardest (see Settings to change this). '
                    ),
                    e(
                        'li',
                        null,
                        'To make a move click on one of the squares on the board. At anytime you can click on the "New Game" button to reset the game or to start a new game after there is a winner or tie.'
                    ),
                    e(
                        'li',
                        null,
                        'To go back to the home screen click on the "End Game" button. Note: All scores will be reset when this button is clicked.'
                    )
                ),
                e(
                    'h3',
                    null,
                    'Settings'
                ),
                e(
                    'ul',
                    null,
                    e(
                        'li',
                        null,
                        'To change any settings click on the "Settings" button on the home screen.'
                    ),
                    e(
                        'li',
                        null,
                        'Select "Mode" to choose between a two player mode where you and someone else can play against each other, or vs computer to play angainst the computer.'
                    ),
                    e(
                        'li',
                        null,
                        'Select "Character" to choose what what character you want to play as, either X or O. '
                    ),
                    e(
                        'li',
                        null,
                        'Select "Difficulty" to choose between four levels of difficulty.'
                    )
                ),
                e(
                    'h3',
                    null,
                    'Issues'
                ),
                e(
                    'ul',
                    null,
                    e(
                        'li',
                        null,
                        'If you are experiencing any issues try using a different browser and ensuring that your browser is up to date.'
                    ),
                    e(
                        'li',
                        null,
                        'Google Chrome is the preferred browser for this app'
                    ),
                    e(
                        'li',
                        null,
                        'IE is not currently supported by his app.'
                    )
                ),

                // This is the exit button that returns the help property back to false and does not render this 
                // portion any longer because the condition is not met so it is skipped.
                e(
                    'button',
                    {
                        className: " restart", onClick: () => {
                            this.setState({ help: false })
                        }
                    },
                    'Back'
                )
            )
        }

        // Next, is the settings portion. If the help portion is not rendered, then it comes here next.
        if (this.state.settings) {
            return e(
                "div",
                null,
                e(
                    "h1",
                    {
                        className: "settings", onClick: () => {
                            this.displaySettings(0); //here is where it calls the function to toggle its content.
                        }
                    },
                    "Mode"
                ),
                e(
                    "form",
                    {
                        id: 'mode', style: { display: 'none' }, onChange: () => {

                            // if one of the radio buttons are clicked then it changes between two player and one player
                            if (this.state.playPC === true) {
                                this.setState({ playPC: false })
                            } else {
                                this.setState({ playPC: true })
                            }
                        }
                    },
                    e(
                        'div',
                        { className: 'settingsDiv' },
                        e("input", { type: "radio", checked: !(this.state.playPC) }),//if playPC is false, this is checked
                        e(
                            "label",
                            null,
                            ' 2 Player'
                        ),
                        e("br", null),
                        e("input", { type: "radio", checked: this.state.playPC }), //if playPC is true, this is checked
                        e(
                            "label",
                            null,
                            ' Vs Computer'
                        ),
                        e("br", null)
                    )

                ),
                e(
                    "h1",
                    {
                        className: "settings", onClick: () => {
                            this.displaySettings(1);
                        }
                    },
                    "Character"
                ),
                e(
                    "form",
                    { 
                        // This part has the same concept of the first settings selection. 
                        // On any changes it sets the characters of the players based on what 
                        // the current character of playerOne.
                        id: 'character', style: { display: 'none' }, onChange: () => {
                            if (this.state.playerOne === 'X') {
                                this.setState({ playerOne: 'O' })
                                this.setState({
                                    pcPlayer: this.state.playerOne === 'X' ? 'X' : 'O',
                                    playerTwo: this.state.playerOne === 'X' ? 'X' : 'O'
                                })

                            } else {
                                this.setState({ playerOne: 'X' })
                                this.setState({
                                    pcPlayer: this.state.playerOne === 'X' ? 'X' : 'O',
                                    playerTwo: this.state.playerOne === 'X' ? 'X' : 'O'
                                })
                            }
                        }
                    },
                    e("input", { type: "radio", checked: (this.state.playerOne === 'X') }),
                    e(
                        "label",
                        null,
                        ' X'
                    ),
                    e("br", null),
                    e("input", { type: "radio", checked: (this.state.playerOne === 'O') }),
                    e(
                        "label",
                        null,
                        ' O'
                    ),
                    e("br", null)
                ),
                e(
                    "h1",
                    {
                        className: "settings", onClick: () => {
                            this.displaySettings(2);
                        }
                    },
                    "Difficulty"
                ),
                e(
                    "form",
                    {
                        // This part also has the same concept. On any changes it sets the difficulty by looping through 
                        // the inputs found in the third form tag in the document and then changes the state of the difficulty 
                        // property based off the value assigned to the input that is checked.
                        id: 'difficulty', style: { display: 'none' },
                        onChange: () => {
                            var difficult = document.forms[2];
                            var i;
                            for (i = 0; i < difficult.length; i++) {
                                if (difficult[i].checked) {
                                    this.state.difficulty = difficult[i].value
                                    this.setState({
                                        difficulty: this.state.difficulty
                                    })
                                }
                            }
                        }
                    },
                    e(
                        'div',
                        null,
                        e("input", { type: "radio", name: "difficulty", value: 0, checked: (this.state.difficulty == 0) }),
                        e(
                            "label",
                            null,
                            '  Very Easy'
                        ),
                        e("br", null),
                        e("input", { type: "radio", name: "difficulty", value: 1, checked: (this.state.difficulty == 1) }),
                        e(
                            "label",
                            null,
                            ' Easy'
                        ),
                        e("br", null),
                        e("input", { type: "radio", name: "difficulty", value: 2, checked: (this.state.difficulty == 2) }),
                        e(
                            "label",
                            null,
                            ' Hard'
                        ),
                        e("br", null),
                        e("input", { type: "radio", name: "difficulty", value: 3, checked: (this.state.difficulty == 3) }),
                        e(
                            "label",
                            null,
                            ' Hardest'
                        ),
                        e("br", null)
                    ),

                ),
                e(
                    'button',
                    { className: " restart", onClick: () => this.setState({ settings: false }) },
                    'Back'
                )
            );
        }

        // This is to render the board and start the game. The first thing it does is 
        // determines if the player is playing the pc and then if it is the pc’s turn and if there are no winners. 
        // If all conditions are met then the pc makes a move.
        if (this.state.gameStarted) {
            if (this.state.playPC) {
                if (this.state.pcPlayer === this.state.currentTurn) {
                    if (this.checkForWinner() === '') {
                        this.pcMove()
                    }

                }
            }

            // This part displays the winner message if there is one.
            return e(
                'div',
                null,
                e(
                    'div',
                    null,
                    this.check(),
                    
                ),

                // These are the two buttons that either creates a fresh board or ends the game and returns to the home screen. 
                e(
                    'button',
                    { className: " restart", onClick: () => this.restart() },
                    'New Game'
                ),
                e(
                    'button',
                    { className: " restart", onClick: () => this.endGame() },
                    'End Game'
                ),

                // This is the part that creates the board based off what is in the board property. 
                // When a div is clicked it calls the function that changes that div to whatever the current character is. 
                e(
                    "div",
                    { className: "board" },

                    // This maps an element to each value in the board array and based off the value of the current index of the board 
                    // array it chooses what color to give it, whether or not there is already a winner and should display unclickable squares, 
                    // or if it is blank and can be clicked.
                    this.state.board.map((cell, index) => {
                        if (this.state.board[index] !== "") {
                            if (this.state.board[index] === "X") {
                                return e(
                                    "div",
                                    { style: { color: "red" }, className: "square" },
                                    cell
                                );
                            } else {
                                return e(
                                    "div",
                                    { style: { color: "blue" }, className: "square" },
                                    cell
                                );
                            }
                        } else if (this.checkForWinner() !== '') {

                            //if there is a winner then the rest of the squares are rendered without the onClick() function even if they are empty
                            return e(
                                "div",
                                { className: "square" },
                                cell
                            );
                        } else {

                            //if the code makes it this far then nobody has one and the square is empty and can be clicked on
                            return e(
                                "div",
                                { className: "square empty", onClick: () => this.handleClick(index) },
                                cell
                            );
                        }

                    }),
                ),

                // This part displays the score.
                e(
                    'div',
                    {className: 'score'},
                    this.score()
                ),
            );


        }

        // These are the three buttons on the home screen. 
        return e(
            'div',
            null,
            e(
                'button',
                {
                    className: "menu", onClick: () => {
                        this.setState({ gameStarted: true })//if this one is selected then the game part is rendered
                    }
                },
                'Play'
            ),
            e(
                'button',
                { className: "menu", onClick: () => this.setState({ settings: true }) },//if this one is selected then the settings part is rendered
                'Settings'
            ),
            e(
                'button',
                { className: "menu", onClick: () => this.setState({ help: true }) },//if this one is selected then the help part is rendered
                'Help'
            )
        )
    }
}


// This part chooses where the code will be render within the html document.
const domContainer = document.querySelector('#game');
ReactDOM.render(e(Game), domContainer);
