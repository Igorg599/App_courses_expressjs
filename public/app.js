document.querySelectorAll('.price').forEach(node => {
  //форматирование цен
  node.textContent = new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(node.textContent)
})

const $card = document.querySelector('#card')

if($card) {
  $card.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id
      
      fetch('/card/remove/' + id, {
        method: 'delete'
      }).then(res => res.json()).then(card => {
          console.log(card)
        })
    }
  })
}