<script setup>
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_PRIMARY_TEXT_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"

import { useI18n } from "vue-i18n"
import { useStore } from "vuex"
import { computed, ref } from "vue"

const emit = defineEmits(["hide"])

const store = useStore()

const { ipcRenderer } = require("electron")

const colorScheme = computed(() => store.state.settings.colorScheme)

const hide = () => emit("hide")

const hasError = ref(false)

const fileName = ref("")

const error = ref("")

const { t: $t } = useI18n({
	inheritLocale: true,
})

const currentProject = computed(() => store.state.project.currentProject)

const createFile = async () => {
	if (!fileName.value) return

	const result = await store.dispatch("project/createFile", {
		project: currentProject.value.name,
		fileName: fileName.value,
	})

	if (result.hasError) {
		error.value = result.error
		hasError.value = true
		return
	}

	hasError.value = false
	const projectsFileTrees = await ipcRenderer.invoke("get-projects-file-trees")

	store.dispatch("project/updateProjects", projectsFileTrees)

	hide()

	return
}
</script>

<template>
	<div
		class="fixed z-10 inset-0 overflow-y-auto"
		aria-labelledby="project-browser"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="
				flex
				items-end
				justify-center
				min-h-screen
				pt-4
				px-4
				pb-20
				text-center
				sm:block sm:p-0
			"
		>
			<div
				class="
					fixed
					inset-0
					bg-zinc-500
					dark:bg-zinc-800
					bg-opacity-75
					dark:bg-opacity-75
					transition-opacity
				"
				aria-hidden="true"
				@click="hide"
			></div>

			<span
				class="hidden sm:inline-block sm:align-middle sm:h-screen"
				aria-hidden="true"
				>&#8203;</span
			>

			<div
				class="
					inline-block
					align-bottom
					bg-zinc-100
					dark:bg-zinc-800
					rounded-lg
					text-left
					overflow-hidden
					shadow-xl
					transform
					transition-all
					sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
				"
			>
				<div class="bg-white dark:bg-zinc-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="flex justify-center">
						<input
							type="text"
							class="
								border border-gray-300
								w-full
								text-gray-900 text-sm
								rounded-lg
								focus:ring-blue-500 focus:border-blue-500
								block
								p-2.5
								dark:border-gray-600
								dark:placeholder-gray-400
								dark:text-zinc-500
								dark:focus:ring-blue-500
								dark:focus:border-blue-500
							"
							:placeholder="$t('file_name')"
							ref="inputFileNameElement"
							v-model.trim="fileName"
						/>
					</div>
					<div
						class="flex mt-3 w-full text-red-500 dark:text-red-400 italic"
						v-show="hasError"
					>
						<small class="ml-auto">{{ $t("error") }}: {{ $t(error) }}</small>
					</div>
				</div>

				<div
					class="
						bg-zinc-50
						dark:bg-zinc-600
						px-4
						py-3
						sm:px-6 sm:flex sm:flex-row-reverse
					"
				>
					<button
						type="button"
						class="
							w-full
							inline-flex
							justify-center
							rounded-md
							border border-transparent
							shadow-sm
							px-4
							py-2
							text-base
							font-medium
							text-zinc-200
							dark:text-zinc-300
							sm:ml-3 sm:w-auto sm:text-sm
						"
						:class="[
							...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
							...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
						]"
						@click="createFile"
						:disabled="!fileName"
					>
						{{ $t("create") }}
					</button>
					<button
						type="button"
						class="
							mt-3
							w-full
							inline-flex
							justify-center
							rounded-md
							shadow-sm
							px-4
							py-2
							bg-white
							text-base
							font-medium
							text-zinc-600
							dark:text-zinc-300
							bg-zinc-100
							hover:bg-zinc-200
							dark:bg-zinc-800
							hover:dark:bg-zinc-700
							sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
						"
						@click="hide"
					>
						{{ $t("cancel") }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>