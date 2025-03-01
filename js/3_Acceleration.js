addLayer("a", {
    name: "acceleration", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        prestige: new Decimal(0),
        velocity: new Decimal(0),
    }},
    color: "#FFFF00",
    branches: ['f', 'r'],
    requires: new Decimal(30), // Can be a function that takes requirement increases into account
    resource: "acceleration", // Name of prestige currency
    baseResource: "fertilizer", // Name of resource prestige is based on
    baseAmount() {return player.f.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for acceleration", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.r.unlocked},
    canBuyMax(){return true},
    effectDescription() { 
        return "which is generating "+format(player.a.points.pow(3.5).times(Decimal.pow(2, getBuyableAmount("a", 11))))+" velocity per second"
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text",
            function() { return 'You have ' + format(player.f.points) + ' fertilizer' },
        ], "blank",
        "milestones",
        ["display-text",
            function() { 
                effect = player.a.velocity.pow(0.2).max(1)
                if (hasUpgrade('re', 13)) effect = effect.times(Decimal.pow(2, getBuyableAmount("a", 11)))
                return 'You have ' + format(player.a.velocity) + ' velocity, which is increasing plants gain by x'+ format(effect)
            },
        ], "blank",
        "buyables",
    ],


    onPrestige() {
        player.a.prestige = player.a.prestige.add(1)
    },

    doReset(resettingLayer) {
        let keep = []

        if (layers[resettingLayer].row > this.row) layerDataReset("a", keep)
	},

    update() {
        let gain = new Decimal(0.05).times(player.a.points.pow(2)).times(Decimal.pow(2, getBuyableAmount("a", 11)))
        player.a.velocity = player.a.velocity.add(gain)
    },

    milestones: {
        0: {
            requirementDescription: "30 Fertilizer",
            done() {return player.f.points.gte(30)},
            effectDescription: "Keep machines upgrades and resource buyables when resetting for acceleration",
        },
        1: {
            requirementDescription: "7 Acceleration",
            done() {return player.a.points.gte(7)},
            effectDescription: "Unlock velocity buyables",
            unlocked() {return hasMilestone('a', 0)},
        },
        2: {
            requirementDescription: "9 Acceleration",
            done() {return player.a.points.gte(9)},
            effectDescription: "Keep fertilizer buyables and resources upgrades when resetting for acceleration",
            unlocked() {return hasMilestone('a', 1)},
        },
    },

    buyables: {
        11: {
            cost() { return Decimal.pow(3, getBuyableAmount(this.layer, this.id)).times(10000) },
            title() { return 'Speed Growth' },
            display() { 
                let effect = Decimal.pow(2, getBuyableAmount(this.layer, this.id))
                return "Multiply acceleration increase on velocity"+((hasUpgrade('re', 13))?" and velocity increase on plants":"")+"<br><br>Current: x"+format(effect)+"<br>Next: x"+format(effect.times(2))+"<br><br>Cost: "+format(this.cost())+" fertilizer<br>Bought: "+formatWhole(getBuyableAmount(this.layer, this.id), 0)
            },
            canAfford() { return player[this.layer].velocity.gte(this.cost()) },
            buy() {
                player[this.layer].velocity = player[this.layer].velocity.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasMilestone('a', 1) }
        },
    },
})
