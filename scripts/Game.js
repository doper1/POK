let general_functions = require('./general_functions')
let Player = require('./player')

class Game {
    constructor(id, pot,type) {
        this.id = id;
        this.players = []; // arr player
        this.pot = pot;

        this.deck = general_functions.shuffleArray(
            general_functions.createDeck()
        ); //deck 
        
        this.type = this.type // for oma chap or more
        this.burned = [];
        this.CommunityCards = [];
    }
    getPlayers() { return this.players; }
    setPlayers(newPlayers) { this.players = newPlayers; }
    



    initRound() {
        this.deck = general_functions.shuffleArray(
            general_functions.createDeck()
        ); // new deck 
        for (let i = 0; i < this.players.length; i++)
            players[i].setHoleCards([]);
        

    }

    addPlayer(id, name, phonenumber) {
        let p = new Player(id,name,phonenumber);
        this.players.push(p);
    }

    getlayers() { return this.players; }

  
 }
module.exports = Game;