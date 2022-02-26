<script setup>
import { computed, ref } from "@vue/reactivity"
import { ipcRenderer } from "electron"
import { useI18n } from "vue-i18n"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"

import {
	UNDERLINING_TOKEN,
	BOLD_TOKEN,
	ITALIC_TOKEN,
	NUMBERED_LIST,
	POINT_LIST,
	SECTION_HEADING_TOKEN,
	SUBSECTION_HEADING_TOKEN,
	COMMENT_TOKEN,
} from "../../constants/latex"

import store from "../../store"
import MathInserterModal from "./MathInserterModal.vue"
import ImageInserterModal from "./ImageInserterModal.vue"

const colorScheme = computed(() => store.state.settings.colorScheme)

const { t: $t } = useI18n({
	inheritLocale: true,
})

const insertMath = () => {
	isMathInserterModalActive.value = true
}

const isMathInserterModalActive = ref(false)

const insertImage = () => {
	isImageInserterModalActive.value = true
}

const isImageInserterModalActive = ref(false)

const emit = defineEmits(["enterFullscreenMode"])

const toggleFullscreenMode = () => {
	emit("toggleFullscreenMode")
}

const { fullscreenMode } = defineProps({ fullscreenMode: Boolean })

const wrapByToken = (head, tail) => {
	store.state.editor.wrapText(head, tail)
}

const insertText = (text) => {
	store.state.editor.insertText(text)
}

const currentFilePath = computed(() => store.state.project.currentFilePath)

const saveFile = () => {
	if (!currentFilePath.value) return

	ipcRenderer.invoke("save-file", {
		content: store.state.editor.getCurrentEditorText(),
		path: [...currentFilePath.value],
	})
}
</script>

<template>
	<div class="flex h-16 items-center gap-2">
		<MathInserterModal
			v-show="isMathInserterModalActive"
			@hide="isMathInserterModalActive = false"
		/>
		<ImageInserterModal
			v-show="isImageInserterModalActive"
			@hide="isImageInserterModalActive = false"
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
					:title="$t('format_bold')"
					@click="wrapByToken(`${BOLD_TOKEN}{`, `}`)"
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
					@click="wrapByToken(`${ITALIC_TOKEN}{`, `}`)"
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
					@click="wrapByToken(`${UNDERLINING_TOKEN}{`, `}`)"
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
					@click="insertText(POINT_LIST)"
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
					@click="insertText(NUMBERED_LIST)"
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
					:title="$t('insert_section_heading')"
					@click="wrapByToken(`${SECTION_HEADING_TOKEN}{`, `}`)"
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
					:title="$t('insert_subsection_heading')"
					@click="wrapByToken(`${SUBSECTION_HEADING_TOKEN}{`, `}`)"
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
					:title="$t('insert_comment')"
					@click="insertText(COMMENT_TOKEN)"
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
							d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"
						/>
						<line x1="8" y1="9" x2="16" y2="9" />
						<line x1="8" y1="13" x2="14" y2="13" />
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
					:title="$t('insert_image')"
					@click="insertImage"
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
						<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
						<circle cx="8.5" cy="8.5" r="1.5" />
						<polyline points="21 15 16 10 5 21" />
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
					:title="$t('insert_math')"
					@click="insertMath"
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
						<path d="M16 13l4 4m0 -4l-4 4" />
						<path d="M20 5h-7l-4 14l-3 -6h-2" />
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
					:title="$t('insert_table')"
					@click="insertTable"
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
						<rect x="4" y="4" width="16" height="16" rx="2" />
						<line x1="4" y1="10" x2="20" y2="10" />
						<line x1="10" y1="4" x2="10" y2="20" />
					</svg>
				</button>
			</div>
		</div>
		<div class="flex h-10 ml-auto">
			<div class="w-10 h-full">
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
					:title="
						fullscreenMode
							? $t('enter_fullscreen_mode')
							: $t('exit_fullscreen_mode')
					"
					@click="toggleFullscreenMode"
				>
					<svg
						v-if="fullscreenMode"
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
						<polyline points="5 9 9 9 9 5" />
						<line x1="3" y1="3" x2="9" y2="9" />
						<polyline points="5 15 9 15 9 19" />
						<line x1="3" y1="21" x2="9" y2="15" />
						<polyline points="19 9 15 9 15 5" />
						<line x1="15" y1="9" x2="21" y2="3" />
						<polyline points="19 15 15 15 15 19" />
						<line x1="15" y1="15" x2="21" y2="21" />
					</svg>
					<svg
						v-else
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
							d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
						/>
					</svg>
				</button>
			</div>
			<div class="w-10 h-full">
				<button
					@click="saveFile"
					class="button w-full h-full flex items-center justify-center"
					:class="[
						...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
						...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
					]"
					:title="$t('save')"
				>
					<svg
						class="h-6 w-6 text-zinc-200 dark:text-zinc-300"
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
							d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
						/>
						<polyline points="17 21 17 13 7 13 7 21" />
						<polyline points="7 3 7 8 15 8" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>