// ==UserScript==
// @name         MWI Edible Tools - Remove April Fools Philosopher's Stone
// @namespace    https://milkywayidle.com
// @version      1.0
// @description  One-time fix: removes Philosopher's Stone from Edible Tools chest statistics (April Fools 2026 bug)
// @match        https://www.milkywayidle.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    "use strict";
    var raw = localStorage.getItem("Edible_Tools");
    if (!raw) return;
    var et = JSON.parse(raw);
    if (!et.Chest_Open_Data) return;
    var allPlayers = et.Chest_Open_Data;
    var key = "Philosopher\u0027s Stone";
    var totalRemoved = [];
    for (var pid in allPlayers) {
        var playerData = allPlayers[pid];
        if (!playerData) continue;
        var chests = playerData["\u5f00\u7bb1\u6570\u636e"];
        if (!chests) continue;
        for (var name in chests) {
            var items = chests[name]["\u83b7\u5f97\u7269\u54c1"];
            if (items && items[key]) {
                totalRemoved.push("[" + pid + "] " + name + ": qty=" + items[key]["\u6570\u91cf"]);
                delete items[key];
            }
        }
    }
    if (totalRemoved.length > 0) {
        localStorage.setItem("Edible_Tools", JSON.stringify(et));
        console.log("[Fix] Removed Philosopher\u0027s Stone from chest data:", totalRemoved);
        alert("Fixed! Removed Philosopher\u0027s Stone from " + totalRemoved.length + " chest(s).\nRefresh the page to see changes.\n\nYou can now uninstall this script.");
    } else {
        console.log("[Fix] No Philosopher\u0027s Stone found in chest data. Nothing to do.");
    }
})();
