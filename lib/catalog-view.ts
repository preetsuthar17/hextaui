const catalogViewStorageKey = "hextaui-catalog-view"

const catalogViewScript = `try{var v=localStorage.getItem("${catalogViewStorageKey}");if(v==="list"||v==="single")document.documentElement.dataset.catalogView=v}catch(e){}`

export { catalogViewScript, catalogViewStorageKey }
