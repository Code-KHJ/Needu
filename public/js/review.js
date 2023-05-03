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


const content_item =  `
  <div class="review_star">
    <p>{{review.total_score.toFixed(1)}}</p>
    <div class="btn_star_detail">
      <div class="star_bg">
        <span style="width: {{review.total_score*20}}%"></span>
      </div>
      <button class="star_detail_open"></button>
    </div>
    <div class="star_detail" style="display: none;">
      <div>
        <div class="star_bg">
          <span style="width: {{review.career_score*20}}%"></span>
        </div>
        <p>커리어 향상</p>
      </div>
      <div>
        <div class="star_bg">
          <span style="width: {{review.worklife_score*20}}%"></span>
        </div>
        <p>업무와 삶의 균형</p>
      </div>
      <div>
        <div class="star_bg">
          <span style="width: {{review.welfare_score*20}}%"></span>
        </div>
        <p>복리후생</p>
      </div>
      <div>
        <div class="star_bg">
          <span style="width: {{review.culture_score*20}}%"></span>
        </div>
        <p>조직 내 문화</p>
      </div>
      <div>
        <div class="star_bg">
          <span style="width: {{review.leadership_score*20}}%"></span>
        </div>
        <p>리더십</p>
      </div>
    </div>
  </div>
  <div class="review_comment">
    <div class="highlight">
      <p>{{review.highlight}}</p>
      <div>
        <span></span>
        {% if review.last_date == '9999-12' %}
        <span>현직원</span>
        {% else %}
        <span>전직원</span>
        {% endif %}
        <span>{{ review.nickname.slice(0,1) }}{{'*'.repeat(review.nickname.length - 1)}}</span>
        <span>{{review.type}}</span>
        <span>{{review.date}}</span>
      </div>
    </div>
    <div class="pros_cons">
      <p>장점</p>
      <p>{{review.pros}}</p>
    </div>
    <div class="pros_cons">
      <p>단점</p>
      <p>{{review.cons}}</p>
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
      <span>({{review.likes}})</span>
    </button>
  </div>
  `

const url = new URL(location.href);
const corp_name = decodeURI(decodeURIComponent(url.pathname.split('/')[2])); // 한글 깨짐 디코딩
let isLoading = false;
let page = 1;
const contents = document.getElementById('content');

async function More_contents() {
  console.log(corp_name + page)

  if (isLoading) return; //로딩 중이면 대기
  else {
    isLoading = true; //  로딩 중
    const res = await axios.get(corp_name+"/more", { 
      params: { name : corp_name, page : page },
      })
    const contentContainer = document.getElementById('content');
    if (res.content !== null) {
      res.data.content.forEach(review => {
        console.log(review)
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
      console.log('complete'+page)
    }
    else { console.log('test') }
  }
}

window.addEventListener('scroll', async function(){
  if(window.scrollY + window.innerHeight >= this.document.documentElement.scrollHeight) {
    await More_contents()
  }
});


