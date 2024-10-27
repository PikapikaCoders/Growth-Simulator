addLayer("f", {
    name: "fertilizer", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        prestige: new Decimal(0),
    }},
    color: "#ab5800",
    branches: ['p'],
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "fertilizer", // Name of prestige currency
    baseResource: "plants", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for fertilizer", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.f.unlocked},
    effectDescription() { 
        return "which are increasing plants gain by x"+format(player.f.points.times(5).pow(0.4).times(new Decimal(1.35).pow(getBuyableAmount('f', 11))))
    },

    onPrestige() {
        player.f.prestige = player.f.prestige.add(1)
    },

    buyables: {
        11: {
            cost() { return new Decimal(3).pow(getBuyableAmount(this.layer, this.id).add(2).times(0.5)) },
            title() { return 'Better Fertilizer' },
            display() { 
                let effect = new Decimal(1.35).pow(getBuyableAmount(this.layer, this.id))
                return "Multiply fertilizer increase on plants gain<br><br>Current: x"+format(effect)+"<br>Next: x"+format(effect.times(1.35))+"<br><br>Cost: "+format(this.cost())+" fertilizer<br>Bought: "+format(getBuyableAmount(this.layer, this.id), 0)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
})