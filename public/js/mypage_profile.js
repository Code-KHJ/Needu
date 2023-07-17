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
  modalBox.style.display = 'none';
  newPassword.style.border = 'none';
  msgpw1.style="display: none;"
  checkPw1 = false;
  newPasswordCheck.style.border = 'none';
  msgpw2.style="display: none;"
  checkPw2 = false;
}

newPassword.addEventListener('keyup', ()=>{
  var regPw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,16}$/ //영어, 숫자만 가능한 정규식
  //비밀번호 글자 수 검사
  if(newPassword.value.length < 8){
    newPassword.style.border = '1px solid #dc3434';
    msgpw1.style="display: "
    msgpw1.innerHTML="비밀번호는 8~16자리로 입력해주세요."
    checkPw1 = false;
  }
  //비밀번호 유효성 검사
  else if(!regPw.test(newPassword.value)){
    newPassword.style.border = '1px solid #dc3434';
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

newPasswordCheck.addEventListener('keyup', ()=>{
  //비밀번호 일치 여부 검사
  if(newPasswordCheck.value !== newPassword.value){
    newPasswordCheck.style.border = '1px solid #dc3434';
    msgpw2.style="display: "
    msgpw2.innerHTML="비밀번호가 일치하지 않습니다."
    checkPw2 = false;
  } else{
    newPasswordCheck.style.borderColor = '#2D65FE'
    msgpw2.style="display: none;"
    checkPw2 = true;
  }
})

changePwFieldset.addEventListener('keyup', ()=>{
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
    msgnm.style="display: "
    msgnm.innerHTML="닉네임을 입력해주세요."
  } else{
    if(!regnick.test(nickname.value)){
      nickname.style.border = '1px solid #dc3434';
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
    msgPn.style="display: "
    msgPn.innerHTML="휴대폰 번호를 바르게 입력해주세요."
  } else{ //통과
    phone.style.border = '1px solid #2D65FE';
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
  console.log(nickResult);
  if(nickResult==true && phoneResult==true && periodResult==true){
    window.confirm('회원정보를 변경하시겠습니까?');
    return true;
  } else{
    console.log('no')
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
      month = month + (lastDate[i].value(5,7) - firstDate[i].value.slice(5,7))
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
  console.log(i)
  const lastDate = document.querySelectorAll('.last-date');
  console.log(target.checked)
  console.log(lastDate[i])
  if(target.checked){
    console.log('che')
    lastDate[i].style.display = 'none';
    lastDate[i].value = '9999-12'
  } else{
    console.log('no')
    lastDate[i].style.display = '';
    lastDate[i].value = '2023-01'
  }
  console.log(lastDate[i].value)
}