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
          for (let i = 0; i < 4; i++) {
            document.querySelector("#answer" + i).textContent = r[i].data.printed_name
          }
        }
      )
      
    }
  ) 
}