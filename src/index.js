let STATE = {
  gameOver: false,
  production: false,
}

console.log = STATE.production ? () => {} : console.log

loadingScreen()

function isWin() {
  const a = document.querySelectorAll('[type=radio]')
  return a[STATE.winningCard.index].checked
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

function loadingScreen() {
  const caricamento = document.getElementById('caricamento')
  setInterval(_ => {
    if (caricamento.textContent === "Caricamento...") {
      caricamento.textContent = "Caricamento"
    } else {
      caricamento.textContent += "."
    }
  }, 800);
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

function endGame() {
  if (!STATE.gameOver) {
    const sottotitolo = document.getElementById('sottotitolo')
    const txtWin = document.getElementById('risultato')
    const button = document.getElementById('submit-answer')
    
    switchImage(STATE.winningCard.index)
    
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
    txtWin.addEventListener('click', refreshHandler())
  }
}

function switchImage(cardN) {
  hide(document.getElementById('immagine-crop'))
  document.querySelectorAll('.immagine-carta').forEach((e, i) => {
    hide(e)
    if (cardN === i) {
      show(e)
    }
  })
}

function changeHandler(e) {
  STATE.selected = parseInt(e.target.getAttribute('card'))
  setLabelBorder(STATE.selected)
  if (STATE.gameOver) {
    switchImage(STATE.selected)
  }
}

function setLabelBorder(n) {
  const transp = 'outline-transparent'
  const color = 'outline-slate-600'
  document.querySelectorAll('label').forEach((e, i) => {
    if (i === n) {
      e.classList.replace(transp, color)
      e.classList.replace('bg-white', 'bg-black')
      e.classList.replace('text-black', 'text-white')
      
    } else {
      e.classList.replace(color, transp)
      e.classList.replace('bg-black', 'bg-white')
      e.classList.replace('text-white', 'text-black')
    }
  })
}

function loadingEnd() {
  const caricamento = document.getElementById('caricamento')
  const form = document.getElementById('answer-form')
  const crop = document.getElementById('immagine-crop')
  
  caricamento.remove()
  show(crop)
  show(form)
}

function setRadioButtonsName() {
  const radio = document.querySelectorAll('[type=radio]+label')
  radio.forEach((r, i) => {
    r.textContent = STATE.cardsIt[i].data.printed_name === null ?
    STATE.cardsIt[i].data.name :
    STATE.cardsIt[i].data.printed_name
  })
}

Promise.all([getRandomCard(), getRandomCard(), getRandomCard(), getRandomCard()]).then(cardsIt => {
  STATE.cardsIt = cardsIt
  Promise.all([
    getCard(cardsIt[0].data.set, cardsIt[0].data.collector_number),
    getCard(cardsIt[1].data.set, cardsIt[1].data.collector_number),
    getCard(cardsIt[2].data.set, cardsIt[2].data.collector_number),
    getCard(cardsIt[3].data.set, cardsIt[3].data.collector_number)
  ]).then( cardsEn => {
    STATE.cardsEn = cardsEn
    {
      const n = getRandomInt(0,4)
      STATE.winningCard = {
        index: n,
        cardData: STATE.cardsEn[n].data
      }
    }
    
    //Assegna immagini ai container delle carte
    const immaginiCarte = document.querySelectorAll('.immagine-carta')
    immaginiCarte.forEach((e, i) => {
      const art = STATE.cardsIt[i].data.image_status == "placeholder" ?
      STATE.cardsEn[i].data.image_uris.large :
      STATE.cardsIt[i].data.image_uris.large
      e.style.backgroundImage = `url(${art})`
    })
    const cropArt = STATE.cardsEn[STATE.winningCard.index].data.image_uris.art_crop
    const contCrop = document.querySelector('#immagine-crop')
    contCrop.style.backgroundImage = `url(${cropArt})`
    show(contCrop)
    
    //event listener sul submit del form
    const answer = document.getElementById('submit-answer')
    answer.addEventListener('click', e => {
      e.preventDefault()
      endGame()
    })
    
    document.querySelectorAll('#answer-form [type=radio]').forEach(e => {
      e.addEventListener('change', changeHandler)
    })
    setRadioButtonsName()
    loadingEnd()
  }
  )
}
)