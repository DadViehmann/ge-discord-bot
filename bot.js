var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const { hiscores } = require('osrs-json-api');
const calcs = require('./BotComponents/calculations');

//configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

//Initialize discord bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
  //Bot uses this to listen to messages for the command identifier
  //It will listen for messages that start with '$'
  if (message.substring(0, 1) == '$') {
    var fullMessage = message.split(' ')
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      //$help
      case 'help':
        var helpMessage = "All commands start with '$' \n**Commands:** \n$help - you're here already, dumb dumb. \n$skill [*User Name*] [*Skill Type*] - checks the selected users record for the skill you entered."
        bot.sendMessage({
          to: channelID,
          message: helpMessage
        });
        break;
      
      //$skill
      case 'skill':
        var userName = fullMessage[1];
        var skillType = fullMessage[2].toLowerCase();
        getPlayer(channelID, userName, skillType);
        break;
      //Other commands can go here ish
    }
  }
});

function getPlayer(channelID, userName, skillType) {
  hiscores
    .getPlayer(userName)
    .then((res) => {
      try {
        var messageResponse = userName + "'s " + skillType.charAt(0).toUpperCase() + skillType.slice(1) + " Skill Records \n**Rank:** " + formatNumberValues(res.skills[skillType].rank) + "\n**Level:** " + res.skills[skillType].level + "\n**XP:** " + res.skills[skillType].xp;
        bot.sendMessage({
          to: channelID,
          message: messageResponse
        });
        console.log(res.skills.overall);
      }
      catch (e) {
        bot.sendMessage({
          to: channelID,
          message: 'You fucking broke me'
        });
      }
    })
    .catch(console.error)
}