import { capitalize, DiscordRequest } from './utils.js';

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
  export const QUERY_DATABASE = {
    name: 'query_database',
    description: 'query select information from database',
    type: 1,
    options:[
      {
        "name":"DiscordUser",
        "description":`
        Returns info about a Discord User.
        Args in order can be:
        UserID=number {UID=bool,name=bool,robloxUserid=bool}
        returnInfo is the information you want to receive
        `,
        "type":1
      },
      {
        "name":"RobloxPlayer",
        "description":`
        Returns info about a Roblox Player.
        Args in order can be:
        UserID=number,returnInfo={userid=bool,name=bool}
        returnInfo is the information you want to receive
        `,
        "type":1
      },
      {
        "name":"DiscordUser_RobloxPlayer",
        "description":`
        Returns info about a Discord User's  RobloxPlayer.
        Args in order can be:
        UserID=number or false,UserName=name#0000 or false,returnInfo={UID=bool,name=bool,robloxUserid=bool}
        UserID and UserName cant be false at the same time
        returnInfo is the information you want to receive
        `,
        "type":1
      }
    ]
  };