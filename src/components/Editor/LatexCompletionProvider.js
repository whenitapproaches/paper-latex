// import * as monaco from "monaco-editor/esm/vs/editor/editor.api"

const ENV_REGEXP = /(?:\\begin(?:\[[^[\]]*\])?){([^}]*)$/

const CMD_REGEXP = /\\([a-zA-Z_]*(?::[a-zA-Z]*)?)$/

const PACKAGE_REGEXP = /(?:\\usepackage(?:\[[^[\]]*\])*){([^}]*)$/

const DOCUMENTCLASS_REGEXP = /(?:\\documentclass(?:\[[^[\]]*\])*){([^}]*)$/

let PublicPath = ""

function unpackJson(jsonInput, suggestionOutput, monaco) {
  Object.keys(jsonInput).forEach((key) => {
    const item = jsonInput[key]
    const pack = {
      kind: monaco.languages.CompletionItemKind.Module,
      detail: item.detail ? item.detail : "",
      documentation: item.documentation ? item.documentation : "",
      label: item.command,
      insertText: item.command,
    }
    suggestionOutput.push(pack)
  })
}

let documentclassSuggestion

async function suggestDocumentClass(monaco) {
  if (!documentclassSuggestion) {
    const freq = await fetch(`${PublicPath}/bin/lang/classnames.json`)
    if (freq.ok) {
      const classes = await freq.json()
      documentclassSuggestion = []
      unpackJson(classes, documentclassSuggestion, monaco)
    } else {
      documentclassSuggestion = []
    }
  }
  return documentclassSuggestion
}

let packageSuggestion

async function suggestPackage(monaco) {
  if (!packageSuggestion) {
    const freq = await fetch(`${PublicPath}/bin/lang/packagenames.json`)
    if (freq.ok) {
      const defaultPackages = await freq.json()
      packageSuggestion = []
      unpackJson(defaultPackages, packageSuggestion, monaco)
    } else {
      packageSuggestion = []
    }
  }
  return packageSuggestion
}

let envSuggestion

async function suggestEnv(monaco) {
  if (!envSuggestion) {
    const freq = await fetch(`${PublicPath}/bin/lang/environments.json`)
    if (freq.ok) {
      const inputJson = await freq.json()
      envSuggestion = []
      unpackJson(inputJson, envSuggestion, monaco)
    } else {
      envSuggestion = []
    }
  }
  return envSuggestion
}

let cmdSuggestion

async function suggestCMD(monaco) {
  if (!cmdSuggestion) {
    const freq = await fetch(`${PublicPath}/bin/lang/commands.json`)
    if (freq.ok) {
      const inputJson = await freq.json()
      cmdSuggestion = []
      unpackJson(inputJson, cmdSuggestion, monaco)
    } else {
      cmdSuggestion = []
    }
  }
  return cmdSuggestion
}

export async function suggest(lineBeforeInvokeChar, monaco) {
  let items = []

  if (lineBeforeInvokeChar.match(CMD_REGEXP)) {
    const tmp = await suggestCMD(monaco)
    items = items.concat(tmp)
  }

  if (lineBeforeInvokeChar.match(ENV_REGEXP)) {
    const tmp = await suggestEnv(monaco)
    items = items.concat(tmp)
  }

  if (lineBeforeInvokeChar.match(PACKAGE_REGEXP)) {
    const tmp = await suggestPackage(monaco)
    items = items.concat(tmp)
  }

  if (lineBeforeInvokeChar.match(DOCUMENTCLASS_REGEXP)) {
    const tmp = await suggestDocumentClass(monaco)
    items = items.concat(tmp)
  }

  return [...items]
}

export const getLaTeXCompletionProvider = (monaco, publicPath) => {
  PublicPath = publicPath

  return {
    triggerCharacters: ["\\", "{"],
    provideCompletionItems: async (model, position) => {
      const currentLine = model.getLineContent(position.lineNumber)

      let startPos = position.column - 32 /* Should be enough */
      if (startPos < 0) {
        startPos = 0
      }

      const lineBeforeInvokeChar = currentLine.substr(
        startPos,
        position.column - 1
      )

      const suggestions = [...(await suggest(lineBeforeInvokeChar, monaco))]

      return {
        suggestions: [
          ...suggestions.map((suggestion) => {
            return {
              detail: suggestion.detail,
              documentation: suggestion.documentation,
              insertText: suggestion.insertText,
              kind: suggestion.kind,
              label: suggestion.label,
              range: suggestion.range,
              sortText: suggestion.sortText,
            }
          }),
        ],
      }

      // const currentLine = model.getLineContent(position.lineNumber)
      // const invokeChar = currentLine[position.column - 1]

      // if (
      //   position.column > 1 &&
      //   invokeChar === "\\" &&
      //   currentLine[position.column - 2] === "\\"
      // ) {
      //   console.log("no suggestion")
      //   return { suggestions: [] }
      // }
      // let startPos = position.column - 32 /* Should be enough */
      // if (startPos < 0) {
      //   startPos = 0
      // }
      // const lineBeforeInvokeChar = currentLine.substr(
      //   startPos,
      //   position.column - 1
      // )

      // return {
      //   suggestions: [...(await suggest(lineBeforeInvokeChar))],
      // }
    },
  }
}
