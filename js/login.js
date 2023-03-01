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

//아이디 체크
function checkUser(){
    const userid = document.getElementById('userid');
    const userpw = document.getElementById('userpw');
    return new Promise((resolve, reject)=>{
        //아이디 중복체크
        axios.post("http://localhost:3000/checkId", {
            id: userid.value
            })
            .then((res)=>{
                //아이디 없음
                if(res.data == 1){
                    console.log("아이디없음")
                    alert("존재하지 않는 아이디입니다.")
                    userid.value = "";
                    resolve(false);
                } else{
                    console.log("비번체크")
                    axios.post("http://localhost:3000/checkPw", {
                    id: userid.value,
                    pw: userpw.value
                    })
                    .then((res)=>{
                        //일치
                        console.log("비번체크22")
                        alert("비번체크")
                        if(res.data == 1){
                            alert("통과") //리디렉션 보내줘야함
                            window.location.href = "../index.html"
                            resolve(true);
                        } else{
                            alert("아이디와 비밀번호가 일치하지 않습니다.")
                            userid.value = "";
                            userpw.value = "";
                            resolve(false);
                        }
                    })
                    .catch((err)=>{
                        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                        console.log(err);
                        reject(err);
                    })
                }
            })
    })
    
}
