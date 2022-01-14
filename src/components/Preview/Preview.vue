<script setup>
import { computed } from "@vue/reactivity"
import { useStore } from "vuex"
import PreviewToolbar from './PreviewToolbar.vue';

const store = useStore()

const pdfFileUrl = computed(() => store.state.preview.pdfFileUrl)
</script>

<template>
	<div class="editor-latex-preview">
		<PreviewToolbar />
		<iframe width="100%" height="100%" :src="pdfFileUrl"></iframe>
	</div>
</template>

<style scoped>
</style>