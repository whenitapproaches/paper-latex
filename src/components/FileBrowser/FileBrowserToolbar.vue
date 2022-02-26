<script setup>
import { computed, ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import { useI18n } from "vue-i18n"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"
import store from "../../store"
import NewFileModal from "./NewFileModal.vue"

import downloadProjectZip from "../../services/downloadProject"
import { useStore } from "vuex"
import NewProjectModal from "./NewProjectModal.vue"

const colorScheme = computed(() => store.state.settings.colorScheme)

const isProjectBrowserModalActive = computed({
	get: () => store.state.editor.isProjectBrowserModalActive,
	set: (value) =>
		store.dispatch("editor/updateIsProjectBrowserModalActive", value),
})

const { t: $t } = useI18n({
	inheritLocale: true,
})

const makeEntryCurrentFile = () => {
	const currentFilePath = store.state.project.currentFilePath
	store.dispatch("project/updateCurrentProjectEntryPath", currentFilePath)
}

const createNewFile = () => {
	isNewFileModalActive.value = true
}

const createNewProject = () => {
	isNewProjectModalActive.value = true
}

const isNewFileModalActive = ref(false)

const isNewProjectModalActive = ref(false)

const currentProject = computed(() => store.state.project.currentProject)

const downloadProject = async () => {
	await downloadProjectZip(currentProject.value.name)
}
</script>

<template>
	<div class="flex h-16 items-center gap-2">
		<NewFileModal
			v-show="isNewFileModalActive"
			@hide="isNewFileModalActive = false"
		/>
		<NewProjectModal
			v-show="isNewProjectModalActive"
			@hide="isNewProjectModalActive = false"
		/>
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
					:title="$t('open_template')"
					@click="isProjectBrowserModalActive = !isProjectBrowserModalActive"
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
						<rect x="4" y="4" width="16" height="4" rx="1" />
						<rect x="4" y="12" width="6" height="8" rx="1" />
						<line x1="14" y1="12" x2="20" y2="12" />
						<line x1="14" y1="16" x2="20" y2="16" />
						<line x1="14" y1="20" x2="20" y2="20" />
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
					:title="$t('new_project')"
					@click="createNewProject"
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
							d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
						/>
						<line x1="12" y1="11" x2="12" y2="17" />
						<line x1="9" y1="14" x2="15" y2="14" />
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
					:title="$t('new_file')"
					@click="createNewFile"
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
						<path d="M14 3v4a1 1 0 0 0 1 1h4" />
						<path
							d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"
						/>
						<line x1="12" y1="11" x2="12" y2="17" />
						<line x1="9" y1="14" x2="15" y2="14" />
					</svg>
				</button>
			</div>
		</div>
		<div class="flex h-10 ml-auto divide-x dark:divide-zinc-700">
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
					:title="$t('make_entry_file')"
					@click="makeEntryCurrentFile"
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
						<circle cx="12" cy="12" r=".5" fill="currentColor" />
						<circle cx="12" cy="12" r="9" />
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
					:title="$t('download_project')"
					@click="downloadProject"
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
						<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
						<polyline points="7 11 12 16 17 11" />
						<line x1="12" y1="4" x2="12" y2="16" />
					</svg>
				</button>
			</div>
			<!-- <div class="w-10">
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
					:title="$t('remove')"
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
						<line x1="4" y1="7" x2="20" y2="7" />
						<line x1="10" y1="11" x2="10" y2="17" />
						<line x1="14" y1="11" x2="14" y2="17" />
						<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
						<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
					</svg>
				</button>
			</div> -->
			<!-- <div class="w-10">
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
					:title="$t('rename')"
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
						<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
						<line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
					</svg>
				</button>
			</div> -->
		</div>
	</div>
</template>

<style scoped>
</style>