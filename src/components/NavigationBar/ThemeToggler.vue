<script setup>
import { computed } from "@vue/reactivity"
import { useStore } from "vuex"
import { DARK_THEME, LIGHT_THEME } from "../../constants"

const store = useStore()

const theme = computed(() => store.state.settings.theme)

const toggleTheme = () => store.dispatch("toggleTheme")
</script>

<template>
	<button
		type="button"
		@click="toggleTheme"
		class="
			bg-zinc-100
			dark:bg-zinc-800
			text-zinc-600
			dark:text-zinc-200
			hover:bg-zinc-200
			hover:dark:bg-zinc-700
			p-2
			rounded-full
			focus:outline-none
			focus:ring-2
			focus:ring-offset-2
			focus:ring-offset-transparent
			focus:ring-transparent
		"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				v-show="theme === DARK_THEME"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="{2}"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			/>

			<path
				v-show="theme === LIGHT_THEME"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.25"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	</button>
</template>