//필터링 세부 기능

//////sido 버튼 기능 구현//////
const sido = document.querySelector(".city-sido");
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
  let location = window.location.search;
  let queryString
  if(location.includes('page')){
    location = location.replace(/page=\d+/, "page=1");
  }
  if(location.includes('order')){
    queryString = location.split('&').map((s)=> s.includes('order') ? s = `order=${order.value}` : s).join('&');
  } else if (location == ''){
    queryString = location+`?order=${order.value}`;
  } else{
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

const pageCount = Math.ceil(totalCount/10) == 0 ? 1 : Math.ceil(totalCount/10);
const pages = document.querySelector('.pages');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let curruntPage = window.location.search.includes('page') ? new URLSearchParams(window.location.search).get('page') : 1; //현재 page

let maxPageCnt = 5; //페이지그룹 당 페이지 수
let pageActiveIdx = Math.ceil(curruntPage/maxPageCnt); //현재 페이지그룹 번호
let startIdx = ((pageActiveIdx-1)*maxPageCnt)+1;
let endIdx = pageActiveIdx*maxPageCnt;
//페이지 생성
for (let i=startIdx; i<=endIdx; i++){
  if(i<=pageCount){pages.innerHTML+=`<li value="${i}">${i}</li>`}
}
const pageNumber = pages.querySelectorAll('li');
function pagination_Load(){
  //prev, next 버튼
  if(pageActiveIdx == 1){
    prevBtn.style.display = 'none';
  }else{
    prevBtn.style.display = 'block';
  }
  if(pageActiveIdx == Math.ceil(pageCount/maxPageCnt)){
    nextBtn.style.display = 'none';
  }else{
    nextBtn.style.display = 'block';
  }
  //현재 페이지 클래스 추가
  pageNumber.forEach((nb)=>{
    console.log(nb.value)
    if(nb.value == curruntPage){
      nb.classList.add('page-active');
    }else{
      nb.classList.remove('page-active');
    }
  })
}
pagination_Load()

//페이지그룹 이동
nextBtn.addEventListener('click', ()=>{
  const lastNumber = pageNumber[pageNumber.length - 1].value;
  movePage(lastNumber + 1);
})
prevBtn.addEventListener('click', ()=>{
  const firstNumber = pageNumber[0].value;
  movePage(firstNumber - 1);
})

function movePage(toPage){
  const location = window.location.search;
  let queryString
  if(location.includes('page')){
    if(location.split('&')[0].includes('page')){
      queryString = location.split('&').map((p)=>p.includes('page') ? p = `?page=${toPage}` : p).join('&');
    }else{
      queryString = location.split('&').map((p)=>p.includes('page') ? p = `page=${toPage}` : p).join('&');
    }
  } else if(location == ''){
    queryString = location+`?page=${toPage}`;
  } else{
    queryString = location+`&page=${toPage}`;
  }
  window.location.href = `/review/search${queryString}`;
}


//페이지 이동
const page = document.querySelectorAll('.pages li');
page.forEach((e)=>{
  e.addEventListener('click', function(){
    const location = window.location.search;
    let queryString
    if(location.includes('page')){
      if(location.split('&')[0].includes('page')){
        queryString = location.split('&').map((p)=>p.includes('page') ? p = `?page=${this.value}` : p).join('&');
      }else{
        queryString = location.split('&').map((p)=>p.includes('page') ? p = `page=${this.value}` : p).join('&');
      }
    } else if(location == ''){
      queryString = location+`?page=${this.value}`;
    } else{
      queryString = location+`&page=${this.value}`;
    }
    window.location.href = `/review/search${queryString}`;
  })
});



