const searchFrm = document.getElementById("search_corp")
const searchInput = document.getElementById("search_input");
const corpList = document.querySelector(".auto_corp");
const corpAdd = document.querySelector(".register");
const btn = document.querySelector('#btnSubmit');
const actionDir = document.querySelector('.search') 


//검색 자동완성 기능
let corp = []
let corp_el = []
let nowIndex = -1;
searchFrm.addEventListener('keyup', async (e)=>{
  if (corp.length > 0){
    btn_reset()
    const results = load_data();  

    //css 조정
    corpList.style.display = '';
    corpAdd.style.display = '';

    //이전 li 삭제
    removeList()

    //li 추가
    if(searchInput.value.length !== 0){
      results.forEach((data) => {
        created_auto(data)
      })
      const corp_elem = document.querySelectorAll(".auto_corp li");
      corp_el = document.querySelectorAll(".auto_data");

      //마우스 클릭
      liClick(corp_elem)
      
      //키보드 네비게이션
      focusNav(e, corp_el)

      //마우스 hover
      mouseover(corp_el)

      //버튼 활성화, 경로 지정
      btn.disabled="";
      actionDir.action="/review_write/"+searchInput.value;  
    }
  } else{
    const res = await axios.get("search_write/all")
    corp = res.data.corp
  }
})


//자동완성 데이터 가져오기
function load_data(){
  //db 데이터 정리
  let value = searchInput.value.trim();
  const filterCorp = corp.filter(data => {
    const name = Hangul.disassemble(data.Corp_name).join('')
    const query = Hangul.disassemble(value).join('')
    return name.includes(query);
  }).map(data => {
    return {
      name: data.Corp_name,
      location: data.Corp_location}})
  //5개 이하로 갯수 보여주기
  const maxResults = 5;
  const resultsCount = Math.min(maxResults, filterCorp.length);
  return filterCorp.slice(0, resultsCount)
}

//자동완성 리스트 추가
function created_auto(data) {
  const corp_elem = document.createElement('li')
  const corp_btn = document.createElement('button');
  corp_btn.classList.add('auto_data');
  corp_btn.innerHTML = `
    <span>${data.name}</span>
    <span>|</span>
    <span>${data.location}</span>
  `
  corp_elem.appendChild(corp_btn);
  corpList.appendChild(corp_elem);
}

function liClick(corp_elem) {
  corp_elem.forEach((item,i)=> {
    item.addEventListener("click", (e)=>{ 
    e.preventDefault();
    input_data(item)
    })});  
}

//검색창에 입력
function input_data(target){
  const corp_selected = target.querySelector('button>span:nth-child(1)').textContent;
  searchInput.value = corp_selected;
  actionDir.action="/review_write/"+searchInput.value;
  removeList()
}

//초기화
function btn_reset(){
  if(btn.disabled == ""){
    btn.disabled="disabled";
    actionDir.action=""
  }
}
//리스트 삭제
function removeList(){
  while (corpList.firstChild){
    corpList.removeChild(corpList.firstChild)
  }
}

//자동완성 리스트 방향키 포커스 이동 구현
function focusNav(e, corp_el){
    const keyCode = e.keyCode;
    //방향키 위쪽 누를 때
    switch (keyCode) {
      // Up key
      case 38:
        console.log(corp_el)
        e.preventDefault()
        nowIndex = Math.max(nowIndex - 1, -1);
        updateFocus(corp_el)
        break;
      // Down key
      case 40:
        e.preventDefault()
        nowIndex = Math.min(nowIndex + 1, corp_el.length - 1);
        updateFocus(corp_el);
        break;
      // Enter key
      case 13:
        e.preventDefault();
        const corp_selected = corp_el.item(nowIndex).querySelector('span:nth-child(1)').textContent;
        searchInput.value = corp_selected;
        actionDir.action="/review_write/"+searchInput.value;
        removeList()
        break;
      // 그 외
      default:
        nowIndex = -1;
        break;
    }
  }

//자동완성 리스트 포커스 이동
function updateFocus(corp_el){
  if(nowIndex >= 0){
    Array.from(corp_el).map((item, index)=>{
      if(index == nowIndex){
        item.classList.add('active');
      }else{
        item.classList.remove('active')
      }
    })
  }else{
    searchInput.focus()
  }
;}

//마우스 hover
function mouseover (corp_el){
  corp_el.forEach((item, i)=> {  
    item.addEventListener('mouseenter', ()=>{
    nowIndex = i;
    corp_el.forEach((item)=>{
      item.classList.remove('active')
    })
    updateFocus(corp_el);
  })})  
}

//상하 스크롤 방지
searchFrm.addEventListener('keydown', (e)=>{
  const keyCode = e.keyCode;
  if (keyCode === 38 || keyCode === 40 || keyCode === 13){
    e.preventDefault();
  }
})

searchInput.addEventListener('keydown', (e)=>{
  const keyCode = e.keyCode;
  if (keyCode === 13){
    setTimeout(() => {
      btn.click();      
    }, 500);
}})
