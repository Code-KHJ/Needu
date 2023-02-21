// const form = document.getElementsById('frm');
// const userid = document.getElementById('id');
// var password1 = document.getElementById('password1');
// const password2 = document.getElementById('password2');
const username = document.getElementById('name');
const phonenumber = document.getElementById('phonenumber');
const email = document.getElementById('email');

function checkId(){
    const userid = document.getElementById('id');
    let regId = /^[a-zA-Z0-9]{4,20}}$/ //영어, 숫자만 가능한 정규식
    let duplicate = [] //db에서 아이디 배열 가져와서 중복검사

    //아이디 글자 수
    if(userid.value.length < 4 || userid.value.length > 20){
       userid.style.borderColor = '#dc3434';
       alert("아이디 글자수 안맞음")
    } else{
        //아이디 정규식 검사
        if(!regId.test(userid.value)){
            userid.style.borderColor = '#dc3434';
            alert("아이디는 영문, 숫자만 가능합니다.")
            userid.value = "";
            return false;
        } else{
            //중복검사 필요

        }
        
    }
}

function checkPw1(){
    const password1 = document.getElementById('password1');
    // let password2 = document.getElementById('password2');
    var regPw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,16}$/ //영어, 숫자만 가능한 정규식
    //비밀번호 글자 수 검사
    if(password1.value.length < 8){
        password1.style.borderColor = '#dc3434';
        alert("비밀번호 글자 적음")
    } else{
        //비밀번호 유효성 검사
        if(!regPw.test(password1.value)){
            password1.style.borderColor = '#dc3434';
            alert("비밀번호는 영문 대소문자, 숫자, 특수문자만 가능하며 반드시 영문, 숫자 필요")
            password1.value = "";
            return false;
        } else{
            //통과 색 수정
            password1.style.borderColor = '#dc3434';
        }
    }
}
function checkPw2(){
    const password1 = document.getElementById('password1');
    const password2 = document.getElementById('password2');
    if(password2.value !== password1.value){
    password2.style.borderColor = '#dc3434';
    alert("비밀번호가 동일하지 않음")
} else{
    //통과
}}

function checkNm(){
    const name = document.getElementById('name');
    if(name.value == ""){
    name.style.borderColor = '#dc3434';
    alert("이름입력하시오")
} else{
    //통과
}}


// id.onchange = function (){
//     if(id.value.length < 4 || id.value.length > 20){
//         id.style.color = "#573737";
//         alert("에러발생");
//     }
// };
