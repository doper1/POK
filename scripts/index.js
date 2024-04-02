let qrcode = require('qrcode-terminal');
let {Client, LocalAuth} = require('whatsapp-web.js');
let Player = require('./player');
let constants = require('./constants')
let general_functions = require('./general_functions')
let poker_functions = require('./poker_functions');
let Game = require('./Game');
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


// changes
let games = [];
//changes

whatsapp.on('message', async message => {
    let message = await message;
    let chat = await message.getChat();
    let chatName = chat.name || 'Unknown Group';
    let playerName = (await message.getContact()).pushname;
    let playerNumber = (await message.author);

    console.log(`Message received in group: ${ general_functions.reverseString(chatName)}`);

    if (chatName.includes("נבחרתם שבוע הבא") || chatName.includes("סלפי אחד") || chatName.includes("קלף חינם")){
        let user_msg = message.body.toLowerCase();

        // poker usage - learn about the functions
        if (user_msg === "poker usage" || user_msg === "poker help" || user_msg === "poker ?" || user_msg === "poker") {
            message.reply('poker- usage, create, join, show, exit, start, finish, check, raise [amount], fold');
        }
        // poker join (the game)

        if (user_msg === "poker join")
        {
            if (games[chat.id] != null){
                games[chat.id] = new Game(chat.id,null,0,"r")
                games[chat.id].addPlayer(message.author.id,message.getContact().pushname,message.author);
            }
            else if (PlayerName in(games[chat.id].players.id)){
                if (message.author.id === games[chat.id].players.id)
                message.reply('you have already joined!')}
            else{
                games[chat.id].addPlayer(message.author.id,message.getContact().pushname,message.author);
            }
        }

        // poker show (players)
        if (user_msg === "poker show") {
            if(games[chat.id] == null)
                message.reply("There are no players on the table");
            else
                message.reply(games[chat.id].getPlayers());
        }

        // poker exit (the table)
        if (user_msg === "poker exit") {
            for (let i = 0; i < games[chat.id].getPlayers().length; i++) {
            message.reply(games[chat.id].getPlayers()[i].getName() + " money is " + games[chat.id].getPlayers()[i].getMoney());
            }
            games[chat.id] = null;
        }

        // poker start - start the game
        if (user_msg === "poker start"){
            let order = general_functions.shuffleArray(games[chat.id].getPlayers());
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