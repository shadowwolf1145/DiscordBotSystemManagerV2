import express from "express";
import { graphqlHTTP } from "express-graphql";
import {Schema} from './schema/schema.js';
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './tools/utils.js';
import { HasGuildCommands, QUERY_DATABASE, TEST_COMMAND } from './tools/commands.js';

const App = express()

App.use('/graphql',graphqlHTTP({
    schema:Schema,
    graphiql:true
}))
App.use('/interactions',express.json({verify: VerifyDiscordRequest(process.env.PUBLIC_KEY)}))

App.post('/interactions', async function (req,res){
    const {type,body,data} = req.body
    console.log("INTERACTION")
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
        console.log("Name : ", name)
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
    }
});

App.listen(3000,()=>{
    console.log("Server Started: Port: 3000")
    
    HasGuildCommands(process.env.APP_ID,process.env.GUILD_ID,[
        TEST_COMMAND,
        QUERY_DATABASE
    ]);
})