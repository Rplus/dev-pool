let card = {};

card.wrap = document.querySelector('.cards');
card.new = document.querySelector('.new-card');

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

card.new.addEventListener('click', () => {
  let lastCard = card.wrap.querySelector('.card:last-child');
  let lastNumber = +lastCard.className.match(/\d+/);
  let newCard = lastCard.cloneNode(true);
  newCard.className = newCard.className.replace(/\d+/, lastNumber + 1);

  lastCard.parentElement.insertBefore(newCard, lastCard.nextSibling);

  reCalcPos();
});

let reCalcPos = () => {
  let cards = [].slice.call(card.wrap.querySelectorAll('.card'));
  let count = cards.length;

  cards.forEach((card, i) => {
    card.style.top = `calc(${i / count} * (100% - 1.5rem))`;
  });
};
