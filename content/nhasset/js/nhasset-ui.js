/* 2021-10-08 111 */
/*
 * [SEPTEM] UI Dev Team
 * @description [SEPTEM] Core Library
 */

$(window).on('load', function () {
});

$(function() {
	console.log('*:* pub *:* nhasset-ui.js');

	popOpenRun();
	assetResetControl();
	useUnuseStatus();

	//footer 데이터센터 //마이데이터와 공통 수정X
	$('.footerNav a.item06').attr('aria-expanded','false').attr('title','데이터센터 하위목록 열기').attr('role','button');
	$('.footerNav a.item06').click(function(){
		$(this).toggleClass('selected');
		$('.footerLink').toggleClass('active');
		if ($(this).hasClass('selected')) {
			$(this).parent('li').addClass('active')
			$(this).attr('title','데이터센터 하위목록 닫기');
			$(this).attr('aria-expanded','true');
		}else{
			$(this).parent('li').removeClass('active')
			$(this).attr('title','데이터센터 하위목록 열기');
			$(this).attr('aria-expanded','false');
		}
		if ($('.footerLink').hasClass('active')) {
			$('.footerLink').attr('aria-hidden','false')
			$('.footerLink ul >li:first-child a').focus();
		}else{
			$('.footerLink').attr('aria-hidden','true')
		}
	});

	// hr 구분선 접근성 추가
	$("hr.divLine").attr("aria-hidden", true);

	// tab 접근성 추가
	setTimeout(function() {
		//2020-11-30 윤지현 : tab에 role 속성 추가
		if('.tabWrap'.length > 0){
			$('.tabWrap ul').attr('role','tablist');
			$('.tabWrap ul li').attr('role','presentation');
			$('.tabWrap ul li a').attr('role','tab');
		}
		//2020-11-30 윤지현 : tab에 role 속성 추가 끝
		$(".tabWrap ul li a").attr("aria-selected", false);
		$(".tabWrap.type01 ul li a.on").attr("aria-selected", true);
		$(".tabWrap.type02 ul li.active a").attr("aria-selected", true);

		//두줄탭의 경우
		if('.tabWrap2'.length > 0){
			$('.tabWrap2 ul').attr('role','tablist');
			$('.tabWrap2 ul li').attr('role','presentation');
			$('.tabWrap2 ul li a').attr('role','tab');
		}
		//2020-11-30 윤지현 : tab에 role 속성 추가 끝
		$(".tabWrap2 ul li a").attr("aria-selected", false);
		$(".tabWrap2 ul li.active a").attr("aria-selected", true);

	}, 100);

	// tab 클릭 동작
	$(document).off('click', '.tabWrap a').on('click', '.tabWrap a', function (e) {
		var $obj = $(this),
			$tabWrap = $obj.closest(".tabWrap"),
			tabIndex = $obj.parent().index() + 1,
			tabClass = $tabWrap.attr("class"),
			tabType = tabClass.substr(tabClass.indexOf("type"), 6);

		$tabWrap.find("a").removeClass("on").attr('aria-selected', false);
		$obj.addClass("on").attr('aria-selected', true);
		//$(".bar").show();
		
		console.log(tabType);
		$tabWrap.next(".tabContWrap." + tabType).find(" > div").hide();
		$tabWrap.next(".tabContWrap." + tabType).find(".tabCont0" + tabIndex).show();
		
		if ($tabWrap.hasClass("type03")) {
			$tabWrap.find("li").removeClass("on");
			$obj.parent().addClass("on");
		}
	});

	//검색결과 리스트 선택
	$(document).off('click', '.srchResult a.selec').on('click', '.srchResult a.selec' , function(){
		$li = $(this).parent('li');
		if(! $li.hasClass('active')){
			$('.srchResult li').removeClass('active');
			$li.closest('li').addClass('active');
		} else {
			$li.closest('li').removeClass('active');
		}
	});

	if( $('.container').hasClass('fullH') ){
		$('html').addClass('h100p');
	}

	/* 부동산 옵션선택 */
	$(document).off('click', '.srchResult a').on('click', '.srchResult a' , function() {
		var item = $(this).parent('li');
		if(! item.hasClass('active')){
			$('.srchResult li').removeClass('active');
			item.addClass('active');
			$('.srchResult a').attr('aria-pressed','false')
			$(this).attr('aria-pressed','true')
		}
	})
	
	$(".yearSet > ol").each(function(i){
		_this = $(this);
		_this.find('a').click(function(){
			_that = $(this);
			$(".yearSet > ol").eq(i).find('li').removeClass('on');
			_that.parent('li').addClass('on');
		})
	})

	//헤더 이전버튼 role 추가
	setTimeout(function(){
		if($('.btnBack').length > 0){
			$('.btnBack').attr('role','button');
		}
	},100)

	// 토글버튼
	$(".tgBtn:not(.onoff) input[type='checkbox']").on('click',function(){
		if( $(this).is(":checked")) {
			$(this).attr('title','체크 해제시 잔액 숨기기');
		} else{
			$(this).attr('title','체크 시 잔액 보이기');
		}
	});

	$(".tgBtn.onoff").on('click',function(){
		if( $(this).children('input').is(":checked")) {
			$(this).children('label').text("ON");
		} else{
			$(this).children('label').text("OFF");
		}
	});

	// footer 접근성
	$(".footer .footMenu li.active").find("a").attr("title", "선택됨");
	$(document).off('click', '.footMenu li a').on('click', '.footMenu li a', function () {
		$(".footMenu li a").attr("title", "");
		$(this).attr("title", "선택됨");
	});

	//증감 아이콘 접근성
	if($('.arrowUp').length){
		$('.arrowUp').each(function(){
			$(this).attr({'role':'img', 'aria-label':'증가'})
		})
	}
	if($('.arrowDown').length){
		$('.arrowDown').each(function(){
			$(this).attr({'role':'img', 'aria-label':'감소'})
		})
	}
	if($('.arrowNone').length){
		$('.arrowNone').each(function(){
			$(this).attr({'role':'img', 'aria-label':'없음'})
		})
	}

	//추가정보 열닫 접근성
	if(! $('.toggleWrap .toggleBtn').hasClass('active')){
		$('.toggleWrap .toggleBtn').attr('aria-expanded','false')
	}

	// 세부카테고리 접근성
	$(".nhasset.popWrap .selectList li.active").find("a").attr("title", "선택됨");
	var $selectLink = $('.nhasset.popWrap .selectList li a');
	$(document).off('click', '.nhasset.popWrap .selectList li a').on('click', '.nhasset.popWrap .selectList li a', function () {
		$('.nhasset.popWrap .selectList li a').attr("title", "");
		$(this).attr("title", "선택됨");
	});
	
	$(window).scroll(function(){
		$('.registBtn , .goTopBtn').fadeOut();
	})

	$.fn.scrollStopped = function(callback) {
		var that = this, $this = $(that);
		$this.scroll(function(ev) {
			clearTimeout($this.data('scrollTimeout'));
			$this.data('scrollTimeout', setTimeout(callback.bind(that), 250, ev));
		});
	};

	$(window).scrollStopped(function(ev){
		// console.log(ev);
		$('.registBtn , .goTopBtn').fadeIn();
	});

	$('.goTopBtn').click(function (){
		$('html,body').animate({ scrollTop: '0' }, 300);
	})

	// .on("touchmove", function () {
	// 	$('.registBtn').addClass('hide');
	// 	setTimeout(function(){ 
	// 		$('.registBtn').removeClass('hide')
	// 	}, 1500);;
	// });

	$('.filterTab button').each(function () {
		$(this).attr('role', 'radio');
		if ($(this).hasClass('active')) {
			$(this).attr('aria-checked', 'true');
		} else {
			$(this).attr('aria-checked', 'false')
		}
	})

	// touch 시 이벤트 
	$('.feedList a, .roundBtnWrap a').on({
		'touchstart': function () {
			$(this).addClass('active');
		},
		'touchend': function () {
			$(this).removeClass('active');
		}
	});
	
});


/************************* 함수 ************************/
// bar 이동 위치 정의
var tabMoveCalc = function() {
	var currActive = $(".tabScroll ul li a.on");
	var leftPos = currActive.parent().offset().left - 20,
		leftLinkPos = currActive.position().left,
		totalPos = leftPos + leftLinkPos
		thisWidth = currActive.outerWidth();

	return {
		currActive : currActive,
		leftPos : leftPos,
		leftLinkPos : leftLinkPos,
		totalPos : totalPos,
		thisWidth : thisWidth
	}
}

// tab swipe 및 bar 동작 
var tabSwipe = function (){
	var $slideListOn = $(".tabScroll ul li a.on");
	var activeIndex = $slideListOn.parent().index();
	var beforeIndex = activeIndex;
	var afterIndex = 0;

	var tabSwiper = new Swiper('.tabScroll', {
		slidesPerView: 4,
		slidesPerGroup: 4,
		loopFillGroupWithBlank: true,
		setWrapperSize:true,
		initialSlide:activeIndex,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		on: {
			init: function () {
				$(".tabScroll").wrap("<div class='tabScrollWrap'></div>");
				var mobileWidth = $(window).width();
				var slideWrapW = mobileWidth - 40;
				var slideW = slideWrapW / 4;

				$(".tabScroll").outerWidth(slideWrapW);
				$(".tabScroll ul li.swiper-slide").outerWidth(slideW);
				// 접근성 추가
				$(".tabScroll ul li.swiper-slide a.on").attr("aria-selected", true);
			}
		}
	});
	
	tabSwiper.update();
}

// tooltip open
var tooltipOpen = function(obj) {
	$tooltipCont = obj.closest(".tooltipWrap").find(".tooltipCont");
	$tooltipCont.css({"width":$(window).width() - 40});
	$(".tooltipCont").hide();
	$tooltipCont.show();
}
// tooltip close 
var tooltipClose = function(obj) {
	obj.closest(".tooltipWrap").find('.toolTipBtn').blur()
	setTimeout(function() {
		obj.closest(".tooltipWrap").find('.toolTipBtn').focus(); 
	},100);
	obj.closest(".tooltipCont").hide();
}

// 하나로가족고객 등급 화살표
var hanaroArr = function() {
	var liWidth = $(".gradeView li").width(),  // li 하나당 크기
		curIndex = $(".gradeView .activeCur").index(),
		newIndex = $(".gradeView .activeNew").index(),
		realIndex = newIndex - curIndex,
		ulWidth = $(".gradeView ul").width(),
		curPos = $(".gradeView .activeCur > span").offset().left,
		liMargin = 28;

	if (realIndex < 0 ) {   // 하락
		realIndex = realIndex * -1;
		lineWidth = (liWidth * realIndex) + (liMargin * realIndex);
		$(".gradeArrow").addClass("leftArr").width(lineWidth).css("right", ulWidth - curPos);
		$(".gradeView .activeNew").addClass("imgDalli03");
	}
	else if (curIndex == newIndex) {   // 유지
		$(".gradeView .activeNew").addClass("imgDalli01");
		$(".gradeView .gradeArrow").hide();
		if (curIndex == 5 && newIndex == 5) {   // 탑클래스 유지
			$(".gradeView .activeNew").removeClass("imgDalli01").addClass("imgDalli04");
			$(".gradeView").css("margin-top", "83px");
			$(".gradeView .topMsg").show();
		}
	} 
	else {   // 상승
		lineWidth = (liWidth * realIndex) + (liMargin * realIndex);
		$(".gradeArrow").addClass("rightArr").width(lineWidth).css("left", curPos);
		$(".gradeView .activeNew").addClass("imgDalli02");
		}
}

//접근성 대응 스크립트 : 팝업 그려진 후 호출
var accessibility = function(){
	if($('.selectList').length > 0){
		$('.selectList').each(function(e){
			var $item = $(this).find('a');
			$item.attr('role','button');
			$item.click(function(){
				$('.selectList').eq(e).find('a').attr('title','');
				$(this).attr('title','선택됨');
			})
		});
	}
	if($('.popInner').find('h1').length > 0){
		$('.popInner').find('h1').each(function(e){
			if($(this).find("a").length == 0){
				$(this).html("<a href='javascript:;' role='text'>"+$(this).html()+"</a>");
			}
		})
		$('.popInner h1').find("a").focus();
		console.log('chk');
	}
}

function addrSelectFnc(){
	$('.addrSelectWrap').each(function (i) {
		$this = $(this);
		$this.find('a').attr('role','radio');
		$this.find('a').click(function () {
			$that = $(this);
			$li = $that.parent('li');
			if (!$li.hasClass('active')) {
				$('.addrSelectWrap').eq(i).find('li').removeClass('active');
				$li.addClass('active');
				$('.addrSelectWrap').eq(i).find('a').attr('aria-checked',false)
				$that.attr('aria-checked',true)
			}
		})
	})
}

// 목표달성 그래프
var graphActive = function() {
	
	if ($(".boxArea").length) {
		graphValue = $(".purposeList .lineGraph").attr("data-value");
		$(".purposeList .lineGraph").animate({width:graphValue + "%"}, 500);

	} else {
		$(".purposeList ul li").each(function(i) {
			graphValue = $(this).find(".lineGraph").attr("data-value");
			$(this).find(".lineGraph").animate({width:graphValue + "%"}, 500);
		});
	}
}

// 목표달성 신호등 아이콘 aria-label 처리
var signalLabel = function() {
	var signalTxt = ['안정', '노력', '주의', '위험'];
	if ($(".boxArea").length) {
		var signalIndex = $(".boxArea .purposeSignal span.active").index();
		if (signalIndex > -1) {
			//var signalTxt = ['안정', '노력', '주의', '위험'];
			$(".boxArea .purposeSignal").attr("aria-label", "기간경과대비 목표달성비율 : " + signalTxt[signalIndex]);
		}
	} else {
		$(".purposeList ul li").each(function(i) {
			var signalIndex = $(this).find(".purposeSignal span.active").index();
			if (signalIndex > -1) {
				$(this).find(".purposeSignal").attr("aria-label", "기간경과대비 목표달성비율 : " + signalTxt[signalIndex]);
			}
		});
	}
	
}

//인풋 reset 버튼 
var assetResetControl = function(){
	var $inp = "input:not([readonly],[type='checkbox'],[type='radio'],[type='image'],[type='submit'],[type='button'])";
	$(document)
		.on('blur, focusout', $inp , function(e) {
			$(this).parent().removeClass('on');	
		})
		.off('focus, focusin', $inp)
		.on('focus, focusin', $inp , function(e){
			$(this).parent().addClass('on');
		})
		.off("keyup",$inp).on("keyup",$inp,function(){
            if($(this).val()!==''){
                $(this).siblings('.btnReset').show();
            }
		})
		.off("click",".btnReset").on("click",".btnReset",function(e){
			console.log('*:* pub *:* reset click :: nhasset-ui.js');
			// $(this).siblings('input').css('border-color','#19A647');

			$(this).siblings('input').val('').focus();
			$(this).hide();
		})
}
var popOpenRun = function(){ //popup.js에서 실행됨

	$("input:not([readonly],[type='checkbox'],[type='radio'],[type='image'],[type='submit'],[type='button'])").each(function(i){
		if($(this).val()!==''){
			$(this).siblings('.btnReset').show();
		}else{
			$(this).siblings('.btnReset').hide();
		}
	});

	addrSelectFnc(); //타일스타일 라디오 접근성

	if($('.selectList').length > 0){
		$(".nhasset.popWrap .selectList li.active").find("a").attr("title", "선택됨");		
	}
	
	// up,down 버튼 효과
	$('.btnUp, .btnDown').click(function(){
		$li = $(this).closest('li')
		$(this).parents('ul > li').css('background','');
		$li.css('background','#f3faf6');
		setTimeout(function(){
			$li.css('background','');
		},800)
	})

	categorySwipe();
	categoryPosition();
	
	
	// IOS 팝업 스크롤 이상현상 관련 처리
	// if(($(".nhasset.popWrap > .popInner").length > 0)) {  //퍼블확인용
	if(($(".nhasset.popWrap > .popInner").length > 0) && (OF.exeStatus == 5)) {
		$(".roundBtnWrap a").on('tap', function() {
			$(this).parent().parent().find('input').blur(); 
		});
		
		$(".btnReset").on('tap', function() {
			$(this).siblings('input').blur();
		});
		
		$(document).on('blur', 'input', function() {
			window.scrollTo(0, NaN); 
		});
	}
	// IOS 팝업 스크롤 이상현상 관련 처리 END
	
}

//toast popup
var toastPopup = function(){
	$('.toastPop').fadeIn(200).delay(1800).fadeOut(400);
}

var popSelect = function(){
	$(".nhasset.popWrap .selectList li.active").find("a").attr("title", "선택됨");
	var $selectLink = $('.nhasset.popWrap .selectList li a');
}


// 자산 메인 상단 배너 //
var bannerSwiperPrd = function(){
	var $listBannerBtn = $(".bannerSwiperPrd");
	var swiper = new Swiper('.bannerSwiperPrd', {
		slidesPerView: 1,
		spaceBetween: 10,
		loop: true,
		autoplay: {
			// delay: 2500,
			delay: 4000,
			disableOnInteraction: true,
			pauseOnMouseEnter: true,
		},
		
		pagination: {
			el: '.swiper-pagination',
			bulletElement : 'a',
			clickable: true,
		},
		on: {
			slideChangeTransitionEnd : function(){
				var $listBannerBtn = $(".bannerSwiperPrd .swiper-pagination");
				$listBannerBtn.find("a").attr('title','');
				$listBannerBtn.find("a").eq(this.activeIndex-1).attr('title','선택됨');
				$('.swiper-slide').attr('aria-hidden','true');
				$('.swiper-slide-active').attr('aria-hidden','false');
			}
		}
	});
	$('.bannerSwiperPrd').find('.stopBtn').on('click',function(){
		$('.swiper-autoBtn').removeClass('playing');
		swiper.autoplay.stop();
		console.log('자동재생 멈춤');
	});
	$('.bannerSwiperPrd').find('.playBtn').on('click',function(){
		$('.swiper-autoBtn').addClass('playing');
		
		swiper.autoplay.start();
		console.log('자동재생 시작');
	});
	$listBannerBtn.find(".swiper-pagination-bullet-active").attr('title','선택됨');
	return swiper;
};


var listSwiperInvest = function(){ //자산메인 투자 스와이프
	var menu = ['금액순', '수익률순'];
	var $listBannerBtn = $(".listSwiperInv .totalSort");
	var swiper = new Swiper('.listSwiperInv', {
		slidesPerView: 1,
		spaceBetween: 40,
		a11y: false,
		pagination: {
			el: '.listSwiperInv .totalSort',
			clickable: true,
			renderBullet: function (indexp, className) {
				return '<a href="javascript:;" role="button" class="' + className + '">' + (menu[indexp]) + '</a>';
			},
		},
		on: {
            init:function(){
                $('.listSwiperInv .swiper-slide').attr('aria-hidden','true');
				$('.listSwiperInv .swiper-slide-active').attr('aria-hidden','false');
            },
            slideChangeTransitionEnd: function(){
                $listBannerBtn.find("a").attr('title','');
                $listBannerBtn.find("a").eq(this.activeIndex).attr('title','선택됨');
                $(".listSwiperInv .swiper-slide").attr('aria-hidden', true);
                $(".listSwiperInv .swiper-slide.swiper-slide-active").attr('aria-hidden', false);
            }
        },
	});
	$listBannerBtn.find(".swiper-pagination-bullet-active").attr('title','선택됨');
	return swiper;
};

var listSwiperlia = function(){ //자산메인 부채 스와이프
	var menu = ['잔액순', '금리순'];
	var $listBannerBtn = $(".listSwiperlia .totalSort");
	var swiper = new Swiper('.listSwiperlia', {
		slidesPerView: 1,
		spaceBetween: 40,
		a11y: false,
		pagination: {
			el: '.listSwiperlia .totalSort',
			clickable: true,
			renderBullet: function (indexp, className) {
				return '<a href="javascript:;" role="button" class="' + className + '">' + (menu[indexp]) + '</a>';
			},
		},
		on: {
            init:function(){
                $('.listSwiperlia .swiper-slide').attr('aria-hidden','true');
				$('.listSwiperlia .swiper-slide-active').attr('aria-hidden','false');
            },
            slideChangeTransitionEnd: function(){
                $listBannerBtn.find("a").attr('title','');
                $listBannerBtn.find("a").eq(this.activeIndex).attr('title','선택됨');
                $(".listSwiperlia .swiper-slide").attr('aria-hidden', true);
                $(".listSwiperlia .swiper-slide.swiper-slide-active").attr('aria-hidden', false);
            }
        },
	});
	$listBannerBtn.find(".swiper-pagination-bullet-active").attr('title','선택됨');
	return swiper;
};

var listSwiperPension = function(){ //자산메인 연금 스와이프 : 2021-12-14 추가
	var menu = ['금액순', '수익률순'];
	var $listBannerBtn = $(".listSwiperPension .totalSort");
	var swiper = new Swiper('.listSwiperPension', {
		slidesPerView: 1,
		spaceBetween: 40,
		a11y: false,
		pagination: {
			el: '.listSwiperPension .totalSort',
			clickable: true,
			renderBullet: function (indexp, className) {
				return '<a href="javascript:;" role="button" class="' + className + '">' + (menu[indexp]) + '</a>';
			},
		},
		on: {
            init:function(){
                $('.listSwiperPension .swiper-slide').attr('aria-hidden','true');
				$('.listSwiperPension .swiper-slide-active').attr('aria-hidden','false');
            },
            slideChangeTransitionEnd: function(){
                $listBannerBtn.find("a").attr('title','');
                $listBannerBtn.find("a").eq(this.activeIndex).attr('title','선택됨');
                $(".listSwiperPension .swiper-slide").attr('aria-hidden', true);
                $(".listSwiperPension .swiper-slide.swiper-slide-active").attr('aria-hidden', false);
            }
        },
	});
	$listBannerBtn.find(".swiper-pagination-bullet-active").attr('title','선택됨');
	return swiper;
};

var listSwiperCrypto = function(){ //자산메인 가상자산 스와이프
	var menu = ['금액순', '수익률순'];
	var $listBannerBtn = $(".listSwiperCrypto .totalSort");
	var swiper = new Swiper('.listSwiperCrypto', {
		slidesPerView: 1,
		spaceBetween: 40,
		a11y: false,
		pagination: {
			el: '.listSwiperCrypto .totalSort',
			clickable: true,
			renderBullet: function (indexp, className) {
				return '<a href="javascript:;" role="button" class="' + className + '">' + (menu[indexp]) + '</a>';
			},
		},
		on: {
            init:function(){
                $('.listSwiperCrypto .swiper-slide').attr('aria-hidden','true');
				$('.listSwiperCrypto .swiper-slide-active').attr('aria-hidden','false');
            },
            slideChangeTransitionEnd: function(){
                $listBannerBtn.find("a").attr('title','');
                $listBannerBtn.find("a").eq(this.activeIndex).attr('title','선택됨');
                $(".listSwiperCrypto .swiper-slide").attr('aria-hidden', true);
                $(".listSwiperCrypto .swiper-slide.swiper-slide-active").attr('aria-hidden', false);
            }
        },
	});
	$listBannerBtn.find(".swiper-pagination-bullet-active").attr('title','선택됨');
	return swiper;
};

function visualWrapAni(){
	$(".visualWrap").addClass("active");
}

/* 자산연결/ 사용,미사용 역할 접근성 */
var useUnuseStatus = function(){
	$('.assetTotalList.boxLine .accValue .contBtn01').each(function(){
		if($(this).hasClass('green')){
			$(this).attr('title','선택됨');
		}
	})
	$('.assetTotalList.boxLine .accValue').each(function(e){
		$obj = $(this).find('.contBtn01'); 
		$obj.click(function(){
			$('.assetTotalList.boxLine .accValue').eq(e).find('.contBtn01').attr('title','');
			$(this).attr('title','선택됨');
		})
	})
}

/* 현금소비 FMCD3001 */
function categorySwipe(){
	categoryMain();
	categorySub();
	categoryPosition();
}

function categoryPosition(){
	$(".cateListHori .categoryWrap li").each(function(i){
		if($(".cateListHori .categoryWrap li").eq(i).find("input:radio[name='catetory']").is(":checked")){
			var categoryWidth = $(".cateListHori .categoryWrap li").width();
			$(".cateListHori .categoryWrap").stop().animate({scrollLeft:((categoryWidth+5)*(i))},300);
		}
	})

	$(".cateSubList li").each(function(i){
		if($(".cateSubList li").eq(i).find("input:radio[name='subCategory']").is(":checked")){
			var categorySubWidth = $(".cateSubList li").width();
			$(".cateSubList .roundChkWrap").stop().animate({scrollLeft:((categorySubWidth+5)*(i))},300);
		}
	})
}

function categoryMain(){
	$(".cateListHori .categoryWrap li").on("click",function(){
		var categoryWidth = $(".cateListHori .categoryWrap li").width();
		$(".cateListHori .categoryWrap").stop().animate({scrollLeft:((categoryWidth+5)*($(this).index()))},300);
		$(".cateSubList .roundChkWrap").scrollLeft(0);
		categorySub();
	})
}

function categorySub(){
	$(".cateSubList li").on("click",function(){
		var categorySubWidth = $(".cateSubList li").width();
		$(".cateSubList .roundChkWrap").stop().animate({scrollLeft:((categorySubWidth+5)*($(this).index()))},300);
		
	})
}