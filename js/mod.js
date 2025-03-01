let modInfo = {
	name: "Growth Simulator",
	id: "mymod",
	author: "nobody",
	pointsName: "growth",
	modFiles: ["_Growth.js", "_AutoReset.js", "tree.js",
		"1_Plants.js",
		"2_Fertilizer.js", "2_Machines.js", "2_Resources.js",
		"3_Acceleration.js", "3_REsearch.js"
	],
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(0)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	  
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if (new Decimal(Math.floor(Math.random()*10000)).lte(player.p.incChance.sub(player.p.incChance.floor()).times(10000))){
		let critMult = new Decimal(1)
		if (hasUpgrade('m', 12)) critMult = critMult.times(4)

		gain = player.p.incChance.ceil().add(critMult).sub(1)
	} else {
		gain = player.p.incChance.ceil().sub(1)
	}
	if (hasUpgrade('m', 11) && Math.random() >= 0.9) gain = gain.times(10)
	if (player.r.points.gte(1) && player.r.unlocked) gain = gain.times(player.r.points.pow(0.2))
		if (player.re.points.gte(1)) gain = gain.times(Decimal.pow(1.5, player.re.points))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
