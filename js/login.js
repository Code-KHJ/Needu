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

const formsbm_user = document.getElementById("form_user");
const btnsbm_user = document.getElementById("submit_user");
formsbm_user.addEventListener('change', ()=>{
    const check_user = Array.from(formsbm_user.elements)
    .filter(input => input.hasAttribute('required'))
    .every(input => input.value.trim() !== '');
    console.log(check_user)
    if(check_user){
        btnsbm_user.disabled="";
        btnsbm_user.className = "summitbtn_user";
        }}
)