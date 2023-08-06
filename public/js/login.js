//개인 로그인 버튼 활성화
const formsbm_user = document.getElementById("form_user");
const btnsbm_user = document.getElementById("submit_user");
formsbm_user.addEventListener('keydown', ()=>{
  const check_user = Array.from(formsbm_user.elements)
  .filter(input => input.hasAttribute('required'))
  .every(input => input.value.trim() !== '');
  if(check_user){
    btnsbm_user.disabled="";
  } else{
    btnsbm_user.disabled="disabled";
  }}    
)

//로그인 검사
async function chehcklogin(event){
  event.preventDefault();
  const checkId = document.getElementById("userid");
  const checkPw = document.getElementById("userpw");
  const checkform = document.getElementById("form_user");
  try{
    await axios.post("/checklogin",{
      id: checkId.value,
      pw: checkPw.value
    })
    .then((res)=>{
    if(res.data == 1){
      checkform.submit();
    } else if (res.data == 2){
      alert("아이디 혹은 비밀번호가 일치하지 않습니다.");
      checkform.reset();
      return false
    } else{
      alert("아이디가 존재하지 않습니다.");
      checkform.reset();
      return false
    }}
  )} catch(err){
    console.log(err);
  }
}

////아이디, 비밀번호 찾기
function modalShow(item){
  let modalBox = document.getElementById(item);
  modalBox.style.display = 'block';

}
function modal_cancel(item){
  let modalBox = document.getElementById(item);
  let modalItem = modalBox.querySelectorAll('input');
  let modalMsg = modalBox.querySelectorAll('.checkmsg');
   modalBox.querySelector('form').reset()

  modalBox.style.display = 'none';
  [...modalItem].map(element=>element.value = '');
  [...modalMsg].map(element=>element.value='');
  [...modalMsg].map(element=>element.style.display='none');
 
  if(item == 'search-id-modal'){
    let resultId = modalBox.querySelector('.searched-id');
    while(resultId.firstChild){
      resultId.removeChild(resultId.firstChild);
    }  
  }
}

//id 찾기 api
async function searchId(){
  const phonenumber = document.getElementById('phonenumber');
  const idList = document.querySelector('.searched-id');
  let res = await axios.post("/login/find/id", {phonenumber: phonenumber.value});
  if(res.data.status == 400){
    return alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
  }
  if(res.data.length == 0){
    alert('일치하는 정보가 없습니다. 입력하신 번호를 확인해주세요.')
  } else{
    idList.style.display = 'block';
    for(i=0; i<res.data.length; i++){
      const idData =  document.createElement('p');
      idData.classList.add('return-userid');
      idData.innerText = `${res.data[i].id}`
      idList.appendChild(idData);
    }
  }
}

//pw 찾기 api
let authCode;
let userIdCheck;
async function searchPw(){
  const userId = document.getElementById('user-id');
  const regid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // 이메일 형식 정규식

  	//아이디 정규식 검사
	if(!regid.test(userId.value)){
		userId.style.borderColor = '#FF4444';
		alert("이메일을 바르게 입력해주세요.")
		return false;
	} else{
		//아이디 중복체크
		try{
			const res = await axios.post("signup/duplic", {
				check: "id",
				checkId: userId.value
			})
      console.log(res.data)
			if(res.data == 1){
        userId.style.borderColor = '#FF4444';
        alert("존재하지 않는 아이디입니다. 아이디를 확인해주세요.")
        return false;
      } else{
        userId.style.borderColor = '#6269F5';
        let res = await axios.post('/login/find/pw', {mail: userId.value});
        if(res.status == 200){
          authCode = res.data.authCode;
          console.log(authCode)
          userIdCheck = userId.value;
          alert("인증번호가 발송되었습니다. 메일을 확인해주세요.");
        }    
      }
    } catch(err){
      return false;
    }
	}
}

function checkAuth(){

  const authInput = document.querySelector('.checkCode').value;
  if(authInput !== authCode){
    alert('인증번호가 일치하지 않습니다. 재발송이 필요하시면 요청 버튼을 클릭해주세요.');
  } else{
    alert('인증번호가 확인되었습니다. 비밀번호를 재설정해주세요.');
    const searchPw = document.getElementById('search-pw-modal');
    searchPw.style.display='none';
    searchPw.querySelector('form').reset();

    modalShow('reset-pw-modal');
    const resetId = document.getElementById('reset-id');
    resetId.value = userIdCheck;
  }
}


//비밀번호 검사
function checkPw1(){
	const password1 = document.getElementById('password1');
	const msgpw1 = document.getElementById('checkpw1msg');
	var regPw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,16}$/ //영어, 숫자만 가능한 정규식
	//비밀번호 글자 수 검사
	if(password1.value.length < 8){
		password1.style.backgroundColor = '#FFFFFF';
		password1.style.borderColor = '#FF4444';
		msgpw1.style="display: "
		msgpw1.innerHTML="비밀번호는 8~16자리로 입력해주세요."
	} else{
		//비밀번호 유효성 검사
		if(!regPw.test(password1.value)){
			password1.style.backgroundColor = '#FFFFFF';
			password1.style.borderColor = '#FF4444';
			msgpw1.style="display: "
			msgpw1.innerHTML="영문 대소문자, 숫자, 특수문자만 입력 가능하며 반드시 영문, 숫자 필요합니다."
			// password1.value = "";
				return false;
		} else{
			//통과
			password1.style.backgroundColor = '#FFFFFF';
			password1.style.borderColor = '#6269F5';
			msgpw1.style="display: none;"
			return true;
		}
  }
}
function checkPw2(){
	const password1 = document.getElementById('password1');
	const password2 = document.getElementById('password2');
	const msgpw2 = document.getElementById('checkpw2msg');
  const submitBtn = document.getElementById('reset-pw-btn');
	if(password2.value !== password1.value){
		//비밀번호 일치 확인
		password2.style.backgroundColor = '#FFFFFF';
		password2.style.borderColor = '#FF4444';
		msgpw2.style="display: "
		msgpw2.innerHTML="비밀번호가 일치하지 않습니다."
	} else{
		//통과
		password2.style.backgroundColor = '#FFFFFF';
		password2.style.borderColor = '#6269F5';
		msgpw2.style="display: none;"
    submitBtn.disabled=''
		return true;
	}
}