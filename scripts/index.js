let qrcode = require('qrcode-terminal');
let {Client, LocalAuth} = require('whatsapp-web.js');
let Player = require('./player');
let constants = require('./constants')
let general_functions = require('./general_functions')
let poker_functions = require('./poker_functions');
let Game = require('./Game');

let whatsapp = new Client({
    authStrategy:new LocalAuth()
})

whatsapp.on('qr', qr=> {
    qrcode.generate(qr,{
        small:true
    })
})
  

let games = {};
whatsapp.on('message', async msg => {
    let message = await msg;
    let chat = await message.getChat();
    let contact = await message.getContact();
    let chat_id = chat.id._serialized.replace(/\D/g, '');
    
    if (chat.name.includes("נבחרתם שבוע הבא") || chat.name.includes("טסטים פוקר") || chat.name.includes("קלף חינם")){
        let user_msg = message.body.toLowerCase();

        // poker usage - learn about the functions
        if (user_msg === "poker usage" || user_msg === "poker help") {
            message.reply('poker- usage, create, join, show, exit, start, finish, check, raise [amount], fold');
        }
        if (user_msg === "poker check"){
            let player = new Player(playerName, playerNumber);
            player.setHoleCards(['5','Diamond'],['Your','Mother'])
            whatsapp.sendMessage(player.getPhoneNumber(),`Hole cards: ${player.getHoleCards()}`);
        }

        // poker join (the game)
        if (user_msg === "poker join") 
        {
            if (!(chat_id in games)){
                games[chat_id] = new Game(chat_id,null,0,"r");
                games[chat_id].addPlayer(contact.pushname, message.author);
                message.reply( `${(contact.pushname).split(" ")[0]} have joined the game!`);
            }   
            else {
                let found = false;
                for (let i = 0; i < games[chat_id].players.length; i++){
                    if (message.author === games[chat_id].players[i].phone_number){
                        found = true;
                        break;
                    }
                }

                if (found)
                    message.reply('you have already joined!');
                else{
                    games[chat_id].addPlayer(message.author.id,message.getContact().pushname,message.author);
                    message.reply( "you have joined the game!");}
                }   
        }


        // poker show (players)
        if (user_msg === "poker show") {
            let players_list = ""
            let players = games[chat_id].players;
            
            if(!(chat_id in games)){
                message.reply("There are no players on the table :(");
            }
            else {
                for( let i = 0; i < players.length; i++){
                    players_list += `${i+1}. ${players[i].name}\n`

                message.reply(`Players:\n ${players_list}`);
                }
            }
        }


        // poker exit (the table)
        if (user_msg === "poker exit") {
            for (let i = 0; i < games[chat_id].players.length; i++) {
            message.reply(games[chat_id].players[i].name + " money is " + games[chat_id].players[i]);
            }
            games[chat_id] = undefined;
        }

        // poker start - start the game
        if (user_msg === "poker start"){
            let order = general_functions.shuffleArray(games[chat_id].getPlayers());
            console.log(`Order: ${order}\nDeck: ${deck}`)
        }
    }
})

whatsapp.on('ready',() => {
    console.log("Client is ready!")
})

whatsapp.initialize()