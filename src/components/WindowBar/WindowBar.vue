<script setup>
import { ipcRenderer } from "electron"
import { computed } from "vue"
import { useStore } from "vuex"
import { COLOR_SCHEME_PRIMARY_TEXT_CLASSES } from "../../constants"

const store = useStore()

const colorScheme = computed(() => store.state.settings.colorScheme)
</script>

<template>
	<div
		class="flex h-9 bg-white dark:bg-zinc-800 w-full"
		:style="{
			'-webkit-app-region': 'drag',
		}"
	>
		<div class="flex items-center px-4 text-zinc-800 dark:text-zinc-200">
			<b :class="[...COLOR_SCHEME_PRIMARY_TEXT_CLASSES[colorScheme]]">Paper</b>
			Latex
		</div>
		<!-- <div class="ml-auto flex">
			<button
				class="
					button
					w-12
					flex
					justify-center
					items-center
					hover:dark:bg-zinc-700 hover:bg-zinc-200
					text-zinc-600
					dark:text-zinc-100
				"
				:style="{
					'-webkit-app-region': 'no-drag',
				}"
				@click="ipcRenderer.send('minimize-window')"
			>
				<svg
					class="h-5 w-5"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" />
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
			</button>
			<button
				class="
					button
					w-12
					flex
					justify-center
					items-center
					hover:dark:bg-zinc-700 hover:bg-zinc-200
					text-zinc-600
					dark:text-zinc-100
				"
				:style="{
					'-webkit-app-region': 'no-drag',
				}"
				@click="ipcRenderer.send('maximize-window')"
			>
				<svg
					class="h-5 w-5"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			</button>

			<button
				class="
					button
					w-12
					flex
					justify-center
					items-center
					hover:bg-red-500 hover:text-zinc-100
					text-zinc-600
					dark:text-zinc-100
				"
				:style="{
					'-webkit-app-region': 'no-drag',
				}"
				@click="ipcRenderer.send('close-window')"
			>
				<svg
					class="h-5 w-5"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" />
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div> -->
	</div>
</template>