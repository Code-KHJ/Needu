document.addEventListener('click', (e) => {
  console.log('123');
  if (e.target.classList.contains('css-1qlbose')) {
    alert('good');
  } else {
    console.log('no');
  }
});

const timeSelect = document.querySelector('iframe');
console.log(timeSelect);

const submitButton = document.querySelector('.css-ichu9a');
let name;
let email;
let phone;

submitButton.addEventListener('submit', () => {
  name = document.querySelector('.css-11c69u6');
});

console.log(name);
console.log(submitButton);
