let qrcode = require('qrcode-terminal');
let {Client, LocalAuth} = require('whatsapp-web.js');
let player = require('./player');
let constants = require('./constants')
let general_functions = require('./general_functions')
let poker_functions = require('./poker_functions');
//const Player = require('player');


let whatsapp = new Client({
    authStrategy:new LocalAuth()
})

whatsapp.on('qr', qr=> {
    qrcode.generate(qr,{
        small:true
    })
})
  
// Variables
let pot = 0;
let players = []

whatsapp.on('message', async message => {
    let chat = await message.getChat();
    let chatName = chat.name || 'Unknown Group';
    let playerName = (await message.getContact()).pushname;
    let playerNumber = (await message.author);

    console.log(`Message received in group: ${ general_functions.reverseString(chatName)}`);

    if (chatName.includes("נבחרתם שבוע הבא") || chatName.includes("סלפי אחד") || chatName.includes("קלף חינם")){
        let user_msg = message.body.toLowerCase();

        // poker usage - learn about the functions
        if (user_msg === "poker usage" || user_msg === "poker help" || user_msg === "poker ?" || user_msg === "poker") {
            message.reply('poker- usage, join, show, exit, start, finish, check, raise [amount], fold');
        }
        
        // poker join (the game)
        if (user_msg === "poker join") {

            if (!(playerName in players)) {
                const player = new Player(playerName, playerNumber)
                players.push(player);
                message.reply(`${player.getName()} joined the Table`);

            } else {
                message.reply(`${playerName} already joined the Table`);
            }
        }

        // poker show (players)
        if (user_msg === "poker show") {
            message.reply(`Players: ${Object.keys(players).join(', ')}`);
        }

        // poker exit (the table)
        if (user_msg === "poker exit") {
    
            if (players.hasOwnProperty(player.getName())) { // Switch it a a Loop on all the player names
                delete players[playerName];
                message.reply(`${playerName} left the Table`);
            } else {
                message.reply(`${playerName} is not on the Table`);
            }
        }

        // poker start - start the game
        if (user_msg === "poker start"){
            let order = general_functions.shuffleArray(players);
            let deck = general_functions.createDeck();
            deck = general_functions.shuffleArray(deck);
            console.log(`Order: ${order}\nDeck: ${deck}`)
            //message.sendMessage() // shuffleArray(deck);
            //message.reply(`Playing Order:\n${players.map((item, index) => `${index + 1}. ${item}`).join(' ')}`);
            //message.reply(`1. ${deck.pop()}\n2. ${deck.pop()}\n3. ${deck.pop()}\n`)
            //message.sendMessage("TEST MESSAGE")
        }
    }
})
whatsapp.on('ready',() => {
    console.log("Client is ready!")
})

whatsapp.initialize()