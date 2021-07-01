document.querySelectorAll('.price').forEach(node => {
  //форматирование цен
  node.textContent = new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(node.textContent)
})