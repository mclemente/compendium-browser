<template>
	<div class="compendium-browser-vue parent flexcol">
		<!-- Tabs. -->
		<Tabs group="primary" :tabs="tabs.primary"/>

		<!-- Filters + Content. -->
		<section class="content">

			<!--
				Render each tab wrapper and their contents. The CompendiumBrowser<Type> components
				each have a v-if on them that causes them to only render if they're active or if they
				have been opened at least once.
			-->
			<Tab group="primary" :tab="tabs.primary.creatures" classes="container container--bottom flexrow">
				<CompendiumBrowserCreatures v-if="tabs.primary.creatures.active || tabs.primary.creatures.opened" :tab="tabs.primary.creatures"/>
			</Tab>

			<Tab group="primary" :tab="tabs.primary.spells" classes="container container--bottom flexrow">
				<CompendiumBrowserSpells v-if="tabs.primary.spells.active || tabs.primary.spells.opened" :tab="tabs.primary.spells" />
			</Tab>

			<Tab group="primary" :tab="tabs.primary.powers" classes="container container--bottom flexrow">
				<CompendiumBrowserPowers v-if="tabs.primary.powers.active || tabs.primary.powers.opened" :tab="tabs.primary.powers" />
			</Tab>

			<Tab group="primary" :tab="tabs.primary.items" classes="container container--bottom flexrow">
				<CompendiumBrowserItems v-if="tabs.primary.items.active || tabs.primary.items.opened" :tab="tabs.primary.items"/>
			</Tab>

			<Tab group="primary" :tab="tabs.primary.settings" classes="container container--bottom flexrow">
				<CompendiumBrowserSettings v-if="tabs.primary.settings.active || tabs.primary.settings.opened" :tab="tabs.primary.settings"/>
			</Tab>

		</section>
	</div>
</template>

<script>
// Import component dependencies.
import Tabs from '@/components/parts/Tabs.vue';
import Tab from '@/components/parts/Tab.vue';
import CompendiumBrowserCreatures from '@/components/dialogs/compendium-browser/CompendiumBrowserCreatures.vue';
import CompendiumBrowserSpells from '@/components/dialogs/compendium-browser/CompendiumBrowserSpells.vue';
import CompendiumBrowserPowers from '@/components/dialogs/compendium-browser/CompendiumBrowserPowers.vue';
import CompendiumBrowserItems from '@/components/dialogs/compendium-browser/CompendiumBrowserItems.vue';
import CompendiumBrowserSettings from '@/components/dialogs/compendium-browser/CompendiumBrowserSettings.vue';

// Stub is an example component and should be removed once the others are all working.
import Stub from '@/components/dialogs/compendium-browser/Stub.vue';

export default {
	name: 'ArchmageCompendiumBrowser',
	props: [`context`],
	components: {
		Tabs,
		Tab,
		Stub,
		CompendiumBrowserCreatures,
		CompendiumBrowserSpells,
		CompendiumBrowserPowers,
		CompendiumBrowserItems,
		CompendiumBrowserSettings
	},
	setup() {
		return {
			CONFIG,
			game
		}
	},
	data() {
		return {
			// The only variable we actually need to track is the active tab.
			tabs: {
				primary: {
					// Default tab is assigned based on the context prop passed in
					// from the Application class.
					creatures: {
						key: 'creatures',
						label: game.i18n.localize('CMPBrowser.Tab.NPCBrowser'),
						active: this.context?.activeTab === 'creatures' ?? false,
						opened: false
					},
					spells: {
						key: 'spells',
						label: game.i18n.localize('CMPBrowser.Tab.SpellBrowser'),
						active: this.context?.activeTab === 'spells' ?? false,
						opened: false
					},
					powers: {
						key: 'powers',
						label: game.i18n.localize('CMPBrowser.Tab.FeatBrowser'),
						active: this.context?.activeTab === 'powers' ?? false,
						opened: false
					},
					items: {
						key: 'items',
						label: game.i18n.localize('CMPBrowser.Tab.ItemBrowser'),
						active: this.context?.activeTab === 'items' ?? false,
						opened: false
					},
					settings: {
						key: 'settings',
						label: game.i18n.localize("CMPBrowser.Tab.Settings"),
						active: this.context?.activeTab === "settings" ?? false,
						opened: false
					}
				}
			}
		}
	},
	methods: {},
	computed: {},
	watch: {},
	async created() {
		console.log("Creating compendium browser...");
	},
	async mounted() {
		console.log("Compendium browser mounted.");
	}
}
</script>

<style lang="less">
// Import our style dependencies used in subcomponents.
@import "@vueform/slider/themes/default.css";
@import "@vueform/multiselect/themes/default.css";

:root {
	--slider-bg: #00000025;
	--slider-connect-bg: cornflowerblue;
	--slider-handle-ring-color: cornflowerblue;
	--color-blue: cornflowerblue;
	--font-roboto: Roboto, sans-serif;
}

.compendium-browser-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	text-align: center;

	i {
		margin-right: 10px;
		color: var(--color-blue);
	}
}

// Override ranger slider styles.
.slider-wrapper {
	width: 227px;
	padding: 0 10px 0 20px;
}

.level-range {
	align-items: center;
}

.level-label {
	flex: 0 auto;
	font-family: var(--font-roboto);
	line-height: 1;
}

// Override multiselect styles.
.multiselect-tag {
	background-color: var(--color-blue);
}

.multiselect {
	&.is-active {
		box-shadow: none;
	}
}

// Override compendium browser base styles.
.compendium-browser {
	.control-area {
		.filtercontainer {
			label {
				font-weight: bold;
			}

			.slider-wrapper div {
				margin: 0;
			}

			.multiselect,
			.multiselect div {
				margin: auto;
			}

			.multiselect .multiselect-tags {
				margin: 5px 0 0 5px;
				padding: 0;

				.multiselect-tag {
					margin: 0 5px 5px 0;
				}
			}
		}
	}
}

</style>