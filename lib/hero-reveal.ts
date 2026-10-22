const heroRevealStorageKey = "hextaui-hero-revealed"

const heroRevealScript = `try{if(!sessionStorage.getItem("${heroRevealStorageKey}")){sessionStorage.setItem("${heroRevealStorageKey}","1");var d=document.documentElement;d.dataset.heroReveal="";setTimeout(function(){delete d.dataset.heroReveal},3200)}}catch(e){}`

export { heroRevealScript }
