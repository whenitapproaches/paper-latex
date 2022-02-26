<script setup>
import { computed, toRefs } from "@vue/reactivity"
import { useStore } from "vuex"
import {
	PATH_SEPARATOR,
	COLOR_SCHEME_PRIMARY_TEXT_CLASSES,
	COLOR_SCHEME_LIGHT_CLASSES,
} from "../../constants"

const props = defineProps({
	title: String,
	path: Array,
	fileTreeWidth: Number,
	currentProject: Object,
})

const { path, currentProject } = toRefs(props)

const store = useStore()

const openFile = () => {
	store.dispatch("project/openFile", path.value)
}

const currentFilePath = computed(() => store.state.editor.currentFilePath)

const isFocused = computed(
	() => currentFilePath.value === path.value.join(PATH_SEPARATOR)
)

const colorScheme = computed(() => store.state.settings.colorScheme)

const entryPath = computed(() => currentProject.value.entryPath)
</script>

<template>
	<div class="px-6 pt-2">
		<button class="flex h-6 w-full relative" @click="openFile">
			<div
				v-show="isFocused"
				class="
					overlay
					h-8
					z-0
					bg-zinc-300
					dark:bg-zinc-700
					opacity-50
					dark:opacity-50
				"
				:style="{ width: `${fileTreeWidth}px` }"
			></div>
			<div
				v-if="entryPath?.join() === path?.join()"
				class="
					overlay
					h-8
					z-0
					flex
					items-center
				"
				:style="{ width: `${fileTreeWidth}px` }"
			>
				<svg
					class="h-3 w-3 ml-3"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="3"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
					:class="[...COLOR_SCHEME_PRIMARY_TEXT_CLASSES[colorScheme]]"
				>
					<path stroke="none" d="M0 0h24v24H0z" />
					<circle cx="12" cy="12" r=".5" fill="currentColor" />
					<circle cx="12" cy="12" r="9" />
				</svg>
			</div>

			<div class="w-6 h-full flex items-center justify-center relative z-50">
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
					:class="[...COLOR_SCHEME_PRIMARY_TEXT_CLASSES[colorScheme]]"
				>
					<path stroke="none" d="M0 0h24v24H0z" />
					<path d="M14 3v4a1 1 0 0 0 1 1h4" />
					<path
						d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"
					/>
					<line x1="9" y1="9" x2="10" y2="9" />
					<line x1="9" y1="13" x2="15" y2="13" />
					<line x1="9" y1="17" x2="15" y2="17" />
				</svg>
			</div>
			<div class="flex grow items-center h-full relative z-50">
				<p
					class="text-left pl-1 text-sm"
					:class="
						isFocused
							? ['text-zinc-600', 'dark:text-zinc-300', 'font-bold']
							: ['text-zinc-500 dark:text-zinc-400']
					"
				>
					{{ title }}
				</p>
			</div>
		</button>
	</div>
</template>