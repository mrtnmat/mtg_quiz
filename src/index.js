function getRandomCard() {
  let a = ['-is:split', '-is:flip', "-set:sunf", "-is:transform", "-is:mdfc", "lang:it"]
  let query = a.join('+')
  return axios.get('https://api.scryfall.com/cards/random?q=' + query)
}

function buttonClickHandler(winningCard, containerCarta) {
  return (event) => {
    if (winningCard.data.printed_name === event.target.textContent) {
      containerCarta.style.backgroundImage = `url(${winningCard.data.image_uris.large})`;
    }
  }
}

function creaBottoni() {
  const nodes = []
  for (let i = 0; i < 4; i++) {
    const node = document.createElement('button')
    node.classList.add('text-xl', 'bg-blue-500', 'hover:bg-blue-400', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'w-auto')
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
          buttons.forEach((btn, i) => {
            btn.addEventListener('click', buttonClickHandler(cardsIt[0], carta))
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