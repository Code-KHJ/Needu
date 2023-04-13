// 별접 입력 구현
const score_input = document.querySelectorAll('.star_bg input');
const star = document.querySelectorAll('.star_bg span');
const form = document.querySelector('.check_score')
const total = document.getElementById('total_score')
score_input.forEach((e,i) => e.addEventListener('input', () => {
  star[i+1].style.width = `${score_input[i].value * 10}%`;
}));
form.addEventListener('change', () => {
  let sum = 0;
  let avg = 0;
  for (let i = 0; i<5; i++ ){
    sum += Number(score_input[i].value)
  }
  total.style.width = `${(sum * 10)/5}%`
})