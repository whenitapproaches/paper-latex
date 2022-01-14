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
import { computed, onMounted, ref } from "@vue/runtime-core"
import debounce from "lodash/debounce"
import EditorToolbar from "./EditorToolbar.vue"

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
	await loadWASM("/bin/onigasm.wasm")
	const registry = new Registry({
		getGrammarDefinition: async (scopeName) => {
			// console.log(scopeName);
			if (scopeName === "text.tex.latex") {
				return {
					format: "json",
					content: await (await fetch("/bin/LaTeX.tmLanguage.json")).text(),
				}
			} else if (scopeName === "text.bibtex") {
				return {
					format: "json",
					content: await (await fetch("/bin/Bibtex.tmLanguage.json")).text(),
				}
			} else if (scopeName === "text.tex") {
				return {
					format: "json",
					content: await (await fetch("/bin/TeX.tmLanguage.json")).text(),
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

	if (model) {
		const column = e.position.column
		const line = e.position.lineNumber
		store.dispatch("editor/saveCursor", {
			path: path.value,
			cursor: { column, line },
		})
	}
}

const _handleResize = debounce(() => {
	editor && editor.layout()
}, 250)

let editor = null

let _contentSubscription

let _cursorSubscription

onMounted(() => {
	editor = monaco.editor.create(editorElement.value, {
		value: "",
		language: "latex",
	})

	_setupHighlighting().then()

	monaco.languages.registerCompletionItemProvider(
		"latex",
		getLaTeXCompletionProvider(monaco)
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
			editorState: editor.saveViewState(),
		})
	})

	store.dispatch("editor/updateEditorUpdateStateFunction", (state) => {
		editor.restoreViewState(state)

		const cursor = state.cursorState[0]

		const { position } = cursor

		editor.setPosition({
			lineNumber: position.lineNumber,
			column: position.column,
		})
		editor.revealLine(position.lineNumber)
		editor.focus()
	})

	store.dispatch(
		"editor/updateEditorSetEditorCursorFunction",
		({ line, column }) => {
			editor.setPosition({ lineNumber: line, column })
			editor.revealLine(line)
			editor.focus()
		}
	)
})

const toolbarElement = ref(null)

const toolbarElementHeight = computed(() =>
	toolbarElement.value ? toolbarElement.value.$el.clientHeight : 0
)
</script>

<template>
	<div>
		<EditorToolbar ref="toolbarElement" />
		<div
			:style="{ height: `calc(100% - ${toolbarElementHeight}px)` }"
			id="editor"
			ref="editorElement"
		></div>
	</div>
</template>

<style scoped>
#editor {
}
</style>

