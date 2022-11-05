function getRandomCard() {
  let a = ['-is:split', '-is:flip', "-set:sunf", "lang:it"]
  let query = a.join('+')
  return axios.get('https://api.scryfall.com/cards/random?q=' + query)
}

let get = true

if (get) {
  Promise.all([getRandomCard(), getRandomCard(), getRandomCard(), getRandomCard()])
  .then(
    r => {
      console.log(r)
      let carta = document.querySelector("#immagine-carta")
      axios.get(`https://api.scryfall.com/cards/${r[0].data.set}/${r[0].data.collector_number}`).then(
        e => {
          console.log(e)
          carta.style.backgroundImage = `url(${e.data.image_uris.art_crop})`;
          creaElementi(r)
        }
      )
      
    }
  ) 
}

function creaElementi(r) {
  const container = document.getElementById('container-bottoni')
  for (let i = 0; i < 4; i++) {
    const node = document.createElement('button')
    node.classList.add('bg-blue-500', 'hover:bg-blue-400', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'w-auto')
    node.textContent = r[i].data.printed_name
    container.appendChild(node)
  }
}