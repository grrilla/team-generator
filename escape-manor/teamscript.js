const csv = require('csvtojson');
const MAX_PER_ROOM = 10;

var player_pool = {
  1: {
    deathRow: [],
    asylum: [],
    devilsAdvocate: [],
    wineCellar: []
  },
  2: {
    deathRow: [],
    asylum: [],
    devilsAdvocate: [],
    wineCellar: []
  },
  3: {
    deathRow: [],
    asylum: [],
    devilsAdvocate: [],
    wineCellar: []
  },
  4: {
    deathRow: [],
    asylum: [],
    devilsAdvocate: [],
    wineCellar: []
  },
  5: {
    deathRow: [],
    asylum: [],
    devilsAdvocate: [],
    wineCellar: []
  }
}

var final_teams = {};

csv()
  .fromFile('./escape-manor-responses.csv')
  .on('json', (obj) => {
    player_pool[obj.deathRow].deathRow.push(obj.email);
    player_pool[obj.asylum].asylum.push(obj.email);
    player_pool[obj.devilsAdvocate].devilsAdvocate.push(obj.email);
    player_pool[obj.wineCellar].wineCellar.push(obj.email);
  })
  .on('done', (error) => {
    if (error != undefined) {
      console.error(error);
    } else {
      console.log('Player selections parsed successfully. Generating teams.\n');

      final_teams    = player_pool[1];

      var freeAgents = [];
      freeAgents     = freeAgents.concat(pareDownTeam('deathRow'))
      .concat(pareDownTeam('asylum'))
      .concat(pareDownTeam('devilsAdvocate'))
      .concat(pareDownTeam('wineCellar'))

      console.log('\nAfter paring down teams, the following free agents remain: ' + freeAgents);
      console.log('\nAssigning free agents at random to their next most preferred, available room...');

      while (freeAgents.length > 0) {
        var freeAgent = freeAgents[Math.floor(Math.random() * freeAgents.length)];
        assignToDifferentTeam(freeAgent, 1);
        freeAgents = freeAgents.filter((p) => p != freeAgent);
      }

      console.log('\nTeam generation complete. Final teams are as follows:');
      console.log(final_teams);
    }
  });

function pareDownTeam(room) {
  var freeAgent = undefined;
  var freeAgentRoster = [];

  while (final_teams[room].length > MAX_PER_ROOM) {
    console.log(room + ' is over capacity. Removing a player at random.');
    freeAgent = final_teams[room][Math.floor(Math.random() * final_teams[room].length)];
    console.log(freeAgent + ' was removed from ' + room + '.');
    final_teams[room] = final_teams[room].filter((p) => p != freeAgent);
    freeAgentRoster.push(freeAgent);
  }
  return freeAgentRoster
}

function assignToDifferentTeam(player, round) {
  if (player_pool[round].deathRow.indexOf(player) > -1 && final_teams.deathRow.length < MAX_PER_ROOM) {
    final_teams.deathRow.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, Death Row.');
    return;
  } else if (player_pool[round].asylum.indexOf(player) > -1 && final_teams.asylum.length < MAX_PER_ROOM) {
    final_teams.asylum.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, the Asylum.');
    return;
  } else if (player_pool[round].devilsAdvocate.indexOf(player) > -1 && final_teams.devilsAdvocate.length < MAX_PER_ROOM) {
    final_teams.devilsAdvocate.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, Devil\'s Advocate.');
    return;
  } else if (player_pool[round].wineCellar.indexOf(player) > -1 && final_teams.wineCellar.length < MAX_PER_ROOM) {
    final_teams.wineCellar.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, the Wine Cellar.');
    return;
  } else if (round < 5) {
    assignToDifferentTeam(player, round + 1);
    return;
  } else {
    console.error('Something terrible and impossible happened...');
  }
}
