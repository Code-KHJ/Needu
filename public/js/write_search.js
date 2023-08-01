//검색 자동완성
const searchForm = document.querySelector(".search");
const searchInput = document.getElementById("search_input");
const corpUl = document.querySelector(".auto_corp");
const corpAdd = document.querySelector(".register");
const btnSubmit = document.querySelector('#btnSubmit');

let corp = []
let corpList = []
let corpbtnSubmit = []
let nowIndex = -1;

//검색 자동완성 기능
searchForm.addEventListener('keyup', async (e)=>{
  if(corp.length == 0){
    const res = await axios.get("/review/write/all")
    corp = res.data.corp
  }
  btnSubmit_reset()

  //이전 li 삭제
  removeList()

  const results = load_data();

  //css 조정
  corpUl.style.display = '';
  corpAdd.style.display = '';

  //li 추가
  if(searchInput.value.length !== 0){
    results.forEach((data) => {
      created_auto(data)
    })
    corpList = document.querySelectorAll(".auto_corp li");
    corpbtnSubmit = document.querySelectorAll(".auto_data");

    //키보드 네비게이션
    focusNav(e, corpList)

    //마우스 hover
    mouseover(corpList)

    //마우스 클릭
    liClick(corpList)
    
    //버튼 활성화, 경로 지정
    btnSubmit.disabled="";
    searchForm.action="/review/write/corp/"+searchInput.value;
  }
})

//자동완성 데이터 가져오기
function load_data(){
  //db 데이터 정리
  let value = searchInput.value.trim();
  let filterCorp = corp.filter(data => {
    const name = Hangul.disassemble(data.Corp_name).join('')
    const query = Hangul.disassemble(value).join('')
    return name.includes(query);
  }).map(data => {
    return {
      name: data.Corp_name,
      city: data.city,
      gugun: data.gugun}})
  //시도 있는 경우 필터링
  // const city = document.querySelector("#city1").value;
  // if(city !== "시/도"){
  //   filterCorp = filterCorp.filter(data => {
  //     return data.city.includes(city)
  //   })
  // }
  //5개 이하로 갯수 보여주기
  const maxResults = 5;
  const resultsCount = Math.min(maxResults, filterCorp.length);
  return filterCorp.slice(0, resultsCount)
}

//자동완성 리스트 추가
function created_auto(data) {
  const auto_corpList = document.createElement('li')
  const corp_btnSubmit = document.createElement('button');
  const city = document.querySelector('.search #city1');
  corp_btnSubmit.classList.add('auto_data');
  if(city !== null){
    corp_btnSubmit.innerHTML = `
      <span>${data.name}</span>
    `
  }else{
    corp_btnSubmit.innerHTML = `
      <span>${data.name}</span>
      <span>|</span>
      <span>${data.city+" "+data.gugun}</span>
    `
    corp_btnSubmit.setAttribute("onclick", `location.href='/review/write/corp/${data.name}'`);
  }
  auto_corpList.appendChild(corp_btnSubmit);
  corpUl.appendChild(auto_corpList);
}

//생성된 li 클릭
function liClick(corpList) {
  corpList.forEach((item,i)=> {
    item.addEventListener("click", (e)=>{ 
    e.preventDefault();
    input_data(item)
    })});
}

//검색창에 붙여넣기
function input_data(target){
  const corp_selected = target.querySelector('button>span:nth-child(1)').textContent;
  searchInput.value = corp_selected;
  searchForm.action="/review/write/corp/"+searchInput.value;
  removeList()
  nowIndex = -1
  searchInput.focus()
}

//초기화
function btnSubmit_reset(){
  if(btnSubmit.disabled == ""){
    btnSubmit.disabled="disabled";
    searchForm.action=""
  }
}

//리스트 삭제
function removeList(){
  while (corpUl.firstChild){
    corpUl.removeChild(corpUl.firstChild)
  }
}

//자동완성 리스트 방향키 포커스 이동 구현
function focusNav(e, corpList){
    const keyCode = e.keyCode;
    if(e.isComposing === false){
      //방향키 위쪽 누를 때
      switch (keyCode) {
        // Up key
        case 38:
          nowIndex = Math.max(nowIndex - 1, -1);
          updateFocus(corpList)
          break;
        // Down key
        case 40:
          nowIndex = Math.min(nowIndex + 1, corpbtnSubmit.length - 1);
          updateFocus(corpList);
          break;
        // Enter key
        case 13:
          if(nowIndex !== -1){
            Array.from(corpList).map((item, index)=>{
              if(index == nowIndex){
                input_data(item)
                nowIndex = -1;
              }
            })
            break
          }
        // 그 외
        default:
          nowIndex = -1;
          break;
      }
    }
  }

//자동완성 리스트 포커스 이동
function updateFocus(corpList){
  if(nowIndex >= 0){
    Array.from(corpList).map((item, index)=>{
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
function mouseover (corpList){
  corpList.forEach((item, i)=> {  
    item.addEventListener('mouseenter', ()=>{
    nowIndex = i;
    corpList.forEach((item)=>{
      item.classList.remove('active')
    })
    updateFocus(corpList);
  })})  
}

//상하 스크롤 방지
searchForm.addEventListener('keydown', (e)=>{
  const keyCode = e.keyCode;
  if (keyCode === 38 || keyCode === 40 || keyCode === 13){
    e.preventDefault();
  }
})

//submit btnSubmit 제출
searchInput.addEventListener('keydown', (e)=>{
  const keyCode = e.keyCode;
  if (keyCode === 13){
    if (nowIndex === -1){
      btnSubmit.click();
    }
}})

//모달 구현
const btn_addCorp = document.querySelector('.btn_addCorp');
const modal_box = document.querySelector('.modal-box');
if(btn_addCorp !== null){
  btn_addCorp.addEventListener('click', ()=>{
    modal_box.style.display = 'block'
  })
  //모달 취소
  function modal_cancel(){
    modal_box.style.display = 'none';
  }  
}