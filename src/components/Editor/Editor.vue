<script setup>
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { Registry } from "monaco-textmate"
import { wireTmGrammars } from "monaco-editor-textmate"
import { loadWASM } from "onigasm"
import { computed, nextTick, onMounted, ref } from "@vue/runtime-core"
import debounce from "lodash/debounce"
import EditorToolbar from "./EditorToolbar.vue"
import { PROJECTS_FOLDER_NAME } from "../../constants"

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "json") {
			return new jsonWorker()
		}
		if (label === "css" || label === "scss" || label === "less") {
			return new cssWorker()
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return new htmlWorker()
		}
		if (label === "typescript" || label === "javascript") {
			return new tsWorker()
		}
		return new editorWorker()
	},
}

import { light, dark } from "./themes/monaco"
import { getLaTeXCompletionProvider } from "./LaTeXCompletionProvider"
import { useStore } from "vuex"
import { ipcRenderer } from "electron"

monaco.editor.defineTheme("light", light)
monaco.editor.defineTheme("dark", dark)

const _setupHighlighting = async () => {
	monaco.languages.register({ id: "bibtex", extensions: [".bib"] })
	monaco.languages.register({
		id: "latex",
		extensions: [".tex", ".cls", ".sty"],
	})
	monaco.languages.setLanguageConfiguration("latex", {
		comments: {
			lineComment: "%",
		},
		brackets: [
			["{", "}"],
			["[", "]"],
			["(", ")"],
		],
		autoClosingPairs: [
			{ open: "{", close: "}", notIn: ["string"] },
			{ open: "[", close: "]", notIn: ["string"] },
			{ open: "(", close: ")", notIn: ["string"] },
			{ open: "`", close: "`", notIn: ["string", "comment"] },
			{ open: '"', close: '"', notIn: ["string", "comment"] },
			{ open: "$", close: "$", notIn: ["string", "comment"] },
		],
		surroundingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
			{ open: "`", close: "`" },
			{ open: '"', close: '"' },
			{ open: "$", close: "$" },
		],
	})

	monaco.languages.setLanguageConfiguration("bibtex", {
		comments: {
			lineComment: "%",
		},
		brackets: [
			["{", "}"],
			["[", "]"],
			["(", ")"],
		],
		autoClosingPairs: [
			{ open: "{", close: "}", notIn: ["string"] },
			{ open: "[", close: "]", notIn: ["string"] },
			{ open: "(", close: ")", notIn: ["string"] },
		],
		surroundingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
		],
	})
	await loadWASM(publicPath.value + "/bin/onigasm.wasm")
	const registry = new Registry({
		getGrammarDefinition: async (scopeName) => {
			if (scopeName === "text.tex.latex") {
				return {
					format: "json",
					content: await (await fetch(publicPath.value + "/bin/LaTeX.tmLanguage.json")).text(),
				}
			} else if (scopeName === "text.bibtex") {
				return {
					format: "json",
					content: await (await fetch(publicPath.value + "/bin/Bibtex.tmLanguage.json")).text(),
				}
			} else if (scopeName === "text.tex") {
				return {
					format: "json",
					content: await (await fetch(publicPath.value + "/bin/TeX.tmLanguage.json")).text(),
				}
			} else {
				throw new Error("Unexpected grammar " + scopeName)
			}
		},
	})
	const grammars = new Map()
	grammars.set("bibtex", "text.bibtex")
	grammars.set("latex", "text.tex.latex")
	await wireTmGrammars(monaco, registry, grammars)
}

const editorElement = ref(null)

const path = computed(() => store.state.editor.currentFilePath)

const store = useStore()
const theme = computed(() => store.state.settings.theme)

const _onModelContentChanged = (e) => {
	const model = editor.getModel()

	if (model) {
		// Report value Change
		const value = model.getValue()

		store.dispatch("editor/saveContent", {
			path: path.value,
			editorContent: value,
		})

		// // Report Key Strokes for preview and YJS
		// this._extractKeyStrokeEvent(model, e)
	}
}

const _onEditorCursorChanged = (e) => {
	const model = editor.getModel()

	if (model && e.source === "mouse") {
		const column = e.position.column
		const line = e.position.lineNumber
		store.dispatch("editor/saveCursor", {
			path: path.value,
			cursor: { column, line },
		})
	}
}

const _handleResize = (time = 250) =>
	debounce(() => {
		editor && editor.layout()
	}, time)()

let editor = null

let _contentSubscription

let _cursorSubscription

const fullscreenMode = ref(false)

const enterFullscreenMode = () => {
	editor.focus()
	fullscreenMode.value = true
	_handleResize(0)
}

const exitFullscreenMode = () => {
	editor.focus()
	fullscreenMode.value = false
	_handleResize(0)
}

const publicPath = ref("")

onMounted(async () => {
	editor = monaco.editor.create(editorElement.value, {
		value: "",
		language: "latex",
		wordWrap: "wordWrapColumn",
		wordWrapColumn: 120,
	})

	const appPaths = await ipcRenderer.invoke("get-app-path")

	console.log(appPaths);

	publicPath.value = appPaths.publicPath

	console.log(publicPath.value);

	await _setupHighlighting()

	monaco.languages.registerCompletionItemProvider(
		"latex",
		getLaTeXCompletionProvider(monaco, publicPath.value)
	)

	editor.updateOptions({ wordBasedSuggestions: false })

	monaco.editor.setTheme(theme.value)

	window.addEventListener("resize", _handleResize)

	_cursorSubscription = editor.onDidChangeCursorPosition((e) =>
		_onEditorCursorChanged(e)
	)

	_contentSubscription = editor.onDidChangeModelContent((e) =>
		_onModelContentChanged(e)
	)

	store.dispatch("editor/updateEditor", editor)

	store.dispatch(
		"editor/updateEditorUpdateContentFunction",
		(editorContent) => {
			editor.getModel().setValue(editorContent)
		}
	)

	store.dispatch("editor/updateEditorSaveStateFunction", (path) => {
		store.dispatch("editor/saveState", {
			path,
			editorState: { ...editor.saveViewState() },
		})
	})

	store.dispatch("editor/updateEditorUpdateStateFunction", (state) => {
		editor.restoreViewState(state)

		const cursor = state.cursorState[0]

		const { position } = cursor

		nextTick(() => {
			editor.setPosition({
				lineNumber: position.lineNumber,
				column: position.column,
			})
			editor.revealLine(position.lineNumber)
			editor.focus()
		})
	})

	store.dispatch(
		"editor/updateEditorSetEditorCursorFunction",
		({ line, column }) => {
			editor.setPosition({ lineNumber: line, column })
			editor.revealLine(line)
			editor.focus()
		}
	)

	store.dispatch("editor/updateEditorInsertTextFunction", (text) => {
		let selection = editor.getSelection()
		let id = { major: 1, minor: 1 }
		let op = {
			identifier: id,
			range: selection,
			text,
			forceMoveMarkers: true,
		}
		editor.executeEdits("insert-text", [op])
		editor.focus()
	})

	store.dispatch("editor/updateEditorWrapTextFunction", (head, tail) => {
		let selection = editor.getSelection()
		const selectionText = editor.getModel().getValueInRange(selection)
		const text = `${head}${selectionText}${tail}`
		let id = { major: 1, minor: 1 }
		let op = {
			identifier: id,
			range: selection,
			text,
			forceMoveMarkers: true,
		}
		editor.executeEdits("wrap-text", [op])
		editor.focus()
	})

	store.dispatch("editor/updateGetCurrentEditorTextFunction", () => {
		return editor.getModel().getValue()
	})
})

const toolbarElement = ref(null)

const toolbarElementHeight = computed(() =>
	toolbarElement.value ? toolbarElement.value.$el.clientHeight : 0
)

const currentFilePath = computed(() => store.state.project.currentFilePath)

const isCurrentFileAnImage = computed(() => {
	if (!currentFilePath.value.length) return

	const currentFilePathDepth = currentFilePath.value.length

	const extension =
		currentFilePath.value[currentFilePathDepth - 1].split(".")[1]

	return ["jpg", "png", "jpeg"].includes(extension)
})
</script>

<template>
	<div
		class="bg-white dark:bg-zinc-900"
		:class="{ fullscreen: fullscreenMode }"
	>
		<div
			v-show="isCurrentFileAnImage"
			class="
				image-previewer
				my-3
				h-full
				flex
				justify-center
				items-center
				bg-black
			"
		>
			<img
				class="w-full"
				v-if="isCurrentFileAnImage"
				:src="[publicPath, PROJECTS_FOLDER_NAME, ...currentFilePath].join('/')"
			/>
		</div>
		<div v-show="!isCurrentFileAnImage" class="h-full">
			<EditorToolbar
				ref="toolbarElement"
				@toggleFullscreenMode="
					fullscreenMode ? exitFullscreenMode() : enterFullscreenMode()
				"
				:fullscreenMode="fullscreenMode"
			/>
			<div
				:class="{ 'editor-fullscreen': fullscreenMode }"
				:style="{ height: `calc(100% - ${toolbarElementHeight}px)` }"
				id="editor"
				ref="editorElement"
				@keyup.esc="exitFullscreenMode"
			></div>
		</div>
	</div>
</template>

<style scoped>
.fullscreen {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999999;
}

.editor-fullscreen {
	widows: 100vw;
}

.image-previewer {
	overflow: hidden;
}
</style>

