<script setup>
import { computed, ref } from "@vue/reactivity"
import { nextTick, onMounted } from "@vue/runtime-core"
import { useStore } from "vuex"
import PreviewToolbar from "./PreviewToolbar.vue"

const store = useStore()

const previewerElement = ref(null)

const pdfFileUrl = computed(() => {
	return store.state.preview.pdfFileUrl
})

const _latexEngine = ref(null)

const onCompiled = () => {
	nextTick(() => {
		console.log(previewerElement.value, pdfFileUrl.value)
		previewerElement.value?.contentWindow.location.reload()
		previewerElement.value.src = pdfFileUrl.value.replaceAll("\\", "/")
	})
}

const isViewingLog = computed(() => store.getters["preview/isViewingLog"])

const viewingLog = computed(() => store.getters["preview/viewingLog"])

const textareaHeight = computed(() => {
	return `calc(100% - 4rem)`
})
</script>

<template>
	<div class="editor-latex-preview">
		<PreviewToolbar @compiled="onCompiled" />
		<div
			class="w-full"
			:style="{ height: textareaHeight }"
			v-show="!isViewingLog"
		>
			<iframe
				width="100%"
				height="100%"
				:src="pdfFileUrl"
				ref="previewerElement"
			></iframe>
		</div>
		<div
			class="w-full"
			:style="{ height: textareaHeight }"
			v-show="isViewingLog"
		>
			<textarea class="w-full h-full" v-model="viewingLog" readonly></textarea>
		</div>
	</div>
</template>

<style scoped>
</style>