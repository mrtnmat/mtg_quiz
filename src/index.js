let STATE = {
  gameOver: false,
  production: false,
  winningCard: null
}

console.log = STATE.production ? () => {} : console.log

function isWin() {
  const a = document.querySelectorAll('[type=radio]')
  return a[STATE.winningCard.index].checked
}

function checkedRadio() {
  const a = document.querySelectorAll('[type=radio]')
  a.forEach((e, i) => {
    if (e.checked) {
      return [i, e]
    }
  })
  return null
}

const answer = document.getElementById('submit-answer')
answer.addEventListener('click', e => {
  e.preventDefault()
  endGame()
})

function endGame() {
  if (!STATE.gameOver) {
    const sottotitolo = document.getElementById('sottotitolo')
    const txtWin = document.getElementById('risultato')
    const button = document.getElementById('submit-answer')
    console.log(STATE.winningCard)
    //const immagineCarta = document.querySelector(`.immagine-carta[carta="${button.attributes.carta.value}"]`)
    const immagineCartaVincente = document.querySelector(`.immagine-carta[carta="${STATE.winningCard.index}"]`)
    //const winningCard = carte[indiceCartaVincente]
    switchImage(STATE.winningCard.index)
    immagineCartaVincente.style.backgroundImage = `url(${STATE.winningCard.cardData.image_uris.large})`;
    
    STATE.gameOver = true
    
    let txtWinClassList, txtWinTextContent, buttonClassList
    
    if (isWin()) {
      txtWinClassList = ['bg-teal-500']
      txtWinTextContent = '👑👑👑 Hai vinto! 👑👑👑'
      buttonClassList = ['bg-green-500', 'hover:bg-green-400']
      flashingColors(txtWin)
    } else {
      txtWinClassList = ['bg-zinc-500', 'hover:bg-zinc-400']
      txtWinTextContent = 'Hai perso! ☹️'
      buttonClassList = ['bg-red-500', 'hover:bg-red-400']
    }
    sottotitolo.classList.add('hidden')
    txtWin.classList.remove('hidden')
    txtWin.classList.add(...txtWinClassList)
    txtWin.textContent = txtWinTextContent
    button.classList.add(...buttonClassList)
    /*
    //ridimensiona carta
    filterClassesDEST(immagineCarta, 'h-')
    immagineCarta.classList.add('h-144')
    */
    //retry sul sottotitolo
    txtWin.addEventListener('click', refreshHandler())
  }
}

function flashingColors(element) {
  setInterval(_ => {
    if (element.classList.contains('bg-teal-500')) {
      element.classList.remove('bg-teal-500')
      element.classList.add('bg-teal-300')
    } else {
      element.classList.remove('bg-teal-300')
      element.classList.add('bg-teal-500')
    }
  }, 200);
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
    const sottotitolo = document.getElementById('sottotitolo')
    const txtWin = document.getElementById('risultato')
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
        txtWinClassList = ['bg-teal-500']
        txtWinTextContent = '👑👑👑 Hai vinto! 👑👑👑'
        buttonClassList = ['bg-green-500', 'hover:bg-green-400']
        setInterval(_ => {
          if (txtWin.classList.contains('bg-teal-500')) {
            txtWin.classList.remove('bg-teal-500')
            txtWin.classList.add('bg-teal-300')
          } else {
            txtWin.classList.remove('bg-teal-300')
            txtWin.classList.add('bg-teal-500')
          }
        }, 200);
      } else {
        txtWinClassList = ['bg-zinc-500', 'hover:bg-zinc-400']
        txtWinTextContent = 'Hai perso! ☹️'
        buttonClassList = ['bg-red-500', 'hover:bg-red-400']
      }
      sottotitolo.classList.add('hidden')
      txtWin.classList.remove('hidden')
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


function switchImage(cardN) {
  document.querySelectorAll('.immagine-carta').forEach((e, i) => {
    e.classList.add('hidden')
    console.log("cardN ", cardN, " i ", i)
    console.log(e)
    if (cardN === i) {
      e.classList.remove('hidden')
      console.log(e)
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
        STATE.winningCard = {
          index: n,
          cardData: winningCardEng.data
        }

        //imposta immagini carte
        const immaginiCarte = document.querySelectorAll('.immagine-carta')
        //console.log(immaginiCarte)
        immaginiCarte.forEach((e, i) => {
          e.style.backgroundImage = e.getAttribute('carta') == 'crop'
          ? `url(${winningCardEng.data.image_uris.art_crop}`
          : `url(${cardsIt[i].data.image_uris.large})`;
        })

        //imposta nomi radio buttons
        const radio = document.querySelectorAll('[type=radio]+label')
        radio.forEach((r, i) => {
          r.textContent = cardsIt[i].data.printed_name === null ? cardsIt[i].data.name : cardsIt[i].data.printed_name
        })
        
        const container = document.getElementById('container-bottoni')
        /*
        //aggiungi bottoni
        const buttons = creaBottoni()
        const sottotitolo = document.getElementById('sottotitolo')
        buttons.forEach((btn, i) => {
          btn.addEventListener('click', buttonClickHandler(cardsIt, n, immaginiCarte[n], sottotitolo))
          btn.addEventListener('mouseover', buttonMouseoverHandler())
          btn.textContent = cardsIt[i].data.printed_name === null ? cardsIt[i].data.name : cardsIt[i].data.printed_name
          container.appendChild(btn)
        })
        */
        
        //rendi visibile
        const caricamento = document.getElementById('caricamento')
        const form = document.getElementById('answer-form')

        caricamento.classList.add('hidden')

        const v = [immaginiCarte[4], container, form]
        v.forEach(e => {
          e.classList.remove('hidden')
        })
      }
    )
  }
)