# MWI April Fools Fix — Philosopher's Stone Remover

A one-time fix userscript for [Milky Way Idle](https://www.milkywayidle.com/) that removes Philosopher's Stone entries from [Edible Tools](https://greasyfork.org/en/scripts/499963) chest statistics.

## Background

On April 1st, 2026, the MWI team added an April Fools event that allowed Philosopher's Stone to drop from all chest types. The [Edible Tools](https://greasyfork.org/en/scripts/499963) userscript recorded these drops into its chest statistics, causing inaccurate profit calculations even after the event ended.

This script scans your Edible Tools chest data, shows you exactly which chests are affected, and lets you remove the bad entries with one click.

## Features

- Adds an **"April Fools Fix"** link to the left sidebar (below Chest Statistics)
- Click to open a panel showing all affected chest types and quantities
- One-click **Remove All** to clean up the data
- Works for all characters on your account
- Safe — only deletes Philosopher's Stone entries, nothing else

## Screenshot

| Scan Results | After Fix |
|:---:|:---:|
| Shows affected chests | ✅ All clean |

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or any userscript manager)
2. **[Click here to install the script](../../raw/main/fix_philosopher_stone.user.js)**
3. Go to [Milky Way Idle](https://www.milkywayidle.com/) and refresh the page
4. Click **"April Fools Fix"** in the left sidebar
5. Review the affected chests and click **Remove All**
6. Refresh the page to see the updated statistics
7. Uninstall the script (it's a one-time fix)

## Manual Fix (Console)

If you prefer not to install a userscript, paste this into your browser console (F12) on the MWI page:

```js
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
```

## Compatibility

- Requires [Edible Tools](https://greasyfork.org/en/scripts/499963) to be installed (this script fixes its data)
- Tested on Chrome 146, should work on any modern browser
- Tampermonkey / Violentmonkey / Greasemonkey compatible

## License

[MIT](LICENSE)
