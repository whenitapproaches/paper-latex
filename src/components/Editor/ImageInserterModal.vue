<script setup>
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_PRIMARY_TEXT_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"

import { ipcRenderer } from "electron"

import { useI18n } from "vue-i18n"
import { useStore } from "vuex"
import { computed, onMounted, ref } from "vue"

const emit = defineEmits(["hide"])

const store = useStore()

const colorScheme = computed(() => store.state.settings.colorScheme)

const hide = () => emit("hide")

const { t: $t } = useI18n({
	inheritLocale: true,
})

const imageFilePath = ref("")

const codeResult = ref("")

const isProcessing = ref(false)

const imageElement = ref(null)

const currentProject = computed(() => store.state.project.currentProject)

const chooseImage = async (event, imageDataUrl = null) => {
	if (isProcessing.value) return
	isProcessing.value = true
	const result = await store.dispatch("editor/insertImage", {
		project: currentProject.value.name,
		imageDataUrl,
	})

	if (result.hasError) {
		codeResult.value = $t("image_inserting_error")
		return (isProcessing.value = false)
	}

	imageFilePath.value = result.saveFilePath
	codeResult.value = result.result?.trim()
	isProcessing.value = false

	const projectsFileTrees = await ipcRenderer.invoke("get-projects-file-trees")

	console.log(projectsFileTrees)

	store.dispatch("project/updateProjects", projectsFileTrees)
}

const codeDisplay = computed(() => {
	if (!codeResult.value) return ""

	return `${codeResult.value}`
})

const insert = () => {
	store.state.editor.insertText(codeDisplay.value)
	hide()
}

onMounted(() => {
	pasteImageInputElement.value.onpaste = function (pasteEvent) {
		var item = pasteEvent.clipboardData.items[0]

		if (item.type.indexOf("image") === 0) {
			var blob = item.getAsFile()

			var reader = new FileReader()
			reader.onload = function (event) {
				imageElement.value.src = event.target.result
				chooseImage(null, event.target.result)
			}

			reader.readAsDataURL(blob)
		}
	}
})

const pasteImageInputElement = ref(null)
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
								sm:w-auto sm:text-sm
							"
							:class="[
								...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
								...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
							]"
							@click="chooseImage"
							:disabled="isProcessing"
						>
							<span
								class="flex items-center w-full h-full"
								v-show="isProcessing"
							>
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
								{{ $t("processing") }}...
							</span>
							<span v-show="!isProcessing">{{ $t("choose_image") }}</span>
						</button>
					</div>
					<div class="flex justify-center mt-3">
						<input
							type="text"
							class="
								border border-gray-300
								text-gray-900 text-sm
								rounded-lg
								focus:ring-blue-500 focus:border-blue-500
								block
								p-2.5
								dark:border-gray-600
								dark:placeholder-gray-400
								dark:text-white
								dark:focus:ring-blue-500
								dark:focus:border-blue-500
							"
							:placeholder="$t('paste_your_image')"
							ref="pasteImageInputElement"
							readonly
						/>
					</div>
					<div
						class="flex items-center image w-full bg-black aspect-[16/9] mt-5"
					>
						<img
							class="mx-auto w-full"
							ref="imageElement"
							:src="`${imageFilePath}`"
							alt=""
						/>
					</div>
					<div
						class="
							flex
							mt-3
							w-full
							bg-zinc-100
							dark:bg-zinc-800
							px-3
							py-2
							text-zinc-600
							dark:text-zinc-300
							overflow-auto
						"
					>
						<code>{{ codeDisplay }}</code>
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
						@click="insert"
						:disabled="!codeResult"
					>
						{{ $t("insert") }}
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
.form-checkbox {
	appearance: none;
	-webkit-print-color-adjust: exact;
	color-adjust: exact;
	display: inline-block;
	vertical-align: middle;
	background-origin: border-box;
	user-select: none;
	flex-shrink: 0;
	background-color: #fff;
	border-color: #e2e8f0;
	border-width: 1px;
	border-radius: 0.25rem;
}
.form-checkbox:checked {
	background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
	border-color: transparent;
	background-color: currentColor;
	background-size: 100% 100%;
	background-position: center;
	background-repeat: no-repeat;
}
</style>