////비밀번호 변경 모달
const changePwForm = document.querySelector('.change-pw');
const changePwFieldset = document.querySelector('.change-pw>fieldset');
const changePwSubmit = document.querySelector('.pw-submit');
const presentPassword = document.querySelector('.password');
const newPassword = document.querySelector('.new-password1');
const newPasswordCheck = document.querySelector('.new-password2');
const msgpw1 = document.querySelector('.msgpw1');
const msgpw2 = document.querySelector('.msgpw2');
let checkPw1 = false;
let checkPw2 = false;

function modal_show(){
  const modalBox = document.querySelector('.pw-modal-box');
  modalBox.style.display = 'block';
}

function modal_none(){
  const modalBox = document.querySelector('.pw-modal-box');
  const changePw = document.querySelector('.change-pw');
  changePw.reset();
  modalBox.style.display = 'none';
  newPassword.style.border = 'none';
  newPassword.style.boxShadow = '0px 0px 2px 0px #6269F5';
  msgpw1.style="display: none;"
  checkPw1 = false;
  newPasswordCheck.style.border = 'none';
  newPasswordCheck.style.boxShadow = '0px 0px 2px 0px #6269F5';
  msgpw2.style="display: none;"
  checkPw2 = false;
}

newPassword.addEventListener('input', ()=>{
  var regPw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,16}$/ //영어, 숫자만 가능한 정규식
  //비밀번호 글자 수 검사
  if(newPassword.value.length < 8){
    newPassword.style.border = '1px solid #dc3434';
    newPassword.style.boxShadow = 'none';
    msgpw1.style="display: "
    msgpw1.innerHTML="비밀번호는 8~16자리로 입력해주세요."
    checkPw1 = false;
  }
  //비밀번호 유효성 검사
  else if(!regPw.test(newPassword.value)){
    newPassword.style.border = '1px solid #dc3434';
    newPassword.style.boxShadow = 'none';
    msgpw1.style="display: "
    msgpw1.innerHTML="영문 대소문자, 숫자, 특수문자만 입력 가능하며 반드시 영문, 숫자 필요합니다."
    checkPw1 = false;
  }
  //통과
  else{
    newPassword.style.borderColor = '#2D65FE';
    msgpw1.style="display: none;"
    checkPw1 = true;
  }
});

newPasswordCheck.addEventListener('input', ()=>{
  //비밀번호 일치 여부 검사
  if(newPasswordCheck.value !== newPassword.value){
    newPasswordCheck.style.border = '1px solid #dc3434';
    newPasswordCheck.style.boxShadow = 'none';
    msgpw2.style="display: "
    msgpw2.innerHTML="비밀번호가 일치하지 않습니다."
    checkPw2 = false;
  } else{
    newPasswordCheck.style.borderColor = '#2D65FE'
    msgpw2.style="display: none;"
    checkPw2 = true;
  }
})

changePwFieldset.addEventListener('input', ()=>{
  if(presentPassword.value.length >= 8 && checkPw1==true && checkPw2==true){
    changePwSubmit.disabled = '';
  } else{
    changePwSubmit.disabled = 'disabled';
  }
})


////개인정보 수정
let nickResult = true;
let phoneResult = true;
let periodResult = true;

async function checkNick(){
  nickResult = false;
  const nicknamePresent = document.querySelector('.user-id>p:nth-child(1)');
  const nickname = document.getElementById('nickname');
  const msgnm = document.querySelector('.checkmsg-nick');
  const regnick = /^[A-Za-z가-힣0-9._-]{2,}$/
  if(nickname.value.length == 0){
    nickname.style.border = '1px solid #dc3434';
    nickname.style.boxShadow = 'none';
    msgnm.style="display: "
    msgnm.innerHTML="닉네임을 입력해주세요."
  } else{
    if(!regnick.test(nickname.value)){
      nickname.style.border = '1px solid #dc3434';
      nickname.style.boxShadow = 'none';
      msgnm.style="display: "
      msgnm.innerHTML="닉네임은 영어, 한글, 숫자로 만들어주세요."
    } else{
      //닉네임 중복체크
      try{
        const res = await axios.post("/signup/duplic", {
            check: "nickname",
            checkName: nickname.value
        })
        //통과
        if(res.data == 1){
          nickname.style.border = '1px solid #2D65FE';
          nickname.style.boxShadow = 'none';
          msgnm.style="display: none;"
          nickResult = true;
        } else{
          //이전 닉네임하고 변경 없을 때
          if (nickname.value == nicknamePresent.innerHTML){
            nickname.style.border = '1px solid #2D65FE';
            msgnm.style="display: none;"
            nickResult = true;
          } else{
            nickname.style.border = '1px solid #dc3434';
            msgnm.style="display: "
            msgnm.innerHTML="이미 존재하는 닉네임입니다."
          }
        }
      } catch(err){
        console.log(err);
      }
    }
  }
};

function checkPhone(){
  phoneResult = false;
  const phone = document.getElementById('phonenumber');
  const msgPn = document.querySelector('.checkmsg-phone');
  const regPn = /^(010)[0-9]{7,8}$/ //전화번호 정규식
  if(!regPn.test(phone.value)){
    phone.style.border = '1px solid #dc3434';
    phone.style.boxShadow = 'none';
    msgPn.style="display: "
    msgPn.innerHTML="휴대폰 번호를 바르게 입력해주세요."
  } else{ //통과
    phone.style.border = '1px solid #2D65FE';
    phone.style.boxShadow = 'none';
    msgPn.style="display: none;"
    phoneResult = true
  }
};

function checkPeriod(){
  periodResult = false;
  const period = document.querySelector('input[name="radio1"]:checked')
  if(period !== null){
    periodResult = true;
  }
};

function checkinfo(){
  checkPeriod()
  if(nickResult==true && phoneResult==true && periodResult==true){
    if(window.confirm('회원정보를 변경하시겠습니까?')){
      return true;
    }else{
      return false;
    }
  } else{
    alert('정보를 바르게 입력해주세요');
    return false;
  }
};
//프로필 이미지 변경
function changeUserImage(){
  alert('프로필 사진 변경 기능은 추구 개발될 예정입니다.')
};

////경력사항
//총경력
function careerCount(){
  const firstDate = [...(document.querySelectorAll('.first-date'))];
  const lastDate = [...(document.querySelectorAll('.last-date'))];
  let year = 0;
  let month = 0;
  let today = (new Date()).toISOString().slice(0,7);
  for (var i=0; i<firstDate.length; i++){
    if(lastDate[i].value.slice(0,4) !== '9999'){
      year = year + (lastDate[i].value.slice(0,4)-firstDate[i].value.slice(0,4))
      month = month + (lastDate[i].value.slice(5,7) - firstDate[i].value.slice(5,7))
    } else{
      year = year + (today.slice(0,4) - firstDate[i].value.slice(0,4))
      month = month + (today.slice(5,7) - firstDate[i].value.slice(5,7))
    }
  }
  year = year + Math.floor(month / 12);
  month = Math.abs(month % 12);
  
  const careerY = document.querySelectorAll('.career-year');
  const careerM = document.querySelectorAll('.career-month');
  careerY.forEach((element) => {
    element.innerHTML = year;
  })
  careerM.forEach((element) => {
    element.innerHTML = month;
  })  
}
careerCount();

//form 제출 오류 방지
function changeCareer(e, formId){
  e.preventDefault();
  const form = document.getElementById(formId);
  if(window.confirm('경력정보를 변경하시겠습니까?')){
    form.submit();
  }
}

//경력 삭제
function deleteCareer(careerNo){
  if(window.confirm("경력을 삭제하시겠습니까?")){
    let queryString = `?no=${careerNo}`;
    axios.delete(`/mypage/profile/career${queryString}`)
      .then(response => {
        if(response.status == 200){
          alert('경력정보가 삭제되었습니다.')
          location.reload();
        } else if(response.status == 401){
          alert('삭제 권한이 없습니다. 로그아웃 후 다시 로그인해주세요')
        }
        else{
          alert('경력정보를 삭제할 수 없습니다. 잠시 후 다시 시도해주세요.')
        }
      })
  }else{
    return false;
  }
}




////경력추가
function addCareer(e){
  e.preventDefault();
  const corpname = document.getElementById('add-corpname').value;
  axios.get("/mypage/check/corp", {
    params: { corp : corpname }
  })
  .then((res)=>{
    if(res.data.result == 0){
      alert('등록되지 않은 기관입니다. 기관이름을 확인해주세요');
      return false;
    }
    else if(res.data.result == 1){
      if(window.confirm("경력을 추가하시겠습니까?")){
        e.target.submit();
        return true;
      }else{
        return false;
      }
    }  
  })
}

//기관명 자동완성
const addCareerCorp = document.getElementById('add-corpname');
const corpUl = document.querySelector(".auto_corp");
const corpAdd = document.querySelector(".register");
const addCareerWrap = document.querySelector('.career-corplist');
let corp = [];
let corpList = [];
let corpbtnSubmit = [];
let nowIndex = -1;
addCareerCorp.addEventListener('keyup', async (e)=>{
  if(corp.length == 0){
    const res = await axios.get("/review/write/all")
    corp = res.data.corp
  }

  //이전 li 삭제
  removeList();

  const results = load_data();

  //css 조정
  corpUl.style.display = '';
  corpAdd.style.display = '';

  //li 추가
  if(addCareerCorp.value.length !== 0){
    results.forEach((data) => {
      created_auto(data)
    })
    //

    corpList = document.querySelectorAll(".auto_corp li");
    corpbtnSubmit = document.querySelectorAll(".auto_data");

    //키보드 네비게이션
    focusNav(e, corpList)

    //마우스 hover
    mouseover(corpList)

    //마우스 클릭
    liClick(corpList)
  }
  if(addCareerCorp.value.length == 0){
    corpUl.style = 'display: none';
    corpAdd.style ='display: none';
  }
})


//자동완성 데이터 가져오기
function load_data(){
  //db 데이터 정리
  let value = addCareerCorp.value.trim();
  let filterCorp = corp.filter(data => {
    const name = Hangul.disassemble(data.Corp_name).join('')
    const query = Hangul.disassemble(value).join('')
    return name.includes(query);
  }).map(data => {
    return {
      name: data.Corp_name,
      city: data.city,
      gugun: data.gugun}})
  //5개 이하로 갯수 보여주기
  const maxResults = 3;
  const resultsCount = Math.min(maxResults, filterCorp.length);
  return filterCorp.slice(0, resultsCount)
};

//리스트 삭제
function removeList(){
  while (corpUl.firstChild){
    corpUl.removeChild(corpUl.firstChild)
  }
};

//자동완성 리스트 추가
function created_auto(data) {
  const auto_corpList = document.createElement('li')
  const corp_btnSubmit = document.createElement('button');
  corp_btnSubmit.classList.add('auto_data');
  corp_btnSubmit.innerHTML = `
    <span>${data.name}</span>
  `
  auto_corpList.appendChild(corp_btnSubmit);
  corpUl.appendChild(auto_corpList);
};

//생성된 li 클릭
function liClick(corpList) {
  corpList.forEach((item,i)=> {
    item.addEventListener("click", (e)=>{ 
    e.preventDefault();
    input_data(item)
    })
  })
};

//검색창에 붙여넣기
function input_data(target){
  const corp_selected = target.querySelector('button>span:nth-child(1)').textContent;
  addCareerCorp.value = corp_selected;
  removeList()
  nowIndex = -1
  addCareerCorp.focus();
  corpUl.style.display='none';
  corpAdd.style.display='none';
};

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
};

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
    addCareerCorp.focus()
  }
};

//마우스 hover
function mouseover (corpList){
  corpList.forEach((item, i)=> {  
    item.addEventListener('mouseenter', ()=>{
    nowIndex = i;
    corpList.forEach((item)=>{
      item.classList.remove('active')
    })
    updateFocus(corpList);
    })
  })  
};

//상하 스크롤 방지
addCareerWrap.addEventListener('keydown', (e)=>{
  const keyCode = e.keyCode;
  if (keyCode === 38 || keyCode === 40 || keyCode === 13){
    e.preventDefault();
  }
});

//기관등록 모달
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
