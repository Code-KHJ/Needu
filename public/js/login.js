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
    }}
    
