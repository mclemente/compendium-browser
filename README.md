# Compendium Browser

A module to easily browse and filter spells, feats, items, and npcs loaded from compendia.
**NEW** Compendium Browser is faster and better-behaved; **it no longer loads all the compendia into memory on start-up** (which sometimes hung servers because of memory or CPU requirements). Instead, it filters and loads on-demand, as well as giving you a Module Setting to control how many rows are loaded at a time.

## Installation
1. Copy this link and use it in Foundrys Module Manager to install the Module

    > https://raw.githubusercontent.com/syl3r86/compendium-browser/master/module.json
    
2. Enable the Module in your Worlds Module Settings

![example](preview.jpg)

## Details
Only the Gamemaster has access to the Settings, where they can enable or disable player access to the spell or npc-browser. It is **highly** recommended to disable any compendia that do not contain spell or should not be used in the NPC Browser. .

This application enables anyone to add their own custom spell or npc filters via the api. After initialization the app can be found under game.compendiumBrowser where either addSpellFilter or addNpcFilter can be used to add a filter. This does support any data that the spell or npc has, including flags.

All filters featured in the app are included in this manner and can be found in the compendium-browser.js at around line 726.

## Contribution
If you feel like supporting my work, feel free to leave a tip at my paypal felix.mueller.86@web.de

## License
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons Licence" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Compendium Browser - a module for Foundry VTT -</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/syl3r86?tab=repositories" property="cc:attributionName" rel="cc:attributionURL">Felix Müller</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).
