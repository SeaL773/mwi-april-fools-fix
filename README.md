# MWI April Fools Fix — Philosopher's Stone Remover

A one-time fix userscript for [Milky Way Idle](https://www.milkywayidle.com/) that removes Philosopher's Stone entries from [Edible Tools](https://greasyfork.org/en/scripts/499963) chest statistics.

## Background

On April 1st, 2026, the MWI team added an April Fools event that allowed Philosopher's Stone to drop from all chest types. The [Edible Tools](https://greasyfork.org/en/scripts/499963) userscript recorded these drops into its chest statistics, causing inaccurate profit calculations even after the event ended.

This script scans your Edible Tools chest data, shows you exactly which chests are affected, and lets you remove the bad entries with one click.

## 背景

2026年4月1日愚人节，MWI 官方在所有宝箱中加入了 Philosopher's Stone（贤者之石）掉落。[食用工具（Edible Tools）](https://greasyfork.org/en/scripts/499963) 油猴插件将这些掉落记录进了开箱统计数据，导致利润计算不准确。

本脚本可以扫描你的食用工具开箱数据，显示哪些宝箱受到影响，并一键清除这些异常条目。

## Screenshot / 截图

| Scan Results / 扫描结果 | Fix Complete / 修复完成 |
|:---:|:---:|
| ![Scan Results](https://raw.githubusercontent.com/SeaL773/mwi-april-fools-fix/main/screenshots/scan_results.png) | ![Fix Complete](https://raw.githubusercontent.com/SeaL773/mwi-april-fools-fix/main/screenshots/fix_complete.png) |

## Features / 功能

- Adds an **"April Fools Fix"** link to the left sidebar (below Chest Statistics)
- Click to open a panel showing all affected chest types and quantities
- One-click **Remove All** to clean up the data
- Works for all characters on your account
- Safe — only deletes Philosopher's Stone entries, nothing else

---

- 在左侧菜单栏添加 **"April Fools Fix"** 链接（Chest Statistics 下方）
- 点击打开面板，显示所有受影响的宝箱类型和数量
- 一键 **Remove All** 清除数据
- 支持同账号下的所有角色
- 安全 — 只删除 Philosopher's Stone 条目，不影响其他数据

## Installation / 安装

1. Install [Tampermonkey](https://www.tampermonkey.net/) or any userscript manager / 安装 [Tampermonkey](https://www.tampermonkey.net/) 或其他油猴管理器
2. **[Click here to install the script / 点击安装脚本](https://github.com/SeaL773/mwi-april-fools-fix/raw/main/fix_philosopher_stone.user.js)**
3. Go to [Milky Way Idle](https://www.milkywayidle.com/) and refresh the page / 打开 MWI 并刷新页面
4. Click **"April Fools Fix"** in the left sidebar / 点击左侧菜单中的 **"April Fools Fix"**
5. Review the affected chests and click **Remove All** / 查看受影响的宝箱并点击 **Remove All**
6. Refresh the page to see the updated statistics / 刷新页面查看更新后的统计
7. Uninstall the script — it's a one-time fix / 卸载脚本（一次性修复）

## Manual Fix (Console) / 手动修复

If you prefer not to install a userscript, paste this into your browser console (F12) on the MWI page:

如果不想安装油猴脚本，也可以在 MWI 页面按 F12 打开控制台，粘贴以下代码：

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

## Compatibility / 兼容性

- Requires [Edible Tools](https://greasyfork.org/en/scripts/499963) / 需要安装 [食用工具](https://greasyfork.org/en/scripts/499963)
- Tested on Chrome 146, should work on any modern browser / 在 Chrome 146 上测试通过，兼容所有现代浏览器
- Tampermonkey / Violentmonkey / Greasemonkey compatible / 支持各类油猴管理器

## License / 许可证

[MIT](LICENSE)
