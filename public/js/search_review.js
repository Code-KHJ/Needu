//Top5 섹션 기능구현
//클릭된 요소로 class 바꾸기
function select(i){
  const selected = document.querySelector('.select-detail');
  selected.classList.remove('select-detail');
  const select = document.querySelectorAll('.details>li').item(i);
  select.classList.add('select-detail');
  change_select(i)
  detail_ul.scrollTo({left: 0, behavior:"smooth"})
}

//항목 값 바꾸기
async function change_select(index){
  const select = document.querySelectorAll('.details>li').item(index);
  const value = select.querySelector('button').value;
  const res = await axios.get('review/detail',{params: { data: value }})
  const li = document.querySelectorAll('.detail-top5-item');
  for (var i = 0; i<5; i++){
    li.item(i).innerHTML = `
    <div class="detail-top5-no">${i+1}</div>
    <div class="detail-top5-content">
      <div class="detail-top5-corp">
        <p>${res.data[i].name}</p>
        <p>${res.data[i].sido} ${res.data[i].gugun}</p>
      </div>
      <div class="detail-top5-highlight">
        <p>${select.querySelector('button').innerText}</p>
        <div>
          <img src="/styles/images/Star_1.png">
          <span>${res.data[i].avg_career}</span>
        </div>
      </div>
      <ul class="detail-top5-details">
        <li>
          <p>커리어 향상</p>
          <div class="star_bg">
            <span style="width: ${res.data[i].avg_career*20}%"></span>
          </div>
        </li>
        <li>
          <p>업무와 삶의 균형</p>
          <div class="star_bg">
            <span style="width: ${res.data[i].avg_worklife*20}%"></span>
          </div>
        </li>
        <li>
          <p>복리후생</p>
          <div class="star_bg">
            <span style="width: ${res.data[i].avg_welfare*20}%"></span>
          </div>
        </li>
        <li>
          <p>조직 내 문화</p>
          <div class="star_bg">
            <span style="width: ${res.data[i].avg_culture*20}%"></span>
          </div>
        </li>
        <li>
          <p>리더십</p>
          <div class="star_bg">
            <span style="width: ${res.data[i].avg_leadership*20}%"></span>
          </div>
        </li>
      </ul>
    </div>
    `
    const li_none = li.item(i).querySelectorAll('.detail-top5-details>li').item(index);
    li_none.style="display:none;"
  }
}

const details = document.querySelectorAll('.details>li');
details.forEach((e,i)=>{
  e.addEventListener('click', ()=>select(i))
})

//좌우 슬라이드 기능구현
const btnBack = document.querySelector('.back');
const btnNext = document.querySelector('.next');
const detail_ul = document.querySelector('.detail-top5');
const item_width = document.querySelector('.detail-top5-item').clientWidth+40; //움직이는 크기

//좌우 버튼으로 구현
btnNext.addEventListener('click', ()=>{
  detail_ul.scrollBy({
    left: item_width,
    behavior: "smooth"
  })
})
btnBack.addEventListener('click', ()=>{
  detail_ul.scrollBy({
    left: -item_width,
    behavior: "smooth"
  })
})


//리뷰 데이터 swiper
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'vertical',
  loop: true,
  autoplay: true,
  delay: 3000,
  slidesPerView: 3,
  spaceBetween: 20,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

function submit(){
  const form = document.querySelector('.search');
  form.submit()
}