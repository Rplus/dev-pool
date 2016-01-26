let Budgets = function Budgets (elm) {
  this.$elm = {
    budget: elm,
    box: elm.querySelector('.b-cat-container'),
    maxSize: elm.querySelector('.b-size span'),
    actualSize: elm.querySelector('.actual-size span'),
    ul: elm.querySelector('.b-cat-list'),
    lists: [].slice.call(elm.querySelectorAll('.b-cat')),
    inputs: [].slice.call(elm.querySelectorAll('input[type="number"]'))
  };

  this.getLimit = () => {
    this.limit = this.$elm.maxSize.textContent * 1;
  };

  this.getListVal = () => {
    this.listVal = this.$elm.lists.map((item, idx) => {
      return this.$elm.inputs[idx].value * 1;
    });
  };

  this.percent = (num, base) => num * 100 / base;
  this.getIndex = (_elm) => [].indexOf.call(_elm.parentNode.children, _elm);

  this.updateWidth = () => {
    this.sum = this.listVal.reduce((prev, curr) => prev + curr);
    this.listValPercent = this.listVal.map((v) => this.percent(v, this.sum));

    this.$elm.lists.forEach((list, idx) => {
      list.style.width = `${this.listValPercent[idx]}%`;
    });

    this.$elm.actualSize.textContent = this.sum;

    this.$elm.box.style.width = `${this.percent(this.sum, this.limit)}%`;

    let _isOverflow = this.sum > this.limit;
    if (!this.isOverflow && _isOverflow) {
      this.isOverflow = _isOverflow;
      this.$elm.budget.classList.add('has-error');
    } else if (this.isOverflow && !_isOverflow) {
      this.isOverflow = _isOverflow;
      this.$elm.budget.classList.remove('has-error');
    }
  };

  this.init = () => {
    this.getLimit();
    this.getListVal();
    this.updateWidth();

    this.$elm.ul.addEventListener('input', (e) => {
      let _target = e.target;
      let _index = this.getIndex(_target.parentElement);
      let _value = _target.value;

      if (_value && _target.validity.valid) {
        this.listVal[_index] = _target.value * 1;
        this.updateWidth();
      }
    });

    this.$elm.maxSize.addEventListener('input', (e) => {
      this.$elm.maxSize.textContent = parseFloat(this.$elm.maxSize.textContent) || 0;
      this.getLimit();
      this.updateWidth();
    });
  };

  this.init();
};

document.querySelector('.btn').addEventListener('click', (e) => {
  e.preventDefault();
  let all = document.querySelectorAll('.b');
  let lastOne = all[all.length - 1];
  let newOne = lastOne.cloneNode(true);

  lastOne.parentNode.insertBefore(newOne, lastOne.nextSibling);

  new Budgets(newOne);
});

new Budgets(document.querySelector('.b'));
