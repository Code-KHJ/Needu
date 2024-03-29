let checkResultId = false;
//id 중복 검사
async function checkId(){
	const userid = document.getElementById('id');
	const msgid = document.getElementById('checkidmsg');
	const regid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // 이메일 형식 정규식

	//아이디 정규식 검사
	if(!regid.test(userid.value)){
		userid.style.backgroundColor = '#FFFFFF';
		userid.style.borderColor = '#FF4444';
		msgid.style="display: "
		msgid.innerHTML="이메일을 바르게 입력해주세요."
		// userid.value = "";
		return false;
	} else{
		//아이디 중복체크
		try{
			const res = await axios.post("signup/duplic", {
				check: "id",
				checkId: userid.value
			})
			if(res.data == 1){
				userid.style.borderColor = '#6269F5';
				msgid.style="display: none;"
				return true;
			} else{
				userid.style.borderColor = '#FF4444';
				msgid.style="display: "
				msgid.innerHTML="이미 존재하는 아이디입니다."
				return false;
			}
		} catch(err){
			return false;
		}
	}
}

//이메일 인증
const inputEmail = document.getElementById('id');
const reqBtn = document.querySelector('.req-btn');
const checkEmail = document.querySelector('.checkEmail');
const confirmBtn = document.querySelector('.confirm-btn');
const inputAuth = document.querySelector('.authCode-input')
let authCode;
inputEmail.addEventListener('change', ()=>{
	checkId().then((result) => {
		if(result === true){
			reqBtn.disabled='';
			reqBtn.style.backgroundColor = '#6269F5'
			reqBtn.style.color = '#FFFFFF';
		}else{
			reqBtn.disabled='disabled';
			reqBtn.style.backgroundColor = '#AAAAAA'
			reqBtn.style.color = '';
		}
	})
})
reqBtn.addEventListener('click', async ()=>{
	checkEmail.style.display = 'block';  
	let res = await axios.post('signup/mail', {
		mail: inputEmail.value,
	});
	authCode = res.data.authCode;
	alert('인증번호가 전송되었습니다. 이메일을 확인해주세요.')
});
inputAuth.addEventListener('input', ()=>{
	if(inputAuth.value == ''){
		confirmBtn.disabled='disabled';
		confirmBtn.style.backgroundColor = '#AAAAAA'
		confirmBtn.style.borderColor = '#AAAAAA'
		confirmBtn.style.color = '';
	}else{
		confirmBtn.disabled='';
		confirmBtn.style.backgroundColor = '#6269F5'
		confirmBtn.style.borderColor = '#6269F5'
		confirmBtn.style.color = '#FFFFFF';
	}
});

confirmBtn.addEventListener('click', ()=>{
	if(inputAuth.value == authCode){
		inputEmail.readOnly = true;
		reqBtn.disabled='disabled';
		reqBtn.style.backgroundColor = '#aaaaaa';
		reqBtn.style.color = '#444444';
		confirmBtn.disabled='disabled;';
		confirmBtn.innerHTML='인증완료';
		confirmBtn.style.backgroundColor = '#aaaaaa';
		confirmBtn.style.color = '#444444';
		inputEmail.style.borderColor = '#aaaaaa';
		inputEmail.style.backgroundColor = '#efefef';
		inputAuth.style.borderColor = '#aaaaaa';
		inputAuth.style.backgroundColor = '#efefef';
		inputAuth.readOnly = true;
		checkResultId = true;
		alert('이메일이 인증되었습니다.');
	}else{
		alert('인증번호가 틀렸습니다. 재발송을 원하시면 인증요청 버튼을 다시 클릭해주세요.')
		inputAuth.style.borderColor = '#FF4444';
		inputAuth.style.backgroundColor = '#FFFFFF';
	}
});


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
		return true;
	}
}
async function checkNm(){
	const nickname = document.getElementById('nickname');
	const msgnm = document.getElementById('checknmmsg')
	const regnm = /^[A-Za-z가-힣0-9._-]{2,}$/ //영어, 한글, 숫자만 가능한 정규식
	if(nickname.value.length == 0){
		nickname.style.borderColor = '#FF4444';
		msgnm.style="display: "
		msgnm.innerHTML="닉네임을 입력해주세요."
	} else{
		if(!regnm.test(nickname.value)){
			nickname.style.backgroundColor = '#FFFFFF';
			nickname.style.borderColor = '#FF4444';
			msgnm.style="display: "
			msgnm.innerHTML="닉네임은 영어, 한글, 숫자로 만들어주세요."
    } else{
			//닉네임 중복체크
			try{
				const res = await axios.post("signup/duplic", {
					check: "nickname",
					checkName: nickname.value
				})
				//통과
				if(res.data == 1){
					nickname.style.backgroundColor = '#FFFFFF';
					nickname.style.borderColor = '#6269F5';
					msgnm.style="display: none;"
					return true;
				} else{
					nickname.style.backgroundColor = '#FFFFFF';
					nickname.style.borderColor = '#FF4444';
					msgnm.style="display: "
					msgnm.innerHTML="이미 존재하는 닉네임입니다."
					return false;
				}
			} catch(err){
				console.log(err);
				return false;
			}
    }
	}
}
function checkPn(){
	const phone = document.getElementById('phonenumber');
	const msgPn = document.getElementById('checkPnmsg');
	const regPn = /^(010)[0-9]{7,8}$/ //전화번호 정규식
	if(!regPn.test(phone.value)){
		phone.style.backgroundColor = '#FFFFFF';
		phone.style.borderColor = '#FF4444';
		msgPn.style="display: "
		msgPn.innerHTML="휴대폰 번호를 바르게 입력해주세요."
	} else{ //통과
		phone.style.backgroundColor = '#FFFFFF';
		phone.style.borderColor = '#6269F5';
		msgPn.style="display: none;"
		return true;
	}
}
const ckBox1 = document.getElementById('check_1');
const ckBox2 = document.getElementById('check_2');
const ckBox3 = document.getElementById('check_3');
const ckBox4 = document.getElementById('check_4');
const ckBox5 = document.getElementById('check_5');
function checkBox1(){
	if (ckBox1.checked == true){
		ckBox2.checked = true
		ckBox3.checked = true
		ckBox4.checked = true
		ckBox5.checked = true
	}
	else{
		ckBox2.checked = false
		ckBox3.checked = false
		ckBox4.checked = false
		ckBox5.checked = false
	}
}
const checkBoxs = document.querySelectorAll('.join_agree input');
checkBoxs.forEach((e)=>{
	e.addEventListener('change', ()=>{
		if(ckBox2.checked && ckBox3.checked && ckBox4.checked && ckBox5.checked){
			ckBox1.checked = 'checked';
		} else{
			ckBox1.checked = '';
		}
	})
})


function checkRd(){
	const ckradio = document.querySelector('input[name="radio1"]:checked');
	if(ckradio == null){ return false }
	else{ return true }}

//제출 전 최종 체크
async function checkSubmit(){
	const ckbox2 = document.getElementById('check_2').checked;
	const ckbox3 = document.getElementById('check_3').checked;
	const checkid = checkResultId;
	const checknm = await checkNm();
	const list = [checkid, checkPw1(), checkPw2(), checknm, checkPn(), ckbox2, ckbox3, checkRd()];
	if(list.every((ck)=>ck==true)){ return true }
	else{ return false };
}
//모두 작성될 경우 submit버튼 활성화
const form = document.querySelector('form');
const btnSubmit = document.querySelector('#btnSubmit');

form.addEventListener('change', ()=>{
	const checkAll = Array.from(form.elements)
	.filter(input => input.hasAttribute('required'))
	.every(input => input.value.trim() !== '');
	if(checkAll){
		(async function lastcheck(){
			const checksubmit = await checkSubmit()
			if(checksubmit == true){
				btnSubmit.disabled="";
				btnSubmit.style.backgroundColor = '#6269F5';
				btnSubmit.style.borderColor = "#6269F5";
				btnSubmit.style.color = "#efefef";    
			}
			else{
				btnSubmit.disabled="disabled";
				btnSubmit.style.backgroundColor = '#AAAAAA';
				btnSubmit.style.borderColor = '#AAAAAA';
			}
		})();
	}
})