
// 별점 상세보기
const btn_star_open = document.querySelectorAll('.star_detail_open');
const star_detail = document.querySelectorAll('.star_detail')
btn_star_open.forEach((e, i) => e.addEventListener("click", () => starOpen(i)));
function starOpen(i){
  let item = star_detail.item(i);
  if(item.style.display == 'none'){
    item.style="display: "
  }
  else{
    item.style="display: none"
  }
}

//좋아요 버튼
async function likesClick(btn, i) {
  const likes_cnt = btn.querySelectorAll("span")[2];
  const currentColor = btn.style.backgroundColor;
  const review_num = i;
  console.log(review_num)
  if (currentColor === 'rgb(61, 71, 255)'){
    //db로 좋아요 취소 보내기
    const res = await axios.post(corp_name+"/likes", {
        name : corp_name, 
        num : review_num, 
        likes : -1})
    if (res.data == "권한없음"){
      alert('로그인이 필요한 서비스입니다.');
    }
    else{
      btn.style.backgroundColor = '';
      btn.style.color = '#333333';
      likes_cnt.innerHTML = "("+res.data+")"  
    }
  } else {
    //db로 좋아요 보내기
    const res = await axios.post(corp_name+"/likes", {
        name : corp_name, 
        num : review_num, 
        likes : 1
    })
    if(res.data == "권한없음"){
      alert('로그인이 필요한 서비스입니다.');
    }
    else{
      btn.style.backgroundColor = '#3D47FF';
      btn.style.color = '#ffffff';
      likes_cnt.innerHTML = "("+res.data+")"        
    }
  }
}
let likes_btn = document.querySelectorAll(".comment_like");
likes_btn.forEach((btn, i) => btn.addEventListener('click', ()=>likesClick(btn, i)))

//더보기 버튼
const more_btn_div = document.querySelector('#more')
const more_btn = document.querySelector('#more button')
more_btn.addEventListener('click', async()=>{
  await More_contents()
  if(page == 2){
    more_btn_div.style.display='none';
    const more_likes_btn = document.querySelectorAll(".comment_like");
    more_likes_btn.forEach((new_btn,i)=>{
      if(!new_btn.__click_event_registered__){
        new_btn.__click_event_registered__ = true;
        new_btn.addEventListener('click', ()=>likesClick(new_btn,i))
      }
    });
    likes_btn.forEach((oldBtn)=>{
      oldBtn.removeEventListener('click',likesClick);
      delete oldBtn.__click_event_registered__;
    });  
  }
})





//리뷰 무한스크롤
const url = new URL(location.href);
const corp_name = decodeURI(decodeURIComponent(url.pathname.split('/')[2])); // 한글 깨짐 디코딩
let isLoading = false;
let page = 1;
const contents = document.getElementById('content');
async function More_contents() {
  if (isLoading) return; //로딩 중이면 대기
  else {
    isLoading = true; //  로딩 중
    const res = await axios.get(corp_name+"/more", { 
      params: { name : corp_name, page : page },
      })
    const contentContainer = document.getElementById('content');
    if (res.data.auth == 1){
      if (res.content !== null) {
        res.data.content.forEach(review => {
          const content_elem = document.createElement('li')
          content_elem.classList.add('contents_review')
          content_elem.innerHTML = `
            <div class="review_star">
            <p>${review.total_score.toFixed(1)}</p>
            <div class="btn_star_detail">
              <div class="star_bg">
                <span style="width: ${review.total_score*20}%"></span>
              </div>
              <button class="star_detail_open"></button>
            </div>
            <div class="star_detail" style="display: none;">
              <div>
                <div class="star_bg">
                  <span style="width: ${review.career_score*20}%"></span>
                </div>
                <p>커리어 향상</p>
              </div>
              <div>
                <div class="star_bg">
                  <span style="width: ${review.worklife_score*20}%"></span>
                </div>
                <p>업무와 삶의 균형</p>
              </div>
              <div>
                <div class="star_bg">
                  <span style="width: ${review.welfare_score*20}%"></span>
                </div>
                <p>복리후생</p>
              </div>
              <div>
                <div class="star_bg">
                  <span style="width: ${review.culture_score*20}%"></span>
                </div>
                <p>조직 내 문화</p>
              </div>
              <div>
                <div class="star_bg">
                  <span style="width: ${review.leadership_score*20}%"></span>
                </div>
                <p>리더십</p>
              </div>
            </div>
          </div>
          <div class="review_comment">
            <div class="highlight">
              <p>${review.highlight}</p>
              <div>
                <span></span>
                <span>${review.last_date == '9999-12' ? '현직원' : '전직원'}</span>
                <span>${ review.nickname.slice(0,1) }${'*'.repeat(review.nickname.length - 1)}</span>
                <span>${review.type}</span>
                <span>${review.date}</span>
              </div>
            </div>
            <div class="pros_cons">
              <p>장점</p>
              <p>${review.pros}</p>
            </div>
            <div class="pros_cons">
              <p>단점</p>
              <p>${review.cons}</p>
            </div>
            <div class="comment_hashtag_wrap">
              <div class="hashtag_fade"></div>
              <div class="comment_hashtag">
                <span>#역에서 가까운</span>
                <span>#중식제공</span>
                <span>#유연근무제</span>
                <span>#휴가눈치안봄</span>
              </div>	
            </div>
            <button class="comment_like">
              <span></span>
              <span>도움이 돼요</span>
              <span>(${review.likes})</span>
            </button>
          </div>
          `
          contentContainer.appendChild(content_elem);
        });
        isLoading = false;
        page++;
      }
      else { console.log('test') }
    }
    if (res.data.auth == 0){
      isLoading = false;
      alert('더 많은 리뷰를 보시려면 먼저 리뷰를 1건 이상 작성해주세요.')
    }
    if (res.data.auth == 'none'){
      isLoading = false;
      alert('로그인 하신 후 이용할 수 있는 서비스입니다.')
      location.href = '/login';
    }
  }
}
window.addEventListener('scroll', async function(){
  if(more_btn_div.style.display=='none'){
    if(window.scrollY + window.innerHeight >= this.document.documentElement.scrollHeight) {
      await More_contents()
      const new_likes_btn = document.querySelectorAll(".comment_like");
      new_likes_btn.forEach((new_btn,i)=>{
        if(!new_btn.__click_event_registered__){
          new_btn.__click_event_registered__ = true;
          new_btn.addEventListener('click', ()=>likesClick(new_btn,i))
        }
      });
      likes_btn.forEach((oldBtn)=>{
        oldBtn.removeEventListener('click',likesClick);
        delete oldBtn.__click_event_registered__;
      })
    }
  }
});

