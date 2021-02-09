/* eslint-disable valid-jsdoc */
/* eslint-disable complexity */
/**
 * @author Felix Müller aka syl3r86
 * @version 0.2.0
 */
/** @author Jeffrey Pugh aka @spetzel2020
 * @version 0.4.0
 */
/*
4-Feb-2020  0.4.0   Switch to not pre-loading the indexes, and instead do that at browsing time, to reduce server load and memory usage
                    Refactor some of the eslint warnings
5-Feb-2021          Don't do memory allocation - just browse compendia in real-time
                    After this, next step would be incremental (lazy) loading  
7-Feb-2021  0.4.1   Move load back to "ready" hook, but limit number loaded
8-Feb-2021  0.4.1   Bug fix: initialize() was setting this.spells, not this.items so CB was using twice the memory (once loaded incorrectly into this.spells
                    and once loaded on first getData() into this.items)
            0.4.1b  SpellBrowser -> CompendiumBrowser    
9-Feb-2021  0.4.1b  Call loadAndFilterItems instead of loadItems; filter as we go, limited by numToPreload   
            0.4.1c  Needed to pass specific spellFilters, itemFilters etc.              
*/

const CMPBrowser = {
    MODULE_NAME : "compendium-browser",
    MODULE_VERSION : "0.4.1",
    PRELOAD : 100,       //How many items, spells, or NPCs you load at once (to minimize memory usage)
    VISIBLE_ROWS : 50   //Plug for maximum rows visible in window - fetch more when actual < this
}

class CompendiumBrowser extends Application {
    
    async initialize() {
        // load settings
        if (this.settings === undefined) {
            this.initSettings();
        } 
        const numToPreload = game.settings.get(CMPBrowser.MODULE_NAME, "preload") ?? CMPBrowser.PRELOAD;
        this.loadItems(numToPreload).then(obj => {
            this.items = obj;
        });
        this.loadNpcs(numToPreload).then(obj => {
            this.npcs = obj;
        });  //Plug 
        await loadTemplates([
            "modules/compendium-browser/template/spell-browser.html",
            "modules/compendium-browser/template/npc-browser.html",
            "modules/compendium-browser/template/feat-browser.html",
            "modules/compendium-browser/template/item-browser.html",
            "modules/compendium-browser/template/filter-container.html",
            "modules/compendium-browser/template/settings.html"
        ]);

        this.hookCompendiumList();
        
        //Reset the filters used in the dialog
        this.spellFilters = {
            registeredFilterCategorys: {},
            activeFilters: {}
        };
        this.npcFilters = {
            registeredFilterCategorys: {},
            activeFilters: {}
        };
        this.featFilters = {
            registeredFilterCategorys: {},
            activeFilters: {}
        };
        this.itemFilters = {
            registeredFilterCategorys: {},
            activeFilters: {}
        };
    }


    async checkListsLoaded() {
        //Provides extra info not in the standard SRD, like which classes can learn a spell
        if (!this.classList) {
            this.classList = await fetch('modules/compendium-browser/spell-classes.json').then(result => {
                return result.json();
            }).then(obj => {
                return this.classList = obj;
            });
        }

        if (!this.packList) {
            this.packList = await fetch('modules/compendium-browser/item-packs.json').then(result => {
                return result.json();
            }).then(obj => {
                return this.packList = obj;
            });
        }

        if (!this.subClasses) {
            this.subClasses = await fetch('modules/compendium-browser/sub-classes.json').then(result => {
                return result.json();
            }).then(obj => {
                return this.subClasses = obj;
            });
        }
    }

    async loadAndFilterItems(numToPreload=CMPBrowser.PRELOAD) {
        console.log('Load and Filter Items | Started loading items');
        console.time("loadAndFilterItems");
        this.checkListsLoaded();

        let unfoundSpells = '';
        let numSpellsLoaded = 0;
        let numFeatsLoaded = 0;
        let numItemsLoaded = 0;
        let items = {
            spells: {},
            feats: {},
            items: {}
        };

        for (let pack of game.packs) {
            if (pack['metadata']['entity'] === "Item" && this.settings.loadedSpellCompendium[pack.collection].load) {
//FIXME: How much could we do with the loaded index rather than all content?                
                await pack.getContent().then(content => {
                    for (let item5e of content) {
                        const decoratedItem = this.decorateCompendiumEntry(item5e);
                        if (decoratedItem) {
                            decoratedItem.compendium = pack.collection;
                            if ((decoratedItem.type === "spell") && this.getFilterResult(decoratedItem, this.spellFilters.activeFilters) && (numSpellsLoaded < numToPreload)) {
                                numSpellsLoaded++;
                                items.spells[decoratedItem._id] = decoratedItem;
                            } else if ((decoratedItem.type === "feat") && this.getFilterResult(decoratedItem, this.featFilters.activeFilters) && (numFeatsLoaded < numToPreload)) {
                                numFeatsLoaded++;
                                items.feats[decoratedItem._id] = decoratedItem;
                            } else if (this.getFilterResult(decoratedItem, this.itemFilters.activeFilters) && (numItemsLoaded < numToPreload)) {
                                numItemsLoaded++;
                                items.items[decoratedItem._id] = decoratedItem;
                            }
                        }
                    }//for item5e of content
                });
            }
            if ((numSpellsLoaded >= numToPreload) && (numFeatsLoaded >= numToPreload) && (numItemsLoaded >= numToPreload)) break;
        }//for packs

/*
        if (unfoundSpells !== '') {
            console.log(`Load and Fliter Items | List of Spells that don't have a class associated to them:`);
            console.log(unfoundSpells);
        }      
*/
        this.itemsLoaded = true;  
        console.timeEnd("loadItems");
        console.log(`Load and Filter Items | Finished loading items: ${Object.keys(items.spells).length} spells, ${Object.keys(items.feats).length} features, ${Object.keys(items.items).length} items `);
        return items;
    }

    async loadItems(numToPreload=CMPBrowser.PRELOAD) {
        console.log('Item Browser | Started loading items');
        console.time("loadItems");
        this.checkListsLoaded();

        this.itemsLoaded = false;
       
        
        let unfoundSpells = '';
        let numSpellsLoaded = 0;
        let numFeatsLoaded = 0;
        let numItemsLoaded = 0;
        let items = {
            spells: {},
            feats: {},
            items: {}
        };


        for (let pack of game.packs) {
            if (pack['metadata']['entity'] === "Item" && this.settings.loadedSpellCompendium[pack.collection].load) {
                await pack.getContent().then(content => {
                    for (let item5e of content) {
                        let item = item5e.data;
                        if (item.type === 'spell') {
                            //0.4.1 Only preload a limited number and fill more in as needed
                            if (numSpellsLoaded++ > numToPreload) continue;

                            item.compendium = pack.collection;

                            // determining classes that can use the spell
                            let cleanSpellName = item.name.toLowerCase().replace(/[^一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤]/g, '').replace("'", '').replace(/ /g, '');
                            //let cleanSpellName = spell.name.toLowerCase().replace(/[^a-zA-Z0-9\s:]/g, '').replace("'", '').replace(/ /g, '');
                            if (this.classList[cleanSpellName]) {
                                let classes = this.classList[cleanSpellName];
                                item.data.classes = classes.split(',');
                            } else {
                                unfoundSpells += cleanSpellName + ',';
                            }

                            // getting damage types
                            item.damageTypes = [];
                            if (item.data.damage && item.data.damage.parts.length > 0) {
                                for (let part of item.data.damage.parts) {
                                    let type = part[1];
                                    if (item.damageTypes.indexOf(type) === -1) {
                                        item.damageTypes.push(type);
                                    }
                                }
                            }
                            items.spells[(item._id)] = item;
                        } else  if (item.type === 'feat' || item.type === 'class') {
                            //0.4.1 Only preload a limited number and fill more in as needed
                            if (numFeatsLoaded++ > numToPreload) continue;

                            item.compendium = pack.collection;
                            // getting damage types
                            item.damageTypes = [];
                            if (item.data.damage && item.data.damage.parts.length > 0) {
                                for (let part of item.data.damage.parts) {
                                    let type = part[1];
                                    if (item.damageTypes.indexOf(type) === -1) {
                                        item.damageTypes.push(type);
                                    }
                                }
                            }

                            // getting class
                            let reqString = item.data.requirements?.replace(/[0-9]/g, '').trim();
                            let matchedClass = [];
                            for (let c in this.subClasses) {
                                if (reqString && reqString.toLowerCase().indexOf(c) !== -1) {
                                    matchedClass.push(c);
                                } else {
                                    for (let subClass of this.subClasses[c]) {
                                        if (reqString && reqString.indexOf(subClass) !== -1) {
                                            matchedClass.push(c);
                                            break;
                                        }
                                    }
                                }
                            }
                            item.classRequirement = matchedClass;
                            item.classRequirementString = matchedClass.join(', ');

                            // getting uses/ressources status
                            item.usesRessources = item5e.hasLimitedUses;

                            item.hasSave = item5e.hasSave;

                            items.feats[(item._id)] = item;

                        } else {
                            //0.4.1 Only preload a limited number and fill more in as needed
                            if (numItemsLoaded++ > numToPreload) continue;

                            item.compendium = pack.collection;
                            // getting damage types
                            item.damageTypes = [];
                            if (item.data.damage && item.data.damage.parts.size > 0) {
                                for (let part of item.data.damage.parts) {
                                    let type = part[1];
                                    if (item.damageTypes.indexOf(type) === -1) {
                                        item.damageTypes.push(type);
                                    }
                                }
                            }

                            // getting pack
                            let matchedPacks = [];
                            for (let pack of Object.keys(this.packList)) {
                                for (let packItem of this.packList[pack]) {
                                    if (item.name.toLowerCase() === packItem.toLowerCase()) {
                                        matchedPacks.push(pack);
                                        break;
                                    }
                                }
                            }
                            item.matchedPacks = matchedPacks;
                            item.matchedPacksString = matchedPacks.join(', ');

                            // getting uses/ressources status
                            item.usesRessources = item5e.hasLimitedUses

                            items.items[(item._id)] = item;
                        }          

                    }//for item5e of content
                });
            }
            if ((numSpellsLoaded >= numToPreload) && (numFeatsLoaded >= numToPreload) && (numItemsLoaded >= numToPreload)) break;
        }//for packs
        if (unfoundSpells !== '') {
            console.log(`Item Browser | List of Spells that don't have a class associated to them:`);
            console.log(unfoundSpells);
        }      
        this.itemsLoaded = true;  
        console.timeEnd("loadItems");
        console.log(`Item Browser | Finished loading items: ${Object.keys(items.spells).length} spells, ${Object.keys(items.feats).length} features, ${Object.keys(items.items).length} items `);
        return items;
    }
    
    async loadNpcs(numToPreload=CMPBrowser.PRELOAD) {
        console.log('NPC Browser | Started loading NPCs');
        console.time("loadNpcs");
        let npcs = {};

        let numberLoaded = 0;
        this.npcsLoaded = false;
        for (let pack of game.packs) {
            if (pack['metadata']['entity'] == "Actor" && this.settings.loadedNpcCompendium[pack.collection].load) {
                await pack.getContent().then(async content => {
                    
                    for (let npc of content) {
                        //console.log('%c '+npc.name, 'background: white; color: red')
                        npc = npc.data;
                        // add needed data
                        npc.compendium = pack.collection;
                        // cr display
                        let cr = npc.data.details.cr;
                        if (cr == undefined || cr == '') cr = 0;
                        else cr = Number(cr);
                        if (cr > 0 && cr < 1) cr = "1/" + (1 / cr);
                        npc.displayCR = cr;
                        npc.displaySize = 'unset';
                        npc.filterSize = 2;
                        if (CONFIG.DND5E.actorSizes[npc.data.traits.size] !== undefined) {
                            npc.displaySize = CONFIG.DND5E.actorSizes[npc.data.traits.size];
                        }
                        switch (npc.data.traits.size) {
                            case 'grg': npc.filterSize = 5; break;
                            case 'huge': npc.filterSize = 4; break;
                            case 'lg': npc.filterSize = 3; break;
                            case 'sm': npc.filterSize = 1; break;
                            case 'tiny': npc.filterSize = 0; break;
                            case 'med':
                            default: npc.filterSize = 2; break;
                        }

                        // getting value for HasSpells and damage types
                        npc.hasSpells = false;
                        npc.damageDealt = [];
                        for (let item of npc.items) {
                            if (item.type == 'spell') {
                                npc.hasSpells = true;
                            }
                            if (item.data.damage && item.data.damage.parts && item.data.damage.parts.length > 0) {
                                for (let part of item.data.damage.parts) {
                                    let type = part[1];
                                    if (npc.damageDealt.indexOf(type) === -1) {
                                        npc.damageDealt.push(type);
                                    }
                                }
                            }
                        }

                        npcs[npc._id] = npc;
                        //0.4.1 Only preload a limited number and fill more in as needed
                        if (numberLoaded++ > numToPreload) break;

                    }
                });
            }
           //0.4.1 Only preload a limited number and fill more in as needed
            if (numberLoaded > numToPreload) break;
        }

        this.npcsLoaded = true;
        console.timeEnd("loadNpcs");
        console.log(`NPC Browser | Finished loading NPCs: ${Object.keys(npcs).length} NPCs`);
        return npcs;
    }
    

    static get defaultOptions() {
        const options = super.defaultOptions;
        mergeObject(options, {
            tabs: [{navSelector: ".tabs", contentSelector: ".content", initial: "spell"}],
            classes: options.classes.concat('compendium-browser'),
            template: "modules/compendium-browser/template/template.html",
            width: 800,
            height: 700,
            resizable: true,
            minimizable: true,
            title: "Compendium Browser"
        });
        return options;
    }

    hookCompendiumList() {
        Hooks.on('renderCompendiumDirectory', (app, html, data) => {
            this.hookCompendiumList();
        });

        let html = $('#compendium');
        if (this.settings === undefined) {
            this.initSettings();
        }
        if (game.user.isGM || this.settings.allowSpellBrowser || this.settings.allowNpcBrowser) {
            const importButton = $(`<button class="compendium-browser-btn"><i class="fas fa-fire"></i> ${game.i18n.localize("CMPBrowser.compendiumBrowser")}</button>`);
            html.find('.compendium-browser-btn').remove();

            // adding to directory-list since the footer doesn't exist if the user is not gm
            html.find('.directory-footer').append(importButton);

            // Handle button clicks
            importButton.click(ev => {
                ev.preventDefault();
                //0.4.1: Reset filters when you first click button
                this.resetFilters();
                this.render(true);
            });
        }
    }

    resetFilters() {
        this.spellFilters.activeFilters = {};
        this.featFilters.activeFilters = {};
        this.itemFilters.activeFilters = {};
        this.npcFilters.activeFilters = {};
    }

    async getData() {     
        const numToPreload = game.settings.get(CMPBrowser.MODULE_NAME, "preload") ?? CMPBrowser.PRELOAD;
/*
        if (!this.spellsLoaded) {
            // spells will be stored locally to not require full loading each time the browser is opened
            this.items = await this.loadItems(numToPreload);     //also sets this.spellsLoaded
        }

*/        
        //0.4.1 Filter as we load to support new way of filtering
        //Previously loaded all data and filtered in place; now loads minimal (preload) amount, filtered as we go
        //First time (when you press Compendium Browser button) is called with filters unset
        this.items = await this.loadAndFilterItems(numToPreload);
        if (!this.npcsLoaded) {
            this.npcs = await this.loadNpcs(numToPreload);  //also sets this.npcsLoaded
        }

        let data = {
            spells : this.items?.spells,
            spellFilters : this.spellFilters,
            showSpellBrowser : (game.user.isGM || this.settings.allowSpellBrowser),
            feats : this.items?.feats,
            featFilters : this.featFilters,
            showFeatBrowser : (game.user.isGM || this.settings.allowFeatBrowser),
            items : this.items?.items,
            itemFilters : this.itemFilters,
            showItemBrowser : (game.user.isGM || this.settings.allowItemBrowser),
            npcs : this.npcs,
            npcFilters : this.npcFilters,
            showNpcBrowser : (game.user.isGM || this.settings.allowNpcBrowser),
            settings : this.settings,
            isGM : game.user.isGM
        };

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        // localizing title
        $(html).parents('.app').find('.window-title')[0].innerText = game.i18n.localize("CMPBrowser.compendiumBrowser");

        // show entity sheet
        html.find('.item-edit').click(ev => {
            let itemId = $(ev.currentTarget).parents("li").attr("data-entry-id");
            let compendium = $(ev.currentTarget).parents("li").attr("data-entry-compendium");
            let pack = game.packs.find(p => p.collection === compendium);
            pack.getEntity(itemId).then(entity => {
                entity.sheet.render(true);
            });
        });

        // make draggable
        html.find('.draggable').each((i, li) => {
            li.setAttribute("draggable", true);
            li.addEventListener('dragstart', event => {
                let packName = li.getAttribute("data-entry-compendium");
                let pack = game.packs.find(p => p.collection === packName);
                if (!pack) {
                    event.preventDefault();
                    return false;
                }
                event.dataTransfer.setData("text/plain", JSON.stringify({
                    type: pack.entity,
                    pack: pack.collection,
                    id: li.getAttribute("data-entry-id")
                }));
            }, false);
        });

        // toggle visibility of filter containers
        html.find('.filtercontainer h3, .multiselect label').click(async ev => {
            await $(ev.target.nextElementSibling).toggle(100);

        });
        html.find('.multiselect label').trigger('click');

        // sort spell list
        html.find('.spell-browser select[name=sortorder]').on('change', ev => {
            let spellList = html.find('.spell-browser li');
            let byName = (ev.target.value == 'true');
            let sortedList = this.sortSpells(spellList, byName);
            let ol = $(html.find('.spell-browser ul'));
            ol[0].innerHTML = [];
            for (let element of sortedList) {
                ol[0].append(element);
            }
        });
        html.find('.spell-browser select[name=sortorder]').trigger('change');

        // sort feat list in place
        html.find('.feat-browser select[name=sortorder]').on('change', ev => {
            let featList = html.find('.feat-browser li');
            let byName = (ev.target.value == 'true');
            let sortedList = this.sortFeats(featList, byName);
            let ol = $(html.find('.feat-browser ul'));
            ol[0].innerHTML = [];
            for (let element of sortedList) {
                ol[0].append(element);
            }
        });
        html.find('.feat-browser select[name=sortorder]').trigger('change');

        // sort item list in place
        html.find('.item-browser select[name=sortorder]').on('change', ev => {
            let itemList = html.find('.item-browser li');
            let byName = (ev.target.value == 'true');
            let sortedList = this.sortItems(itemList, byName);
            let ol = $(html.find('.item-browser ul'));
            ol[0].innerHTML = [];
            for (let element of sortedList) {
                ol[0].append(element);
            }
        });
        html.find('.item-browser select[name=sortorder]').trigger('change');

        // sort npc list in place
        html.find('.npc-browser select[name=sortorder]').on('change', ev => {
            let npcList = html.find('.npc-browser li');
            let orderBy = ev.target.value;
            let sortedList = this.sortNpcs(npcList, orderBy);
            let ol = $(html.find('.npc-browser ul'));
            ol[0].innerHTML = [];
            for (let element of sortedList) {
                ol[0].append(element);
            }
        });
        html.find('.npc-browser select[name=sortorder]').trigger('change')

        // reset filters and re-render
        html.find('#reset-spell-filter').click(ev => {
            this.spellFilters.activeFilters = {};
            this.render();
        });

        html.find('#reset-feat-filter').click(ev => {
            this.featFilters.activeFilters = {};
            this.render();
        });

        html.find('#reset-item-filter').click(ev => {
            this.itemFilters.activeFilters = {};
            this.render();
        });

        html.find('#reset-npc-filter').click(ev => {
            this.npcFilters.activeFilters = {};
            this.render();
        });

        // settings
        html.find('.settings input').on('change', ev => {
            let setting = ev.target.dataset.setting;
            let value = ev.target.checked;
            if (setting === 'spell-compendium-setting') {
                let key = ev.target.dataset.key;
                this.settings.loadedSpellCompendium[key].load = value;
                this.loadItems().then(items => {
                    this.items = items;
                    this.render();
                });
                ui.notifications.info("Settings Saved. Spell Compendiums are being reloaded.");
            } else if (setting === 'npc-compendium-setting') {
                let key = ev.target.dataset.key;
                this.settings.loadedNpcCompendium[key].load = value;
                this.loadNpcs().then(npcs => {
                    this.npcs = npcs;
                    this.render();
                });
                ui.notifications.info("Settings Saved. NPC Compendiums are being reloaded.");
            }
            if (setting === 'allow-spell-browser') {
                this.settings.allowSpellBrowser = value;
            }
            if (setting === 'allow-feat-browser') {
                this.settings.allowFeatBrowser = value;
            }
            if (setting === 'allow-item-browser') {
                this.settings.allowItemBrowser = value;
            }
            if (setting === 'allow-npc-browser') {
                this.settings.allowNpcBrowser = value;
            }
            this.saveSettings();
        });


        // activating or deactivating filters - in place

        // text filters

        html.find('.filter[data-type=text] input, .filter[data-type=text] select').on('keyup change paste', ev => {
            let path = $(ev.target).parents('.filter').data('path');
            let key = path.replace(/\./g, '');
            let value = ev.target.value;
            let itemType = $(ev.target).parents('.tab').data('tab');

            let filterTarget = `${itemType}Filters`;

            if (value === '' || value === undefined) {
                delete this[filterTarget].activeFilters[key];
            } else {
                this[filterTarget].activeFilters[key] = {
                    path: path,
                    type: 'text',
                    valIsArray: false,
                    value: ev.target.value
                }
            }

            let list = null;
            let subjects = null;
            if (itemType === 'spell') {
                list = html.find('.spell-browser li');
                subjects = this.items.spells;
            } else if (itemType === 'npc') {
                list = html.find('.npc-browser li');
                subjects = this.npcs;
            } else if (itemType === 'feat') {
                list = html.find('.feat-browser li');
                subjects = this.items.feats;
            } else if (itemType === 'item') {
                list = html.find('.item-browser li');
                subjects = this.items.items;
            }
            this.filterElements(list, subjects, this[filterTarget].activeFilters);
        });

        // select filters
        html.find('.filter[data-type=select] select, .filter[data-type=bool] select').on('change', ev => {
            let path = $(ev.target).parents('.filter').data('path');
            let key = path.replace(/\./g, '');
            let filterType = $(ev.target).parents('.filter').data('type');
            let itemType = $(ev.target).parents('.tab').data('tab');
            let valIsArray = $(ev.target).parents('.filter').data('valisarray');
            if (valIsArray === 'true') valIsArray = true;
            let value = ev.target.value;
            if (value === 'false') value = false;
            if (value === 'true') value = true;

            let filterTarget = `${itemType}Filters`;

            if (value === "null") {
                delete this[filterTarget].activeFilters[key]
            } else {
                this[filterTarget].activeFilters[key] = {
                    path: path,
                    type: filterType,
                    valIsArray: valIsArray,
                    value:value
                }
            }

            let list = null;
            let subjects = null;
            if (itemType === 'spell') {
                list = html.find('.spell-browser li');
                subjects = this.items.spells;
            } else if (itemType === 'npc') {
                list = html.find('.npc-browser li');
                subjects = this.npcs;
            } else if (itemType === 'feat') {
                list = html.find('.feat-browser li');
                subjects = this.items.feats;
            } else if (itemType === 'item') {
                list = html.find('.item-browser li');
                subjects = this.items.items;
            }
            this.filterElements(list, subjects, this[filterTarget].activeFilters);
        });

        // multiselect filters
        html.find('.filter[data-type=multiSelect] input').on('change', ev => {
            let path = $(ev.target).parents('.filter').data('path');
            let key = path.replace(/\./g, '');
            let filterType = 'multiSelect';
            let itemType = $(ev.target).parents('.tab').data('tab');
            let valIsArray = $(ev.target).parents('.filter').data('valisarray');
            if (valIsArray === 'true') valIsArray = true;
            let value = $(ev.target).data('value');

            let filterTarget = `${itemType}Filters`;
            let filter = this[filterTarget].activeFilters[key];

            if (ev.target.checked === true) {
                if (filter === undefined) {
                    this[filterTarget].activeFilters[key] = {
                        path: path,
                        type: filterType,
                        valIsArray: valIsArray,
                        values: [ value ]
                    }
                } else {
                    this[filterTarget].activeFilters[key].values.push(value);
                }
            } else {
                delete this[filterTarget].activeFilters[key].values.splice(this[filterTarget].activeFilters[key].values.indexOf(value),1);
                if (this[filterTarget].activeFilters[key].values.length === 0) {
                    delete this[filterTarget].activeFilters[key];
                }
            }

            let list = null;
            let subjects = null;
            if (itemType === 'spell') {
                list = html.find('.spell-browser li');
                subjects = this.items.spells;
            } else if (itemType === 'npc') {
                list = html.find('.npc-browser li');
                subjects = this.npcs;
            } else if (itemType === 'feat') {
                list = html.find('.feat-browser li');
                subjects = this.items.feats;
            } else if (itemType === 'item') {
                list = html.find('.item-browser li');
                subjects = this.items.items;
            }
            this.filterElements(list, subjects, this[filterTarget].activeFilters);
        });


        html.find('.filter[data-type=numberCompare] select, .filter[data-type=numberCompare] input').on('change keyup paste', ev => {
            let path = $(ev.target).parents('.filter').data('path');
            let key = path.replace(/\./g, '');
            let filterType = 'numberCompare';
            let itemType = $(ev.target).parents('.tab').data('tab');
            let valIsArray = false;

            let operator = $(ev.target).parents('.filter').find('select').val();
            let value = $(ev.target).parents('.filter').find('input').val();

            let filterTarget = `${itemType}Filters`;

            if (value === '' || operator === 'null') {
                delete this[filterTarget].activeFilters[key]
            } else {
                this[filterTarget].activeFilters[key] = {
                    path: path,
                    type: filterType,
                    valIsArray: valIsArray,
                    operator: operator,
                    value: value
                }
            }

            let list = null;
            let subjects = null;
            if (itemType === 'spell') {
                list = html.find('.spell-browser li');
                subjects = this.items.spells;
            } else if (itemType === 'npc') {
                list = html.find('.npc-browser li');
                subjects = this.npcs;
            } else if (itemType === 'feat') {
                list = html.find('.feat-browser li');
                subjects = this.items.feats;
            } else if (itemType === 'item') {
                list = html.find('.item-browser li');
                subjects = this.items.items;
            }
            this.filterElements(list, subjects, this[filterTarget].activeFilters);
        });


        // lazy load images
        const observer = new IntersectionObserver((entries, observer) => {
            for (let e of entries) {
                if (!e.isIntersecting) continue;
                const img = e.target;
                // Avatar image
                //const img = li.querySelector("img");
                if (img && img.dataset.src) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                }

                // No longer observe the target
                observer.unobserve(e.target);
            }
        });
        html.find("img").each((i, img) => observer.observe(img));
    }

    //SORTING
    sortSpells(list, byName) {
        if (byName) {
            list.sort((a, b) => {
                let aName = $(a).find('.item-name a')[0].innerHTML;
                let bName = $(b).find('.item-name a')[0].innerHTML;
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0;
            });
        } else {
            list.sort((a, b) => {
                let aVal = $(a).find('input[name=level]').val();
                let bVal = $(b).find('input[name=level]').val();
                if (aVal < bVal) return -1;
                if (aVal > bVal) return 1;
                if (aVal == bVal) {
                    let aName = $(a).find('.item-name a')[0].innerHTML;
                    let bName = $(b).find('.item-name a')[0].innerHTML;
                    if (aName < bName) return -1;
                    if (aName > bName) return 1;
                    return 0;
                }
            });
        }
        return list;
    }

    sortFeats(list, byName) {
        if (byName) {
            list.sort((a, b) => {
                let aName = $(a).find('.item-name a')[0].innerHTML;
                let bName = $(b).find('.item-name a')[0].innerHTML;
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0;
            });
        } else {
            list.sort((a, b) => {
                let aVal = $(a).find('input[name=class]').val();
                let bVal = $(b).find('input[name=class]').val();
                if (aVal < bVal) return -1;
                if (aVal > bVal) return 1;
                if (aVal == bVal) {
                    let aName = $(a).find('.item-name a')[0].innerHTML;
                    let bName = $(b).find('.item-name a')[0].innerHTML;
                    if (aName < bName) return -1;
                    if (aName > bName) return 1;
                    return 0;
                }
            });
        }
        return list;
    }

    sortItems(list, byName) {
        if (byName) {
            list.sort((a, b) => {
                let aName = $(a).find('.item-name a')[0].innerHTML;
                let bName = $(b).find('.item-name a')[0].innerHTML;
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0;
            });
        } else {
            list.sort((a, b) => {
                let aVal = $(a).find('input[name=type]').val();
                let bVal = $(b).find('input[name=type]').val();
                if (aVal < bVal) return -1;
                if (aVal > bVal) return 1;
                if (aVal == bVal) {
                    let aName = $(a).find('.item-name a')[0].innerHTML;
                    let bName = $(b).find('.item-name a')[0].innerHTML;
                    if (aName < bName) return -1;
                    if (aName > bName) return 1;
                    return 0;
                }
            });
        }
        return list;
    }

    sortNpcs(list, orderBy) {
        switch (orderBy) {
            case 'name':
                list.sort((a, b) => {
                    let aName = $(a).find('.npc-name a')[0].innerHTML;
                    let bName = $(b).find('.npc-name a')[0].innerHTML;
                    if (aName < bName) return -1;
                    if (aName > bName) return 1;
                    return 0;
                }); break;
            case 'cr':
                list.sort((a, b) => {
                    let aVal = Number($(a).find('input[name="order.cr"]').val());
                    let bVal = Number($(b).find('input[name="order.cr"]').val());
                    if (aVal < bVal) return -1;
                    if (aVal > bVal) return 1;
                    if (aVal == bVal) {
                        let aName = $(a).find('.npc-name a')[0].innerHTML;
                        let bName = $(b).find('.npc-name a')[0].innerHTML;
                        if (aName < bName) return -1;
                        if (aName > bName) return 1;
                        return 0;
                    }
                }); break;
            case 'size':
                list.sort((a, b) => {
                    let aVal = $(a).find('input[name="order.size"]').val();
                    let bVal = $(b).find('input[name="order.size"]').val();
                    if (aVal < bVal) return -1;
                    if (aVal > bVal) return 1;
                    if (aVal == bVal) {
                        let aName = $(a).find('.npc-name a')[0].innerHTML;
                        let bName = $(b).find('.npc-name a')[0].innerHTML;
                        if (aName < bName) return -1;
                        if (aName > bName) return 1;
                        return 0;
                    }
                }); break;
        }
        return list;
    }

    decorateCompendiumEntry(item5e) {
        if (!item5e) return null;
        //Decorate and then filter a compendium entry - returns null or the item
        let item = item5e.data;

        // getting damage types (common to all Items, although some won't have any)
        item.damageTypes = [];
        if (item.data.damage && item.data.damage.parts.length > 0) {
            for (let part of item.data.damage.parts) {
                let type = part[1];
                if (item.damageTypes.indexOf(type) === -1) {
                    item.damageTypes.push(type);
                }
            }
        }

        if (item.type === 'spell') {
            // determining classes that can use the spell
            let cleanSpellName = item.name.toLowerCase().replace(/[^一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤]/g, '').replace("'", '').replace(/ /g, '');
            //let cleanSpellName = spell.name.toLowerCase().replace(/[^a-zA-Z0-9\s:]/g, '').replace("'", '').replace(/ /g, '');
            if (this.classList[cleanSpellName]) {
                let classes = this.classList[cleanSpellName];
                item.data.classes = classes.split(',');
            } else {
//FIXME: unfoundSpells += cleanSpellName + ',';
            }
        } else  if (item.type === 'feat' || item.type === 'class') {
            // getting class
            let reqString = item.data.requirements?.replace(/[0-9]/g, '').trim();
            let matchedClass = [];
            for (let c in this.subClasses) {
                if (reqString && reqString.toLowerCase().indexOf(c) !== -1) {
                    matchedClass.push(c);
                } else {
                    for (let subClass of this.subClasses[c]) {
                        if (reqString && reqString.indexOf(subClass) !== -1) {
                            matchedClass.push(c);
                            break;
                        }
                    }
                }
            }
            item.classRequirement = matchedClass;
            item.classRequirementString = matchedClass.join(', ');

            // getting uses/ressources status
            item.usesRessources = item5e.hasLimitedUses;
            item.hasSave = item5e.hasSave;

        } else {
            // getting pack
            let matchedPacks = [];
            for (let pack of Object.keys(this.packList)) {
                for (let packItem of this.packList[pack]) {
                    if (item.name.toLowerCase() === packItem.toLowerCase()) {
                        matchedPacks.push(pack);
                        break;
                    }
                }
            }
            item.matchedPacks = matchedPacks;
            item.matchedPacksString = matchedPacks.join(', ');

            // getting uses/ressources status
            item.usesRessources = item5e.hasLimitedUses
        } 
        return item;
    }

    filterElements(list, subjects, filters) {
        for (let element of list) {
            let subject = subjects[element.dataset.entryId];
            if (this.getFilterResult(subject, filters) == false) {
                $(element).hide();
            } else {
                $(element).show();
            }
        }
    }

    getFilterResult(subject, filters) {
        for (let filter of Object.values(filters)) {
            let prop = getProperty(subject, filter.path);
            if (filter.type === 'numberCompare') {

                switch (filter.operator) {
                    case '=': if (prop != filter.value) { return false; } break;
                    case '<': if (prop >= filter.value) { return false; } break;
                    case '>': if (prop <= filter.value) { return false; } break;
                }

                continue;
            }
            if (filter.valIsArray === false) {
                if (filter.type === 'text') {
                    if (prop === undefined) return false;
                    if (prop.toLowerCase().indexOf(filter.value.toLowerCase()) === -1) {
                        return false;
                    }
                } else {
                    if (filter.value !== undefined && prop !== undefined && prop != filter.value && !(filter.value === true && prop)) {
                        return false;
                    }
                    if (filter.values && filter.values.indexOf(prop) === -1) {
                        return false;
                    }
                }
            } else {
                if (prop === undefined) return false;
                if (typeof prop === 'object') {
                    if (filter.value) {
                        if (prop.indexOf(filter.value) === -1) {
                            return false;
                        }
                    } else if (filter.values) {
                        for (let val of filter.values) {
                            if (prop.indexOf(val) !== -1) {
                                continue;
                            }
                            return false;
                        }
                    }
                } else {
                    for (let val of filter.values) {
                        if (prop === val) {
                            continue;
                        }
                    }
                    return false;
                }
            }
        }

        return true;
    }

    clearObject(obj) {
        let newObj = {};
        for (let key in obj) {
            if (obj[key] == true) {
                newObj[key] = true;
            }
        }
        return newObj;
    }

    initSettings() {
        let defaultSettings = {
            loadedSpellCompendium: {},
            loadedNpcCompendium: {},
        };
        for (let compendium of game.packs) {
            if (compendium['metadata']['entity'] === "Item") {
                defaultSettings.loadedSpellCompendium[compendium.collection] = {
                    load: true,
                    name: `${compendium['metadata']['label']} (${compendium.collection})`
                };
            }
            if (compendium['metadata']['entity'] === "Actor") {
                defaultSettings.loadedNpcCompendium[compendium.collection] = {
                    load: true,
                    name: `${compendium['metadata']['label']} (${compendium.collection})`
                };
            }
        }
        // creating game setting container
        game.settings.register(CMPBrowser.MODULE_NAME, "settings", {
            name: "Compendium Browser Settings",
            hint: "Settings to exclude packs from loading and visibility of the browser",
            default: defaultSettings,
            type: Object,
            scope: 'world',
            onChange: settings => {
                this.settings = settings;
            }
        });
        game.settings.register(CMPBrowser.MODULE_NAME, "preload", {
            name: game.i18n.localize("CMPBrowser.SETTING.Preload.NAME"),
            hint: game.i18n.localize("CMPBrowser.SETTING.Preload.HINT"),
            scope: "world",
            config: true,
            default: CMPBrowser.PRELOAD,
            type: Number,
            range: {             // If range is specified, the resulting setting will be a range slider
                min: 20,
                max: 500,
                step: 10
            }
        });
        
        // load settings from container and apply to default settings (available compendie might have changed)
        let settings = game.settings.get(CMPBrowser.MODULE_NAME, 'settings');
        for (let compKey in defaultSettings.loadedSpellCompendium) {
            if (settings.loadedSpellCompendium[compKey] !== undefined) {
                defaultSettings.loadedSpellCompendium[compKey].load = settings.loadedSpellCompendium[compKey].load;
            }
        }
        for (let compKey in defaultSettings.loadedNpcCompendium) {
            if (settings.loadedNpcCompendium[compKey] !== undefined) {
                defaultSettings.loadedNpcCompendium[compKey].load = settings.loadedNpcCompendium[compKey].load;
            }
        }
        defaultSettings.allowSpellBrowser = settings.allowSpellBrowser ? true : false;
        defaultSettings.allowFeatBrowser = settings.allowFeatBrowser ? true : false;
        defaultSettings.allowItemBrowser = settings.allowItemBrowser ? true : false;
        defaultSettings.allowNpcBrowser = settings.allowNpcBrowser ? true : false;
        
        if (game.user.isGM) {
            game.settings.set(CMPBrowser.MODULE_NAME, 'settings', defaultSettings);
            console.log("New default settings set");
            console.log(defaultSettings);
        }   
        this.settings = defaultSettings;
    }

    saveSettings() {
        game.settings.set(CMPBrowser.MODULE_NAME, 'settings', this.settings);
    }


    _lazyLoadImg(entries, observer) {
    }

    //FILTERS - Added on the Ready hook
    //0.4.0 Make this async so filters can be added all at once
    async addFilter(entityType, category, label, path, type, possibleValues = null, valIsArray = false) {
        let target = `${entityType}Filters`;
        let filter = {};
        filter.path = path;
        filter.label = label;
        filter.type = 'text';
        if (['text', 'bool', 'select', 'multiSelect', 'numberCompare'].indexOf(type) !== -1) {
            filter[`is${type}`] = true;
            filter.type = type;
        }
        if (possibleValues !== null) {
            filter.possibleValues = possibleValues;
        }
        filter.valIsArray = valIsArray;

        let catId = category.replace(/\W/g, '');
        if (this[target].registeredFilterCategorys[catId] === undefined) {
            this[target].registeredFilterCategorys[catId] = {label: category, filters: []};
        }
        this[target].registeredFilterCategorys[catId].filters.push(filter);

    }

    async addSpellFilters() {
        // Spellfilters
        this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("DND5E.Source"), 'data.source', 'text');
        this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.lvl"), 'data.level', 'multiSelect', [game.i18n.localize("CMPBrowser.cantip"), 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.school"), 'data.school', 'select', CONFIG.DND5E.spellSchools);
        this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.castingTime"), 'data.activation.type', 'select',
            {
                action: game.i18n.localize("DND5E.Action"),
                bonus: game.i18n.localize("CMPBrowser.bonusAction"),
                reaction: game.i18n.localize("CMPBrowser.reaction"),
                minute: game.i18n.localize("DND5E.TimeMinute"),
                hour: game.i18n.localize("DND5E.TimeHour"),
                day: game.i18n.localize("DND5E.TimeDay")
            }
        );
        this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.spellType"), 'data.actionType', 'select', CONFIG.DND5E.itemActionTypes);
        this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.damageType"), 'damageTypes', 'select', CONFIG.DND5E.damageTypes);
        this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.class"), 'data.classes', 'select',
            {
                artificer: game.i18n.localize("CMPBrowser.artificer"),
                bard: game.i18n.localize("CMPBrowser.bard"),
                cleric: game.i18n.localize("CMPBrowser.cleric"),
                druid: game.i18n.localize("CMPBrowser.druid"),
                paladin: game.i18n.localize("CMPBrowser.paladin"),
                ranger: game.i18n.localize("CMPBrowser.ranger"),
                sorcerer: game.i18n.localize("CMPBrowser.sorcerer"),
                warlock: game.i18n.localize("CMPBrowser.warlock"),
                wizard: game.i18n.localize("CMPBrowser.wizard"),
            }, true
        );
        this.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.ritual"), 'data.components.ritual', 'bool');
        this.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.concentration"), 'data.components.concentration', 'bool');
        this.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.verbal"), 'data.components.vocal', 'bool');
        this.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.somatic"), 'data.components.somatic', 'bool');
        this.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.material"), 'data.components.material', 'bool');
    }

    async addItemFilters() {
        // Item Filters

        this.addItemFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("DND5E.Source"), 'data.source', 'text');
        this.addItemFilter(game.i18n.localize("CMPBrowser.general"), "Item Type", 'type', 'select', {
            consumable: game.i18n.localize("DND5E.ItemTypeConsumable"),
            backpack: game.i18n.localize("DND5E.ItemTypeContainer"),
            equipment: game.i18n.localize("DND5E.ItemTypeEquipment"),
            loot: game.i18n.localize("DND5E.ItemTypeLoot"),
            tool: game.i18n.localize("DND5E.ItemTypeTool"),
            weapon: game.i18n.localize("DND5E.ItemTypeWeapon")
        });
        this.addItemFilter(game.i18n.localize("CMPBrowser.general"), "Packs", 'matchedPacks', 'select',
            {
                burglar: "Burglar's Pack",
                diplomat: "Diplomat's Pack",
                dungeoneer: "Dungeoneer's Pack",
                entertainer: "Entertainer's Pack",
                explorer: "Explorer's Pack",
                monsterhunter: "Monster Hunter's Pack",
                priest: "Priest's Pack",
                scholar: "Scholar's Pack",
            }, true
        );
        this.addItemFilter("Game Mechanics", game.i18n.localize("DND5E.ItemActivationCost"), 'data.activation.type', 'select', CONFIG.DND5E.abilityActivationTypes);
        this.addItemFilter("Game Mechanics", game.i18n.localize("CMPBrowser.damageType"), 'damageTypes', 'select', CONFIG.DND5E.damageTypes);
        this.addItemFilter("Game Mechanics", "Uses Resources", 'usesRessources', 'bool');

        this.addItemFilter("Item Subtype", "Weapon", 'data.weaponType', 'text', CONFIG.DND5E.weaponTypes);
        this.addItemFilter("Item Subtype", "Equipment", 'data.armor.type', 'text', CONFIG.DND5E.equipmentTypes);
        this.addItemFilter("Item Subtype", "Consumable", 'data.consumableType', 'text', CONFIG.DND5E.consumableTypes);
        
        this.addItemFilter("Magic Items", "Rarity", 'data.rarity', 'select', 
        {
            Common: "Common",
            Uncommon: "Uncommon",
            Rare: "Rare",
            "Very rare": "Very Rare",
            Legendary: "Legendary"
        });
    }

    async addFeatFilters() {
        
        // Feature Filters

        this.addFeatFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("DND5E.Source"), 'data.source', 'text');
        this.addFeatFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.class"), 'classRequirement', 'select',
            {
                artificer: game.i18n.localize("CMPBrowser.artificer"),
                barbarian: "Barbarian",
                bard: game.i18n.localize("CMPBrowser.bard"),
                cleric: game.i18n.localize("CMPBrowser.cleric"),
                druid: game.i18n.localize("CMPBrowser.druid"),
                fighter: "Fighter",
                monk: "Monk",
                paladin: game.i18n.localize("CMPBrowser.paladin"),
                ranger: game.i18n.localize("CMPBrowser.ranger"),
                rogue: "Rogue",
                sorcerer: game.i18n.localize("CMPBrowser.sorcerer"),
                warlock: game.i18n.localize("CMPBrowser.warlock"),
                wizard: game.i18n.localize("CMPBrowser.wizard")
            }, true);

        this.addFeatFilter("Game Mechanics", game.i18n.localize("DND5E.ItemActivationCost"), 'data.activation.type', 'select', CONFIG.DND5E.abilityActivationTypes);
        this.addFeatFilter("Game Mechanics", game.i18n.localize("CMPBrowser.damageType"), 'damageTypes', 'select', CONFIG.DND5E.damageTypes);
        this.addFeatFilter("Game Mechanics", "Uses Resources", 'usesRessources', 'bool');


    }

    async addNpcFilters() {
        // NPC Filters

        this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("DND5E.Source"), 'data.details.source', 'text');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.size"), 'data.traits.size', 'select', CONFIG.DND5E.actorSizes);
        this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.hasSpells"), 'hasSpells', 'bool');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.hasLegAct"), 'data.resources.legact.max', 'bool');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.hasLegRes"), 'data.resources.legres.max', 'bool');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.cr"), 'data.details.cr', 'numberCompare');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.creatureType"), 'data.details.type', 'text', {
            aberration: game.i18n.localize("CMPBrowser.aberration"),
            beast: game.i18n.localize("CMPBrowser.beast"),
            celestial: game.i18n.localize("CMPBrowser.celestial"),
            construct: game.i18n.localize("CMPBrowser.construct"),
            dragon: game.i18n.localize("CMPBrowser.dragon"),
            elemental: game.i18n.localize("CMPBrowser.elemental"),
            fey: game.i18n.localize("CMPBrowser.fey"),
            fiend: game.i18n.localize("CMPBrowser.fiend"),
            giant: game.i18n.localize("CMPBrowser.giant"),
            humanoid: game.i18n.localize("CMPBrowser.humanoid"),
            monstrosity: game.i18n.localize("CMPBrowser.monstrosity"),
            ooze: game.i18n.localize("CMPBrowser.ooze"),
            plant: game.i18n.localize("CMPBrowser.plant"),
            undead: game.i18n.localize("CMPBrowser.undead")
        });

        this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityStr"), 'data.abilities.str.value', 'numberCompare');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityDex"), 'data.abilities.dex.value', 'numberCompare');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityCon"), 'data.abilities.con.value', 'numberCompare');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityInt"), 'data.abilities.int.value', 'numberCompare');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityWis"), 'data.abilities.wis.value', 'numberCompare');
        this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityCha"), 'data.abilities.cha.value', 'numberCompare');

        this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamImm"), 'data.traits.di.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
        this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamRes"), 'data.traits.dr.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
        this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamVuln"), 'data.traits.dv.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
        this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.ConImm"), 'data.traits.ci.value', 'multiSelect', CONFIG.DND5E.conditionTypes, true);
        this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("CMPBrowser.dmgDealt"), 'damageDealt', 'multiSelect', CONFIG.DND5E.damageTypes, true);

    }

    /**
     * Used to add custom filters to the Spell-Browser
     * @param {String} category - Title of the category
     * @param {String} label - Title of the filter
     * @param {String} path - path to the data that the filter uses. uses dotnotation. example: data.abilities.dex.value
     * @param {String} type - type of filter
     *                      possible filter:
     *                          text:           will give a textinput (or use a select if possibleValues has values) to compare with the data. will use objectData.indexOf(searchedText) to enable partial matching
     *                          bool:           will see if the data at the path exists and not false.
     *                          select:         exactly matches the data with the chosen selector from possibleValues
     *                          multiSelect:    enables selecting multiple values from possibleValues, any of witch has to match the objects data
     *                          numberCompare:  gives the option to compare numerical values, either with =, < or the > operator
     * @param {Boolean} possibleValues - predetermined values to choose from. needed for select and multiSelect, can be used in text filters
     * @param {Boolean} valIsArray - if the objects data is an object use this. the filter will check each property in the object (not recursive). if no match is found, the object will be hidden
     */
    addSpellFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
        this.addFilter('spell', category, label, path, type, possibleValues, valIsArray);
    }

    /**
     * Used to add custom filters to the Spell-Browser
     * @param {String} category - Title of the category
     * @param {String} label - Title of the filter
     * @param {String} path - path to the data that the filter uses. uses dotnotation. example: data.abilities.dex.value
     * @param {String} type - type of filter
     *                      possible filter:
     *                          text:           will give a textinput (or use a select if possibleValues has values) to compare with the data. will use objectData.indexOf(searchedText) to enable partial matching
     *                          bool:           will see if the data at the path exists and not false.
     *                          select:         exactly matches the data with the chosen selector from possibleValues
     *                          multiSelect:    enables selecting multiple values from possibleValues, any of witch has to match the objects data
     *                          numberCompare:  gives the option to compare numerical values, either with =, < or the > operator
     * @param {Boolean} possibleValues - predetermined values to choose from. needed for select and multiSelect, can be used in text filters
     * @param {Boolean} valIsArray - if the objects data is an object use this. the filter will check each property in the object (not recursive). if no match is found, the object will be hidden
     */
    addNpcFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
        this.addFilter('npc', category, label, path, type, possibleValues, valIsArray);
    }

    addFeatFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
        this.addFilter('feat', category, label, path, type, possibleValues, valIsArray);
    }

    addItemFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
        this.addFilter('item', category, label, path, type, possibleValues, valIsArray);
    }
}

Hooks.on('ready', async () => {

    if (game.compendiumBrowser === undefined) {
        game.compendiumBrowser = new CompendiumBrowser();
//0.4.0 Defer loading content until we actually use the Compendium Browser
        //A compromise approach would be better (periodic loading) except would still create the memory use problem
        await game.compendiumBrowser.initialize();
    }

    game.compendiumBrowser.addSpellFilters();
    game.compendiumBrowser.addFeatFilters();
    game.compendiumBrowser.addItemFilters();
    game.compendiumBrowser.addNpcFilters();

});