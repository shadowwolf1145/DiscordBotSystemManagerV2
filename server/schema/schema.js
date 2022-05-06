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
    {userid:'1',name:'UnfortunatePie'},
    {userid:'2',name:'Shadowwolf1145'}
]

var discordusers = [
    {UID:'123',name:'Rosalie#1234',robloxUserid:'1'},
    {UID:'321',name:'Riok Riftstrider#4321',robloxUserid:'2'}
]

var gOne = [
    {gameName:"GameOneData",userid:'1',level:32},
    {gameName:"GameOneData",userid:'2',level:23}
];

var gTwo = [
    {gameName:"GameTwoData",userid:'1',pet:'beep'},
    {gameName:"GameTwoData",userid:'2',pet:'boop'}
];

var games = [
    gOne,
    gTwo
]

class GameOneData {
    constructor(userid,gameName,level){
        this.userid = userid;
        this.gameName = gameName;
        this.level = level;
    }
}

const GameDataInferace = new GraphQLInterfaceType({
    name:"GameData",
    fields:() =>({
        userid:{type:GraphQLID},
        gameName:{type:GraphQLString}
    })
})

const GameOneDataType = new GraphQLObjectType({
    name:"GameOneData",
    interfaces:()=>[GameDataInferace],
    isTypeOf: value => value.gameName == GameOneDataType,
    fields: () => ({
        userid:{type:GraphQLID},
        level:{type:GraphQLInt},
        gameName:{type:GraphQLString}
    })
})

const GameTwoDataType = new GraphQLObjectType({
    name:"GameTwoData",
    interfaces:()=>[GameDataInferace],
    isTypeOf: value => value.gameName == GameTwoDataType,
    fields: () => ({
        userid:{type:GraphQLID},
        pet:{type:GraphQLString},
        gameName:{type:GraphQLString}
    })
})

const RobloxPlayerType = new GraphQLObjectType({
    name:"RobloxPlayer",
    fields: () => ({
        userid:{type:GraphQLID},
        name:{type:GraphQLString},
        gameData:{
            type:GraphQLList(GameDataInferace),
            args:{userid:{type:GraphQLID}},
            resolve(parent,args){
                var temp = []
                games.forEach((game)=>{
                    game.forEach((row)=>{
                        temp.push(row)
                    })
                })
                temp = _.filter(temp,{userid:parent.userid})
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
        robloxUserid:{type:GraphQLID},
        robloxUser:{
            type:RobloxPlayerType,
            resolve(parent,args){
                return _.find(robloxplayers,{userid:parent.robloxUserid})
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        robloxPlayer:{
            type:RobloxPlayerType,
            args:{userid:{type:GraphQLID}},
            resolve(parent,args){
                return _.find(robloxplayers,{userid:args.userid})
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