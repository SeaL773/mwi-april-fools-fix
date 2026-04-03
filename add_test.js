// Add test Philosopher's Stone to Pirate Refinement Chest
(function() {
    var et = JSON.parse(localStorage.getItem("Edible_Tools"));
    var items = et.Chest_Open_Data["259092"]["\u5f00\u7bb1\u6570\u636e"]["Pirate Refinement Chest"]["\u83b7\u5f97\u7269\u54c1"];
    items["Philosopher\u0027s Stone"] = {"\u6570\u91cf": 3, "\u603b\u8ba1Ask\u4ef7\u503c": 0, "\u603b\u8ba1Bid\u4ef7\u503c": 0};
    localStorage.setItem("Edible_Tools", JSON.stringify(et));
    console.log("Added test data. Refresh page.");
})();
