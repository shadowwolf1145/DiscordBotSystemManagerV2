import { graphql, GraphQLInt, GraphQLList, GraphQLSchema } from "graphql";
import _ from 'lodash';
import { 
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID
} from "graphql";
import e from "express";

// Dummy Data
var robloxplayers = [
    {UID:'1',name:'UnfortunatePie'},
    {UID:'2',name:'Shadowwolf1145'}
]

var discordusers = [
    {UID:'123',name:'Rosalie#1234',robloxUID:'1'},
    {UID:'266767474777784320',name:'Riok Riftstrider#4321',robloxUID:'2'}
]

var gOne = [
    {gameName:"GameOneData",UID:'1',level:32},
    {gameName:"GameOneData",UID:'2',level:23}
];

var gTwo = [
    {gameName:"GameTwoData",UID:'1',pet:'beep'},
    {gameName:"GameTwoData",UID:'2',pet:'boop'}
];

var games = [
    gOne,
    gTwo
]

class GameOneData {
    constructor(UID,gameName,level){
        this.UID = UID;
        this.gameName = gameName;
        this.level = level;
    }
}

const GameDataInferace = new GraphQLInterfaceType({
    name:"GameData",
    fields:() =>({
        UID:{type:GraphQLID},
        gameName:{type:GraphQLString}
    })
})

const GameOneDataType = new GraphQLObjectType({
    name:"GameOneData",
    interfaces:()=>[GameDataInferace],
    isTypeOf: value => value.gameName == GameOneDataType,
    fields: () => ({
        UID:{type:GraphQLID},
        level:{type:GraphQLInt},
        gameName:{type:GraphQLString}
    })
})

const GameTwoDataType = new GraphQLObjectType({
    name:"GameTwoData",
    interfaces:()=>[GameDataInferace],
    isTypeOf: value => value.gameName == GameTwoDataType,
    fields: () => ({
        UID:{type:GraphQLID},
        pet:{type:GraphQLString},
        gameName:{type:GraphQLString}
    })
})

const RobloxPlayerType = new GraphQLObjectType({
    name:"RobloxPlayer",
    fields: () => ({
        UID:{type:GraphQLID},
        name:{type:GraphQLString},
        gameData:{
            type:GraphQLList(GameDataInferace),
            args:{UID:{type:GraphQLID}},
            resolve(parent,args){
                var temp = []
                games.forEach((game)=>{
                    game.forEach((row)=>{
                        temp.push(row)
                    })
                })
                temp = _.filter(temp,{UID:parent.UID})
                return temp
            }
        }
    })
});

const DiscordUserType = new GraphQLObjectType({
    name:"DiscordUser",
    fields:()=>({
        UID:{type:GraphQLID},
        name:{type:GraphQLString},
        robloxUID:{type:GraphQLID},
        robloxUser:{
            type:RobloxPlayerType,
            resolve(parent,args){
                return _.find(robloxplayers,{UID:parent.robloxUID})
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        robloxPlayer:{
            type:RobloxPlayerType,
            args:{UID:{type:GraphQLID}},
            resolve(parent,args){
                return _.find(robloxplayers,{UID:args.UID})
            },
        },
        discordUser:{
            type:DiscordUserType,
            args:{UID:{type:GraphQLID}},
            resolve(parent,args){
                return _.find(discordusers,{UID:args.UID})
            }
        },
        allRobloxPlayers:{
            type:GraphQLList(RobloxPlayerType),
            resolve(){
                return robloxplayers
            }
        },
        allDiscordUsers:{
            type:GraphQLList(DiscordUserType),
            resolve(){
                return discordusers
            }
        },
        allGameData:{
            type:new GraphQLList(GameDataInferace),
            resolve(){
                var temp = []
                games.forEach((game)=>{
                    game.forEach((row)=>{
                        temp.push(row)
                    })
                })
                return temp
            }
        },
        allGameOneData:{
            type:new GraphQLList(GameOneDataType),
            resolve(){
                return gOne
            }
        },
        allGameTwoData:{
            type:new GraphQLList(GameTwoDataType),
            resolve(){
                return gOne
            }
        }
    }
});

export const Schema = new GraphQLSchema({
    query: RootQuery,
});