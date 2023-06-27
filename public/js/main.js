//리뷰 데이터 swiper
$('.slider-for').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: '.slider-nav'
});
$('.slider-nav').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  vertical: true,
  verticalSwiping: true,
  focusOnSelect: true,
  adaptiveHeight: true,
  slidesMargin: 15,
  prevArrow: false,
  nextArrow: false,
  mobileFirst: true,
  responsive: [ // 반응형 웹 구현 옵션
  {  
      breakpoint: 767,
      settings: {
        asNavFor: '.slider-for',
      } 
  },
  ]
});