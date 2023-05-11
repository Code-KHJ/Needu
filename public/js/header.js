const header = document.getElementById('header_wrap');

class header_component extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback(){
    this.render();
  }
  render(){
    const name = this.dataset.name;
    console.log(name)
    header.innerHTML = `
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
              <li><a href="/review/연습용기관">기업리뷰</a></li>
              <li><a href="/review_write">리뷰작성</a></li>
            </ul>
          </div>
          <div class="usersign">
            ${name ? `
            <a href="#">${name}님</a>
            <a href="/logout">로그아웃</a>` : `
            <a href="/login">로그인</a>
            <a href="/signup">회원가입</a>`
            }
          </div>
        </nav>
      </div>
    </header>
  `
  }
}

customElements.define('header-component', header_component)


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