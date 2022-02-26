<script setup>
import FileTreeFile from "./FileTreeFile.vue"
import {
	FILE_BROWSER_FILES_KEY,
	FILE_BROWSER_FOLDERS_KEY,
	PATH_SEPARATOR,
	COLOR_SCHEME_PRIMARY_TEXT_CLASSES,
} from "../../constants"
import { sortLocales } from "../../helpers"
import { computed, toRefs } from "@vue/reactivity"
import { useStore } from "vuex"
import { useI18n } from "vue-i18n"

const props = defineProps({
	folder: Object,
	title: String,
	path: Array,
	fileTreeWidth: Number,
	currentProject: Object,
})

const { folder, path } = toRefs(props)

const isEmpty = computed(
	() =>
		!folder.value[FILE_BROWSER_FILES_KEY].length &&
		!folder.value[FILE_BROWSER_FOLDERS_KEY].length
)

const store = useStore()

const currentFilePath = computed(() => store.state.editor.currentFilePath)

const isFocused = computed(
	() => currentFilePath.value === path.value.join(PATH_SEPARATOR)
)

const { t: $t } = useI18n({
	inheritLocale: true,
})

const colorScheme = computed(() => store.state.settings.colorScheme)
</script>

<template>
	<div class="px-6 pt-2">
		<button class="flex h-6 w-full relative">
			<div
				v-show="isFocused"
				class="overlay w-96 h-8 z-0 bg-zinc-200 dark:bg-zinc-700"
			></div>
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
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
					/>
				</svg>
			</div>
			<div class="flex grow items-center h-full relative z-50">
				<p
					class="text-left pl-1 text-zinc-500 dark:text-zinc-400 text-sm"
					:class="{ 'text-zinc-600': isFocused }"
				>
					{{ title }}
				</p>
			</div>
		</button>
		<div>
			<ul class="list-none" v-if="!isEmpty">
				<li
					v-for="subFolder in sortLocales(
						folder[FILE_BROWSER_FOLDERS_KEY],
						'name'
					)"
					:key="`${subFolder.name}`"
				>
					<FileTreeFolder
						:title="subFolder.name"
						:folder="subFolder"
						:path="[...path, subFolder.name]"
						:fileTreeWidth="fileTreeWidth"
						:currentProject="currentProject"
					></FileTreeFolder>
				</li>
				<li
					v-for="fileName in sortLocales(folder[FILE_BROWSER_FILES_KEY])"
					:key="`${folder.name}-${fileName}`"
				>
					<FileTreeFile
						:title="fileName"
						:path="[...path, fileName]"
						:fileTreeWidth="fileTreeWidth"
						:currentProject="currentProject"
					></FileTreeFile>
				</li>
			</ul>
			<p
				class="text-zinc-400 dark:text-zinc-500 text-sm italic pl-6 mt-2"
				v-else
			>
				({{ $t("empty") }})
			</p>
		</div>
	</div>
</template>