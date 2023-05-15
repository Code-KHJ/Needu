
const searchInput = document.getElementById("search_input");
const corpList = document.querySelector(".auto_corp");
const corpAdd = document.querySelector(".register");
const btn = document.querySelector('#btnSubmit');
const actionDir = document.querySelector('.search') 

//검색 자동완성 기능
let corp = []
searchInput.addEventListener('keyup', async ()=>{
  if (corp.length > 0){
    btn_reset()
    //자동완성 데이터 가져오기
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
    const results = filterCorp.slice(0, resultsCount)

    //css 조정
    corpList.style.display = '';
    corpAdd.style.display = '';

    //이전 li 삭제
    while (corpList.firstChild){
      corpList.removeChild(corpList.firstChild)
    }
    //li 추가
    if(searchInput.value.length !== 0){
      results.forEach((data) => {
        created_auto(data)
      })
      const corp_el = document.querySelectorAll(".auto_data");

      //li 클릭하면 input으로
      corp_el.forEach((data, i)=> data.addEventListener('click', ()=>input_data(data, i)))
    }
  } else{
    const res = await axios.get("search_write/all")
    corp = res.data.corp
  }
})

//자동완성 리스트 추가
function created_auto(data) {
  const corp_elem = document.createElement('li')
  corp_elem.classList.add('auto_data');
  corp_elem.innerHTML = `
    <span>${data.name}</span>
    <span>|</span>
    <span>${data.location}</span>
  `
  corpList.appendChild(corp_elem)
}

//리스트 중 선택하면 input에 입력
function input_data(data, i){
  const corp_selected = data.querySelector('span:nth-child(1)').textContent;
  searchInput.value = corp_selected;
  btn.disabled="";
  actionDir.action="/review_write/"+searchInput.value;
}

function btn_reset(){
  if(btn.disabled == ""){
    btn.disabled="disabled";
    actionDir.action=""
  }
}