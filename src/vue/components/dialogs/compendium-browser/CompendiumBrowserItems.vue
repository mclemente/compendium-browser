<template>
	<div class="item-browser browser flexrow">
		<section class="control-area flexcol">

			<div class="controls">
				<FilterNameSort v-model="name" :filters="sorts"/>

				<div class="filtercontainer">
					<h3>{{ game.i18n.localize('General') }}</h3>
					<div class="filters">
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.type">{{ game.i18n.localize('Type') }}</label>
							<Multiselect
								v-model="type"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(itemTypes)"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.rarity">{{ game.i18n.localize('Magical Item') }}</label>
							<Multiselect
								v-model="rarity"
								mode="tags"
								:class="{ 'rarity': true }"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.itemRarity)"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.activation">{{ game.i18n.localize('Activation') }}</label>
							<Multiselect
								v-model="activation"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.abilityActivationTypes)"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.damageType">{{ game.i18n.localize('Damage Type') }}</label>
							<Multiselect
								v-model="damageType"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.damageTypes)"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.uses">{{ game.i18n.localize('Has Limited Uses') }}</label>
							<input type="checkbox" v-model="uses">
						</div>
					</div>
				</div>

				<div class="filtercontainer">
					<h3>{{ game.i18n.localize('Subtypes') }}</h3>
					<div class="filters">
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.weaponTypes">{{ game.i18n.localize('Weapon Types') }}</label>
							<Multiselect
								v-model="weaponTypes"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.weaponTypes)"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.equipmentTypes">{{ game.i18n.localize('Equipment Types') }}</label>
							<Multiselect
								v-model="equipmentTypes"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.equipmentTypes)"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.consumableTypes">{{ game.i18n.localize('Consumable Types') }}</label>
							<Multiselect
								v-model="consumableTypes"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.consumableTypes)"
								:closeOnSelect="false"
							/>
						</div>
					</div>
				</div>
			</div>
			<footer>
				<!-- Reset. -->
				<button type="reset" @click="resetFilters()">{{ game.i18n.localize('Reset Filters') }}</button>
			</footer>
		</section>

		<section class="list-area flexcol">
			<!-- Items results. -->
			<ul v-if="loaded" class="compendium-browser-results compendium-browser-items">
				<!-- Individual items entries. -->
				<li v-for="(equipment, equipmentKey) in entries" :key="equipmentKey"
					:class="`flexrow draggable compendium-browser-row${equipmentKey >= pager.lastIndex - 1 && equipmentKey < pager.totalRows - 1
						? ' compendium-browser-row-observe': ''} document item`"
						:data-document-id="equipment._id"
						@click="openDocument(equipment.uuid, 'Item')"
						@dragstart="startDrag($event, equipment, 'Item')"
						draggable="true"
				>
					<!-- Both the image and title have drag events. These are primarily separated so that -->
					<!-- if a user drags the token, it will only show the token as their drag preview. -->
					<img :src="equipment.img" />
					<div class="line">
						<!-- First row is the title. -->
						<div class="flexrow">
							<h4 class="name">{{ equipment.name }}</h4>
							<h4 class="type">
								<span>
									<span v-if="equipment.system.rarity" class="rarity">{{ CONFIG.DND5E.itemRarity[equipment.system.rarity] }} </span>
									{{ game.i18n.localize(`ITEM.Type${equipment.type.capitalize()}`) }}
								</span>
							</h4>
						</div>
						<!-- Second row is supplemental info. -->
						<div class="tags flexrow">
							<div>
								<span v-if="equipment.system.properties.length" v-for="(prop, index) of equipment.system.properties" :key="prop">
									{{ CONFIG.DND5E.itemProperties[prop].label }}<span v-if="index != Object.keys(equipment.system.properties).length - 1">, </span>
								</span>
							</div>
							<div>
								<span>{{ equipment.system.price.value }} {{ equipment.system.price.denomination }}</span>
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div v-else class="compendium-browser-loading"><p><i class="fas fa-circle-notch fa-spin"></i>Please wait, loading...</p></div>
		</section>
	</div>
</template>

<script>
// onUpdated() is used for the infinite scroll intersection observer.
import { onUpdated } from 'vue';
// External components.
import FilterNameSort from '@/components/dialogs/compendium-browser/filters/FilterNameSort.vue';
import Multiselect from '@vueform/multiselect';
import Slider from '@vueform/slider';
// Helper methods.
import {
	getPackIndex,
	// localize,
	// localizeEquipmentBonus,
	numberFormat,
	openDocument,
	sortPackValues,
	startDrag
} from '@/methods/Helpers.js';

export default {
	name: 'CompendiumBrowserItems',
	props: ['tab'],
	// Imported components that need to be available in the <template>
	components: {
		Slider,
		Multiselect,
		FilterNameSort
	},
	setup() {
		return {
			// Imported methods that need to be available in the <template>
			// localize,
			// localizeEquipmentBonus,
			numberFormat,
			openDocument,
			sortPackValues,
			startDrag,
			// Foundry base props and methods.
			CONFIG,
			foundry,
			game,
			getDocumentClass
		}
	},
	data() {
		return {
			// Props used for infinite scroll and pagination.
			observer: null,
			loaded: false,
			pager: {
				perPage: 50,
				firstIndex: 0,
				lastIndex: 50,
				totalRows: 0,
			},
			sorts: {
				sortBy: 'name',
				direction: 'asc',
				sortOptions: [
					{ value: 'name', label: game.i18n.localize('Name') },
					{ value: 'price', label: game.i18n.localize('Price') },
					{ value: 'rarity', label: game.i18n.localize('Rarity') },
				],
			},
			// Sorting.
			// Our list of pseudo documents returned from the compendium.
			packIndex: [],
			// Filters.
			name: '',
			type: [],
			rarity: [],
			activation: [],
			damageType: [],
			uses: false,
			weaponTypes: [],
			consumableTypes: [],
			equipmentTypes: [],
		}
	},
	methods: {
		/**
		 * Callback for the infinite scroll IntersectionObserver.
		 *
		 * @param {Array} List of IntersectionObserverEntry objects.
		 */
		 infiniteScroll(entries) {
			// Iterate over our possible elements.
			entries.forEach(({target, isIntersecting}) => {
				// If the element isn't visible, do nothing.
				if (!isIntersecting) {
					return;
				}

				// Otherwise, remove the observer and update our pager properties.
				// We need to increase the lastIndex for our filter by an amount
				// equal to our number of entries per page.
				this.observer.unobserve(target);
				this.pager.lastIndex = Math.min(
					this.pager.lastIndex + this.pager.perPage,
					this.pager.totalRows
				);
			});
		},
		/**
		 * Click event to reset our filters.
		 */
		 resetFilters() {
			this.sorts.sortBy = 'name';
			this.sorts.direction = 'asc';
			this.name = '';
			this.type = [];
			this.rarity = [];
			this.activation = [];
			this.damageType = [];
			this.uses = false;
			this.weaponTypes = [];
			this.consumableTypes = [];
			this.equipmentTypes = [];
		},
	},
	computed: {
		itemTypes() {
			return {
				consumable: game.i18n.localize("ITEM.TypeConsumable"),
				container: game.i18n.localize("ITEM.TypeContainer"),
				equipment: game.i18n.localize("ITEM.TypeEquipment"),
				loot: game.i18n.localize("ITEM.TypeLoot"),
				tool: game.i18n.localize("ITEM.TypeTool"),
				weapon: game.i18n.localize("ITEM.TypeWeapon"),
			};
		},
		bonusOptions() {
			return [
				{
					value: 'melee',
					dataProp: 'system.attributes.attack.melee.bonus',
					label: 'Melee',
				},
				{
					value: 'ranged',
					dataProp: 'system.attributes.attack.ranged.bonus',
					label: 'Ranged',
				},
				{
					value: 'divine',
					dataProp: 'system.attributes.attack.divine.bonus',
					label: 'Divine',
				},
				{
					value: 'arcane',
					dataProp: 'system.attributes.attack.arcane.bonus',
					label: 'Arcane',
				},
				{
					value: 'ac',
					dataProp: 'system.attributes.ac.bonus',
					label: 'AC',
				},
				{
					value: 'md',
					dataProp: 'system.attributes.md.bonus',
					label: 'PD',
				},
				{
					value: 'pd',
					dataProp: 'system.attributes.pd.bonus',
					label: 'MD',
				},
				{
					value: 'hp',
					dataProp: 'system.attributes.hp.bonus',
					label: 'HP',
				},
				{
					value: 'recoveries',
					dataProp: 'system.attributes.recoveries.bonus',
					label: 'Recoveries',
				},
				{
					value: 'save',
					dataProp: 'system.attributes.save.bonus',
					label: 'Save',
				},
				{
					value: 'disengage',
					dataProp: 'system.attributes.disengage.bonus',
					label: 'Disengage',
				},
			];
		},
		rechargeOptions() {
			return [
				{
					value: 6,
					label: 'Easy (6+)',
					next: 10,
				},
				{
					value: 11,
					label: 'Normal (11+)',
					next: 15,
				},
				{
					value: 16,
					label: 'Hard (16+)',
					next: 20,
				}
			]
		},
		chakraSlots() {
			const result = {};
			return result;
		},
		entries() {
			// Build our results array. Exit early if the length is 0.
			let result = this.packIndex;
			if (result.length < 1) {
				this.pager.totalRows = 0;
				return [];
			}

			// Filter by name.
			if (this.name && this.name.length > 0) {
				const name = this.name.toLocaleLowerCase();
				result = result.filter(entry =>
					entry.originalName?.toLocaleLowerCase().includes(name)
					|| entry.name.toLocaleLowerCase().includes(name)
				);
			}

			if (Array.isArray(this.type) && this.type.length > 0) {
				result = result.filter(entry => this.type.includes(entry.type));
			}
			if (Array.isArray(this.rarity) && this.rarity.length > 0) {
				result = result.filter(entry => this.rarity.includes(entry.system.rarity));
			}
			if (Array.isArray(this.activation) && this.activation.length > 0) {
				result = result.filter(entry => entry.system.activation && this.activation.includes(entry.system.activation.type))
			}
			if (Array.isArray(this.damageType) && this.damageType.length > 0) {
				result = result.filter(entry => {
					if (!entry.system.damage) return false;
					const damageTypes = entry.system.damage.parts.map((d) => d[1]);
					return this.damageType.some((d) => damageTypes.includes(d));
				})
			}
			if (this.uses) {
				result = result.filter(entry => entry.system.uses && entry.system.uses.max);
			}
			if (Array.isArray(this.weaponTypes) && this.weaponTypes.length > 0) {
				result = result.filter(entry => entry.system.type && this.weaponTypes.includes(entry.system.type.value));
			}
			if (Array.isArray(this.consumableTypes) && this.consumableTypes.length > 0) {
				result = result.filter(entry => entry.system.type && this.consumableTypes.includes(entry.system.type.value));
			}
			if (Array.isArray(this.equipmentTypes) && this.equipmentTypes.length > 0) {
				result = result.filter(entry => entry.system.type && this.equipmentTypes.includes(entry.system.type.value));
			}

			// Reflow pager.
			if (result.length > this.pager.perPage) {
				this.pager.totalRows = result.length;
				if (this.pager.lastIndex == 0) {
					this.pager.lastIndex = this.pager.perPage - 1;
				}
			}
			else {
				this.pager.totalRows = 0;
			}

			// Sort.
			result = result.sort((a, b) => {
				// Add sorts here.
				switch (this.sorts.sortBy) {
					case "price":
						const currencies = Object.keys(CONFIG.DND5E.currencies).reverse();
						if (a.system.price.denomination === b.system.price.denomination) {
							return a.system.price.value - b.system.price.value
						}
						return currencies.indexOf(a.system.price.denomination) - currencies.indexOf(b.system.price.denomination);
					case "rarity":
						const rarities = Object.keys(CONFIG.DND5E.itemRarity);
						return rarities.indexOf(a.system.rarity) - rarities.indexOf(b.system.rarity);
				}
				return a.name.localeCompare(b.name);
			});
			if (this.sorts.direction === "desc") {
				result = result.reverse();
			}

			// Return results.
			return this.pager.totalRows > 0
				? result.slice(this.pager.firstIndex, this.pager.lastIndex)
				: result;
		},
	},
	watch: {},
	// Handle created hook.
	async created() {
		console.log("Creating compendium browser magic items tab...");

		// Load the pack index with the fields we need.
		getPackIndex({
			fields: [
				'system.activation.type',
				'system.container',
				'system.damage',
				'system.properties',
				'system.price',
				'system.rarity',
				'system.source.book',
				'system.type',
				'system.uses',
			],
			types: ["Item"],
			subTypes: ["consumable", "container", "equipment", "loot", "tool", "weapon"]
		}).then(packIndex => {
			this.packIndex = packIndex.filter((e) => !e.system.container);
			this.loaded = true;
		});

		// Create our intersection observer for infinite scroll.
		this.observer = new IntersectionObserver(this.infiniteScroll, {
			root: this.$el,
			threshold: 0.1,
		});
	},
	// Handle mounted hook.
	async mounted() {
		console.log("Compendium browser magic items tab mounted.");

		// Note that our tab has beened opened so that it won't de-render later.
		this.tab.opened = true;

		// Adjust our observers whenever the results of the compendium browser
		// are updated.
		onUpdated(() => {
			const target = document.querySelector('.compendium-browser-items .compendium-browser-row-observe');
			if (target) {
				this.observer.observe(target);
			}
		});
	},
	// Handle the unmount hook.
	async beforeUnmount() {
		// Handle the unmount hook.
		this.observer.disconnect();
	}
}
</script>

<style lang="scss">
	@import "@vueform/slider/themes/default.css";
	@import "@vueform/multiselect/themes/default.css";
</style>