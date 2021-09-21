module.exports = class Match {
  constructor(matchID, mapType, ranked, leaderboardID, started, finished, players){
    this.matchID = matchID;
    this.mapType = mapType;
    this.ranked = ranked;
    this.leadboard = leaderboardID;
    this.startTime = this.GetTime(started);
    this.finishTime = this.GetTime(finished);
    this.players = players;
  }

  GetTime(time){
    return new Date(time).toLocaleString();
  }
}