addLayer("p", {
    name: "plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        incChance: new Decimal(0.3),
        prestige: new Decimal(0),
    }},
    color: "#FF00FF",
    requires: new Decimal(2), // Can be a function that takes requirement increases into account
    resource: "plants", // Name of prestige currency
    baseResource: "growth", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.8, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (player.f.points.gt(0)) mult = player.f.points.times(5).pow(0.4)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for plants", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration() { return (hasUpgrade('p', 31))?0.05:0 },

    update() {
        //Increase Chance Calculator
        let chance = new Decimal(0.3)
        if (hasUpgrade('p', 11)) chance = chance.times(1.5)
        if (hasUpgrade('p', 12)) chance = chance.times(1.5)
        if (hasUpgrade('p', 13)) chance = chance.times(1.5)
        player.g.baseMult = chance
        if (hasUpgrade('p', 21)) chance = chance.times(player.points.pow(0.1))
        if (hasUpgrade('p', 22)) chance = chance.times(player.p.points.pow(0.2))
        if (hasUpgrade('p', 23)) chance = chance.times(player.p.points.pow(0.1))
        player.p.incChance = chance
    },

    onPrestige() {
        player.p.prestige = player.p.prestige.add(1)
    },

    upgrades: {
        11: {
            title: "Super Growth I",
            description: "Growth Rate x1.5",
            cost: new Decimal(1),
        },
        12: {
            title: "Super Growth II",
            description: "Growth Rate x1.5",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade('p', 11)}
        },
        13: {
            title: "Super Growth III",
            description: "Growth Rate x1.5",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade('p', 12)}
        },
        21: {
            title: "Manipulate I",
            description: "Growth Rate increased by Growth",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade('p', 12)}
        },
        22: {
            title: "Manipulate II",
            description: "Growth Rate increased by Plants",
            cost: new Decimal(30),
            unlocked() {return hasUpgrade('p', 21)}
        },
        23: {
            title: "Manipulate II",
            description: "Growth Rate increased by Plant Reset",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade('p', 22)}
        },
        31: {
            title: "Point Factory",
            description: "Generate 5% of Plant you'd gain when reset every second",
            cost: new Decimal(200),
            unlocked() {return hasUpgrade('p', 13), hasUpgrade('p', 23)}
        },
    },
})
