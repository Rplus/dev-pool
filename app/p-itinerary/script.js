let card = {};

card.wrap = document.querySelector('.cards');
card.items = [].slice.call(card.wrap.querySelectorAll('.card'));
card.titles = [].slice.call(card.wrap.querySelectorAll('.card__title'));

card.wrap.addEventListener('click', (e) => {
  if (e.target.classList.contains('card__title')) {
    let parentCard = e.target.parentElement;
    let isActive = parentCard.classList.contains('is-active');
    let activedItem = card.wrap.querySelector('.card.is-active');

    if (!isActive && !!activedItem) {
      activedItem.classList.toggle('is-active');
    }
    parentCard.classList.toggle('is-active');
    card.wrap.classList.toggle('is-active', !isActive);
  }
});
