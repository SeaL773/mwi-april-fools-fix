// Fix: Remove Philosopher's Stone from all chest open data (April Fools bug)
(function() {
    var et = JSON.parse(localStorage.getItem("Edible_Tools"));
    var chests = et.Chest_Open_Data["259092"]["\u5f00\u7bb1\u6570\u636e"];
    var key = "Philosopher\u0027s Stone";
    var removed = [];
    for (var name in chests) {
        var items = chests[name]["\u83b7\u5f97\u7269\u54c1"];
        if (items && items[key]) {
            removed.push(name + ": qty=" + items[key]["\u6570\u91cf"]);
            delete items[key];
        }
    }
    localStorage.setItem("Edible_Tools", JSON.stringify(et));
    console.log("Removed from:", removed);
    console.log("Done! Refresh page to see changes.");
})();
