import { capitalize, DiscordRequest } from './utils.js';
import _ from 'lodash';
export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

export const TEST_COMMAND = {
    name: 'test',
    description: 'Basic guild command',
    type: 1,
  };
const QUERY_OPTIONS = [
  {
    name:"mention_name",
    description:"@Name of the user you want to lookup",
    type:9,
    required:true,
  }
]
const Discord_Options = [].concat(QUERY_OPTIONS)
Discord_Options.push({
  name:"discord_options",
  description:"a list of the possible data that can be returned about the discordUser",
  required:true,
  type:3,
  choices:[
    {
      name:"UniqueID",
      value:"UID"
    },
    {
      name:"Name",
      value:"name"
    },
    {
      name:"robloxID",
      value:"robloxUID"
    },
    {
      name:"UniqueID_Name",
      value:"UID name"
    },{
      name:"UniqueID_robloxUID",
      value:"UID robloxUID"
    },
    {
      name:"Name_robloxUID",
      value:"name robloxUID"
    }
  ]
})
const Roblox_Options = [].concat(QUERY_OPTIONS)
Roblox_Options.push(
  {
  name:"roblox_options",
  description:"a list of the possible data that can be returned about the robloxUser",
  require:true,
  type:3,
  choices:[
    {
      name:"UniqueID",
      value:"UID"
    },
    {
      name:"Name",
      value:"name"
    },
    {
      name:"UniqueID_Name",
      value:"UID name"
    },
  ]
},
{
  name:"gamedata_options",
  description:"return a robloxUser's gameData",
  type:3,
  choices:[
    {
      name:"Game_Name",
      value:"gameName"
    }
  ]
})
const DiscordRoblox_Options = _.union(Discord_Options,Roblox_Options)
  export const T6 = { // Query Database
    name: 't6',//query_database
    type: 1,
    description: 'Query select information from database',
    options:[
      {
        name:'get_discorduser_info',
        type:2,
        description:"Query select information about a discorduser",
        options:[
          {
            name:"discord",
            type:1,
            description:"return information related to the discorduser",
            options:Discord_Options
          },
          {
            name:"discordroblox",
            type:1,
            description:"return information related to the discorduser and their robloxuser",
            options:DiscordRoblox_Options
          }
        ]
      }
    ]
  };