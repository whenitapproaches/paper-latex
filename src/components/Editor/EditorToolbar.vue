<script setup>
import { computed } from "@vue/reactivity"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"
import store from "../../store"

const colorScheme = computed(() => store.state.settings.colorScheme)
</script>

<template>
	<div class="flex h-16 items-center gap-2">
		<div class="flex h-10 divide-x dark:divide-zinc-700">
			<div class="w-10">
				<button
					class="
						button
						w-full
						h-full
						flex
						items-center
						justify-center
						bg-zinc-100
						hover:bg-zinc-200
						dark:bg-zinc-800
						hover:dark:bg-zinc-700
					"
					:title="$t('format_bold')"
				>
					<svg
						class="h-6 w-6 text-zinc-600 dark:text-zinc-300"
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
						<path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z" />
						<path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7" />
					</svg>
				</button>
			</div>
			<div class="w-10">
				<button
					class="
						button
						w-full
						h-full
						flex
						items-center
						justify-center
						bg-zinc-100
						hover:bg-zinc-200
						dark:bg-zinc-800
						hover:dark:bg-zinc-700
					"
					:title="$t('format_italic')"
				>
					<svg
						class="h-6 w-6 text-zinc-600 dark:text-zinc-300"
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
						<line x1="11" y1="5" x2="17" y2="5" />
						<line x1="7" y1="19" x2="13" y2="19" />
						<line x1="14" y1="5" x2="10" y2="19" />
					</svg>
				</button>
			</div>
			<div class="w-10">
				<button
					class="
						button
						w-full
						h-full
						flex
						items-center
						justify-center
						bg-zinc-100
						hover:bg-zinc-200
						dark:bg-zinc-800
						hover:dark:bg-zinc-700
					"
					:title="$t('format_underlined')"
				>
					<svg
						class="h-6 w-6 text-zinc-600 dark:text-zinc-300"
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
						<line x1="6" y1="20" x2="18" y2="20" />
						<path d="M8 5v6a4 4 0 0 0 8 0v-6" />
					</svg>
				</button>
			</div>
		</div>
		<div class="flex h-10 divide-x dark:divide-zinc-700">
			<div class="w-10">
				<button
					class="
						button
						w-full
						h-full
						flex
						items-center
						justify-center
						bg-zinc-100
						hover:bg-zinc-200
						dark:bg-zinc-800
						hover:dark:bg-zinc-700
					"
					:title="$t('insert_bullet_point_list')"
				>
					<svg
						class="h-6 w-6 text-zinc-600 dark:text-zinc-300"
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
						<line x1="9" y1="6" x2="20" y2="6" />
						<line x1="9" y1="12" x2="20" y2="12" />
						<line x1="9" y1="18" x2="20" y2="18" />
						<line x1="5" y1="6" x2="5" y2="6.01" />
						<line x1="5" y1="12" x2="5" y2="12.01" />
						<line x1="5" y1="18" x2="5" y2="18.01" />
					</svg>
				</button>
			</div>
			<div class="w-10">
				<button
					class="
						button
						w-full
						h-full
						flex
						items-center
						justify-center
						bg-zinc-100
						hover:bg-zinc-200
						dark:bg-zinc-800
						hover:dark:bg-zinc-700
					"
					:title="$t('insert_numbered_list')"
				>
					<svg
						class="h-6 w-6 text-zinc-600 dark:text-zinc-300"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="8" y1="6" x2="21" y2="6" />
						<line x1="8" y1="12" x2="21" y2="12" />
						<line x1="8" y1="18" x2="21" y2="18" />
						<line x1="3" y1="6" x2="3.01" y2="6" />
						<line x1="3" y1="12" x2="3.01" y2="12" />
						<line x1="3" y1="18" x2="3.01" y2="18" />
					</svg>
				</button>
			</div>
		</div>
		<div class="flex h-10 divide-x dark:divide-zinc-700">
			<div class="w-10">
				<button
					class="
						button
						w-full
						h-full
						flex
						items-center
						justify-center
						bg-zinc-100
						hover:bg-zinc-200
						dark:bg-zinc-800
						hover:dark:bg-zinc-700
					"
					:title="$t('insert_section')"
				>
					<svg
						class="h-6 w-6 text-zinc-600 dark:text-zinc-300"
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
							d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
						/>
					</svg>
				</button>
			</div>
			<div class="w-10">
				<button
					class="
						button
						w-full
						h-full
						flex
						items-center
						justify-center
						bg-zinc-100
						hover:bg-zinc-200
						dark:bg-zinc-800
						hover:dark:bg-zinc-700
					"
					:title="$t('insert_subsection')"
				>
					<svg
						class="h-6 w-6 text-zinc-600 dark:text-zinc-300"
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
						<path
							d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11"
						/>
						<line x1="8" y1="8" x2="12" y2="8" />
						<line x1="8" y1="12" x2="12" y2="12" />
						<line x1="8" y1="16" x2="12" y2="16" />
					</svg>
				</button>
			</div>
		</div>
		<div class="flex h-10 ml-auto">
			<div class="h-full">
				<button
					@click="compile"
					class="button px-6 text-zinc-200 dark:text-zinc-300 h-full"
					:class="[
						...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
						...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
					]"
				>
					{{ $t("save") }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>