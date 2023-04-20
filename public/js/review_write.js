// 별접 입력 구현
const score_input = document.querySelectorAll('.star_bg input');
const star = document.querySelectorAll('.star_bg span');
const check_score = document.querySelector('.check_score')
const total_score = document.getElementById('total_score')
score_input.forEach((e,i) => e.addEventListener('input', () => {
  star[i+1].style.width = `${score_input[i].value * 10}%`;
}));
check_score.addEventListener('change', () => {
  let sum = 0;
  let avg = 0;
  for (let i = 0; i<5; i++ ){
    sum += Number(score_input[i].value)
  }
  total_score.style.width = `${(sum * 10)/5}%`
})

//해시태그 체크
function hashClick() {
  const currentColor = this.style.backgroundColor;
  if (currentColor === 'rgb(61, 71, 255)'){
    this.style.backgroundColor = '';
    this.style.color = '#333333';
  } else {
    this.style.backgroundColor = '#3D47FF';
    this.style.color = '#ffffff';
  }
}
const hashtag = document.querySelectorAll('.hashtag span');
hashtag.forEach((e) => e.addEventListener('click', hashClick))


//한줄평 작성 확인
function checkHigh() {
  const highlight = document.getElementById('highlight')
  if(highlight.value.length>0){
    highlight.style.borderColor = '#2D65FE';
    return true
  } else{
    highlight.style.borderColor = '#dc3434';
    return false
  }
}

//장점 작성 확인 및 글자수 체크
function checkPros() {
  const pros = document.getElementById('pros')
  const pros_cnt = document.getElementById('pros_cnt');
  pros_cnt.innerHTML=`현재 글자수: ${pros.value.length}자`
  if(pros.value.length>10){
    pros.style.borderColor = '#2D65FE';
    pros_cnt.style.color = '#aaaaaa';
    return true
  } else{
    pros.style.borderColor = '#dc3434';
    pros_cnt.style.color = '#dc3434';
    return false
  }
}

//단점 작성 확인 및 글자수 체크
function checkCons() {
  const cons = document.getElementById('cons');
  const cons_cnt = document.getElementById('cons_cnt');
  cons_cnt.innerHTML=`현재 글자수: ${cons.value.length}자`
  if(cons.value.length>10){
    cons.style.borderColor = '#2D65FE';
    cons_cnt.style.color = '#aaaaaa';
    return true
  } else{
    cons.style.borderColor = '#dc3434';
    cons_cnt.style.color = '#dc3434';
    return false
  }
}

//폼입력 여부 체크 후 버튼 활성화
const form = document.querySelector('form');
const btnSubmit = document.querySelector('#btnSubmit');

form.addEventListener('change', ()=>{
  const score_array = Array.prototype.slice.call(score_input).every(input => input.value > 0);
  const check_highlight = document.getElementById('highlight').value.length > 0;
  const check_pros = document.getElementById('pros').value.length > 10;
  const check_cons = document.getElementById('cons').value.length > 10;
  const checkAll = [score_array, check_highlight, check_pros, check_cons];
  if(checkAll.every((ck) => ck==true)){
    btnSubmit.disabled="";
    btnSubmit.style.backgroundColor = '#2D65FE';
    btnSubmit.style.borderColor = "#2D65FE";
    btnSubmit.style.color = "#EAEDF4";    
  } else{
    btnSubmit.disabled="disabled";
    btnSubmit.style.backgroundColor = 'rgba(51, 51, 51, 0.5)';
    btnSubmit.style.borderColor = 'rgba(51, 51, 51, 0.5)';
  }
})

