//헤더 웹 컴포넌트
class header_component extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }

  render() {
    const name = this.dataset.name;
    this.innerHTML = `
    <div class="modal"></div>
    <header>
      <h1 class="blind"><a href="/">logo</a></h1>
      <div class="nav_wrap">
        <div class="btn_ham_gnb blind">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav>          
          <div class="gnb_wrap">
            <div class="gnb_search" style=display:none>
              <form>
                <label for="search" class="screen_out">검색</label>
                <input type="search" name="search" id="search" class="search_text" placeholder="검색어를 입력하세요">
                <label for="btn_search" class="screen_out">검색버튼</label>
                <input type="submit" id="btn_search" name="btn_search" value="검색" class="blind btn_search">
              </form>
            </div>
            <ul class="gnb">
              <li><a href="/review/search">기관리뷰</a></li>
              <li><a href="/review/write">리뷰작성</a></li>
              <li class="beta" style=display:none>
                <a href="https://needu.oopy.io">니쥬챗</a>
                <img src="./styles/images/ico_beta.png">
              </li>
              <li><a href="https://neighborly-arithmetic-8e6.notion.site/NeedU-2323fd6cf25042c28a5b9fb0029d67ce?pvs=4" target="_blank">NEEDU소개</a></li>
            </ul>
          </div>
          <div class="usersign">
            ${
              name
                ? `
            <a href="/mypage/profile" class="nickname">${name}님</a>
            <a href="/logout" class="logout"><span >로그아웃</span></a>`
                : `
            <a href="/login" class="login">로그인</a>
            <a href="/signup" class="signup">회원가입</a>`
            }
          </div>
        </nav>
      </div>
    </header>
  `;
  }
}
customElements.define('header-component', header_component);

//nav 모달 width에 따라 구현
const btn_ham_gnb = document.querySelector('.btn_ham_gnb');
const modal = document.querySelector('.modal');
const nav = document.querySelector('nav');
btn_ham_gnb.addEventListener('click', () => {
  if (modal.style.display == 'block') {
    modal.style.display = 'none';
    nav.style.display = 'none';
  } else {
    modal.style.display = 'block';
    nav.style.display = 'block';
  }
});
window.addEventListener('resize', () => {
  let winResize = window.innerWidth;
  if (winResize >= 768) {
    modal.style.display = 'none';
    nav.style.display = 'none';
  }
});

//푸터 웹 컴포넌트
class footer_component extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <div class="footer_wrap">
      <div class="footer_main">
        <div>
          <a href='https://neighborly-arithmetic-8e6.notion.site/NEEDU-2023-08-06-850d2be0329c403daf4377ade286c4a1?pvs=25' target="_blank">이용약관</a>
          <a href="https://neighborly-arithmetic-8e6.notion.site/d262bf0970b143fa97cfb93552a1b33f" target="_blank">개인정보처리방침</a>
          <a href="https://neighborly-arithmetic-8e6.notion.site/NEEDU-d7cb722b6a6247d38594aff27c31c036?pvs=4" target="_blank">커뮤니티 운영가이드</a>
        </div>
      </div>
      <div>
        <div class="footer_ico">
          <div class="footer_logo"></div>
          <div class="ico_sns">
            <a href="https://www.facebook.com/people/%EC%82%AC%ED%9A%8C%EB%B3%B5%EC%A7%80-%EA%B8%B0%EA%B4%80%EB%A6%AC%EB%B7%B0-%ED%94%8C%EB%9E%AB%ED%8F%BC-NEEDU/61550193057323/" target="_blank">
              <img src="../styles/images/ico_facebook.svg">
            </a>
            <a href="https://www.instagram.com/needu.sw/" target="_blank">
              <img src="../styles/images/ico_instagram.svg">
            </a>
            <a href="http://pf.kakao.com/_CsYKG" target="_blank">
              <img src="../styles/images/ico_kakao.svg">
            </a>
          </div>
        </div>
        <div class="footer_contact">
          <span>NEEDU</span>
          <span>대표 김현준</span>
          <span>사업자 등록번호 197-07-02539</span>
          <span class="contact_email"><img src="../styles/images/ico_email.svg">needu.sw@gmail.com</span>
          <span class="contact_phone"><img src="../styles/images/ico_phone.svg">070-7954-4468</span>
        </div>
      </div>
    </div>
  `;
  }
}
customElements.define('footer-component', footer_component);

//toTop 웹 컴포넌트
class toTop_component extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <button class="btn_toTop"></button>
  `;
    this.onclick = function () {
      if (window.pageYOffset > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
  }
}
customElements.define('totop-component', toTop_component);

//기관 등록 모달 컴포넌트
class register_component extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <div id="register-modal" class="modal-box" style="display: none;">
      <div class="modal-wrap">
        <div>기관 등록하기
          <button class="modal_cancel" type="reset" onclick="modal_cancel(this);">
            <img src="../styles/images/cancel.png", alt="닫기">
          </button>
        </div>
        <form id="frm_add_corp" method="post" action="/review/write/add">
          <div class="Corp_data">
            <div>
              <label for="modal_Corp_name">기관명</label>
              <input id="modal_Corp_name" type="text" placeholder="예) 행복사회복지사복지관" name="Corp_name" required>
            </div>
            <div>
              <label>소재지</label>
              <div>
                <select name="city" id="sido1" required></select>
                <select name="gugun" id="gugun1" required></select>	
              </div>
            </div>
          </div>
          <div class="btn_modalSubmit">
            <button class="modal_submit" type="submit" form="frm_add_corp">등록</button>
          </div>	
        </form>
      </div>
    </div>
    `;
  }
}
customElements.define('register-modal', register_component);

//기관 등록 모달 컴포넌트
class login_component extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <div id="login-modal" class="modal-box" style="display: none;">
      <div class="modal-wrap" style="max-width: 400px">
        <div>로그인
          <button class="modal_cancel" type="reset" onclick="modal_cancel(this);">
            <img src="../styles/images/cancel.png", alt="닫기">
          </button>
        </div>
        <div class="modal-content">
          지금 가입하면</br>더 많은 리뷰를 볼 수 있어요!
        </div>
        <div class="modal-btn-wrap">
          <button type="button" onclick="location.href = '/signup'">회원가입</button>
          <button type="button" onclick="location.href = '/login'">로그인</button>
        </div>
      </div>
    </div>
    `;
  }
}
customElements.define('login-modal', login_component);
