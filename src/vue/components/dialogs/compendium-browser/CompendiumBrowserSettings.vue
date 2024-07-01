<template>
	<div class="settings-browser browser">
		<section class="flexcol">
			<div class="settings-group">
				<div v-for="(entry, entryKey) in tabVisibility" :key="entryKey" :data-setting="`allow-${entryKey}-browser`" class="flexrow">
					<input data-key="{{entryKey}}" type="checkbox" :checked="entry" />
					<label>{{ "rename me " + entryKey }}</label>
				</div>
			</div>
			<div v-for="(packGroup, key) in packs" :key="key" class="settings-group"
				:data-setting='key === "actors" ? "npc-compendium-setting" : "spell-compendium-setting"'
			>
				<div v-for="(entry, entryKey) in packGroup" :key="entryKey" class="flexrow">
					<input data-key="{{entryKey}}" type="checkbox" :checked="entry.load" />
					<label>{{entry.name}}</label>
				</div>
			</div>
		</section>
	</div>

</template>

<script>
// Helper methods.
import {
	sortPackValues,
} from '@/methods/Helpers.js';

export default {
	name: 'CompendiumBrowserSettings',
	props: ['tab'],
	// Imported components that need to be available in the <template>
	components: {},
	setup() {
		return {
			// Foundry base props and methods.
			CONFIG,
			game
		}
	},
	data() {
		const tabVisibility = game.settings.get("compendium-browser", "tabVisibility");
		const packs = game.settings.get("compendium-browser", "settings");
		const mapping = {
			"Actor": "actors",
			"Item": "items"
		};
		for (const pack of game.packs) {
			const { collection, documentName, metadata } = pack;
			if (!["Actor", "Item"].includes(documentName)) continue;
			const type = mapping[documentName];
			if (!packs[type][collection]) {
				packs[type][collection] = {
					load: true,
					name: `${metadata.label} (${collection})`,
				};
			}
		}
		return {
			// Props used for infinited scroll and pagination.
			loaded: false,
			// Filters.
			packs,
			tabVisibility
		}
	},
	methods: {},
	computed: {},
	watch: {},
	// Handle created hook.
	async created() {},
	// Handle mounted hook.
	async mounted() {
		console.log("Compendium browser powers tab mounted.");

		// Note that our tab has beened opened so that it won't de-render later.
		this.tab.opened = true;
	},
	// Handle the unmount hook.
	async beforeUnmount() {
	}
}
</script>

<style lang="scss">
</style>