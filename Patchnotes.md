#0.8.2
- Fixed Class searching for spells - issue: #43
- Fixed Drag-and-Drop error in Foundry V10  - issue: #41
#0.8
- Merged PR [League-of-Foundry-Developers/compendium-browser#40](https://github.com/League-of-Foundry-Developers/compendium-browser/pull/40): Foundry v10 support
#0.7
Works only with Foundry v0.8 and 9
##0.7.2
- Merged PR [League-of-Foundry-Developers/compendium-browser#33](https://github.com/League-of-Foundry-Developers/compendium-browser/pull/33)
- Fixed: Issue [League-of-Foundry-Developers/compendium-browser#29](https://github.com/League-of-Foundry-Developers/compendium-browser/issues/29)
- Fixed: Issue [League-of-Foundry-Developers/compendium-browser#30](https://github.com/League-of-Foundry-Developers/compendium-browser/issues/30)
- Fixed: Issue [League-of-Foundry-Developers/compendium-browser#31](https://github.com/League-of-Foundry-Developers/compendium-browser/issues/31)
- Change message to "Loading..." until we're done, then "Loaded" (also when we hit the maxLoaded) 

##0.7.1
- Merged PR [League-of-Foundry-Developers/compendium-browser#26](https://github.com/League-of-Foundry-Developers/compendium-browser/pull/26)
- Fixed: Issue [League-of-Foundry-Developers/compendium-browser#25](https://github.com/League-of-Foundry-Developers/compendium-browser/issues/25)

##v0.7.0 (only Foundry 0.8+)
- Merged PR #24 (performance speed ups)
- Fixed: Issue [League-of-Foundry-Developers/compendium-browser#19](https://github.com/League-of-Foundry-Developers/compendium-browser/issues/19)
- Fixed: Issue [League-of-Foundry-Developers/compendium-browser#7](https://github.com/League-of-Foundry-Developers/compendium-browser/issues/7)

##v0.6.0
- Merged PR #14, #8 (classes for new spells and Optional Class Features in Tasha's)
- Manually merged PR #3 (German and Spanish translations)

##v0.5.0
- Fixed: Issue #17 (error in filtering NPCs by Creature Type)

##v0.4.5
- Fixed: [Suggestion] Show compendium source in results; Issue #11
- Fixed: Spells from non-system compendium show up in items tab. Issue#10

##v0.4.3

##v0.3.1
  - fixed a bug that prevented loading when Class type items were loaded.
  - fixed a bug that prevented disabled the scrollbar in the settings tab.

##v0.3.0
 - improved load times by lazyloading images
 - fixed some css problems
 - new Feature: Feat Browser
    - Compendium Browser now has a new section for Feats
    - lets you filter by source, class (as set in the requirements field), activation cost, damage type and if it uses ressources
 - new Feature: Item Browser
    - Compendium Browser now has a new section for all inventory Items
    - All item Packs (such as Explorer's Pack) are configured and you can browse a List of all Items contained in a pack!
      - this list can be modified by editing the "item-packs.json" file to customize your packs
    - many further filters available!

##v0.2.1
 - fixed an issue that prevented the rendering of the Button to open the browser

##v0.2
  - fixed a bug that could prevent proper npc loading
  - added a filter for "Source" for both spells and npcs
  - migrated to the new TabsV2
  - added a Reset Filters button
  - Added the Artificer class, thanks to Tielc#7191 for that

