//필터링 세부 기능

//////sido 버튼 기능 구현//////
const sido = document.querySelector(".sido");
const sidoList = document.querySelector('.sido-list');
const sidoLi = sidoList.querySelectorAll('.sido-label>input');
const sidoSubmit = document.querySelector('.submit-sido');
const sidoReset = document.querySelector('.reset-sido');
const checkedList = document.querySelector('.checked-list');
let cityInput = document.querySelector('.city-input');

//리스트 노출
sido.addEventListener('click', ()=>{
  if(sidoList.style.display == 'none'){
    sidoList.style = "display: block";
  }else{
    sidoList.style = "display: none";
  }
})

//초기화
sidoReset.addEventListener('click', ()=>{
  sidoLi.forEach(checkbox => checkbox.checked = false);
  checkedList.innerHTML="";
  cityInput.value="";
})

//적용 버튼 구현
sidoSubmit.addEventListener('click', ()=>{
  let selected_city = [];
  checkedList.innerHTML="";
  sidoLi.forEach(checkbox => {
    if(checkbox.checked == true){
      const item = document.createElement('span')
      item.classList.add('sido-checked');
      item.innerHTML=`
        <span onclick="sido_cancle(this)">❌ </span><span>${checkbox.value}</span>
      `
      checkedList.append(item)
      selected_city.push(checkbox.value);
    }
  })
  cityInput.value = selected_city
  sidoList.style="display: none;"
})
//선택 취소하기
function sido_cancle(item){
  let name = item.parentElement.querySelector('span:nth-child(2)');
  item.parentElement.remove();
  sidoLi.forEach(checkbox =>{
    if(checkbox.value == name.innerHTML){
      checkbox.checked = false;
    }
  })
  cityInput.value = cityInput.value.split(',').filter(value => value !== name.innerHTML).join(',');
}

//외부 클릭시 닫기
document.addEventListener('click', (e)=>{
  if(sidoList.style.display == 'none'){
    return
  }else{
    if(!sidoList.parentElement.contains(e.target)){
      sidoList.style="display: none;"
    }
  }
})

//////별점 필터링//////
const scoreBtn = document.querySelectorAll('.btn-score');
let scoreInput = document.querySelector('.score-input');

scoreBtn.forEach((e)=>e.addEventListener('click', function(){
  if(this.classList.contains('score-active')){
    this.classList.remove('score-active');
    scoreInput.value = scoreInput.value.split(',').filter(value => value !== this.value).join(',');
  }else{
    this.classList.add('score-active');
    scoreInput.value = (scoreInput.value ? scoreInput.value + ',':'') + this.value;
    console.log(scoreInput.value.split(','))
  }
}))

//////키워드 필터링//////
const tagBtn = document.querySelectorAll('.tags>button');
let hashtagInput = document.querySelector('.hashtag-input');

tagBtn.forEach((e)=>e.addEventListener('click', function(){
  if(this.classList.contains('hashtag-active')){
    this.classList.remove('hashtag-active');
    hashtagInput.value = hashtagInput.value.split(',').filter(value => value !== this.value).join(',');
  }else{
    this.classList.add('hashtag-active');
    hashtagInput.value = (hashtagInput.value ? hashtagInput.value + ',':'') + this.value;
    console.log(hashtagInput.value.split(','))
  }
}))


//////전체 초기화 버튼//////
function resetAll(){
  sidoLi.forEach(checkbox => checkbox.checked = false);
  checkedList.innerHTML="";
  cityInput.value="";

  const score = document.querySelectorAll('.score-active');
  score.forEach(button => button.classList.remove('score-active'));
  scoreInput.value = '';

  const hashtag = document.querySelectorAll('.hashtag-active');
  hashtag.forEach(button => button.classList.remove('hashtag-active'));
  hashtagInput.value = '';

  const corpname = document.querySelector('.corpname-input');
  corpname.value = '';
}


//////필터 아이콘 클릭//////
function filter_active(){
  const filterSet = document.querySelector('.filter');
  const filterBtn = document.querySelector('.filter-black');
  const filterBtn_acitve = document.querySelector('.filter-blue');
  if(filterSet.style.display == 'flex'){
    filterSet.style.display = 'none';
    filterBtn.style.display = 'block';
    filterBtn_acitve.style.display = 'none';
  }else{
    filterSet.style.display = 'flex';
    filterBtn.style.display = 'none';
    filterBtn_acitve.style.display = 'block';
  }
}


//////정렬 기능 구현//////
const order = document.querySelector('select[name="order"]');
order.addEventListener('change', ()=>{
  const location = window.location.search;
  let queryString
  if(location.includes('order')){
    queryString = location.split('&').map((s)=> s.includes('order') ? s = `order=${order.value}` : s).join('&');
  }else{
    queryString = location+`&order=${order.value}`;
  }
  window.location.href = `/review/search${queryString}`;
})



//////페이지네이션 구현//////
//전체 데이터 수 쿠키에서 가져오기
const cookieData = document.cookie.split('; ')
  .find(row => row.startsWith('totalCount='))
  .split('=')[1];
const totalCount = JSON.parse(decodeURIComponent(cookieData).split('[')[1].split(']')[0]).cnt;
const corpPerPage = 10;
const pageCount = Math.ceil(totalCount/corpPerPage);
const pages = document.querySelector('.pages')
//페이지 생성
for (let i=1; i<=pageCount; i++){
  pages.innerHTML+=`<li value="${i}">${i}</li>`
}

//페이지 이동
const page = document.querySelectorAll('.pages li');
page.forEach((e)=>{
  e.addEventListener('click', function(){
    const location = window.location.search;
    let queryString
    if(location.includes('page')){
      queryString = location.split('&').map((p)=>p.includes('page') ? p = `page=${this.value}` : p).join('&');
    }else{
      queryString = location+`&page=${this.value}`;
    }
    window.location.href = `/review/search${queryString}`;
  })
});












// //////페이지네이션 구현//////
// const corpPerPage = 10;
// const corpLi = document.querySelectorAll('.corp-li');
// const corpCount = corpLi.length;
// const pageCount = Math.ceil(corpCount/corpPerPage);
// const numbers = document.querySelector('.pages');

// //페이지 생성
// for (let i=1; i<=pageCount; i++){
//   numbers.innerHTML+=`<li>${i}</li>`
// }

// //페이지 넘버 css, 이벤트 실행
// const numberBtn = numbers.querySelectorAll('li');
// numberBtn.forEach((item, index)=>{
//   item.addEventListener('click', (e)=>{
//     numberBtn.forEach(nb => nb.classList.remove('page-active'));
//     e.target.classList.add('page-active');
//     displayList(index);
//   })
// })

// //페이지 이동 이벤트
// function displayList(index){
//   let listArray = [...corpLi].slice((index-1)*10,index*10);
//   console.log(listArray);
// }