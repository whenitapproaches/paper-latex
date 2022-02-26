<script setup>
import { computed, ref } from "@vue/reactivity"
import { onMounted, watchEffect } from "@vue/runtime-core"
import { useStore } from "vuex"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"

import { findIndex } from "lodash"
import { useI18n } from "vue-i18n"
import { ipcRenderer } from "electron"

const emit = defineEmits(["hide"])

const store = useStore()

const colorScheme = computed(() => store.state.settings.colorScheme)

const hide = () => emit("hide")

const projects = computed(() => store.state.project.projects)

const currentProjectIndex = computed(() => {
	const currentProjectName = store.state.project.currentProject.name
	return findIndex(projects.value, (o) => o.name === currentProjectName)
})

const chosenProjectIndex = ref()

watchEffect(() => {
	chosenProjectIndex.value = currentProjectIndex.value
})

const chooseProject = () => {
	store.dispatch(
		"project/updateCurrentProject",
		projects.value[chosenProjectIndex.value]
	)
	store.dispatch("editor/updateEditorContent", "")
	emit("hide")
}

const uploadProject = async () => {
	const result = await store.dispatch("project/uploadProject")

	if (!result.hasError) {
		const projectsFileTrees = await ipcRenderer.invoke(
			"get-projects-file-trees"
		)

		store.dispatch("project/updateProjects", projectsFileTrees)
		return
	}
}

const { t: $t } = useI18n({
	inheritLocale: true,
})
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
					<div class="flex flex-wrap gap-10">
						<div
							class="w-1/3"
							v-for="(project, index) in projects"
							:key="project.name"
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
									text-zinc-600
									dark:text-zinc-300
									sm:text-sm
								"
								@click="chosenProjectIndex = index"
								:class="
									index === chosenProjectIndex
										? [
												...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
												...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
												'text-zinc-200',
										  ]
										: []
								"
							>
								{{ project.name }}
							</button>
						</div>
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
						@click="chooseProject"
					>
						{{ $t("choose") }}
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
							mr-auto
						"
						:class="[
							...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
							...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
						]"
						@click="uploadProject"
					>
						{{ $t("upload_project") }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>