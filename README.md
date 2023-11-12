# Compendium Browser

Tired of scrolling compendia? Easily browse and filter for spells, feats, items, and NPCs using Compendium Browser.

Compendium Browser is faster and better-behaved; **it no longer loads all the compendia into memory on start-up** (which sometimes hung servers because of memory or CPU requirements). Instead, it filters and loads on-demand, as well as giving you a Module Setting to control how many rows are loaded at a time.

## Installation

1. Go to the Add-on Modules tab in Foundry Setup
2. Click Install Module and search for **Compendium Browser** OR paste this link: `https://github.com/League-of-Foundry-Developers/compendium-browser/releases/latest/download/module.json`
3. Open your world and go to Settings>Manage Modules and enable Compendium Browser

![example](preview.jpg)

## Details

Only the Gamemaster has access to the Settings, where they can enable or disable player access to the spell or npc-browser. It is **highly** recommended to disable any compendia that do not contain spell or should not be used in the NPC Browser. .

This application enables anyone to add their own custom spell or npc filters via the api. After initialization the app can be found under game.compendiumBrowser where either addSpellFilter or addNpcFilter can be used to add a filter. This does support any data that the spell or npc has, including flags.

## License

This project is a fork of Compendium Browser by [Felix Müller](https://github.com/syl3r86).

## Community Contribution

See the [CONTRIBUTING](/CONTRIBUTING.md) file for information about how you can help this project.
