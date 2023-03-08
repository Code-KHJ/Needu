//개인, 기업 폼 전환
function changeToUser(){
    const btnUser = document.getElementById("login_user");
    const formUser = document.getElementById("form_login_user");
    const btnCorp = document.getElementById("login_corp");
    const formCorp = document.getElementById("form_login_corp");
    btnUser.style.background = "rgba(0, 13, 255, 0.1)";
    formUser.style = "display: ;";
    btnCorp.style.background = "#fafafa";
    formCorp.style = "display: none;"
}
function changeToCorp(){
    const btnUser = document.getElementById("login_user");
    const formUser = document.getElementById("form_login_user");
    const btnCorp = document.getElementById("login_corp");
    const formCorp = document.getElementById("form_login_corp");

    btnUser.style.background = "#fafafa";
    formUser.style = "display: none;"
    btnCorp.style.background = "rgba(0, 13, 255, 0.1)";
    formCorp.style = "display: ;";
};
//개인 로그인 버튼 활성화
const formsbm_user = document.getElementById("form_user");
const btnsbm_user = document.getElementById("submit_user");
formsbm_user.addEventListener('keydown', ()=>{
    const check_user = Array.from(formsbm_user.elements)
    .filter(input => input.hasAttribute('required'))
    .every(input => input.value.trim() !== '');
    console.log(check_user)
    if(check_user){
        btnsbm_user.disabled="";
        btnsbm_user.className = "summitbtn_on";
    } else{
        btnsbm_user.disabled="disabled";
        btnsbm_user.className = "";
    }}
    
)
//기업 로그인 버튼 활성화
const formsbm_corp = document.getElementById("form_corp");
const btnsbm_corp = document.getElementById("submit_corp");
formsbm_corp.addEventListener('change', ()=>{
    const check_corp = Array.from(formsbm_corp.elements)
    .filter(input => input.hasAttribute('required'))
    .every(input => input.value.trim() !== '');
    console.log(check_corp)
    if(check_corp){
        btnsbm_corp.disabled="";
        btnsbm_corp.className = "summitbtn_on";
        }}
)

async function chehckpw(event){
    event.preventDefault();
    console.log('checking')
    const checkId = document.getElementById("userid");
    const checkPw = document.getElementById("userpw");
    const checkform = document.getElementById("form_user");
    try{
        await axios.post("/checkpw",{
            id: checkId.value,
            pw: checkPw.value
        })
        .then((res)=>{
        console.log(res.data)
        if(res.data == 1){
            checkform.submit();
        } else if (res.data == 2){
            console.log('false')
            alert("아이디 혹은 비밀번호가 일치하지 않습니다.");
            checkform.reset();
            return false
        } else{
            console.log('false')
            alert("아이디가 존재하지 않습니다.");
            checkform.reset();
            return false
        }}
    )} catch(err){
        console.log(err);
    }}
    
