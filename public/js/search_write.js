const searchFrm = document.getElementById("search_corp")
const searchInput = document.getElementById("search_input");
const corpUl = document.querySelector(".auto_corp");
const corpAdd = document.querySelector(".register");
const btn = document.querySelector('#btnSubmit');

let corp = []
let corpList = []
let corpBtn = []
let nowIndex = -1;

//검색 자동완성 기능
searchFrm.addEventListener('keyup', async (e)=>{
  if (corp.length > 0){
    btn_reset()

    //이전 li 삭제
    removeList()

    const results = load_data();  

    //css 조정
    corpUl.style.display = '';
    corpAdd.style.display = '';
    searchFrm.style.marginBottom = '150px';

    //li 추가
    if(searchInput.value.length !== 0){
      results.forEach((data) => {
        created_auto(data)
      })
      corpList = document.querySelectorAll(".auto_corp li");
      corpBtn = document.querySelectorAll(".auto_data");

      //키보드 네비게이션
      focusNav(e, corpList)

      //마우스 hover
      mouseover(corpList)

      //마우스 클릭
      liClick(corpList)
      
      //버튼 활성화, 경로 지정
      btn.disabled="";
      searchFrm.action="/review_write/"+searchInput.value;  
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
      sido: data.sido,
      gugun: data.gugun}})
  //5개 이하로 갯수 보여주기
  const maxResults = 5;
  const resultsCount = Math.min(maxResults, filterCorp.length);
  return filterCorp.slice(0, resultsCount)
}

//자동완성 리스트 추가
function created_auto(data) {
  const auto_corpList = document.createElement('li')
  const corp_btn = document.createElement('button');
  corp_btn.classList.add('auto_data');
  corp_btn.innerHTML = `
    <span>${data.name}</span>
    <span>|</span>
    <span>${data.sido+" "+data.gugun}</span>
  `
  auto_corpList.appendChild(corp_btn);
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
  searchFrm.action="/review_write/"+searchInput.value;
  removeList()
  nowIndex = -1
  searchInput.focus()
}

//초기화
function btn_reset(){
  if(btn.disabled == ""){
    btn.disabled="disabled";
    searchFrm.action=""
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
          nowIndex = Math.min(nowIndex + 1, corpBtn.length - 1);
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
searchFrm.addEventListener('keydown', (e)=>{
  const keyCode = e.keyCode;
  if (keyCode === 38 || keyCode === 40 || keyCode === 13){
    e.preventDefault();
  }
})

//submit btn 제출
searchInput.addEventListener('keydown', (e)=>{
  const keyCode = e.keyCode;
  if (keyCode === 13){
    if (nowIndex === -1){
      btn.click();
    }
}})

//모달 구현
const btn_addCorp = document.querySelector('.btn_addCorp');
const modal_box = document.querySelector('.modal-box');
btn_addCorp.addEventListener('click', ()=>{
  modal_box.style.display = 'block'
})
//모달 취소
function modal_cancel(){
  modal_box.style.display = 'none';
}




//시군구 다중셀렉트
$('document').ready(function() {
  var area0 = ["시/도 선택","서울특별시","인천광역시","대전광역시","광주광역시","대구광역시","울산광역시","부산광역시","경기도","강원도","충청북도","충청남도","전라북도","전라남도","경상북도","경상남도","제주도"];
  var area1 = ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"];
  var area2 = ["계양구","남구","남동구","동구","부평구","서구","연수구","중구","강화군","옹진군"];
  var area3 = ["대덕구","동구","서구","유성구","중구"];
  var area4 = ["광산구","남구","동구",     "북구","서구"];
  var area5 = ["남구","달서구","동구","북구","서구","수성구","중구","달성군"];
  var area6 = ["남구","동구","북구","중구","울주군"];
  var area7 = ["강서구","금정구","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구","기장군"];
  var area8 = ["고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시","가평군","양평군","여주군","연천군"];
  var area9 = ["강릉시","동해시","삼척시","속초시","원주시","춘천시","태백시","고성군","양구군","양양군","영월군","인제군","정선군","철원군","평창군","홍천군","화천군","횡성군"];
  var area10 = ["제천시","청주시","충주시","괴산군","단양군","보은군","영동군","옥천군","음성군","증평군","진천군","청원군"];
  var area11 = ["계룡시","공주시","논산시","보령시","서산시","아산시","천안시","금산군","당진군","부여군","서천군","연기군","예산군","청양군","태안군","홍성군"];
  var area12 = ["군산시","김제시","남원시","익산시","전주시","정읍시","고창군","무주군","부안군","순창군","완주군","임실군","장수군","진안군"];
  var area13 = ["광양시","나주시","목포시","순천시","여수시","강진군","고흥군","곡성군","구례군","담양군","무안군","보성군","신안군","영광군","영암군","완도군","장성군","장흥군","진도군","함평군","해남군","화순군"];
  var area14 = ["경산시","경주시","구미시","김천시","문경시","상주시","안동시","영주시","영천시","포항시","고령군","군위군","봉화군","성주군","영덕군","영양군","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군"];
  var area15 = ["거제시","김해시","마산시","밀양시","사천시","양산시","진주시","진해시","창원시","통영시","거창군","고성군","남해군","산청군","의령군","창녕군","하동군","함안군","함양군","합천군"];
  var area16 = ["서귀포시","제주시","남제주군","북제주군"];

   
  // 시/도 선택 박스 초기화
 
  $("select[name^=sido]").each(function() {
   $selsido = $(this);
   $.each(eval(area0), function() {
    $selsido.append("<option value='"+this+"'>"+this+"</option>");
   });
   $selsido.next().append("<option value=''>구/군 선택</option>");
  });
 
  
  // 시/도 선택시 구/군 설정
 
  $("select[name^=sido]").change(function() {
   var area = "area"+$("option",$(this)).index($("option:selected",$(this))); // 선택지역의 구군 Array
   var $gugun = $(this).next(); // 선택영역 군구 객체
   $("option",$gugun).remove(); // 구군 초기화
 
   if(area == "area0")
    $gugun.append("<option value=''>구/군 선택</option>");
   else {
    $.each(eval(area), function() {
     $gugun.append("<option value='"+this+"'>"+this+"</option>");
    });
   }
  }); 
 });