//헤더 웹 컴포넌트
class header_component extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback(){
    this.render();
  }
  render(){
    const name = this.dataset.name;
    this.innerHTML = `
    <div class="modal"></div>
    <header>
      <h1 class="blind"><a href="/">logo</a></h1>
      <div class="nav_wrap">
        <div class="btn_ham_gnb blind"> 메뉴버튼
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav>          
          <div class="gnb_wrap">
            <div class="gnb_search">
              <form>
                <label for="search" class="screen_out">검색</label>
                <input type="search" name="search" id="search" class="search_text" placeholder="검색어를 입력하세요">
                <label for="btn_search" class="screen_out">검색버튼</label>
                <input type="submit" id="btn_search" name="btn_search" value="검색" class="blind btn_search">
              </form>
            </div>
            <ul class="gnb">
              <li><a href="/review">기업리뷰</a></li>
              <li><a href="/search_write">리뷰작성</a></li>
            </ul>
          </div>
          <div class="usersign">
            ${name ? `
            <a href="#" class="nickname">${name}님</a>
            <a href="/logout" class="logout"><span >로그아웃</span></a>` : `
            <a href="/login" class="login">로그인</a>
            <a href="/signup" class="signup">회원가입</a>`
            }
          </div>
        </nav>
      </div>
    </header>
  `
  }
}
customElements.define('header-component', header_component)

//nav 모달 width에 따라 구현
const btn_ham_gnb = document.querySelector('.btn_ham_gnb');
const modal = document.querySelector('.modal');
const nav = document.querySelector('nav');
btn_ham_gnb.addEventListener('click', () => {
  if(modal.style.display == 'block'){
    modal.style.display = 'none'
    nav.style.display = 'none'
  }
  else{
    modal.style.display = 'block'
    nav.style.display = 'block'
  }
})
window.addEventListener('resize', () => {
  let winResize = window.innerWidth;
  if (winResize >= 768){
    modal.style.display = 'none'
    nav.style.display = 'none'
  }
})


//푸터 웹 컴포넌트
class footer_component extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback(){
    this.render();
  }
  render(){
    this.innerHTML = `
    <div class="footer_main">
      <div class="logo"></div>
      <a>이용약관</a>
      <a>개인정보 처리방침</a>
    </div>
    <div class="footer_data">
      <span>상호명: 00000</span>
      <span>사업자번호: 000-00-00000</span>
      <span>통신판매업: 00000</span>
      <span>대표자: 000</span>
      <span>이메일: 00000@000000.com</span>
      <span>주소: 서울시 00구 00로 00길 00-00</span>
    </div>
  `
  }
}
customElements.define('footer-component', footer_component)


//toTop 웹 컴포넌트
class toTop_component extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback(){
    this.render();
  }
  render(){
    this.innerHTML = `
    <button class="btn_toTop"></button>
  `
    this.onclick = function(){
      if(window.pageYOffset > 0){
        window.scrollTo({top:0, behavior: "smooth"});
      }    
    }
  }
}
customElements.define('totop-component', toTop_component)


//기관 등록 모달 컴포넌트
class register_component extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback(){
    this.render();
  }
  render(){
    this.innerHTML = `
    <div class="modal-box" style="display: none;">
      <div class="modal_addCorp">
        <div>기관 등록하기</div>
        <form id="frm_add_corp" method="post" action="/search_write/add">
          <div class="Corp_data">
            <div>
              <label for="modal_Corp_name">기관명</label>
              <input id="modal_Corp_name" type="text" placeholder="예) 행복사회복지사복지관" name="Corp_name" required>
            </div>
            <div>
              <label>소재지</label>
              <div>
                <select name="sido" id="sido1"></select>
                <select name="gugun" id="gugun1"></select>	
              </div>
            </div>
          </div>
          <div class="btn_modalSubmit">
            <button class="modal_cancel" type="button" onclick="modal_cancel();">취소</button>
            <button class="modal_submit" type="submit" form="frm_add_corp">등록</button>
          </div>	
        </form>
      </div>
    </div>
    `
  }
}
customElements.define('register-modal', register_component)