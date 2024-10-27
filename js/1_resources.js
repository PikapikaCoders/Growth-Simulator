addLayer("r", {
    name: "resources", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        gain: new Decimal(1),
    }},
    color: "#CD7F32",
    branches: ['p'],
    requires: new Decimal(3000), // Can be a function that takes requirement increases into account
    resource: "resources", // Name of prestige currency
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.m.unlocked},
    effectDescription() { 
        return "which is increasing growth gain by x"+format(player.r.points.pow(0.2))
    },

    tabFormat: [
        "main-display",
        "buyables", "blank",
        ["display-text",
            function() { return '<hr><br>Performing a 2nd row reset will reset this layer' },
        ],
        ["display-text",
            function() { return 'You are gaining ' + format(player.r.gain.times(20)) + ' resources per second' },
        ],
    ],


    doReset(resettingLayer) {
		if (layers[resettingLayer].row >= this.row) player.r.points = new Decimal(0)
	},

    update() {
        if (player.p.points.gte(3000)) player.r.unlocked = true

        let gain = new Decimal(0.05)
        gain = gain.times(getBuyableAmount(this.layer, 11).add(1))
        player.r.gain = gain

        if (player.r.unlocked) player.r.points = player.r.points.add(gain)
    },

    buyables: {
        11: {
            cost() { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)).times(5) },
            title() { return 'Resource Package I' },
            display() { 
                let effect = getBuyableAmount(this.layer, this.id).add(1)
                return "Multiply resource gain<br><br>Current: x"+format(effect)+"<br>Next: x"+format(effect.add(1))+"<br><br>Cost: "+format(this.cost())+" machines<br>Bought: "+format(getBuyableAmount(this.layer, this.id), 0)
            },
            canAfford() { return player.m.points.gte(this.cost()) },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
})