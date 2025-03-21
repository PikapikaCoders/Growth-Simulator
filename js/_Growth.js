addLayer("g", {
    name: "growth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        baseMult: new Decimal(1),
    }},
    color: "#00FF00",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tooltip: "Growth Info",

    tabFormat: [
        ["display-text",
            function() {
                return 'You have <span style="color:#00FF00">'+format(player.points)+'</span> growth!<hr>'
            }, {"font-size": "32px", "color": "#00FFFF"}
        ], "blank",
        ["display-text",
            function() {
                return 'The growth rate is <span style="color:#00FF00">'+format(player.p.incChance)+'</span>.'
            }, {"font-size": "25px"}
        ],
        ["display-text",
            function() {
                let mult = ""
                let point = ""
                let prestigePoint = ""
                let prestige = ""
                if (hasUpgrade('p', 11)) mult = 'Base Multiplier on growth rate: x'+format(player.g.baseMult)
                if (hasUpgrade('p', 21)) point = 'Growth multiplier on growth rate: x'+format(player.points.pow(0.1))
                if (hasUpgrade('p', 22)) prestigePoint = 'Plant multiplier on growth rate: x'+format(player.p.points.pow(0.2)) 
                if (hasUpgrade('p', 23)) prestige = 'Plant Resets multiplier on growth rate: x'+format(player.p.prestige.pow(0.1))
                return mult+'<br>'+point+'<br>'+prestigePoint+'<br>'+prestige
            },
        ],
    ]
})
