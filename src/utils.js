function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function refreshHandler() {
  return (_ => window.location.reload())
}

function filterClassesDEST(el, prefix) {
  const classes = el.className.split(" ").filter(c => !c.startsWith(prefix));
  el.className = classes.join(" ").trim();
}

function hide(el) {
  el.classList.add('hidden')
}
function show(el) {
  el.classList.remove('hidden')
}