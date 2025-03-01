addLayer("m", {
    name: "machines", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        prestige: new Decimal(0),
    }},
    color: "#C4C4C4",
    branches: ['p'],
    requires: new Decimal(400), // Can be a function that takes requirement increases into account
    resource: "machines", // Name of prestige currency
    baseResource: "plants", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('m', 32) && player.f.points.gte(1)) mult = mult.div(player.f.points.pow(0.1))
        if (hasUpgrade('m', 33) && player.m.points.gte(1)) mult = mult.div(player.m.points.div(10))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for machines", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.f.unlocked},
    canBuyMax(){return true},

    onPrestige() {
        player.m.prestige = player.m.prestige.add(1)
    },

    doReset(resettingLayer) {
        let keep = []
        if (layers[resettingLayer].layer == "a" && hasMilestone('a', 0)) keep.push("upgrades")
        if (layers[resettingLayer].layer == "re" && hasMilestone('re', 2)) keep.push("upgrades")

        if (layers[resettingLayer].row > this.row) layerDataReset("m", keep)
    },

    upgrades: {
        11: {
            title: "Luck Machine I",
            description: "10% chance to have growth production x10 for a tick every tick",
            cost: new Decimal(1),
        },
        12: {
            title: "Luck Machine II",
            description: "Extra gain of growth based on growth chance x4",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade('m', 11)},
        },
        13: {
            title: "Luck Machine III",
            description: "1% chance to have growth chance x100 for a tick every tick",
            cost: new Decimal(7),
            unlocked() {return hasUpgrade('m', 12) && player.a.best.gte(1)},
        },
        14: {
            title: "Luck Machine IV",
            description: "0.1% chance to have gain 25,000% of plant you'd have gained when reset every tick",
            cost: new Decimal(55),
            unlocked() {return hasUpgrade('m', 13) && hasUpgrade('re', 12)},
        },
        21: {
            title: "Database I",
            description: "Automate plants upgrades",
            cost: new Decimal(4),
            unlocked() {return hasUpgrade('m', 12)},
        },
        22: {
            title: "Database II",
            description: "Unlock auto-reset for fertilizer",
            cost: new Decimal(7),
            unlocked() {return hasUpgrade('m', 21) && player.a.best.gte(1)},
        },
        23: {
            title: "Database III",
            description: "Generate 20% of plant you'd have gained when reset every second",
            cost: new Decimal(30),
            unlocked() {return hasUpgrade('m', 22)},
        },
        24: {
            title: "Database IV",
            description: "Unlock auto-reset for machines",
            cost: new Decimal(60),
            unlocked() {return hasUpgrade('m', 23) && hasUpgrade('re', 12)},
        },
        31: {
            title: "Synergy I",
            description: "Fertilizer increased by machines",
            cost: new Decimal(47),
            unlocked() {return hasUpgrade('m', 23) && hasUpgrade('re', 12)},
        },
        32: {
            title: "Synergy II",
            description: "Machines increased by fertilizer",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade('m', 31)},
        },
        33: {
            title: "Synergy III",
            description: "Machines increased by itself",
            cost: new Decimal(53),
            unlocked() {return hasUpgrade('m', 32)},
        },
    },
})
