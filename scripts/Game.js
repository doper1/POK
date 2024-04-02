let general_functions = require('./general_functions')
let Player = require('./player')

class Game {
    constructor(id, players, pot,type) {
        this.id = id;
        this.players = players; // arr player
        this.pot = pot;

        this.deck = general_functions.shuffleArray(
            general_functions.createDeck()
        ); //deck 
        
        this.type = this.type // for oma chap or more
        this.burned = [];
        this.CommunityCards = [];
    }
    
    



    initRound() {
        this.deck = general_functions.shuffleArray(
            general_functions.createDeck()
        ); // new deck 
        for (let i = 0; i < this.players.length; i++)
            players[i].setHoleCards([]);
        

    }

    addPlayer(id, name, phonenumber) {
        players.push(new Player(id,name,phonenumber));
    }

    getPlayers() { return this.players; }

  
 }
module.exports = Game;