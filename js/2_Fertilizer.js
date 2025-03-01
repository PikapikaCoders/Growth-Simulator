addLayer("f", {
    name: "fertilizer", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        prestige: new Decimal(0),
        keepPlants: new Decimal(0),
    }},
    color: "#AB5800",
    branches: ['p'],
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "fertilizer", // Name of prestige currency
    baseResource: "plants", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('m', 31) && player.m.points.gte(1)) mult = mult.times(player.m.points.div(10))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for fertilizer", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    effectDescription() { 
        return "which are increasing plants gain by x"+format(player.f.points.times(5).pow(0.4).times(new Decimal(1.35).pow(getBuyableAmount('f', 11).times(new Decimal(1.2).pow(getBuyableAmount('f', 12))))).max(1))
    },

    softcap: new Decimal(2000),
    softcapPower: new Decimal(0.3),

    onPrestige() {
        player.f.prestige = player.f.prestige.add(1)
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row >= this.row) player.r.points = new Decimal(0)

        let keep = []
        if (layers[resettingLayer].layer == "re" && hasMilestone('re', 0)) keep.push("buyables")
        if (layers[resettingLayer].layer == "a" && hasMilestone('a', 2)) keep.push("buyables")

        if (layers[resettingLayer].row > this.row) layerDataReset("f", keep)
	},

    buyables: {
        11: {
            cost() { return new Decimal(3).pow(getBuyableAmount(this.layer, this.id).add(2).times(0.5)).floor() },
            title() { return 'Better Fertilizer I' },
            display() { 
                let effect = new Decimal(1.35).pow(getBuyableAmount(this.layer, this.id).times(new Decimal(1.2).pow(getBuyableAmount('f', 12))))
                return "Multiply fertilizer increase on plants gain<br><br>Current: x"+format(effect)+"<br>Next: x"+format(effect.times(1.35))+"<br><br>Cost: "+format(this.cost())+" fertilizer<br>Bought: "+formatWhole(getBuyableAmount(this.layer, this.id), 0)+"/"+formatWhole(this.purchaseLimit)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: 15,
        },

        12: {
            cost() { return new Decimal(3).pow(getBuyableAmount(this.layer, this.id)).times(20).floor() },
            title() { return 'Better Fertilizer II' },
            display() { 
                let effect = new Decimal(1.2).pow(getBuyableAmount(this.layer, this.id))
                return "Multiply Better Fertilizer I increase on fertilizer<br><br>Current: x"+format(effect)+"<br>Next: x"+format(effect.times(1.2))+"<br><br>Cost: "+format(this.cost())+" fertilizer<br>Bought: "+formatWhole(getBuyableAmount(this.layer, this.id), 0)+"/"+formatWhole(this.purchaseLimit)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: 5,
            unlocked() { return player.re.best.gte(1) }
        },
    },
})
