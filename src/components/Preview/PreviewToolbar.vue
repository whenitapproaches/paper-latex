<script setup>
import { computed, ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import { ipcRenderer } from "electron"
import { useI18n } from "vue-i18n"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
	COMPILING_LOG_VIEWING_STATE,
	RESULT_LOG_VIEWING_STATE,
} from "../../constants"
import store from "../../store"

const emit = defineEmits(["compiled"])

const colorScheme = computed(() => store.state.settings.colorScheme)

const isProcessing = ref(false)

const compile = () => {
	if (isProcessing.value) return

	const currentProjectMainEntryFilePath =
		store.getters["project/currentProjectMainEntryFilePath"]

	if (!currentProjectMainEntryFilePath)
		return store.dispatch("message-popup/popUp", {
			content: "entry_not_found",
			time: 5000,
		})

	const currentProject = store.state.project.currentProject

	isProcessing.value = true

	ipcRenderer.send("compile", {
		project: currentProject.name,
		entry: [...currentProjectMainEntryFilePath],
	})
}

const { t: $t } = useI18n({
	inheritLocale: true,
})

const updateViewingLogState = (viewingState) => {
	store.dispatch("preview/updateViewingLogState", viewingState)
}

ipcRenderer.on("compiled", (event, result) => {
	store.dispatch("preview/updateCompilingLog", result.log)
	store.dispatch("preview/updateResultLog", result.resultLog)

	if (result.hasError) {
		isProcessing.value = false
		emit("compiled")

		return store.dispatch("message-popup/popUp", {
			content: "compile_error",
			time: 5000,
		})
	}

	store.dispatch("preview/updatePdfFileUrl", result.pdfClientPath)
	isProcessing.value = false
	emit("compiled")
})

const viewingLogState = computed(() => store.state.viewingLogState)
</script>

<template>
	<div class="flex h-16 items-center gap-2">
		<div class="flex h-10 divide-x dark:divide-zinc-700">
			<button
				@click="compile"
				class="button px-6 text-zinc-200 dark:text-zinc-300"
				:class="[
					...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
					...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
				]"
			>
				<span class="flex items-center w-full h-full" v-show="isProcessing">
					<svg
						class="animate-spin -ml-1 mr-2 h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-50"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-100"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					{{ $t("compiling") }}...
				</span>
				<span v-show="!isProcessing">{{ $t("compile") }}</span>
			</button>
		</div>
		<div class="flex h-10 divide-x dark:divide-zinc-700 ml-auto">
			<button
				@click="updateViewingLogState(false)"
				class="
					button
					px-6
					bg-zinc-100
					hover:bg-zinc-200
					dark:bg-zinc-800
					hover:dark:bg-zinc-700
					text-zinc-600
					dark:text-zinc-300
				"
				:class="[
					...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
					...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
				]"
			>
				{{ $t("view_document") }}
			</button>
			<button
				@click="updateViewingLogState(COMPILING_LOG_VIEWING_STATE)"
				class="
					button
					px-6
					bg-zinc-100
					hover:bg-zinc-200
					dark:bg-zinc-800
					hover:dark:bg-zinc-700
					text-zinc-600
					dark:text-zinc-300
				"
				:class="[
					...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
					...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
				]"
			>
				{{ $t("view_compiling_log") }}
			</button>
			<button
				@click="updateViewingLogState(RESULT_LOG_VIEWING_STATE)"
				class="
					button
					px-6
					bg-zinc-100
					hover:bg-zinc-200
					dark:bg-zinc-800
					hover:dark:bg-zinc-700
					text-zinc-600
					dark:text-zinc-300
				"
				:class="[
					...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
					...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
				]"
			>
				{{ $t("view_result_log") }}
			</button>
		</div>
	</div>
</template>