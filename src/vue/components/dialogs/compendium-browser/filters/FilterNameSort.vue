<template>
	<div class="filtercontainer">
		<!-- Name filter. -->
		<div class="filter">
			<input type="text" name="compendiumBrowser.name" v-model="value" :placeholder="game.i18n.localize('Name')" />
		</div>

		<!-- Sort -->
		<div class="form-group">
			<label>{{ game.i18n.localize('Sort by:') }}</label>
			<div class="form-fields">
				<select class="sort" v-model="filters.sortBy">
					<option v-for="(option, index) in filters.sortOptions" :key="index" :value="option.value">{{ option.label }}</option>
				</select>
				<a class="direction" data-direction="asc" @click="changeDirection()">
					<i v-if="filters.direction === 'asc'" class="fa-solid fa-sort-numeric-up"></i>
					<i v-else class="fa-solid fa-sort-numeric-down-alt"></i>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FilterNameSort',
	// Use a modelValue prop and emit to allow v-model on this component.
	// The name input itself will use a computed property named value that
	// has both a getter and setter which are automatically triggered by
	// v-model.
	props: ['modelValue','filters'],
	emits: ['update:modelValue'],
	components: {},
	setup() {
		return {
			// Expose Foundry globals to the template.
			CONFIG,
			game
		}
	},
	data() {
		return {};
	},
	methods: {
		// updateValue(event) {
		// 	this.valueMutable = event.target.value;
		// 	console.log(event.target.value);
		// 	this.$emit('update:value', event.target.value);
		// },
		changeDirection() {
			if (this.filters.direction === "asc") this.filters.direction = "desc";
			else this.filters.direction = "asc";
		},
	},
	computed: {
		value: {
			// Retrieve the internal value.
			get() {
				return this.modelValue;
			},
			// In addition to setting the internal value,
			// emit the new value to the parent.
			set(value) {
				this.$emit('update:modelValue', value);
			}
		}
	},
	async created() {},
	async mounted() {}
}
</script>

<style lang="scss">
</style>