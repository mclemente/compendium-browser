<template>
	<div class="feat-browser browser flexrow">
		<section class="control-area flexcol">
			<div class="controls">
				<FilterNameSort v-model="name" :filters="sorts"/>

				<div class="filtercontainer">
					<h3>{{ game.i18n.localize('General') }}</h3>
					<div class="filters">
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.classes">{{ game.i18n.localize('Classes') }}</label>
							<Multiselect
								v-model="classes"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(this.classList)"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.overall">{{ game.i18n.localize('Item Type') }}</label>
							<Multiselect
								v-model="subtypes"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues({
									class: 'ITEM.TypeClass',
									feat: 'ITEM.TypeFeat',
									subclass: 'ITEM.TypeSubclass',
									background: 'DND5E.Background',
									race: 'DND5E.Race',
								})"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.featureType">{{ game.i18n.localize('Feature Type') }}</label>
							<Multiselect
								v-model="featureTypes"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(Object.keys(dnd5e.config.featureTypes).reduce(function (acc, current) {
									acc[current] = dnd5e.config.featureTypes[current].label;
									return acc;
								}, {}))"
								:closeOnSelect="false"
							/>
						</div>
						<div class="filter">
							<label class="unit-title" for="compendiumBrowser.featureType">{{ game.i18n.localize('Subfeature Type') }}</label>
							<Multiselect
								v-model="featureSubtype"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(dnd5e.config.featureTypes.class.subtypes)"
								:closeOnSelect="false"
							/>
						</div>
					</div>
				</div>

				<div class="filtercontainer">
					<h3>{{ game.i18n.localize('Game Mechanics') }}</h3>
					<div class="filters">
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
								v-model="damageTypes"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.damageTypes)"
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
			<ul v-if="loaded" class="compendium-browser-results compendium-browser-features">
				<li v-for="(entry, entryKey) in entries" :key="entryKey"
						:class="`flexrow draggable compendium-browser-row${entryKey >= pager.lastIndex - 1 && entryKey < pager.totalRows - 1
							? ' compendium-browser-row-observe': ''} document item`"
						:data-document-id="entry._id" @click="openDocument(entry.uuid, 'Item')"
						@dragstart="startDrag($event, entry, 'Item')"
						draggable="true"
					>
					<img :src="entry.img"/>
					<div class="line">
						<h4 class="name">{{ entry.name }}</h4>
					</div>
				</li>
			</ul>
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
	openDocument,
	sortPackValues,
	startDrag,
} from '@/methods/Helpers.js';

export default {
	name: 'CompendiumBrowserPowers',
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
			openDocument,
			sortPackValues,
			startDrag,
			// Foundry base props and methods.
			CONFIG,
			game,
			getDocumentClass,
			// System-specific props and methods
			dnd5e
		}
	},
	data() {
		return {
			// Props used for infinited scroll and pagination.
			observer: null,
			loaded: false,
			pager: {
				perPage: 50,
				firstIndex: 0,
				lastIndex: 50,
				totalRows: 0,
			},
			// Sorting.
			sorts: {
				sortBy: 'name',
				direction: 'asc',
				sortOptions: [
					{ value: 'name', label: game.i18n.localize('Name') },
					{ value: 'class', label: game.i18n.localize('TYPES.Item.class') },
				],
			},
			// Our list of pseudo documents returned from the compendium.
			packIndex: [],
			// Filters.
			name: '',
			classList: {},
			classes: [],
			subtypes: [],
			featureTypes: [],
			featureSubtype: [],
			activation: [],
			damageTypes: [],
		}
	},
	methods: {
		/**
		 * Callback for the infinite scroll IntersectionObserver.
		 *
		 * @param {Array} List of IntersectionObserverEntry objects.
		 */
		infiniteScroll(entries) {
			entries.forEach(({target, isIntersecting}) => {
				// If the element isn't visible, do nothing.
				if (!isIntersecting) {
					return;
				}

				// Otherwise, remove the observer and update our pager properties.
				// We need to increase the lastIndex for our filter by an amount
				// equal to our number of entries per page.
				this.observer.unobserve(target);
				this.pager.lastIndex = Math.min(this.pager.lastIndex + this.pager.perPage, this.pager.totalRows);
			});
		},
		/**
		 * Click event to reset our filters.
		 */
		resetFilters() {
			this.sorts.sortBy = 'name';
			this.sorts.direction = 'asc';
			this.name = '';
			this.classes = [];
			this.subtypes = [];
			this.featureTypes = [];
			this.featureSubtype = [];
			this.activation = [];
			this.damageTypes = [];
		},
		applyFilter(property, entries, result) {
    		if (property.length) {
				property.forEach(value => {
					result = result.filter(entry => entry.system.traits[entries].value.includes(value));
				});
			}
    		return result;
		}
	},
	computed: {
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

			if (Array.isArray(this.classes) && this.classes.length > 0) {
				result = result.filter(entry =>
					{
						if (
							this.classes.includes(entry.system?.classIdentifier)
							|| this.classes.includes(entry.system?.identifier)
						) return true;
						const reqString = entry.system?.requirements?.replace(/\d/g, "").trim();
						if (reqString) {
							for (const [key, classData] of Object.entries(this.classList)) {
								if (!this.classes.includes(key)) continue;
								const isClassMatch = reqString.includes(classData.label);
								const isSubclassMatch = !isClassMatch && Object.values(classData.subclasses).some(
									(label) => reqString.includes(label)
								);
								if (isClassMatch || isSubclassMatch) return true;
							}
						}
					}
				);
			}

			if (Array.isArray(this.subtypes) && this.subtypes.length > 0) {
				result = result.filter(entry => this.subtypes.includes(entry.type));
			}

			if (Array.isArray(this.featureTypes) && this.featureTypes.length > 0) {
				result = result.filter(entry => this.featureTypes.includes(entry.system?.type?.value));
			}

			if (Array.isArray(this.featureSubtype) && this.featureSubtype.length > 0) {
				result = result.filter(entry => this.featureSubtype.includes(entry.system?.type?.subtype));
			}

			if (Array.isArray(this.damageTypes) && this.damageTypes.length > 0) {
				result = result.filter(entry => {
					if (!entry.system.damage) return false;
					const damageTypes = entry.system.damage.parts.map((d) => d[1]);
					return this.damageTypes.some((d) => damageTypes.includes(d));
				})
			}

			if (Array.isArray(this.activation) && this.activation.length > 0) {
				result = result.filter(entry => this.activation.includes(entry.system?.activation?.type));
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
				switch (this.sorts.sortBy) {
					case 'class':
						return a.system?.identifier.localeCompare(b.system?.identifier);
					case 'type':
						return a.type.localeCompare(b.type);
				}
				return a.name.localeCompare(b.name);
			});

			// Return results.
			return this.pager.totalRows > 0
				? result.slice(this.pager.firstIndex, this.pager.lastIndex)
				: result;
		}
	},
	watch: {},
	// Handle created hook.
	async created() {
		console.log("Creating compendium browser powers tab...");
		// Load the pack index with the fields we need.
		getPackIndex({
			// [
			// 	'dnd5e.backgrounds',
			// 	'dnd5e.classes',
			// 	'dnd5e.subclasses',
			// 	'dnd5e.classfeatures',
			// 	'dnd5e.races',
			// ],
			fields: [
				'system.activation.type',
				'system.classIdentifier',
				'system.damage',
				'system.identifier',
				'system.level',
				'system.requirements',
				'system.type',
			],
			types: ["Item"],
			subTypes: ["background", "class", "feature", "race", "subclass"]
		}).then(packIndex => {
			this.packIndex = packIndex;
			const classes = packIndex.filter((entry) => entry.type === "class" && entry.system.identifier);
			const subclasses = {};
			if (classes.length) {
				classes.map((entry) => {
					return {
						label: entry.name,
						identifier: entry.system.identifier
					};
				})
				.forEach((c) => {
					this.classList[c.identifier] = {
						label: c.label,
						subclasses: {}
					};
				});
			}
			const _subclasses = packIndex.filter((entry) => entry.type === "subclass" && entry.system.classIdentifier);
			if (_subclasses.length) {
				_subclasses.map((entry) => {
						return {
							name: entry.name,
							identifier: entry.system.identifier,
							classId: entry.system.classIdentifier
						};
					})
					.forEach((subclass) => {
						if (subclasses[subclass.classId]) {
							subclasses[subclass.classId].subclasses[subclass.identifier] = subclass.name;
						} else {
							subclasses[subclass.classId] = {
								subclasses: {
									[subclass.identifier]: subclass.name
								}
							};
						}
					});
			}
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
		console.log("Compendium browser powers tab mounted.");

		// Note that our tab has beened opened so that it won't de-render later.
		this.tab.opened = true;

		// Adjust our observers whenever the results of the compendium browser
		// are updated.
		onUpdated(() => {
			const target = document.querySelector('.compendium-browser-features .compendium-browser-row-observe');
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