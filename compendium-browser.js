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
            0.4.1d: Fixed img observer on replaced spellData        
11-Feb-2021 0.4.1e: Don't save the filter data (which is most of the memory) and remove the preload limit; instead just save the minimal amount of data     
            0.4.1g: Generalize the spell list reload and confirm spells still working   
            0.4.1h: Add the partials for npc, feat, item and the backing code    
12-Feb-2021 0.4.1j: Correct compactItem for feats and items required display items   
                    Rename itemType -> browserTab to differentiate candidate item's type from the tab it appears on (spell, feat/class, item, NPC)  
                    Fixed: Was calling the wrong sort for feat and NPC    
            0.4.1k: Don't call loadItems() during initalize; getData() just displays static elements    
            0.4.1l: Display progress indicator for loading - for now just a static one    
15-Feb-2021 0.4.2:  Fix NPCs to use loadAndFilterNpcs
            0.4.2b: Add Loading... message for NPCs
                    Want loading message with dynamic results and to not replace existing data; need to localize as well
*/

const CMPBrowser = {
    MODULE_NAME : "compendium-browser",
    MODULE_VERSION : "0.4.1",
    PRELOAD : 9999,       //How many items, spells, or NPCs you load at once (to minimize memory usage) - ignored for now
    VISIBLE_ROWS : 50   //Plug for maximum rows visible in window - fetch more when actual < this
}

class CompendiumBrowser extends Application {

    static get defaultOptions() {
        const options = super.defaultOptions;
        mergeObject(options, {
            title: "CMPBrowser.compendiumBrowser",
            tabs: [{navSelector: ".tabs", contentSelector: ".content", initial: "spell"}],
            classes: options.classes.concat('compendium-browser'),
            template: "modules/compendium-browser/template/template.html",
            width: 800,
            height: 700,
            resizable: true,
            minimizable: true
        });
        return options;
    }

    async initialize() {
        // load settings
        if (this.settings === undefined) {
            this.initSettings();
        } 
        const numToPreload = game.settings.get(CMPBrowser.MODULE_NAME, "preload") ?? CMPBrowser.PRELOAD;
/*        
        this.loadItems(numToPreload).then(obj => {
            this.items = obj;
        });
        this.loadNpcs(numToPreload).then(obj => {
            this.npcs = obj;
        });  //Plug 
*/        
        await loadTemplates([
            "modules/compendium-browser/template/spell-browser.html",
            "modules/compendium-browser/template/spell-browser-list.html",       
            "modules/compendium-browser/template/npc-browser.html",
            "modules/compendium-browser/template/npc-browser-list.html",
            "modules/compendium-browser/template/feat-browser.html",
            "modules/compendium-browser/template/feat-browser-list.html",
            "modules/compendium-browser/template/item-browser.html",
            "modules/compendium-browser/template/item-browser-list.html",
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

    /* Hook to load the first data */
    static afterRender(cb, html, data) {
        //After rendering the first time or re-rendering trigger the load/reload of visible data
        if (game.user.isGM || this.settings.allowSpellBrowser) {
            cb.replaceList(html, "spell");
        } else if (this.settings.allowFeatBrowser) {
            cb.replaceList(html, "feat");
        } else if (this.settings.allowItemBrowser) {
            cb.replaceList(html, "item");
        } else if (this.settings.allowNPCBrowser) {
            cb.replaceList(html, "npc");
        }
    }

    /** override */
    _onChangeTab(event, tabs, active) {
        super._onChangeTab(event, tabs, active);
        const html = this.element;
        this.replaceList(html, active, {reload : false})
    }


    /** override */
    async getData() {   
        //Only called on initial display or refresh (including when settings are changed)
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
        const loadingItem = {
            name: "Loading...",
            img: "icons/sundries/books/book-open-turquoise.webp"
        }
        //0.4.1k: Don't do any item/npc loading until tab is visible
        let data = {
            items : {"Loading" : loadingItem},
            npcs: {"Loading" : loadingItem},
            spellFilters : this.spellFilters,
            showSpellBrowser : (game.user.isGM || this.settings.allowSpellBrowser),
            featFilters : this.featFilters,
            showFeatBrowser : (game.user.isGM || this.settings.allowFeatBrowser),
            itemFilters : this.itemFilters,
            showItemBrowser : (game.user.isGM || this.settings.allowItemBrowser),
            npcFilters : this.npcFilters,
            showNpcBrowser : (game.user.isGM || this.settings.allowNpcBrowser),
            settings : this.settings,
            isGM : game.user.isGM
        };


        return data;
    }

    activateItemListListeners(html) {
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
        //0.4.1: Avoid the game.packs lookup
        html.find('.draggable').each((i, li) => {
            li.setAttribute("draggable", true);
            li.addEventListener('dragstart', event => {
                let packName = li.getAttribute("data-entry-compendium");
                let itemType = li.parents('.tab').data('tab');
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
    }

    /** override */
    activateListeners(html) {
        super.activateListeners(html);

        this.observer = new IntersectionObserver((entries, observer) => {
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

        this.activateItemListListeners(html);

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
        this.triggerSort(html, "spell");

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
        this.triggerSort(html, "feat");

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
        this.triggerSort(html, "item");

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
        this.triggerSort(html, "npc");

        // reset filters and re-render
        html.find('#reset-spell-filter').click(ev => {
            this.spellFilters.activeFilters = {};
            this.replaceList(html, "spell", {reload : true});
        });

        html.find('#reset-feat-filter').click(ev => {
            this.featFilters.activeFilters = {};
            this.replaceList(html, "feat", {reload : true});
        });

        html.find('#reset-item-filter').click(ev => {
            this.itemFilters.activeFilters = {};
            this.replaceList(html, "item", {reload : true});
        });

        html.find('#reset-npc-filter').click(ev => {
            this.npcFilters.activeFilters = {};
            this.replaceList(html, "npc", {reload : true});
        });

        // settings
        html.find('.settings input').on('change', ev => {
            let setting = ev.target.dataset.setting;
            let value = ev.target.checked;
            if (setting === 'spell-compendium-setting') {
                let key = ev.target.dataset.key;
                this.settings.loadedSpellCompendium[key].load = value;
                this.render();
                ui.notifications.info("Settings Saved. Item Compendiums are being reloaded.");
            } else if (setting === 'npc-compendium-setting') {
                let key = ev.target.dataset.key;
                this.settings.loadedNpcCompendium[key].load = value;
                this.render();
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


        // activating or deactivating filters
        //0.4.1: Now does a re-load and updates just the data side
        // text filters
        html.find('.filter[data-type=text] input, .filter[data-type=text] select').on('keyup change paste', ev => {
            const path = $(ev.target).parents('.filter').data('path');
            const key = path.replace(/\./g, '');
            const value = ev.target.value;
            const browserTab = $(ev.target).parents('.tab').data('tab');

            const filterTarget = `${browserTab}Filters`;

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

            this.replaceList(html, browserTab);   
        });

        // select filters
        html.find('.filter[data-type=select] select, .filter[data-type=bool] select').on('change', ev => {
            const path = $(ev.target).parents('.filter').data('path');
            const key = path.replace(/\./g, '');
            const filterType = $(ev.target).parents('.filter').data('type');
            const browserTab = $(ev.target).parents('.tab').data('tab');
            let valIsArray = $(ev.target).parents('.filter').data('valisarray');
            if (valIsArray === 'true') valIsArray = true;
            let value = ev.target.value;
            if (value === 'false') value = false;
            if (value === 'true') value = true;

            const filterTarget = `${browserTab}Filters`;

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
            this.replaceList(html, browserTab);      
        });

        // multiselect filters
        html.find('.filter[data-type=multiSelect] input').on('change', ev => {
            const path = $(ev.target).parents('.filter').data('path');
            const key = path.replace(/\./g, '');
            const filterType = 'multiSelect';
            const browserTab = $(ev.target).parents('.tab').data('tab');
            let valIsArray = $(ev.target).parents('.filter').data('valisarray');
            if (valIsArray === 'true') valIsArray = true;
            let value = $(ev.target).data('value');

            const filterTarget = `${browserTab}Filters`;
            const filter = this[filterTarget].activeFilters[key];

            if (ev.target.checked === true) {
                if (filter === undefined) {
                    this[filterTarget].activeFilters[key] = {
                        path: path,
                        type: filterType,
                        valIsArray: valIsArray,
                        values: [value]
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

            this.replaceList(html, browserTab, observer);   
        });


        html.find('.filter[data-type=numberCompare] select, .filter[data-type=numberCompare] input').on('change keyup paste', ev => {
            const path = $(ev.target).parents('.filter').data('path');
            const key = path.replace(/\./g, '');
            const filterType = 'numberCompare';
            const browserTab = $(ev.target).parents('.tab').data('tab');
            let valIsArray = false;

            const operator = $(ev.target).parents('.filter').find('select').val();
            const value = $(ev.target).parents('.filter').find('input').val();

            const filterTarget = `${browserTab}Filters`;

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

            this.replaceList(html, browserTab);
        });

        //Just for the loading image
        if (this.observer) { 
            html.find("img").each((i,img) => this.observer.observe(img));
        }
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

    async loadAndFilterItems(browserTab="spell",numToPreload=CMPBrowser.PRELOAD) {
        console.log(`Load and Filter Items | Started loading ${browserTab}s`);
        console.time("loadAndFilterItems");
        await this.checkListsLoaded();

        //0.4.1: Load and filter just one of spells, feats, and items (specified by browserTab)
        let unfoundSpells = '';
        let numItemsLoaded = 0;
        let compactItems = {};

        //Filter the full list, but only save the core compendium information + level
        for (let pack of game.packs) {
            if (pack['metadata']['entity'] === "Item" && this.settings.loadedSpellCompendium[pack.collection].load) {
//FIXME: How much could we do with the loaded index rather than all content?                
                await pack.getContent().then(content => {
                    for (let item5e of content) {
                        let compactItem = null;
                        const decoratedItem = this.decorateItem(item5e);
                        if (decoratedItem) {
                            if ((browserTab === "spell") && (decoratedItem.type === "spell")) {
                                if (this.getFilterResult(decoratedItem, this.spellFilters.activeFilters)) {
                                    compactItem = {
                                        compendium : pack.collection,
                                        name : decoratedItem.name,
                                        img: decoratedItem.img,
                                        data : {
                                            level : decoratedItem.data?.level,
                                            components : decoratedItem.data?.components
                                        }
                                    }
                                }
                            } else if ((browserTab === "feat") && ((decoratedItem.type === "feat") || (decoratedItem.type === "class"))) {
                                if (this.getFilterResult(decoratedItem, this.featFilters.activeFilters)) {
                                    compactItem = {
                                        compendium : pack.collection,
                                        name : decoratedItem.name,
                                        img: decoratedItem.img,
                                        classRequirementString : decoratedItem.classRequirementString
                                    }
                                }
                            } else if ((browserTab === "item") && this.getFilterResult(decoratedItem, this.itemFilters.activeFilters)) {
                                compactItem = {
                                    compendium : pack.collection,
                                    name : decoratedItem.name,
                                    img: decoratedItem.img,
                                    type : decoratedItem.type
                                }
                            }
                            if (compactItem) {  //Indicates it passed the filters
                                compactItems[decoratedItem._id] = compactItem; 
                                if (numItemsLoaded++ >= numToPreload) break;
                            }
                        }
                    }//for item5e of content
                });
            }//end if pack entity === Item
            if (numItemsLoaded >= numToPreload) break;
        }//for packs

/*
        if (unfoundSpells !== '') {
            console.log(`Load and Fliter Items | List of Spells that don't have a class associated to them:`);
            console.log(unfoundSpells);
        }      
*/
        this.itemsLoaded = true;  
        console.timeEnd("loadAndFilterItems");
        console.log(`Load and Filter Items | Finished loading ${Object.keys(compactItems).length} ${browserTab}s`);
        return compactItems;
    }

    async loadItems(numToPreload=CMPBrowser.PRELOAD) {
        console.log('Item Browser | Started loading items');
        console.time("loadItems");
        await this.checkListsLoaded();

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
    
    async loadAndFilterNpcs(numToPreload=CMPBrowser.PRELOAD) {
        console.log('NPC Browser | Started loading NPCs');
        console.time("loadAndFilterNpcs");
        let npcs = {};

        let numberLoaded = 0;
        this.npcsLoaded = false;
        for (let pack of game.packs) {
            if (pack['metadata']['entity'] == "Actor" && this.settings.loadedNpcCompendium[pack.collection].load) {
                await pack.getContent().then(async content => {
                    
                    for (let npc of content) {
                        let compactNpc = null;
                        const decoratedNpc = this.decorateNpc(npc);
                        if (decoratedNpc && this.getFilterResult(decoratedNpc, this.npcFilters.activeFilters)) {
                            //0.4.2: Don't store all the details - just the display elements
                            compactNpc = {
                                compendium : pack.collection,
                                name : decoratedNpc.name,
                                img: decoratedNpc.img,
                                displayCR : decoratedNpc.displayCR,
                                displaySize : decoratedNpc.displaySize,
                                displayType: decoratedNpc.data?.details?.type,
                                orderCR : decoratedNpc.data.details.cr,
                                orderSize : decoratedNpc.filterSize
                            }
                            if (compactNpc) {
                                npcs[decoratedNpc._id] = compactNpc;
                            }
                            //0.4.1 Only preload a limited number and fill more in as needed
                            if (numberLoaded++ > numToPreload) break;
                        }
                    }
                });
            }
           //0.4.1 Only preload a limited number and fill more in as needed
            if (numberLoaded > numToPreload) break;
        }

        this.npcsLoaded = true;
        console.timeEnd("loadAndFilterNpcs");
        console.log(`NPC Browser | Finished loading NPCs: ${Object.keys(npcs).length} NPCs`);
        return npcs;
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
            const cbButton = $(`<button class="compendium-browser-btn"><i class="fas fa-fire"></i> ${game.i18n.localize("CMPBrowser.compendiumBrowser")}</button>`);
            html.find('.compendium-browser-btn').remove();

            // adding to directory-list since the footer doesn't exist if the user is not gm
            html.find('.directory-footer').append(cbButton);

            // Handle button clicks
            cbButton.click(ev => {
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



    async replaceList(html, browserTab, options = {reload : true}) {
        let elements = null;
        if (browserTab === 'spell') {
            elements = html.find("ul#CBSpells");
        } else if (browserTab === 'npc') {
            elements = html.find("ul#CBNPCs");
        } else if (browserTab === 'feat') {
            elements = html.find("ul#CBFeats");
        } else if (browserTab === 'item') {
            elements = html.find("ul#CBItems");
        }
        if (elements?.length) {
            //0.4.2b: Don't reload on a tab-switch
            if ((elements[0].children.length <= 1) && options?.reload) {
                //Uses loadAndFilterItems to read compendia for items which pass the current filters and render on this tab
                const newItemsHTML = await this.renderItemData(browserTab); 
                elements[0].innerHTML = newItemsHTML;
                //Re-sort before setting up lazy loading
                this.triggerSort(html, browserTab);

                //Lazy load images
                if (this.observer) { 
                    $(elements).find("img").each((i,img) => this.observer.observe(img));
                }

                //Reactivate listeners for clicking and dragging
                this.activateItemListListeners($(elements));
            }
        }

    }

    async renderItemData(browserTab) {
        let items;
        let html;
        if (browserTab === "spell") {
            items = await this.loadAndFilterItems(browserTab);
            html = await renderTemplate("modules/compendium-browser/template/spell-browser-list.html", {spells : items});
        } else if (browserTab === "feat") {
            items = await this.loadAndFilterItems(browserTab);
            html = await renderTemplate("modules/compendium-browser/template/feat-browser-list.html", {feats : items});
        } else if (browserTab === "npc") {
            const npcs = await this.loadAndFilterNpcs();
            html = await renderTemplate("modules/compendium-browser/template/npc-browser-list.html", {npcs : npcs});
        } else {
            items = await this.loadAndFilterItems(browserTab);
            html = await renderTemplate("modules/compendium-browser/template/item-browser-list.html", {items : items});
        }
        return html;
    }

    //SORTING
    triggerSort(html, browserTab) {
        if (browserTab === 'spell') {
            html.find('.spell-browser select[name=sortorder]').trigger('change');
        } else if (browserTab === 'feat') {
            html.find('.feat-browser select[name=sortorder]').trigger('change');
        } else if (browserTab === 'npc') {
            html.find('.npc-browser select[name=sortorder]').trigger('change')
        } else if (browserTab === 'item') {
            html.find('.item-browser select[name=sortorder]').trigger('change');
        }
    }



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

    decorateItem(item5e) {
        if (!item5e) return null;
        //Decorate and then filter a compendium entry - returns null or the item
        const item = item5e.data;

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

    decorateNpc(npc) {
        //console.log('%c '+npc.name, 'background: white; color: red')
        const decoratedNpc = npc.data;

        // cr display
        let cr = decoratedNpc.data.details.cr;
        if (cr == undefined || cr == '') cr = 0;
        else cr = Number(cr);
        if (cr > 0 && cr < 1) cr = "1/" + (1 / cr);
        decoratedNpc.displayCR = cr;
        decoratedNpc.displaySize = 'unset';
        decoratedNpc.filterSize = 2;
        if (CONFIG.DND5E.actorSizes[decoratedNpc.data.traits.size] !== undefined) {
            decoratedNpc.displaySize = CONFIG.DND5E.actorSizes[decoratedNpc.data.traits.size];
        }
        switch (decoratedNpc.data.traits.size) {
            case 'grg': decoratedNpc.filterSize = 5; break;
            case 'huge': decoratedNpc.filterSize = 4; break;
            case 'lg': decoratedNpc.filterSize = 3; break;
            case 'sm': decoratedNpc.filterSize = 1; break;
            case 'tiny': decoratedNpc.filterSize = 0; break;
            case 'med':
            default: decoratedNpc.filterSize = 2; break;
        }

        // getting value for HasSpells and damage types
        decoratedNpc.hasSpells = false;
        decoratedNpc.damageDealt = [];
        for (let item of decoratedNpc.items) {
            if (item.type == 'spell') {
                decoratedNpc.hasSpells = true;
            }
            if (item.data.damage && item.data.damage.parts && item.data.damage.parts.length > 0) {
                for (let part of item.data.damage.parts) {
                    let type = part[1];
                    if (decoratedNpc.damageDealt.indexOf(type) === -1) {
                        decoratedNpc.damageDealt.push(type);
                    }
                }
            }
        }

        return decoratedNpc;
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
                max: 9999,
                step: 100
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

Hooks.on("renderCompendiumBrowser", CompendiumBrowser.afterRender);