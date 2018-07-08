import FlatDocumentStructure from '../src'

const fds = new FlatDocumentStructure({
  "dfes" : { id: "dfes", parent: null, nextSibling: "wqsa"},
  "wqsa" : { id: "wqsa", parent: null, nextSibling: "fdwq" },
  "fdwq" : { id: "fdwq", parent: null, nextSibling: null },
  "lfrg" : { id: "lfrg", parent: "wqsa", nextSibling: "ertf" },
  "ertf" : { id: "ertf", parent: "wqsa", nextSibling: null },
  "dfre" : { id: "dfre", parent: "ertf", nextSibling: null }
})

console.log(fds.toArrayStructure())
