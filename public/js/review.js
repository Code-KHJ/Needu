
// 별점 상세보기
const btn_star_open = document.querySelectorAll('.star_detail_open');
const star_detail = document.querySelectorAll('.star_detail')
btn_star_open.forEach((e, i) => e.addEventListener("click", () => starOpen(i)));
function starOpen(i){
  let item = star_detail.item(i);
  if(item.style.display == 'none'){
    item.style="display: "
  }
  else{
    item.style="display: none"
  }
}
