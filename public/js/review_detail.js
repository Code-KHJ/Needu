// 별점 상세보기
function star_detailClick(element) {
  const liElement = element.closest('li');
  const star_detail = liElement.querySelector('.star_detail');
  console.log(star_detail);
  if (star_detail.style.display == 'none') {
    star_detail.style = 'display: ';
  } else {
    star_detail.style = 'display: none';
  }
}

//좋아요 버튼
async function likesClick(element) {
  const likes_cnt = element.querySelectorAll('span')[1];
  const like = likes_cnt.querySelector('span');
  const currentColor = element.style.backgroundColor;
  const liElement = element.closest('li');
  let i = Array.from(liElement.parentNode.children).indexOf(liElement);
  if (i > 0) {
    i = i - 1;
  }
  const review_num = i;
  if (currentColor === 'rgb(61, 71, 255)') {
    //db로 좋아요 취소 보내기
    const res = await axios.post(corp_name + '/likes', {
      name: corp_name,
      num: review_num,
      likes: -1,
    });
    if (res.data == '권한없음') {
      alert('로그인이 필요한 서비스입니다.');
    } else {
      element.style.backgroundColor = '';
      [...element.querySelectorAll('span')].map(
        (element) => (element.style.color = '#333333')
      );
      element.querySelector('img').src = '/styles/images/like.png';
      like.innerHTML = parseInt(like.innerHTML, 10) - 1;
    }
  } else {
    //db로 좋아요 보내기
    const res = await axios.post(corp_name + '/likes', {
      name: corp_name,
      num: review_num,
      likes: 1,
    });
    if (res.data == '권한없음') {
      alert('로그인이 필요한 서비스입니다.');
    } else {
      element.style.backgroundColor = '#3D47FF';
      [...element.querySelectorAll('span')].map(
        (element) => (element.style.color = '#ffffff')
      );
      like.innerHTML = parseInt(like.innerHTML, 10) + 1;
      element.querySelector('img').src = '/styles/images/like-white.png';
    }
  }
}

//더보기 버튼
const more_btn_div = document.querySelector('#more');
const more_btn = document.querySelector('#more button');
more_btn.addEventListener('click', async () => {
  await More_contents();
  if (page == 2) {
    more_btn_div.style.display = 'none';
  }
});

//리뷰 무한스크롤
const url = new URL(location.href);
const corp_name = decodeURI(decodeURIComponent(url.pathname.split('/')[3])); // 한글 깨짐 디코딩
let isLoading = false;
let page = 1;
const contents = document.getElementById('content');
async function More_contents() {
  if (isLoading) return; //로딩 중이면 대기
  else {
    isLoading = true; //  로딩 중
    const res = await axios.get(corp_name + '/more', {
      params: { name: corp_name, page: page },
    });
    const contentContainer = document.getElementById('content');
    if (res.data.auth >= 1) {
      if (res.content !== null) {
        res.data.content.forEach((review) => {
          const content_elem = document.createElement('li');
          content_elem.classList.add('contents_review');
          content_elem.innerHTML = `
            <div class="review_star">
            <p>${review.total_score}</p>
            <div class="btn_star_detail">
              <div class="star_bg">
                <span style="width: ${review.total_score * 20}%"></span>
              </div>
              <button type="button" class="star_detail_open" onclick="star_detailClick(this)"></button>
            </div>
            <div class="star_detail" style="display: none;">
              <div>
                <div class="star_bg">
                  <span style="width: ${review.growth_score * 20}%"></span>
                </div>
                <p>성장 가능성</p>
              </div>
              <div>
                <div class="star_bg">
                  <span style="width: ${review.leadership_score * 20}%"></span>
                </div>
                <p>리더십</p>
              </div>
              <div>
                <div class="star_bg">
                  <span style="width: ${review.reward_score * 20}%"></span>
                </div>
                <p>급여 및 복지</p>
              </div>
              <div>
                <div class="star_bg">
                  <span style="width: ${review.worth_score * 20}%"></span>
                </div>
                <p>일 가치감</p>
              </div>
              <div>
                <div class="star_bg">
                  <span style="width: ${review.culture_score * 20}%"></span>
                </div>
                <p>사내 문화</p>
              </div>
              <div>
              <div class="star_bg">
                <span style="width: ${review.worklife_score * 20}%"></span>
              </div>
              <p>워라밸</p>
            </div>
            </div>
          </div>
          <div class="review_comment">
            <div class="highlight">
              <p>${review.highlight}</p>
              <div>
                ${
                  review.last_date == '9999-12'
                    ? '<img class="work-status" src="/styles/images/ico_working.png"><span>현직원</span>'
                    : '<img class="work-status" src="/styles/images/ico_worked.png"><span>전직원</span>'
                }
                <span>${review.nickname.slice(0, 1)}${'*'.repeat(
            review.nickname.length - 1
          )}</span>
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
                <span>${
                  review.hashtag_1 !== null ? review.hashtag_1 : ''
                }</span>
                <span>${
                  review.hashtag_2 !== null ? review.hashtag_2 : ''
                }</span>
                <span>${
                  review.hashtag_3 !== null ? review.hashtag_3 : ''
                }</span>
                <span>${
                  review.hashtag_4 !== null ? review.hashtag_4 : ''
                }</span>
                <span>${
                  review.hashtag_5 !== null ? review.hashtag_5 : ''
                }</span>
                <span>${
                  review.hashtag_6 !== null ? review.hashtag_6 : ''
                }</span>
                <span>${
                  review.hashtag_7 !== null ? review.hashtag_7 : ''
                }</span>
                <span>${
                  review.hashtag_8 !== null ? review.hashtag_8 : ''
                }</span>
                <span>${
                  review.hashtag_9 !== null ? review.hashtag_9 : ''
                }</span>
                <span>${
                  review.hashtag_10 !== null ? review.hashtag_10 : ''
                }</span>
                <span>${
                  review.hashtag_11 !== null ? review.hashtag_11 : ''
                }</span>
                <span>${
                  review.hashtag_12 !== null ? review.hashtag_12 : ''
                }</span>
                <span>${
                  review.hashtag_13 !== null ? review.hashtag_13 : ''
                }</span>
                <span>${
                  review.hashtag_14 !== null ? review.hashtag_14 : ''
                }</span>
                <span>${
                  review.hashtag_15 !== null ? review.hashtag_15 : ''
                }</span>
                <span>${
                  review.hashtag_16 !== null ? review.hashtag_16 : ''
                }</span>
              </div>	
            </div>
            <button type="button" class="comment_like" onclick="likesClick(this)">
              <img src="/styles/images/like.png">
              <span>도움이 돼요</span>
              <span>(<span>${review.likes}</span>)</span>
            </button>
          </div>
          `;
          contentContainer.appendChild(content_elem);
        });
        isLoading = false;
        page++;
      } else {
        console.log('test');
      }
    }
    if (res.status == '204') {
      isLoading = false;
      alert('더 많은 리뷰를 보시려면 먼저 리뷰를 1건 이상 작성해주세요.');
    }
    if (res.data.auth == 'none') {
      isLoading = false;
      alert('로그인 하신 후 이용할 수 있는 서비스입니다.');
      location.href = '/login';
    }
  }
}

window.addEventListener('scroll', async function () {
  if (more_btn_div.style.display == 'none') {
    if (
      window.scrollY + window.innerHeight >=
      this.document.documentElement.scrollHeight
    ) {
      await More_contents();
    }
  }
});

////사이드바
//리뷰 데이터 swiper
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'vertical',
  loop: true,
  autoplay: true,
  delay: 3000,
  slidesPerView: 4,
  spaceBetween: 20,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
});
