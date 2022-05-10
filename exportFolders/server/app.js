import express from "express";
import { graphqlHTTP } from "express-graphql";
import {Schema} from './schema/schema.js';
import fetch from "node-fetch";
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './tools/utils.js';
import { HasGuildCommands, TEST_COMMAND,T,T2,T3,T4,T5} from './tools/commands.js';
const Site = 'https://wiry-linen-lifter.glitch.me/graphql?query='

function CommandLogger(container){
  var currCon = container
  if ("options" in currCon){
      console.log(currCon.name,currCon.options)
      if (currCon.options != null){
        if (currCon.options.length > 1){
          for (var index in currCon.options){
            CommandLogger(currCon.options[index])
          }
        }else{
          CommandLogger(currCon.options[0])
        }
      }
  }
  if ("value" in currCon){
      console.log(currCon.name,currCon.value)
  }
}

const QUERY_NAMES = {
  'get_discorduser_info':'discordUser',
}
function TargetedQuery(command){
  command = command.options[0]
  if (!('name' in command)) {console.error("Invalid Command: No Name Variable")}
  if (!(command.name in QUERY_NAMES)){console.error("Invalid Command: No Query Name found matching Command Name")}
  if (!('options' in command)){console.error("Invalid Command: Missing Options Parameter")}
  var QueryName = QUERY_NAMES[command.name]
  var QueryOptions = command.options[0]
  var UserID = QueryOptions.options[0].value
  var Command = `{${QueryName}(UID:${UserID}){${QueryOptions.name}}}`
  return Command
}
function TargetedQueryV2(command){
  command = command.options[0]
  if (!('name' in command)) {console.error("Invalid Command: No Name Variable")}
  if (!(command.name in QUERY_NAMES)){console.error("Invalid Command: No Query Name found matching Command Name")}
  if (!('options' in command)){console.error("Invalid Command: Missing Options Parameter")}
  var QueryName = QUERY_NAMES[command.name]
  var QueryOptions = command.options[0]//discord
  var UserID = ""
  console.log(QueryOptions.name)
  if ("name" in QueryOptions && (QueryOptions.name != "discord" && QueryOptions.name != "discordroblox")){console.error("was expecting discord or discordroblox option"); return}
  	console.log("QueryOptions",QueryOptions.options)
    var discord_options = null;
    var roblox_options = null;
    var gamedata_options = null;
    var Command = null;
    for (var obj of QueryOptions.options){
      console.log("Obj: ",obj)
      if (obj.name == "mention_name"){
      	UserID = obj.value
      }
      if (obj.name == "discord_options"){
      	discord_options = obj.value
      }
      if (obj.name == "roblox_options"){
      	roblox_options = obj.value
      }
      if (obj.name == "game_data"){
      	gamedata_options = obj.value
      }
    }
		if (roblox_options != null && gamedata_options != null) {
    	Command = `{${QueryName}(UID:${UserID}){${discord_options} robloxUser{${roblox_options} gameData{${gamedata_options}}}}}`
    }else if (roblox_options != null){
    	Command = `{${QueryName}(UID:${UserID}){${discord_options} robloxUser{${roblox_options}}}}`
    }else {
    	Command = `{${QueryName}(UID:${UserID}){${discord_options}}}`
    }
    console.log("Ret Command: ",Command)
    return Command
}
function NontargetedQuery(command){
  command = command.options[0]
  if (!('name' in command)) {console.error("Invalid Command: No Name Variable")}
  if (!(command.name in QUERY_NAMES)){console.error("Invalid Command: No Query Name found matching Command Name")}
  if (!('options' in command)){console.error("Invalid Command: Missing Options Parameter")}
  var QueryName = QUERY_NAMES[command.name]
  var QueryOptions = command.options[0]
  var Command = `{${QueryName}{${QueryOptions.name}}}`
  console.log('Command:',Command)
  return Command
}

const QUERY_TYPES = {
  'get_discorduser_info':TargetedQueryV2
}

const App = express()

App.use('/graphql',graphqlHTTP({
    schema:Schema,
    graphiql:true
}))
App.use('/interactions',express.json({verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)}))

App.post('/interactions', async function (req,res){
    const {type,body,data} = req.body
    console.log("INTERACTION")
    //console.log(data)
    //CommandLogger(data)
    if (type === InteractionType.PING) {
        console.log("PING")
        try {
          await res.send({type: InteractionResponseType.PONG})
        }catch(err){
          console.error("ERROR: ",err)
        }
    }

    if (type === InteractionType.APPLICATION_COMMAND){
        const {name} = data;
        if (name === "test"){
          try {
            await res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Hello World!!!'
                }
            });
          } catch(err){
            console.error("ERROR: ",err)
          }
        }
      if (name === "t3"){
        var QUERY = QUERY_TYPES[data.options[0].name](data)
        console.log("QUERY: ",QUERY)
        console.log("SITE: ",Site.concat(QUERY))
        fetch(Site.concat(QUERY))
        .then((response)=>response.json())
        .then((result)=> {
          try {
            console.log("MSG: ",result)
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: JSON.stringify(result)
                }
            });
          } catch(err){
            console.error("ERROR: ",err)
          }
        })

        
      }
      if (name === "t5"){
        var QUERY = QUERY_TYPES[data.options[0].name](data)
        console.log("QUERY: ",QUERY)
        console.log("SITE: ",Site.concat(QUERY))
        fetch(Site.concat(QUERY))
        .then((response)=>response.json())
        .then((result)=> {
          try {
            console.log("MSG: ",result)
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: JSON.stringify(result)
                }
            });
          } catch(err){
            console.error("ERROR: ",err)
          }
        })

        
      }
    }
});

App.listen(3000,()=>{
    console.log("Server Started: Port: 3000")
    
    HasGuildCommands(process.env.APP_ID,process.env.GUILD_ID,[
        TEST_COMMAND,
        T,
        T2,
        T3,
        T5
    ]);
})