addLayer("ar", {
    name: "auto-reset", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AR", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        baseMult: new Decimal(1),
        fLimit: new Decimal(1),
        fToggle: false,
        mLimit: new Decimal(1),
        mToggle: false,
    }},
    color: "#FFD6E6",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.ar.unlocked},
    tooltip: "Auto-reset Info",

    tabFormat: [
        ["display-text",
            function() {
                return 'Auto-reset Settings<hr>'
            }, {"font-size": "32px", "color": "#00FFFF"}
        ], "blank",

        ["display-text",
            function() {
                if (hasUpgrade('m', 22)) return 'Amount of fertilizer until reset:'
                else return '[LOCKED!]'
            }
        ], "blank",
        ["text-input", "fLimit"], "blank",
        ["toggle", ["ar", "fToggle"]], "blank",
        ["display-text", function() { return '<hr>' }], "blank",

        ["display-text",
            function() {
                if (hasUpgrade('m', 24)) return 'Amount of machines until reset: 1'
                else return '[LOCKED!]'
            }
        ], "blank",
        ["toggle", ["ar", "mToggle"]], "blank",
        ["display-text", function() { return '<hr>' }], "blank",
    ],

    update() {
        if (hasUpgrade('m', 22)) player.ar.unlocked = true
    },

    automate() {
        if (hasUpgrade('m', 22) && player.ar.fToggle && getResetGain("f").gte(player.ar.fLimit)) {
            player.f.points = player.f.points.add(getResetGain("f"))
            doReset("f", true)
        }

        if (hasUpgrade('m', 24) && player.ar.mToggle && canReset("m")) {
            player.m.points = player.m.points.add(1)
            doReset("m", true)
        }
    },
})