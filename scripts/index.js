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
let games = {};
//changes

//test



whatsapp.on('message', async msg => {
    let message = await msg;
    let chat = await message.getChat();
    let chatid = chat.id._serialized.replace(/\D/g, '');
    let chatName = chat.name || 'Unknown Group';
    let contact = await message.getContact();
    let playerName = (await message.getContact()).pushname;
    let playerNumber = (await message.author);

    console.log(`Message received in group: ${ general_functions.reverseString(chatName)}`);

    if (chatName.includes("נבחרתם שבוע הבא") || chatName.includes("טסטים פוקר") || chatName.includes("קלף חינם")){
        let user_msg = message.body.toLowerCase();

        // poker usage - learn about the functions
        if (user_msg === "poker usage" || user_msg === "poker help" || user_msg === "poker ?" || user_msg === "poker") {
            message.reply('poker- usage, create, join, show, exit, start, finish, check, raise [amount], fold');
        }
        // poker join (the game)
        if (user_msg === "poker check"){
            message.reply("console");
            console.log('chat id is + '+chatid);} //chatid trimmed example trimmed  120363278412162149 example not trimmed 120363278412162149@c.us
            console.log("1:"+message.author.name); 
            console.log("2:"+contact.pushname); //name exa,ple: Laizilkah
            console.log("3:"+contact.id._serialized)
            console.log("4:"+message.author)
            
        if (user_msg === "poker join") 
        {
            if (!(chatid in games)){ /// is DICT CHANGE TOMORROW to index
                games[chatid] = new Game(chatid,null,0,"r")
                games[chatid].addPlayer(contact.id._serialized,message.getContact().pushname,message.author);// scuffed work change to message author in games[CHATID].PLAYERS.ID
                message.reply( "new game: u have joined the game!");
                console.log("this is player count "+games[chatid].players.length)
            }   
            else {
                found = false;
                console.log(games[chatid].players)
                for (let i = 0; i < games[chatid].players.length;i++) 
                    if (message.author === games[chatid].players[i].id)
                        found = true;
                if (found)
                    message.reply('you have already joined!');
                else{
                    games[chatid].addPlayer(message.author.id,message.getContact().pushname,message.author);
                    message.reply( "you have joined the game!");}
                console.log("i am working")
                }   
        }

        // poker show (players)
        if (user_msg === "poker show") {
            if(!(chatid in games))
                message.reply("There are no players on the table");
            else
                message.reply(games[chatid].players);
        }

        // poker exit (the table)
        if (user_msg === "poker exit") {
            for (let i = 0; i < games[chatid].players.length; i++) {
            message.reply(games[chatid].players[i].name + " money is " + games[chatid].players[i]);
            }
            games[chatid] = undefined;
        }

        // poker start - start the game
        if (user_msg === "poker start"){
            let order = general_functions.shuffleArray(games[chatid].getPlayers());
            console.log(`Order: ${order}\nDeck: ${deck}`)
            //message.sendMessage() // shuffleArray(deck);
            //message.reply(`Playing Order:\n${players.map((item, index) => `${index + 1}. ${item}`).join(' ')}`);
            //message.reply(`1. ${deck.pop()}\n2. ${deck.pop()}\n3. ${deck.pop()}\n`)
            //message.sendMessage("TEST MESSAGE")
        }
    }


}
//catch (error) {console.log(error)}}
)

whatsapp.on('ready',() => {
    console.log("Client is ready!")
})

whatsapp.initialize()