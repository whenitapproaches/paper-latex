import { get } from "lodash"

export const sortLocales = (array, properties = null) => {
  return [
    ...array.sort((a, b) => {
      if (!properties) {
        return a.toLowerCase().localeCompare(b.toLowerCase())
      }

      return get(a, properties)
        .toLowerCase()
        .localeCompare(get(b, properties).toLowerCase())
    }),
  ]
}
