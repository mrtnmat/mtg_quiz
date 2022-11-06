let STATE = {
  win: false
}

function getRandomCard() {
  let a = ['-is:split', '-is:flip', "-set:sunf", "-is:transform", "-is:mdfc", "lang:it"]
  let query = a.join('+')
  return axios.get('https://api.scryfall.com/cards/random?q=' + query)
}

function buttonClickHandler(winningCard, containerCarta, txtWin) {
  return (event) => {
    if (!STATE.win) {
      const button = event.target
      filterClassesDEST(button, 'bg-')
      filterClassesDEST(button, 'hover:bg-')
  
      if (winningCard.data.printed_name === button.textContent) {
        STATE.win = true
        containerCarta.style.backgroundImage = `url(${winningCard.data.image_uris.large})`;
        //ridimensiona carta
        filterClassesDEST(containerCarta, 'h-')
        containerCarta.classList.add('h-160')
        //sottotitolo
        sottotitolo.classList.add('bg-teal-500', 'hover:bg-teal-400', 'rounded', 'text-white')
        sottotitolo.textContent = 'Hai vinto!'
        sottotitolo.addEventListener('click', refreshHandler())
        //cambia colore al bottone
        button.classList.add('bg-green-500', 'hover:bg-green-400')
      } else {
        button.classList.add('bg-red-500', 'hover:bg-red-400')
      } 
    }
  }
}

function refreshHandler() {
  return (_ => window.location.reload())
}

function filterClassesDEST(el, prefix) {
  const classes = el.className.split(" ").filter(c => !c.startsWith(prefix));
  el.className = classes.join(" ").trim();
}

function creaBottoni() {
  const nodes = []
  for (let i = 0; i < 4; i++) {
    const node = document.createElement('button')
    node.classList.add('text-xl', 'bg-blue-500', 'hover:bg-blue-400', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'w-auto', 'min-w-max')
    nodes.push(node)    
  }
  return nodes
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray
}

Promise.all([getRandomCard(), getRandomCard(), getRandomCard(), getRandomCard()])
  .then(
    cardsIt => {
      console.log(cardsIt)
      axios.get(`https://api.scryfall.com/cards/${cardsIt[0].data.set}/${cardsIt[0].data.collector_number}`).then(
        cardsEng => {
          console.log(cardsEng)
          const carta = document.querySelector("#immagine-carta")
          carta.style.backgroundImage = `url(${cardsEng.data.image_uris.art_crop})`;

          //aggiungi bottoni
          const buttons = creaBottoni()
          const container = document.getElementById('container-bottoni')
          const shuffledCardsIt = shuffleArray(cardsIt)
          const sottotitolo = document.getElementById('sottotitolo')
          buttons.forEach((btn, i) => {
            btn.addEventListener('click', buttonClickHandler(cardsIt[0], carta, sottotitolo))
            btn.textContent = shuffledCardsIt[i].data.printed_name
            container.appendChild(btn)
          })

          //rendi visibile
          const caricamento = document.getElementById('caricamento')
          caricamento.remove('')
          carta.classList.remove('invisible')
          container.classList.remove('invisible')
        }
      )
    }
  )