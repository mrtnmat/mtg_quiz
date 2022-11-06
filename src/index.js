let STATE = {
  gameOver: false
}

function getRandomCard() {
  let a = ['-is:split', '-is:flip', "-set:sunf", "-is:transform", "-is:mdfc", "lang:it", `d:${Date.now().toString()}`]
  let query = a.join('+')
  return axios({
    url: 'https://api.scryfall.com/cards/random?q=' + query,
  })
}

function getCard(set, collector_number) {
  return axios.get(`https://api.scryfall.com/cards/${set}/${collector_number}`)
}

function buttonClickHandler(carte, indiceCartaVincente) {
  return (event) => {
    const button = event.target
    const txtWin = document.getElementById('sottotitolo')
    const immagineCarta = document.querySelector(`.immagine-carta[carta="${button.attributes.carta.value}"]`)
    const immagineCartaVincente = document.querySelector(`.immagine-carta[carta="${indiceCartaVincente}"]`)
    const winningCard = carte[indiceCartaVincente]

    if (!STATE.gameOver) {
      STATE.gameOver = true
      filterClassesDEST(button, 'bg-')
      filterClassesDEST(button, 'hover:bg-')
      
      immagineCartaVincente.style.backgroundImage = `url(${winningCard.data.image_uris.large})`;
      
      let txtWinClassList
      let txtWinTextContent
      let buttonClassList
      if (winningCard.data.printed_name === button.textContent) {
        txtWinClassList = ['bg-teal-500', 'hover:bg-teal-400', 'rounded', 'text-white']
        txtWinTextContent = '👑👑👑 Hai vinto! 👑👑👑'
        buttonClassList = ['bg-green-500', 'hover:bg-green-400']
      } else {
        txtWinClassList = ['bg-zinc-500', 'hover:bg-zinc-400', 'rounded', 'text-white']
        txtWinTextContent = 'Hai perso! ☹️'
        buttonClassList = ['bg-red-500', 'hover:bg-red-400']
      }
      txtWin.classList.add(...txtWinClassList)
      txtWin.textContent = txtWinTextContent
      button.classList.add(...buttonClassList)
      
      //ridimensiona carta
      filterClassesDEST(immagineCarta, 'h-')
      immagineCarta.classList.add('h-144')
      
      //retry sul sottotitolo
      txtWin.addEventListener('click', refreshHandler())
    } else {
      switchImage(button)
    }
  }
}

function buttonMouseoverHandler() {
  return (event => {
    if (STATE.gameOver) {
      switchImage(event.target)
    }
  })
}

function switchImage(button) {
  document.querySelectorAll('.immagine-carta').forEach((e, i) => {
    e.classList.add('hidden')
    if (parseInt(button.attributes.carta.value) === i) {
      e.classList.remove('hidden')
    }
  })
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
    node.setAttribute('carta', i)
    node.classList.add('text-xl', 'bg-blue-500', 'hover:bg-blue-400', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'w-auto', 'min-w-max')
    nodes.push(node)    
  }
  return nodes
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

Promise.all([getRandomCard(), getRandomCard(), getRandomCard(), getRandomCard()])
.then(
  cardsIt => {
    console.log(cardsIt)
    const n = getRandomInt(0,4)
    getCard(cardsIt[n].data.set, cardsIt[n].data.collector_number).then(
    winningCardEng => {
      console.log("winning card: ", winningCardEng)
      const immaginiCarte = document.querySelectorAll('.immagine-carta')
      immaginiCarte.forEach((e, i) => {
        e.style.backgroundImage = i == n ? `url(${winningCardEng.data.image_uris.art_crop}` : `url(${cardsIt[i].data.image_uris.large})`;
      })
      
      //aggiungi bottoni
      const buttons = creaBottoni()
      const container = document.getElementById('container-bottoni')
      const sottotitolo = document.getElementById('sottotitolo')
      buttons.forEach((btn, i) => {
        btn.addEventListener('click', buttonClickHandler(cardsIt, n, immaginiCarte[n], sottotitolo))
        btn.addEventListener('mouseover', buttonMouseoverHandler())
        btn.textContent = cardsIt[i].data.printed_name === null ? cardsIt[i].data.name : cardsIt[i].data.printed_name
        container.appendChild(btn)
      })
      
      //rendi visibile
      const caricamento = document.getElementById('caricamento')
      caricamento.classList.add('hidden')
      immaginiCarte[n].classList.remove('hidden')
      container.classList.remove('hidden')
    }
    )
  }
  )