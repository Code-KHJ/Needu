// 별점 상세보기
function star_detailClick(element){
  const liElement = element.closest("li");
  const star_detail = liElement.querySelector('.star_detail');
  if(star_detail.style.display == 'none'){
    star_detail.style="display: "
  }
  else{
    star_detail.style="display: none"
  }
}

//수정 버튼 이동

function reviewEdit (review_no){
  window.location.href = `/mypage/review/edit?no=${review_no}`
}