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

//경력 삭제
function deleteReview(reviewNo){
  if(window.confirm("이 후기를 정말 삭제하시겠습니까?")){
    let queryString = `?no=${reviewNo}`;
    axios.delete(`/mypage/review${queryString}`)
      .then(response => {
        if(response.status == 200){
          alert('후기가 삭제되었습니다.')
          location.reload();
        } else if(response.status == 401){
          alert('삭제 권한이 없습니다. 로그아웃 후 다시 로그인해주세요')
        }
        else{
          alert('후기를 삭제할 수 없습니다. 잠시 후 다시 시도해주세요.')
        }
      })
  }else{
    return false;
  }
}