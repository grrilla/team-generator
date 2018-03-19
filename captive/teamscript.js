const csv = require('csvtojson');
const MIN_PER_ROOM = 2;
const MAX_PER_ROOM = {
  draculas_library: 7,
  charlotte: 7,
  cabinet_of_curiosities: 12,
  surgeon: 6
};

var player_pool = {
  1: {
    draculas_library: [],
    charlotte: [],
    cabinet_of_curiosities: [],
    surgeon: []
  },
  2: {
    draculas_library: [],
    charlotte: [],
    cabinet_of_curiosities: [],
    surgeon: []
  },
  3: {
    draculas_library: [],
    charlotte: [],
    cabinet_of_curiosities: [],
    surgeon: []
  },
  4: {
    draculas_library: [],
    charlotte: [],
    cabinet_of_curiosities: [],
    surgeon: []
  }
}

var final_teams = {};

csv()
  .fromFile('./escape.csv')
  .on('json', (obj) => {
    player_pool[obj.draculas_library].draculas_library.push(obj.email);
    player_pool[obj.charlotte].charlotte.push(obj.email);
    player_pool[obj.cabinet_of_curiosities].cabinet_of_curiosities.push(obj.email);
    player_pool[obj.surgeon].surgeon.push(obj.email);
  })
  .on('done', (error) => {
    if (error != undefined) {
      console.error(error);
    } else {
      console.log('Player selections parsed successfully. Generating teams.\n');

      final_teams    = player_pool[1];

      var freeAgents = [];
      freeAgents     = freeAgents.concat(pareDownTeam('draculas_library'))
      .concat(pareDownTeam('charlotte'))
      .concat(pareDownTeam('cabinet_of_curiosities'))
      .concat(pareDownTeam('surgeon'));

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

  while (final_teams[room].length > MAX_PER_ROOM[room]) {
    console.log(room + ' is over capacity. Removing a player at random.');
    freeAgent = final_teams[room][Math.floor(Math.random() * final_teams[room].length)];
    console.log(freeAgent + ' was removed from ' + room + '.');
    final_teams[room] = final_teams[room].filter((p) => p != freeAgent);
    freeAgentRoster.push(freeAgent);
  }
  return freeAgentRoster
}

function assignToDifferentTeam(player, round) {
  if (player_pool[round].draculas_library.indexOf(player) > -1 && final_teams.draculas_library.length < MAX_PER_ROOM[draculas_library]) {
    final_teams.draculas_library.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, Dracula\'s Library.');
    return;
  } else if (player_pool[round].charlotte.indexOf(player) > -1 && final_teams.charlotte.length < MAX_PER_ROOM[charlotte]) {
    final_teams.charlotte.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, Charlotte.');
    return;
  } else if (player_pool[round].cabinet_of_curiosities.indexOf(player) > -1 && final_teams.cabinet_of_curiosities.length < MAX_PER_ROOM[cabinet_of_curiosities]) {
    final_teams.cabinet_of_curiosities.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, The Cabinet of Curiosities.');
    return;
  } else if (player_pool[round].surgeon.indexOf(player) > -1 && final_teams.surgeon.length < MAX_PER_ROOM[surgeon]) {
    final_teams.surgeon.push(player);
    console.log('\n' + player + ' got their Round ' + round + 'pick, The Surgeon.');
    return;
  } else if (round < 4) {
    assignToDifferentTeam(player, round + 1);
    return;
  } else {
    console.error('Something terrible and impossible happened...');
  }
}
