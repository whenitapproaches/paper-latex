<script setup>
import { computed, ref } from "@vue/reactivity"
import { useStore } from "vuex"
import FileTreeFile from "./FileTreeFile.vue"
import FileTreeFolder from "./FileTreeFolder.vue"
import { sortLocales } from "../../helpers"
import {
	FILE_BROWSER_FILES_KEY,
	FILE_BROWSER_FOLDERS_KEY,
	PROJECT_STORAGE_FOLDER_NAME,
} from "../../constants"
import { ipcRenderer } from "electron"
import { onMounted } from "@vue/runtime-core"

const store = useStore()

const currentProject = computed(() => store.state.project.currentProject)

const fileTreeElement = ref(null)

const fileTreeElementWidth = ref(0)

onMounted(() => {
	fileTreeElementWidth.value = fileTreeElement.value?.clientWidth

	window.addEventListener("resize", () => {
		fileTreeElementWidth.value = fileTreeElement.value?.clientWidth
	})
})

onMounted(async () => {
	const projectsFileTrees = await ipcRenderer.invoke("get-projects-file-trees")

	store.dispatch("project/updateProjects", projectsFileTrees)
})
</script>

<template>
	<ul class="list-none" ref="fileTreeElement">
		<li
			v-for="folder in sortLocales(
				currentProject.storage[FILE_BROWSER_FOLDERS_KEY],
				'name'
			)"
			:key="`${currentProject.name}-${folder.name}`"
		>
			<FileTreeFolder
				:title="folder.name"
				:folder="folder"
				:path="[currentProject.name, PROJECT_STORAGE_FOLDER_NAME, folder.name]"
				:fileTreeWidth="fileTreeElementWidth"
				:currentProject="currentProject"
			></FileTreeFolder>
		</li>
		<li
			v-for="fileName in sortLocales(
				currentProject.storage[FILE_BROWSER_FILES_KEY]
			)"
			:key="`${currentProject.name}-${fileName}`"
		>
			<FileTreeFile
				:title="fileName"
				:path="[currentProject.name, PROJECT_STORAGE_FOLDER_NAME, fileName]"
				:fileTreeWidth="fileTreeElementWidth"
				:currentProject="currentProject"
			></FileTreeFile>
		</li>
	</ul>
</template>