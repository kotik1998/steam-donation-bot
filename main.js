const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

const client = new SteamUser();

const logOnOptions = {
	accountName: '',
	password: '',
	twoFactorCode: SteamTotp.generateAuthCode('')
};

client.logOn(logOnOptions);

const community = new SteamCommunity();
const manager = new TradeOfferManager({
	steam: client,
	community: community,
	language: 'en'
});

client.on('loggedOn', () => {
	console.log('Logged into Steam');

	client.setPersona(SteamUser.Steam.EPersonaState.Online);
	client.gamesPlayed(440);
});

client.on('friendRelationship', (steamid, relationship) => {
    if (relationship === 2) {
        client.addFriend(steamid);
    }
});

client.on('webSession', (sessionid, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	community.startConfirmationChecker(10000, 'N3jOWNZ00Y+ZFQX7HnQ2VZnKp6g=');
});

manager.on('newOffer', (offer) => {
  if (offer.itemsToGive.length === 0) {
		offer.accept((err, status) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`Accepted offer. Status: ${status}.`);
			}
		});
	} else {
		offer.decline((err) => {
			if (err) {
				console.log(err);
			} else {
				console.log("This bot doesn't give items away.");
			}
		});
	}
});
