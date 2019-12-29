/**
 * @author Felix Müller aka syl3r86
 * @version 0.1
 */

class SpellBrowser extends Application {

    constructor(app) {
        super(app);
        
        // load settings
        Hooks.on('ready', e => {
            this.initSettings();

            this.loadSpells().then(obj => {
                this.spells = obj
            });
            this.loadNpcs().then(obj => {
                this.npcs = obj
            });

            loadTemplates([
                "modules/compendium-browser/template/spell-browser.html",
                "modules/compendium-browser/template/npc-browser.html",
                "modules/compendium-browser/template/filter-container.html",
                "modules/compendium-browser/template/settings.html"                
            ])
        });
        this.hookCompendiumList();

        this.spellFilters = {
            registeredFilterCategorys: {},
            activeFilters: {}
        };
        this.npcFilters = {
            registeredFilterCategorys: {},
            activeFilters: {}
        };
        
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.classes = options.classes.concat('compendium-browser');
        options.template = "modules/compendium-browser/template/template.html";
        options.width = 700;
        options.height = 700;
        options.resizable = true;
        options.minimizable = true;
        options.title = game.i18n.localize("Compendium Browser");
        return options;
    }

    hookCompendiumList() {
        Hooks.on('renderCompendiumDirectory', (app, html, data) => {
            if (game.user.isGM || this.settings.allowSpellBrowser || this.settings.allowNpcBrowser) {
                const importButton = $(`<button class="compendium-browser-btn"><i class="fas fa-fire"></i> ${game.i18n.localize("Compendium Browser")}</button>`);
                html.find('.compendium-browser-btn').remove();

                // adding to directory-list since the footer doesn't exist if the user is not gm
                html.find('.directory-footer').append(importButton);

                // Handle button clicks
                importButton.click(ev => {
                    ev.preventDefault();
                    this.render(true);
                });
            }
        });
    }

    async getData() {
        if (!this.spellsLoaded) {
            // spells will be stored locally to not require full loading each time the browser is opened
            this.spells = await this.loadSpells();
            this.spellsLoaded = true;
        }

        let data = {};
        data.spells = this.spells;
        data.spellFilters = this.spellFilters;
        data.showSpellBrowser = (game.user.isGM || this.settings.allowSpellBrowser);
        data.npcs = this.npcs;
        data.npcFilters = this.npcFilters;
        data.showNpcBrowser = (game.user.isGM || this.settings.allowNpcBrowser);
        data.settings = this.settings;
        data.isGM = game.user.isGM;
        return data;
    }

    async loadSpells() {
        console.log('Spell Browser | Started loading spells');
        this.spellsLoaded = false;
        this.spellsLoading = true;
        
        let unfoundSpells = '';

        let spells = {};

        for (let pack of game.packs) {
            if (pack['metadata']['entity'] == "Item" && this.settings.loadedSpellCompendium[pack.collection].load) {
                await pack.getContent().then(content => {
                    for (let spell of content) {
                        spell = spell.data;
                        if (spell.type == 'spell') {

                            spell.compendium = pack.collection;

                            // determining classes that can use the spell
                            let cleanSpellName = spell.name.toLowerCase().replace(/[^a-zA-Z0-9\s:]/g, '').replace("'", '').replace(/ /g, '');
                            if (spellClassList[cleanSpellName] !== undefined) {
                                let classes = spellClassList[cleanSpellName];
                                spell.data.classes = classes.split(',');
                            } else {
                                unfoundSpells += cleanSpellName + ',';
                            }

                            // getting damage types
                            spell.damageTypes = [];
                            if (spell.data.damage.parts.length > 0) {
                                for (let part of spell.data.damage.parts) {
                                    let type = part[1];
                                    if (spell.damageTypes.indexOf(type) === -1) {
                                        spell.damageTypes.push(type);
                                    }
                                }
                            }

                            spells[(spell._id)] = spell;
                        }
                    }
                });
            }
        }
        if (unfoundSpells !== '') {
            console.log(`Spell Browser | List of Spells that don't have a class assosiated to them:`);
            console.log(unfoundSpells);
        }        
        console.log('Spell Browser | Finished loading spells');
        return spells;
    }
    
    async loadNpcs() {
        console.log('NPC Browser | Started loading spells');

        let npcs = {};

        for (let pack of game.packs) {
            if (pack['metadata']['entity'] == "Actor" && this.settings.loadedNpcCompendium[pack.collection].load) {
                await pack.getContent().then(async content => {
                    for (let npc of content) {
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
                            if (item.data.damage.parts.length > 0) {
                                for (let part of item.data.damage.parts) {
                                    let type = part[1];
                                    if (npc.damageDealt.indexOf(type) === -1) {
                                        npc.damageDealt.push(type);
                                    }
                                }
                            }
                        }

                        npcs[npc._id] = npc;
                    }
                });
            }
        }
        console.log('NPC Browser | Finished loading NPCs');
        return npcs;
    }
    
    activateListeners(html) {
        // activating tabs/*
        let nav = $('.tabs[data-group="toplvl"]');
        new Tabs(nav, {
            initial: this["activeTab"] || 'tab1',
            callback: clicked => {
                this["activeTab"] = clicked.data("tab");
            }
        });

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

        // sort npc list
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

        // settings
        html.find('.settings input').on('change', ev => {
            let setting = ev.target.dataset.setting;
            let value = ev.target.checked;
            if (setting === 'spell-compendium-setting') {
                let key = ev.target.dataset.key;
                this.settings.loadedSpellCompendium[key].load = value;
                this.loadSpells().then((spells) => {
                    this.spells = spells;
                    this.render();
                });
                ui.notifications.info("Settings Saved. Spell Compendiums are being reloaded.");
            } else if (setting === 'npc-compendium-setting') {
                let key = ev.target.dataset.key;
                this.settings.loadedNpcCompendium[key].load = value;
                this.loadNpcs().then((npcs) => {
                    this.npcs = npcs;
                    this.render();
                });
                ui.notifications.info("Settings Saved. NPC Compendiums are being reloaded.");
            }
            if (setting === 'allow-spell-browser') {
                this.settings.allowSpellBrowser = value;
            }
            if (setting === 'allow-npc-browser') {
                this.settings.allowNpcBrowser = value;
            }
            this.saveSettings();
        });


        // activating or deactivating filters

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
                subjects = this.spells;
            } else if (itemType === 'npc') {
                list = html.find('.npc-browser li');
                subjects = this.npcs;
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
                subjects = this.spells;
            } else if (itemType === 'npc') {
                list = html.find('.npc-browser li');
                subjects = this.npcs;
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
                subjects = this.spells;
            } else if (itemType === 'npc') {
                list = html.find('.npc-browser li');
                subjects = this.npcs;
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
                subjects = this.spells;
            } else if (itemType === 'npc') {
                list = html.find('.npc-browser li');
                subjects = this.npcs;
            }
            this.filterElements(list, subjects, this[filterTarget].activeFilters);
        });

    }

    sortSpells(list, byName) {
        if(byName) {
            list.sort((a, b) => {
                let aName = $(a).find('.spell-name a')[0].innerHTML;
                let bName = $(b).find('.spell-name a')[0].innerHTML;
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
                    let aName = $(a).find('.spell-name a')[0].innerHTML;
                    let bName = $(b).find('.spell-name a')[0].innerHTML;
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
        for (let filterKey in filters) {
            let filter = filters[filterKey];
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
                if (typeof prop === 'object') {
                    if (filter.value && prop.indexOf(filter.value) === -1) {
                        return false;
                    } else {
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
            if (compendium['metadata']['entity'] == "Item") {
                defaultSettings.loadedSpellCompendium[compendium.collection] = {
                    load: true,
                    name: `${compendium['metadata']['label']} (${compendium.collection})`
                };
            }
            if (compendium['metadata']['entity'] == "Actor") {
                defaultSettings.loadedNpcCompendium[compendium.collection] = {
                    load: true,
                    name: `${compendium['metadata']['label']} (${compendium.collection})`
                };
            }
        }
        // creating game setting container
        game.settings.register("compendiumBrowser", "settings", {
            name: "Compendium Browser Settings",
            hint: "Settings to exclude packs from loading and visibility of the browser",
            default: defaultSettings,
            type: Object,
            scope: 'world',
            onChange: settings => {
                this.settings = settings;
            }
        });

        // load settings from container and apply to default settings (available compendie might have changed)
        let settings = game.settings.get('compendiumBrowser', 'settings');
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
        defaultSettings.allowSpellBrowser = settings.allowSpellBrowser;
        defaultSettings.allowNpcBrowser = settings.allowNpcBrowser;

        game.settings.set('compendiumBrowser', 'settings', defaultSettings);
        this.settings = defaultSettings;
    }

    saveSettings() {
        game.settings.set('compendiumBrowser', 'settings', this.settings);
    }

    addFilter(entityType, category, label, path, type, possibleValues = null, valIsArray = false) {
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
            this[target].registeredFilterCategorys[catId] = { label: category, filters: [] };
        }
        this[target].registeredFilterCategorys[catId].filters.push(filter);

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
}

Hooks.on('init', () => {
    if (game.compendiumBrowser === undefined) {
        game.compendiumBrowser = new SpellBrowser();
    }
});

//game.i18n.localize("FRIEND");

Hooks.on('ready', () => {
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.lvl"), 'data.level', 'multiSelect', [game.i18n.localize("CMPBrowser.cantip"), 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.school"), 'data.school', 'select', CONFIG.DND5E.spellSchools);
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.castingTime"), 'data.activation.type', 'select',
        {
            action: game.i18n.localize("DND5E.Action"),
            bonus: game.i18n.localize("CMPBrowser.bonusAction"),
            reaction: game.i18n.localize("CMPBrowser.reaction"),
            minute: game.i18n.localize("DND5E.TimeMinute"),
            hour: game.i18n.localize("DND5E.TimeHour"),
            day: game.i18n.localize("DND5E.TimeDay")
            });
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.spellType"), 'data.actionType', 'select', CONFIG.DND5E.itemActionTypes);
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.damageType"), 'damageTypes', 'select', CONFIG.DND5E.damageTypes);
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.class"), 'data.classes', 'select',
        {
            bard: game.i18n.localize("CMPBrowser.bard"),
            cleric: game.i18n.localize("CMPBrowser.cleric"),
            druid: game.i18n.localize("CMPBrowser.druid"),
            paladin: game.i18n.localize("CMPBrowser.paladin"),
            ranger: game.i18n.localize("CMPBrowser.ranger"),
            sorcerer: game.i18n.localize("CMPBrowser.sorcerer"),
            warlock: game.i18n.localize("CMPBrowser.warlock"),
            wizard: game.i18n.localize("CMPBrowser.wizard"),
        }, true);

    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.ritual"), 'data.components.ritual', 'bool');
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.concentration"), 'data.components.concentration', 'bool');
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.verbal"), 'data.components.vocal', 'bool');
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.somatic"), 'data.components.somatic', 'bool');
    game.compendiumBrowser.addSpellFilter(game.i18n.localize("CMPBrowser.components"), game.i18n.localize("CMPBrowser.material"), 'data.components.material', 'bool');

    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.hasSpells"), 'data.traits.size', 'select', CONFIG.DND5E.actorSizes);
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.ritual"), 'hasSpells', 'bool');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.hasLegAct"), 'data.resources.legact.max', 'bool');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.hasLegRes"), 'data.resources.legres.max', 'bool');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.cr"), 'data.details.cr', 'numberCompare');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.creatureType"), 'data.details.type', 'text', {
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

    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityStr"), 'data.abilities.str.value', 'numberCompare');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityDex"), 'data.abilities.dex.value', 'numberCompare');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityCon"), 'data.abilities.con.value', 'numberCompare');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityInt"), 'data.abilities.int.value', 'numberCompare');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityWis"), 'data.abilities.wis.value', 'numberCompare');
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), game.i18n.localize("DND5E.AbilityCha"), 'data.abilities.cha.value', 'numberCompare');

    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamImm"), 'data.traits.di.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamRes"), 'data.traits.dr.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamVuln"), 'data.traits.dv.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.ConImm"), 'data.traits.ci.value', 'multiSelect', CONFIG.DND5E.conditionTypes, true);
    game.compendiumBrowser.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("CMPBrowser.dmgDealt"), 'damageDealt', 'multiSelect', CONFIG.DND5E.damageTypes, true);
})


spellClassList = {
    "abidalzimshorridwilting": "sorcerer,wizard",
    "absorbelements": "druid,ranger,sorcerer,wizard",
    "aganazzarsscorcher": "sorcerer,wizard",
    "beastbond": "druid,ranger",
    "bonesoftheearth": "druid",
    "catapult": "sorcerer,wizard",
    "catnap": "bard,sorcerer,wizard",
    "causefear": "warlock,wizard",
    "ceremony": "cleric,paladin",
    "chaosbolt": "sorcerer",
    "charmmonster": "bard,druid,sorcerer,warlock,wizard",
    "controlflames": "druid,sorcerer,wizard",
    "controlwinds": "druid,sorcerer,wizard",
    "createbonfire": "druid,sorcerer,warlock,wizard",
    "createhomunculus": "wizard",
    "crownofstars": "sorcerer,warlock,wizard",
    "dansemacabre": "warlock,wizard",
    "dawn": "cleric,wizard",
    "dragonsbreath": "sorcerer,wizard",
    "druidgrove": "druid",
    "dustdevil": "druid,sorcerer,wizard",
    "earthtremor": "bard,druid,sorcerer,wizard",
    "earthbind": "druid,sorcerer,warlock,wizard",
    "elementalbane": "druid,warlock,wizard",
    "enemiesabound": "bard,sorcerer,warlock,wizard",
    "enervation": "sorcerer,warlock,wizard",
    "eruptingearth": "druid,sorcerer,wizard",
    "farstep": "sorcerer,warlock,wizard",
    "findgreatersteed": "paladin",
    "flamearrows": "druid,ranger,sorcerer,wizard",
    "frostbite": "druid,sorcerer,warlock,wizard",
    "guardianofnature": "druid,ranger",
    "gust": "druid,sorcerer,wizard",
    "healingspirit": "druid,ranger",
    "holyweapon": "cleric,paladin",
    "iceknife": "druid,sorcerer,wizard",
    "illusorydragon": "wizard",
    "immolation": "sorcerer,wizard",
    "infernalcalling": "warlock,wizard",
    "infestation": "druid,sorcerer,warlock,wizard",
    "investitureofflame": "druid,sorcerer,warlock,wizard",
    "investitureofice": "druid,sorcerer,warlock,wizard",
    "investitureofstone": "druid,sorcerer,warlock,wizard",
    "investitureofwind": "druid,sorcerer,warlock,wizard",
    "invulnerability": "wizard",
    "lifetransference": "cleric,wizard",
    "maddeningdarkness": "warlock,wizard",
    "maelstrom": "druid",
    "magicstone": "druid,warlock",
    "masspolymorph": "bard,sorcerer,wizard",
    "maximiliansearthengrasp": "sorcerer,wizard",
    "melfsminutemeteors": "sorcerer,wizard",
    "mentalprison": "sorcerer,warlock,wizard",
    "mightyfortress": "wizard",
    "mindspike": "sorcerer,warlock,wizard",
    "moldearth": "druid,sorcerer,wizard",
    "negativeenergyflood": "warlock,wizard",
    "powerwordpain": "sorcerer,warlock,wizard",
    "primalsavagery": "druid",
    "primordialward": "druid",
    "psychicscream": "bard,sorcerer,warlock,wizard",
    "pyrotechnics": "bard,sorcerer,wizard",
    "scatter": "sorcerer,warlock,wizard",
    "shadowblade": "sorcerer,warlock,wizard",
    "shadowofmoil": "warlock",
    "shapewater": "druid,sorcerer,wizard",
    "sickeningradiance": "sorcerer,warlock,wizard",
    "skillempowerment": "bard,sorcerer,wizard",
    "skywrite": "bard,druid,wizard",
    "snare": "druid,ranger,wizard",
    "snillocssnowballswarm": "sorcerer,wizard",
    "soulcage": "warlock,wizard",
    "steelwindstrike": "ranger,wizard",
    "stormsphere": "sorcerer,wizard",
    "summongreaterdemon": "warlock,wizard",
    "summonlesserdemons": "warlock,wizard",
    "synapticstatic": "bard,sorcerer,warlock,wizard",
    "templeofthegods": "cleric",
    "tenserstransformation": "wizard",
    "thunderstep": "sorcerer,warlock,wizard",
    "thunderclap": "bard,druid,sorcerer,warlock,wizard",
    "tidalwave": "druid,sorcerer,wizard",
    "tinyservant": "wizard",
    "tollthedead": "cleric,warlock,wizard",
    "transmuterock": "druid,wizard",
    "vitriolicsphere": "sorcerer,wizard",
    "walloflight": "sorcerer,warlock,wizard",
    "wallofsand": "wizard",
    "wallofwater": "druid,sorcerer,wizard",
    "wardingwind": "bard,druid,sorcerer,wizard",
    "waterysphere": "druid,sorcerer,wizard",
    "whirlwind": "druid,sorcerer,wizard",
    "wordofradiance": "cleric",
    "wrathofnature": "druid,ranger",
    "zephyrstrike": "ranger",
    "boomingblade": "sorcerer,warlock,wizard",
    "greenflameblade": "sorcerer,warlock,wizard",
    "lightninglure": "sorcerer,warlock,wizard",
    "swordburst": "sorcerer,warlock,wizard",
    "arcaneweapon": "artificerrevisited",
    "acidsplash": "sorcerer,wizard,artificerrevisited",
    "aid": "cleric,paladin,artificer,artificerrevisited",
    "alarm": "ranger,wizard,artificer,artificerrevisited",
    "alterself": "sorcerer,wizard,artificer,artificerrevisited",
    "animalfriendship": "bard,druid,ranger",
    "animalmessenger": "bard,druid,ranger",
    "animalshapes": "druid",
    "animatedead": "cleric,wizard",
    "animateobjects": "bard,sorcerer,wizard,artificerrevisited",
    "antilifeshell": "druid",
    "antimagicfield": "cleric,wizard",
    "antipathysympathy": "druid,wizard",
    "arcaneeye": "wizard,artificer,artificerrevisited",
    "arcanegate": "sorcerer,warlock,wizard",
    "arcanelock": "wizard,artificer,artificerrevisited",
    "armorofagathys": "warlock",
    "armsofhadar": "warlock",
    "astralprojection": "cleric,warlock,wizard",
    "augury": "cleric",
    "auraoflife": "paladin",
    "auraofpurity": "paladin",
    "auraofvitality": "paladin",
    "awaken": "bard,druid",
    "bane": "bard,cleric",
    "banishingsmite": "paladin",
    "banishment": "cleric,paladin,sorcerer,warlock,wizard",
    "barkskin": "druid,ranger",
    "beaconofhope": "cleric",
    "beastsense": "druid,ranger",
    "bestowcurse": "bard,cleric,wizard",
    "bigbyshand": "wizard,artificerrevisited",
    "arcanehand": "wizard,artificerrevisited",
    "bladebarrier": "cleric",
    "bladeward": "bard,sorcerer,warlock,wizard",
    "bless": "cleric,paladin",
    "blight": "druid,sorcerer,warlock,wizard",
    "blindingsmite": "paladin",
    "blindnessdeafness": "bard,cleric,sorcerer,wizard",
    "blink": "sorcerer,wizard,artificer,artificerrevisited",
    "blur": "sorcerer,wizard,artificer,artificerrevisited",
    "brandingsmite": "paladin",
    "burninghands": "sorcerer,wizard",
    "calllightning": "druid",
    "calmemotions": "bard,cleric",
    "chainlightning": "sorcerer,wizard",
    "charmperson": "bard,druid,sorcerer,warlock,wizard",
    "chilltouch": "sorcerer,warlock,wizard",
    "chromaticorb": "sorcerer,wizard",
    "circleofdeath": "sorcerer,warlock,wizard",
    "circleofpower": "paladin",
    "clairvoyance": "bard,cleric,sorcerer,wizard",
    "clone": "wizard",
    "cloudofdaggers": "bard,sorcerer,warlock,wizard",
    "cloudkill": "sorcerer,wizard",
    "colorspray": "sorcerer,wizard",
    "command": "cleric,paladin",
    "commune": "cleric",
    "communewithnature": "druid,ranger",
    "compelledduel": "paladin",
    "comprehendlanguages": "bard,sorcerer,warlock,wizard",
    "compulsion": "bard",
    "coneofcold": "sorcerer,wizard",
    "confusion": "bard,druid,sorcerer,wizard",
    "conjureanimals": "druid,ranger",
    "conjurebarrage": "ranger",
    "conjurecelestial": "cleric",
    "conjureelemental": "druid,wizard",
    "conjurefey": "druid,warlock",
    "conjureminorelementals": "druid,wizard",
    "conjurevolley": "ranger",
    "conjurewoodlandbeings": "druid,ranger",
    "contactotherplane": "warlock,wizard",
    "contagion": "cleric,druid",
    "contingency": "wizard",
    "continualflame": "cleric,wizard,artificer,artificerrevisited",
    "controlwater": "cleric,druid,wizard",
    "controlweather": "cleric,druid,wizard",
    "cordonofarrows": "ranger",
    "counterspell": "sorcerer,warlock,wizard",
    "createfoodandwater": "cleric,paladin",
    "createundead": "cleric,warlock,wizard",
    "createordestroywater": "cleric,druid",
    "creation": "sorcerer,wizard,artificerrevisited",
    "crownofmadness": "bard,sorcerer,warlock,wizard",
    "crusadersmantle": "paladin",
    "curewounds": "bard,cleric,druid,paladin,ranger,artificer,artificerrevisited",
    "dancinglights": "bard,sorcerer,wizard,artificerrevisited",
    "darkness": "sorcerer,warlock,wizard",
    "darkvision": "druid,ranger,sorcerer,wizard,artificer,artificerrevisited",
    "daylight": "cleric,druid,paladin,ranger,sorcerer",
    "deathward": "cleric,paladin,artificer",
    "delayedblastfireball": "sorcerer,wizard",
    "demiplane": "warlock,wizard",
    "destructivewave": "paladin",
    "detectevilandgood": "cleric,paladin",
    "detectmagic": "bard,cleric,druid,paladin,ranger,sorcerer,wizard,artificerrevisited",
    "detectpoisonanddisease": "cleric,druid,paladin,ranger",
    "detectthoughts": "bard,sorcerer,wizard",
    "dimensiondoor": "bard,sorcerer,warlock,wizard",
    "disguiseself": "bard,sorcerer,wizard,artificer,artificerrevisited",
    "disintegrate": "sorcerer,wizard",
    "dispelevilandgood": "cleric,paladin",
    "dispelmagic": "bard,cleric,druid,paladin,sorcerer,warlock,wizard,artificerrevisited",
    "dissonantwhispers": "bard",
    "divination": "cleric",
    "divinefavor": "paladin",
    "divineword": "cleric",
    "dominatebeast": "druid,sorcerer",
    "dominatemonster": "bard,sorcerer,warlock,wizard",
    "dominateperson": "bard,sorcerer,wizard",
    "drawmijsinstantsummons": "wizard",
    "instantsummons": "wizard",
    "dream": "bard,warlock,wizard",
    "druidcraft": "druid",
    "earthquake": "cleric,druid,sorcerer",
    "eldritchblast": "warlock",
    "elementalweapon": "paladin,artificerrevisited",
    "enhanceability": "bard,cleric,druid,sorcerer,artificer,artificerrevisited",
    "enlargereduce": "sorcerer,wizard,artificer,artificerrevisited",
    "ensnaringstrike": "ranger",
    "entangle": "druid",
    "enthrall": "bard,warlock",
    "etherealness": "bard,cleric,sorcerer,warlock,wizard",
    "evardsblacktentacles": "wizard",
    "blacktentacles": "wizard",
    "expeditiousretreat": "sorcerer,warlock,wizard,artificer,artificerrevisited",
    "eyebite": "bard,sorcerer,warlock,wizard",
    "fabricate": "wizard,artificer,artificerrevisited",
    "faeriefire": "bard,druid",
    "falselife": "sorcerer,wizard,artificer,artificerrevisited",
    "fear": "bard,sorcerer,warlock,wizard",
    "featherfall": "bard,sorcerer,wizard",
    "feeblemind": "bard,druid,warlock,wizard",
    "feigndeath": "bard,cleric,druid,wizard",
    "findfamiliar": "wizard",
    "findsteed": "paladin",
    "findtraps": "cleric,druid,ranger",
    "findthepath": "bard,cleric,druid",
    "fingerofdeath": "sorcerer,warlock,wizard",
    "firebolt": "sorcerer,wizard,artificerrevisited",
    "fireshield": "wizard",
    "firestorm": "cleric,druid,sorcerer",
    "fireball": "sorcerer,wizard",
    "flameblade": "druid",
    "flamestrike": "cleric",
    "flamingsphere": "druid,wizard",
    "fleshtostone": "warlock,wizard",
    "fly": "sorcerer,warlock,wizard,artificer,artificerrevisited",
    "fogcloud": "druid,ranger,sorcerer,wizard",
    "forbiddance": "cleric",
    "forcecage": "bard,warlock,wizard",
    "foresight": "bard,druid,warlock,wizard",
    "freedomofmovement": "bard,cleric,druid,ranger,artificer,artificerrevisited",
    "friends": "bard,sorcerer,warlock,wizard",
    "gaseousform": "sorcerer,warlock,wizard,artificer,artificerrevisited",
    "gate": "cleric,sorcerer,wizard",
    "geas": "bard,cleric,druid,paladin,wizard",
    "gentlerepose": "cleric,wizard",
    "giantinsect": "druid",
    "glibness": "bard,warlock",
    "globeofinvulnerability": "sorcerer,wizard",
    "glyphofwarding": "bard,cleric,wizard,artificer,artificerrevisited",
    "goodberry": "druid,ranger",
    "graspingvine": "druid,ranger",
    "grease": "wizard,artificerrevisited",
    "greaterinvisibility": "bard,sorcerer,wizard",
    "greaterrestoration": "bard,cleric,druid,artificerrevisited",
    "guardianoffaith": "cleric",
    "guardsandwards": "bard,wizard",
    "guidance": "cleric,druid,artificerrevisited",
    "guidingbolt": "cleric",
    "gustofwind": "druid,sorcerer,wizard",
    "hailofthorns": "ranger",
    "hallow": "cleric",
    "hallucinatoryterrain": "bard,druid,warlock,wizard",
    "harm": "cleric",
    "haste": "sorcerer,wizard,artificer,artificerrevisited",
    "heal": "cleric,druid",
    "healingword": "bard,cleric,druid",
    "heatmetal": "bard,druid,artificerrevisited",
    "hellishrebuke": "warlock",
    "heroesfeast": "cleric,druid",
    "heroism": "bard,paladin",
    "hex": "warlock",
    "holdmonster": "bard,sorcerer,warlock,wizard",
    "holdperson": "bard,cleric,druid,sorcerer,warlock,wizard",
    "holyaura": "cleric",
    "hungerofhadar": "warlock",
    "huntersmark": "ranger",
    "hypnoticpattern": "bard,sorcerer,warlock,wizard",
    "icestorm": "druid,sorcerer,wizard",
    "identify": "bard,wizard,artificerrevisited",
    "illusoryscript": "bard,warlock,wizard",
    "imprisonment": "warlock,wizard",
    "incendiarycloud": "sorcerer,wizard",
    "inflictwounds": "cleric",
    "insectplague": "cleric,druid,sorcerer",
    "invisibility": "bard,sorcerer,warlock,wizard,artificer,artificerrevisited",
    "jump": "druid,ranger,sorcerer,wizard,artificer,artificerrevisited",
    "knock": "bard,sorcerer,wizard",
    "legendlore": "bard,cleric,wizard",
    "leomundssecretchest": "wizard,artificer,artificerrevisited",
    "leomundstinyhut": "bard,wizard",
    "lesserrestoration": "bard,cleric,druid,paladin,ranger,artificer,artificerrevisited",
    "levitate": "sorcerer,wizard,artificerrevisited",
    "light": "bard,cleric,sorcerer,wizard,artificerrevisited",
    "lightningarrow": "ranger",
    "lightningbolt": "sorcerer,wizard",
    "locateanimalsorplants": "bard,druid,ranger",
    "locatecreature": "bard,cleric,druid,paladin,ranger,wizard",
    "locateobject": "bard,cleric,druid,paladin,ranger,wizard",
    "longstrider": "bard,druid,ranger,wizard,artificer,artificerrevisited",
    "magearmor": "sorcerer,wizard",
    "magehand": "bard,sorcerer,warlock,wizard,artificerrevisited",
    "magiccircle": "cleric,paladin,warlock,wizard",
    "magicjar": "wizard",
    "magicmissile": "sorcerer,wizard",
    "magicmouth": "bard,wizard,artificerrevisited",
    "magicweapon": "paladin,wizard,artificer,artificerrevisited",
    "majorimage": "bard,sorcerer,warlock,wizard",
    "masscurewounds": "bard,cleric,druid",
    "massheal": "cleric",
    "masshealingword": "cleric",
    "masssuggestion": "bard,sorcerer,warlock,wizard",
    "maze": "wizard",
    "meldintostone": "cleric,druid",
    "melfsacidarrow": "wizard",
    "acidarrow": "wizard",
    "mending": "bard,cleric,druid,sorcerer,wizard,artificerrevisited",
    "message": "bard,sorcerer,wizard,artificerrevisited",
    "meteorswarm": "sorcerer,wizard",
    "mindblank": "bard,wizard",
    "minorillusion": "bard,sorcerer,warlock,wizard",
    "miragearcane": "bard,druid,wizard",
    "mirrorimage": "sorcerer,warlock,wizard",
    "mislead": "bard,wizard",
    "mistystep": "sorcerer,warlock,wizard",
    "modifymemory": "bard,wizard",
    "moonbeam": "druid",
    "mordenkainensfaithfulhound": "wizard,artificer,artificerrevisited",
    "faithfulhound": "wizard,artificer,artificerrevisited",
    "mordenkainensmagnificentmansion": "bard,wizard",
    "magnificentmansion": "bard,wizard",
    "mordenkainensprivatesanctum": "wizard,artificer,artificerrevisited",
    "mordenkainenssword": "bard,wizard",
    "arcanesword": "bard,wizard",
    "moveearth": "druid,sorcerer,wizard",
    "nondetection": "bard,ranger,wizard",
    "nystulsmagicaura": "wizard",
    "arcanistsmagicaura": "wizard",
    "otilukesfreezingsphere": "wizard",
    "otilukesresilientsphere": "wizard,artificer,artificerrevisited",
    "ottosirresistibledance": "bard,wizard",
    "passwithouttrace": "druid,ranger",
    "passwall": "wizard",
    "phantasmalforce": "bard,sorcerer,wizard",
    "phantasmalkiller": "wizard",
    "phantomsteed": "wizard",
    "planarally": "cleric",
    "planarbinding": "bard,cleric,druid,wizard",
    "planeshift": "cleric,druid,sorcerer,warlock,wizard",
    "plantgrowth": "bard,druid,ranger",
    "poisonspray": "druid,sorcerer,warlock,wizard,artificerrevisited",
    "polymorph": "bard,druid,sorcerer,wizard",
    "powerwordheal": "bard",
    "powerwordkill": "bard,sorcerer,warlock,wizard",
    "powerwordstun": "bard,sorcerer,warlock,wizard",
    "prayerofhealing": "cleric",
    "prestidigitation": "bard,sorcerer,warlock,wizard,artificerrevisited",
    "prismaticspray": "sorcerer,wizard",
    "prismaticwall": "wizard",
    "produceflame": "druid",
    "programmedillusion": "bard,wizard",
    "projectimage": "bard,wizard",
    "protectionfromenergy": "cleric,druid,ranger,sorcerer,wizard,artificer,artificerrevisited",
    "protectionfromevilandgood": "cleric,paladin,warlock,wizard",
    "protectionfrompoison": "cleric,druid,paladin,ranger,artificer,artificerrevisited",
    "purifyfoodanddrink": "cleric,druid,paladin",
    "raisedead": "bard,cleric,paladin",
    "rarystelepathicbond": "wizard",
    "rayofenfeeblement": "warlock,wizard",
    "rayoffrost": "sorcerer,wizard,artificerrevisited",
    "rayofsickness": "sorcerer,wizard",
    "regenerate": "bard,cleric,druid",
    "reincarnate": "druid",
    "removecurse": "cleric,paladin,warlock,wizard",
    "resistance": "cleric,druid,artificerrevisited",
    "resurrection": "bard,cleric",
    "reversegravity": "druid,sorcerer,wizard",
    "revivify": "cleric,paladin,artificer,artificerrevisited",
    "ropetrick": "wizard,artificer,artificerrevisited",
    "sacredflame": "cleric",
    "sanctuary": "cleric,artificer,artificerrevisited",
    "scorchingray": "sorcerer,wizard",
    "scrying": "bard,cleric,druid,warlock,wizard",
    "searingsmite": "paladin",
    "seeinvisibility": "bard,sorcerer,wizard,artificerrevisited",
    "seeming": "bard,sorcerer,wizard",
    "sending": "bard,cleric,wizard",
    "sequester": "wizard",
    "shapechange": "druid,wizard",
    "shatter": "bard,sorcerer,warlock,wizard",
    "shield": "sorcerer,wizard",
    "shieldoffaith": "cleric,paladin,artificer,artificerrevisited",
    "shillelagh": "druid",
    "shockinggrasp": "sorcerer,wizard,artificerrevisited",
    "silence": "bard,cleric,ranger",
    "silentimage": "bard,sorcerer,wizard",
    "simulacrum": "wizard",
    "sleep": "bard,sorcerer,wizard",
    "sleetstorm": "druid,sorcerer,wizard",
    "slow": "sorcerer,wizard",
    "sparethedying": "cleric,artificerrevisited",
    "speakwithanimals": "bard,druid,ranger",
    "speakwithdead": "bard,cleric",
    "speakwithplants": "bard,druid,ranger",
    "spiderclimb": "sorcerer,warlock,wizard,artificer,artificerrevisited",
    "spikegrowth": "druid,ranger",
    "spiritguardians": "cleric",
    "spiritualweapon": "cleric",
    "staggeringsmite": "paladin",
    "stinkingcloud": "bard,sorcerer,wizard",
    "stoneshape": "cleric,druid,wizard,artificer,artificerrevisited",
    "stoneskin": "druid,ranger,sorcerer,wizard,artificer,artificerrevisited",
    "stormofvengeance": "druid",
    "suggestion": "bard,sorcerer,warlock,wizard",
    "sunbeam": "druid,sorcerer,wizard",
    "sunburst": "druid,sorcerer,wizard",
    "swiftquiver": "ranger",
    "symbol": "bard,cleric,wizard",
    "tashashideouslaughter": "bard,wizard",
    "hideouslaughter": "bard,wizard",
    "telekinesis": "sorcerer,wizard",
    "telepathy": "wizard",
    "teleport": "bard,sorcerer,wizard",
    "teleportationcircle": "bard,sorcerer,wizard",
    "tensersfloatingdisk": "wizard",
    "tensersfloatingdisc": "wizard",
    "floatingdisc": "wizard",
    "thaumaturgy": "cleric",
    "thornwhip": "druid,artificerrevisited",
    "thunderoussmite": "paladin",
    "thunderwave": "bard,druid,sorcerer,wizard",
    "timestop": "sorcerer,wizard",
    "tongues": "bard,cleric,sorcerer,warlock,wizard",
    "transportviaplants": "druid",
    "treestride": "druid,ranger",
    "truepolymorph": "bard,warlock,wizard",
    "trueresurrection": "cleric,druid",
    "trueseeing": "bard,cleric,sorcerer,warlock,wizard",
    "truestrike": "bard,sorcerer,warlock,wizard",
    "tsunami": "druid",
    "unseenservant": "bard,warlock,wizard",
    "vampirictouch": "warlock,wizard",
    "viciousmockery": "bard",
    "walloffire": "druid,sorcerer,wizard",
    "wallofforce": "wizard",
    "wallofice": "wizard",
    "wallofstone": "druid,sorcerer,wizard,artificerrevisited",
    "wallofthorns": "druid",
    "wardingbond": "cleric",
    "waterbreathing": "druid,ranger,sorcerer,wizard,artificer,artificerrevisited",
    "waterwalk": "cleric,druid,ranger,sorcerer,artificer,artificerrevisited",
    "web": "sorcerer,wizard",
    "weird": "wizard",
    "windwalk": "druid",
    "windwall": "druid,ranger",
    "wish": "sorcerer,wizard",
    "witchbolt": "sorcerer,warlock,wizard",
    "wordofrecall": "cleric",
    "wrathfulsmite": "paladin",
    "zoneoftruth": "bard,cleric,paladin"
}