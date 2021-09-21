module.exports = class Player {
  constructor(profileId, steamId, name, rating, ratingChange, color, team, civ, won) {
    this.profileId = profileId;
    this.steamId = steamId;
    this.name = name;
    this.rating = rating;
    this.ratingChange = ratingChange;
    this.color = this.GetColor(color);
    this.team = team;
    this.civ = civ;
    this.won = won;
  }

  GetColor(color){
    switch(color){
      case 1:
        return String.fromCharPoint(0x1F535);
      case 2:
        return String.fromCharPoint(0x1F534);
      case 3:
        return String.fromCharPoint(0x1F7E2);
      case 4:
        return String.fromCharPoint(0x1F7E1);
      case 5:
        return String.fromCharPoint(0x1F310);
      case 6:
        return String.fromCharPoint(0x1F7E3);
      case 7:
        return String.fromCharPoint(0x26AA);
      case 8:
        return String.fromCharPoint(0x1F7E0);
      default:
        return String.fromCharPoint(0x1F535);
    }
  }
}

