addLayer("re", {
    name: "research", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "RE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        prestige: new Decimal(0),
    }},
    color: "#FFFFFF",
    branches: ['m', 'r'],
    requires: new Decimal(3e7), // Can be a function that takes requirement increases into account
    resource: "research", // Name of prestige currency
    baseResource: "resources", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have

    getResetGain() {
        mult = new Decimal(1)
        exp = new Decimal(1)

        return player.m.points.div(5).floor().sub(1).sub(player.re.points).max(0).times(mult).pow(exp)
    },

    getNextAt() {
        mult = new Decimal(1)
        exp = new Decimal(1)

        return getResetGain(this.layer).pow(Decimal.div(1, exp)).div(mult).add(2).add(player.re.points).times(5)
    },

    canReset() {
        return getResetGain(this.layer).gte(1)
    },

    prestigeButtonText() {
        if (getResetGain(this.layer).lt(1)) return 'Reset for +'+format(getResetGain(this.layer))+' research.<br><br>Req: '+format(player.m.points)+' / '+format(getNextAt(this.layer))+' machines'
        else if (getResetGain(this.layer).lt(100)) return 'Reset for +'+format(getResetGain(this.layer))+' research.<br><br>Next: '+format(player.m.points)+' / '+format(getNextAt(this.layer))+' machines'
        else return 'Reset for +'+format(getResetGain(this.layer))+' research'
    },

    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for research", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.a.unlocked && player.re.unlocked},
    canBuyMax(){return true},
    effectDescription() { 
        base = new Decimal(1.2)
        if (hasUpgrade('re', 11)) base = base.add(0.05)

        effect = Decimal.pow(base, player.re.points.sub(1).max(0)).times(Decimal.pow(1.5, player.re.points.min(1)))
        return "which is increasing growth and plant gain by x"+format(effect)
    },

    onPrestige() {
        player.re.prestige = player.re.prestige.add(1)
    },

    doReset(resettingLayer) {
        let keep = []

        if (layers[resettingLayer].row > this.row) layerDataReset("re", keep)
	},

    update() {
        if (player.m.points.gte(10) || player.re.best.gte(1)) {
            player.re.unlocked = true
        } else {
            player.re.unlocked = false
        }
    },

    milestones: {
        0: {
            requirementDescription: "10 Machines",
            done() {return player.f.points.gte(30)},
            effectDescription: "Keep fertilizer amount, fertilizer and resource buyables when resetting for research",
        },
        1: {
            requirementDescription: "8 Research",
            done() {return player.re.points.gte(8)},
            effectDescription: "Unlock research upgrades",
            unlocked() {return hasMilestone('re', 0)},
        },
        2: {
            requirementDescription: "12 Research",
            done() {return player.re.points.gte(12)},
            effectDescription: "Keep machine and resources upgrades when resetting for research",
            unlocked() {return hasMilestone('re', 1)},
        },
    },

    upgrades: {
        11: {
            title: "Computer",
            description: "Each research boosts +0.05x more",
            cost: new Decimal(5),
            unlocked() { return hasMilestone('re', 1) }
        },
        12: {
            title: "Storage",
            description: "Unlock new machines and resources upgrades",
            cost: new Decimal(8),
            unlocked() { return hasUpgrade('re', 11) && hasMilestone('re', 1) }
        },
        13: {
            title: "Propeller",
            description: "Speed Growth also affect velocity effect",
            cost: new Decimal(11),
            unlocked() { return hasUpgrade('re', 11) && hasMilestone('re', 1) }
        },
    },
})