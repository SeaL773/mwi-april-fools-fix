// Remove Philosopher's Stone from ALL players' chest data
(function() {
    var et = JSON.parse(localStorage.getItem("Edible_Tools"));
    var allPlayers = et.Chest_Open_Data;
    var key = "Philosopher\u0027s Stone";
    var totalRemoved = [];
    for (var pid in allPlayers) {
        var chests = allPlayers[pid]["\u5f00\u7bb1\u6570\u636e"];
        if (!chests) continue;
        for (var name in chests) {
            var items = chests[name]["\u83b7\u5f97\u7269\u54c1"];
            if (items && items[key]) {
                totalRemoved.push("[" + pid + "] " + name + ": qty=" + items[key]["\u6570\u91cf"]);
                delete items[key];
            }
        }
    }
    localStorage.setItem("Edible_Tools", JSON.stringify(et));
    console.log("Removed:", totalRemoved);
    console.log("Done! Refresh page.");
})();
