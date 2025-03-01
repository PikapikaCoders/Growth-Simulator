addLayer("r", {
    name: "resources", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        gain: new Decimal(1),
    }},
    color: "#CD7F32",
    branches: ['p'],
    requires: new Decimal(3000), // Can be a function that takes requirement increases into account
    resource: "resources", // Name of prestige currency
    baseResource: "plants", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.m.unlocked},
    effectDescription() { 
        return "which is increasing growth gain by x"+format(player.r.points.pow(0.2).max(1))
    },

    tabFormat: [
        "main-display",
        "buyables", "blank",
        ["display-text",
            function() { return '<hr><br>Performing a 2nd row reset will reset this layer' },
        ],
        ["display-text",
            function() { return 'You are gaining ' + format(player.r.gain.times(20)) + ' resources per second' },
        ], "blank",
        "upgrades",
    ],


    doReset(resettingLayer) {
        if (layers[resettingLayer].row >= this.row) player.r.points = new Decimal(0)

        let keep = []
        if (layers[resettingLayer].layer == "a" && hasMilestone('a', 0)) keep.push("buyables")
        if (layers[resettingLayer].layer == "re" && hasMilestone('re', 0)) keep.push("buyables")
        if (layers[resettingLayer].layer == "a" && hasMilestone('a', 2)) keep.push("upgrades")
        if (layers[resettingLayer].layer == "re" && hasMilestone('re', 2)) keep.push("upgrades")

        if (layers[resettingLayer].row > this.row) layerDataReset("r", keep)
	},

    update() {
        if (player.p.points.gte(3000)) player.r.unlocked = true

        let gain = new Decimal(0.05)
        gain = gain.times(new Decimal(2).pow(getBuyableAmount(this.layer, 11)))
        player.r.gain = gain

        if (player.r.unlocked) player.r.points = player.r.points.add(gain)
    },

    buyables: {
        11: {
            cost() { return getBuyableAmount(this.layer, this.id).add(1).times(5) },
            title() { return 'Resource Package I' },
            display() { 
                let effect = new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
                return "Multiply resource gain<br><br>Current: x"+format(effect)+"<br>Next: x"+format(effect.times(2))+"<br><br>"+((hasUpgrade('r', 11))?"Req":"Cost")+": "+format(this.cost())+" machines<br>Bought: "+format(getBuyableAmount(this.layer, this.id), 0)
            },
            canAfford() { return player.m.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('r', 11)) player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },

    upgrades: {
        11: {
            fullDisplay() {
                return "<b>Resource Fusion</b><br>Buying Resource Package I no longer spend machines.<br><br>Cost: 52 machines"
            },
            canAfford() {
                return player.m.points.gte(52)
            },
            pay() {
                return player.m.points = player.m.points.sub(52)
            },
            unlocked() {return hasUpgrade('re', 12)}
        },
    }
})