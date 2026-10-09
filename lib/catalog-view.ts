const catalogViewStorageKey = "hextaui-catalog-layout"

const catalogViewScript = `try{var v=localStorage.getItem("${catalogViewStorageKey}");if(v==="cards"||v==="list")document.documentElement.dataset.catalogView=v}catch(e){}`

export { catalogViewScript, catalogViewStorageKey }
