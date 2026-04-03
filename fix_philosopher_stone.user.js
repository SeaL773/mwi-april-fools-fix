// ==UserScript==
// @name         MWI Fix - April Fools Philosopher's Stone Remover
// @namespace    https://milkywayidle.com
// @version      1.0
// @description  Remove Philosopher's Stone entries from Edible Tools chest statistics (April Fools 2026 bug)
// @match        https://www.milkywayidle.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @author       SeaL773
// @homepageURL  https://github.com/SeaL773/mwi-april-fools-fix
// @supportURL   https://github.com/SeaL773/mwi-april-fools-fix/issues
// ==/UserScript==

(function() {
    "use strict";

    var ITEM_KEY = "Philosopher\u0027s Stone";
    var CHEST_DATA_KEY = "\u5f00\u7bb1\u6570\u636e";
    var ITEMS_KEY = "\u83b7\u5f97\u7269\u54c1";
    var QTY_KEY = "\u6570\u91cf";

    function waitForNav(cb) {
        var check = setInterval(function() {
            var container = document.querySelector("div[class*=NavigationBar_minorNavigationLinks]");
            if (container) {
                clearInterval(check);
                cb(container);
            }
        }, 1000);
    }

    function scan() {
        var raw = localStorage.getItem("Edible_Tools");
        if (!raw) return [];
        var et = JSON.parse(raw);
        if (!et.Chest_Open_Data) return [];
        var results = [];
        var allPlayers = et.Chest_Open_Data;
        for (var pid in allPlayers) {
            var playerData = allPlayers[pid];
            if (!playerData) continue;
            var nickname = playerData["\u73a9\u5bb6\u6635\u79f0"] || pid;
            var chests = playerData[CHEST_DATA_KEY];
            if (!chests) continue;
            for (var name in chests) {
                var items = chests[name][ITEMS_KEY];
                if (items && items[ITEM_KEY]) {
                    results.push({
                        pid: pid,
                        nickname: nickname,
                        chest: name,
                        qty: items[ITEM_KEY][QTY_KEY] || 0
                    });
                }
            }
        }
        return results;
    }

    function doRemove() {
        var raw = localStorage.getItem("Edible_Tools");
        if (!raw) return 0;
        var et = JSON.parse(raw);
        if (!et.Chest_Open_Data) return 0;
        var count = 0;
        var allPlayers = et.Chest_Open_Data;
        for (var pid in allPlayers) {
            var playerData = allPlayers[pid];
            if (!playerData) continue;
            var chests = playerData[CHEST_DATA_KEY];
            if (!chests) continue;
            for (var name in chests) {
                var items = chests[name][ITEMS_KEY];
                if (items && items[ITEM_KEY]) {
                    delete items[ITEM_KEY];
                    count++;
                }
            }
        }
        localStorage.setItem("Edible_Tools", JSON.stringify(et));
        return count;
    }

    function createPanel() {
        var overlay = document.createElement("div");
        overlay.id = "philo-fix-overlay";
        overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;";

        var panel = document.createElement("div");
        panel.style.cssText = "background:#1a1a2e;border:1px solid #444;border-radius:8px;padding:20px;min-width:400px;max-width:600px;color:#ddd;font-family:sans-serif;max-height:80vh;overflow-y:auto;";

        var title = document.createElement("h2");
        title.textContent = "\uD83D\uDD27 April Fools Fix";
        title.style.cssText = "margin:0 0 4px 0;color:#f0a030;font-size:18px;";
        panel.appendChild(title);

        var subtitle = document.createElement("div");
        subtitle.textContent = "Remove Philosopher\u0027s Stone from Edible Tools chest data";
        subtitle.style.cssText = "color:#999;font-size:12px;margin-bottom:16px;";
        panel.appendChild(subtitle);

        var results = scan();

        if (results.length === 0) {
            var noData = document.createElement("div");
            noData.style.cssText = "text-align:center;padding:30px 0;";
            noData.innerHTML = "<div style='font-size:32px;margin-bottom:10px;'>\u2705</div><div style='color:#8f8;font-size:14px;'>No Philosopher\u0027s Stone found in chest data.</div><div style='color:#888;font-size:12px;margin-top:6px;'>Nothing to fix!</div>";
            panel.appendChild(noData);
        } else {
            var totalQty = 0;
            results.forEach(function(r) { totalQty += r.qty; });

            var summary = document.createElement("div");
            summary.style.cssText = "background:#2a1a1a;border:1px solid #633;border-radius:6px;padding:10px 14px;margin-bottom:14px;";
            summary.innerHTML = "<span style='color:#f88;'>\u26A0 Found " + totalQty + " Philosopher\u0027s Stone</span><span style='color:#999;'> across " + results.length + " chest type(s)</span>";
            panel.appendChild(summary);

            var table = document.createElement("table");
            table.style.cssText = "width:100%;border-collapse:collapse;margin-bottom:16px;";

            var thead = document.createElement("thead");
            thead.innerHTML = "<tr style='border-bottom:1px solid #444;'><th style='text-align:left;padding:6px 8px;color:#aaa;font-size:12px;'>Player</th><th style='text-align:left;padding:6px 8px;color:#aaa;font-size:12px;'>Chest Type</th><th style='text-align:right;padding:6px 8px;color:#aaa;font-size:12px;'>Qty</th></tr>";
            table.appendChild(thead);

            var tbody = document.createElement("tbody");
            results.forEach(function(r) {
                var tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid #333";
                tr.innerHTML = "<td style='padding:6px 8px;font-size:13px;color:#ccc;'>" + r.nickname + "</td><td style='padding:6px 8px;font-size:13px;color:#ddd;'>" + r.chest + "</td><td style='padding:6px 8px;font-size:13px;color:#f88;text-align:right;font-weight:bold;'>" + r.qty + "</td>";
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            panel.appendChild(table);

            var btnRow = document.createElement("div");
            btnRow.style.cssText = "display:flex;gap:10px;justify-content:flex-end;";

            var removeBtn = document.createElement("button");
            removeBtn.textContent = "\uD83D\uDDD1 Remove All";
            removeBtn.style.cssText = "background:#c33;color:#fff;border:none;border-radius:4px;padding:8px 20px;cursor:pointer;font-size:14px;font-weight:bold;";
            removeBtn.onmouseover = function() { this.style.background = "#e44"; };
            removeBtn.onmouseout = function() { this.style.background = "#c33"; };
            removeBtn.onclick = function() {
                var count = doRemove();
                panel.innerHTML = "";
                var done = document.createElement("div");
                done.style.cssText = "text-align:center;padding:30px 0;";
                done.innerHTML = "<div style='font-size:32px;margin-bottom:10px;'>\u2705</div><div style='color:#8f8;font-size:16px;font-weight:bold;'>Removed from " + count + " chest(s)!</div><div style='color:#999;font-size:13px;margin-top:8px;'>Refresh the page to see changes.</div><div style='color:#888;font-size:12px;margin-top:4px;'>You can uninstall this script now.</div>";
                panel.appendChild(done);
                var okBtn = document.createElement("button");
                okBtn.textContent = "OK";
                okBtn.style.cssText = "display:block;margin:16px auto 0;background:#444;color:#fff;border:none;border-radius:4px;padding:8px 30px;cursor:pointer;font-size:14px;";
                okBtn.onclick = function() { overlay.remove(); };
                panel.appendChild(okBtn);
            };
            btnRow.appendChild(removeBtn);
            panel.appendChild(btnRow);
        }

        var closeBtn = document.createElement("button");
        closeBtn.textContent = "\u2715 Close";
        closeBtn.style.cssText = "display:block;margin:12px auto 0;background:transparent;color:#888;border:1px solid #555;border-radius:4px;padding:6px 20px;cursor:pointer;font-size:12px;";
        closeBtn.onclick = function() { overlay.remove(); };
        panel.appendChild(closeBtn);

        overlay.appendChild(panel);
        overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
    }

    function addNavItem(container) {
        var links = container.querySelectorAll("div[class*=NavigationBar_minorNavigationLink]");
        var chestStatsLink = null;
        var newsLink = null;
        for (var i = 0; i < links.length; i++) {
            if (links[i].textContent.indexOf("Chest Statistics") !== -1) chestStatsLink = links[i];
            if (links[i].textContent.indexOf("News") !== -1 && !newsLink) newsLink = links[i];
        }

        var item = document.createElement("div");
        if (links.length > 0) {
            item.className = links[0].className;
        }
        item.style.color = "gold";
        item.style.cursor = "pointer";
        item.textContent = "April Fools Fix";

        item.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            createPanel();
        };

        // Insert after Chest Statistics (before News)
        if (newsLink) {
            container.insertBefore(item, newsLink);
        } else if (chestStatsLink && chestStatsLink.nextSibling) {
            container.insertBefore(item, chestStatsLink.nextSibling);
        } else {
            container.appendChild(item);
        }
    }

    waitForNav(addNavItem);
})();
