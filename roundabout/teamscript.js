const csv = require('csvtojson');
const MAX_PER_ROOM = 5;

var player_pool = {
  1: {
    final_destination: [],
    butchers_basement: [],
    prisoner: [],
    ninja: [],
    mummy: []
  },
  2: {
    final_destination: [],
    butchers_basement: [],
    prisoner: [],
    ninja: [],
    mummy: []
  },
  3: {
    final_destination: [],
    butchers_basement: [],
    prisoner: [],
    ninja: [],
    mummy: []
  },
  4: {
    final_destination: [],
    butchers_basement: [],
    prisoner: [],
    ninja: [],
    mummy: []
  },
  5: {
    final_destination: [],
    butchers_basement: [],
    prisoner: [],
    ninja: [],
    mummy: []
  }
}

var final_teams = {};

csv()
  .fromFile('./escape.csv')
  .on('json', (obj) => {
    player_pool[obj.final_destination].final_destination.push(obj.email);
    player_pool[obj.butchers_basement].butchers_basement.push(obj.email);
    player_pool[obj.prisoner].prisoner.push(obj.email);
    player_pool[obj.ninja].ninja.push(obj.email);
    player_pool[obj.mummy].mummy.push(obj.email);
  })
  .on('done', (error) => {
    if (error != undefined) {
      console.error(error);
    } else {
      console.log('Player selections parsed successfully. Generating teams.\n');

      final_teams    = player_pool[1];

      var freeAgents = [];
      freeAgents     = freeAgents.concat(pareDownTeam('final_destination'))
      .concat(pareDownTeam('butchers_basement'))
      .concat(pareDownTeam('prisoner'))
      .concat(pareDownTeam('ninja'))
      .concat(pareDownTeam('mummy'));

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
  if (player_pool[round].final_destination.indexOf(player) > -1 && final_teams.final_destination.length < MAX_PER_ROOM) {
    final_teams.final_destination.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, Final Destination.');
    return;
  } else if (player_pool[round].butchers_basement.indexOf(player) > -1 && final_teams.butchers_basement.length < MAX_PER_ROOM) {
    final_teams.butchers_basement.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, Butcher\'s Basement.');
    return;
  } else if (player_pool[round].prisoner.indexOf(player) > -1 && final_teams.prisoner.length < MAX_PER_ROOM) {
    final_teams.prisoner.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, The Prisoner.');
    return;
  } else if (player_pool[round].ninja.indexOf(player) > -1 && final_teams.ninja.length < MAX_PER_ROOM) {
    final_teams.ninja.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, The Ninja.');
    return;
  } else if (player_pool[round].mummy.indexOf(player) > -1 && final_teams.mummy.length < MAX_PER_ROOM) {
    final_teams.mummy.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, Back to the Mummy.');
    return;
  } else if (round < 5) {
    assignToDifferentTeam(player, round + 1);
    return;
  } else {
    console.error('Something terrible and impossible happened...');
  }
}
