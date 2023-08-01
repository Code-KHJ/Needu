
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
  const modalBox = document.querySelector('.modal-box');
  modalBox.style.display = 'block';
}

function modal_none(){
  const modalBox = document.querySelector('.modal-box');
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
}

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
}

function checkPeriod(){
  periodResult = false;
  const period = document.querySelector('input[name="radio1"]:checked')
  if(period !== null){
    periodResult = true;
  }
}

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
}


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
  month = month % 12;
  
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

//재직중 체크 해제
const workignBtn = document.querySelectorAll('.working');
workignBtn.forEach((e,i)=>{
  e.addEventListener('click', (e)=>{
    let target = e.target
    workingClick(target,i)
  })
})
function workingClick(target,i){
  const lastDate = document.querySelectorAll('.last-date');
  if(target.checked){
    lastDate[i].style.display = 'none';
    lastDate[i].value = '9999-12'
  } else{
    lastDate[i].style.display = '';
    lastDate[i].value = '2023-01'
  }
}

//경력정보 입퇴사일 최대기간 설정
const firstDate = document.querySelectorAll('.first-date');
const lastDate = document.querySelectorAll('.last-date');
const dateComponent = document.querySelectorAll('.first-date, .last-date, .first-date-add, .last-date-add')
Array.from(dateComponent).map((item)=> item !== "9999-12" ? item.max = (new Date()).toISOString().slice(0,7) : item.max = "9999-12")
firstDate.forEach((e, i) => {
  e.addEventListener('change', ()=>
  lastDate[i].min = firstDate[i].value
  )
})

//form 제출 오류 방지
function changeCareer(e, formId){
  e.preventDefault();
  const form = document.getElementById(formId);
  if(window.confirm('경력정보를 변경하시겠습니까?')){
    form.submit();
  }
}

//재직중 체크 해제(추가)
const workignBtn_add = document.querySelector('.working-add');
workignBtn_add.addEventListener('click', (e)=>{
  const target = e.target;
  const lastDate = document.querySelector('.last-date-add');
  if(target.checked){
    lastDate.style.display = 'none';
    lastDate.max = "9999-12"
    lastDate.value = '9999-12'
  } else{
    lastDate.style.display = '';
    lastDate.value = "reset";
  }
})

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