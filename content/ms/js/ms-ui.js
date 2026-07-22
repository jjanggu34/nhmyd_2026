/*
 * 마이데이터 플랫폼UI Script
 */
$(document).ready(function(){
	$('.insightViewWrap').each(function(){
		$(this).parents('.popCont').addClass('pb0')
	});
	
	//금융일정 접근성
	$('.touch_area').attr('role','button').attr('title','탭 하시면 월, 주 단위로 볼 수 있습니다.');
	
	//전체메인 가입전 모션
	$('.joinBeforeWrap').each(function(){
		var $this = $(this);
		var $titAreaHeight = $('.joinBeforeTitle').outerHeight();
		var $headerHeight = $('.header').outerHeight();
		var $heightSum = $titAreaHeight;// + $headerHeight;
		$(window).on('scroll',function(){
			var $scrollTop = $('html, body').scrollTop();
			var $listOffset = $('.joinBeforeList').offset().top;
			//console.log($listOffset)
			if ($scrollTop > $heightSum) {
				$this.addClass('withFootBtn');
			}else{
				$this.removeClass('withFootBtn');
			}
			if ($scrollTop == 0) {
				$('.joinBeforeList > li').removeClass('active');
			}
			$('.joinBeforeList > li').each(function(){
				var $thisTop = $(this).offset().top;
				var $emtPos = $scrollTop + $heightSum;
				if ($thisTop <= $emtPos) {
					var $this = $(this);
					if (!$this.hasClass('active')) {
						$this.addClass('active');
						if ($this.hasClass('mainMcWrap')) {
							myCarCost()
						}
						
					}
				}
			});
			$('.joinBeforeList > li.mainGsWrap').each(function(){
				$(this).parents('.content').css('padding-bottom','0');
				var $dHeight = $(window).outerHeight();
				var $thisMHight = $dHeight - $headerHeight - 50;
				$(this).css('min-height',$thisMHight)
			});
		});
	});

	//업데이트(자산수집)
	$('.btnUpdate,.btnUpdate_full').click(function(){
		$(this).addClass('active')
	});

	//전화번호 - 처리
	$(document).on("keyup",".phoneNumber", function(){
		$(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--","-"));
	});

	//정부혜택 외부링크
	$('.gs_listView .context a[href*=openURL]').attr('title','외부 브라우저로 열림');

	//footer 데이터센터
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

	//정부지원혜택 버튼 action
	$('.comServiceRow a').each(function(){
		if ($(this).hasClass('selected')) {
			$(this).attr('aria-selected','true').attr('title','선택됨');
		}else{
			$(this).attr('aria-selected','false').attr('title','');
		}
	});
	$('.comServiceRow a').click(function(){
		$('.comServiceRow a').removeClass('selected')
		$(this).addClass('selected');
		$('.comServiceRow a').each(function(){
			if ($(this).hasClass('selected')) {
				$(this).attr('aria-selected','true').attr('title','선택됨');;
			}else{
				$(this).attr('aria-selected','false').attr('title','');;
			}
		});
	});

	//정부지원혜택 가족수
	$('.famWrap > ul').each(function(){
		var $famLengh = $(this).children('li').length;
		$(this).addClass('famNum_' + $famLengh)
		//console.log($famLengh);
	});
	
	//sticky 적용 wrapper
	$('.benefitMore ').parents('.wrapper').addClass('wrapUnset');

	//토글 버튼
	$('.btnSortWrap .btn').each(function(){
		if ($(this).hasClass('selected')) {
			$(this).attr('aria-selected','true').attr('title','선택됨')
		}else{
			$(this).attr('aria-selected','false').attr('title','')
		}
	})
	$('.btnSortWrap .btn').click(function(){
		$(this).parent('.btnSortWrap').children('.btn').removeClass('selected').attr('aria-selected','false').attr('title','');
		$(this).addClass('selected').attr('aria-selected','true').attr('title','선택됨');
	});
	
	//툴팁
	$('.dfs .jsToggleWrap .cls').click(function(){
		$(this).parent('.jsToggleWrap').hide();
	});
	
	//탭 이동 시 툴팁 닫음
	$('.jsTabs .tabs li a').click(function(){
		if($(this).parents('.jsTabs').find('.icoQuestion').length){
			$(this).parents('.jsTabs').find('.icoQuestion').attr('aria-expanded','false').removeClass('on');
			$(this).parents('.jsTabs').find('.jsToggleWrap.an_cont').attr('aria-hidden','true').removeClass('on').hide();
		}
	});

	//연말정산 배터리
	$('.yaMainConsult').each(function(){
		var $thisStat = $(this).find('.statNum').text();
		var $thisStatSet = 100 - $thisStat;
		var $thisAdd = $(this).find('.statBar');
		$thisAdd.stop().animate({bottom:-$thisStatSet + '%'},10,function(){
			$thisAdd.parents('.yaMainConsultVisInner').addClass('active');
		});
	});
	
	//폴딩 js
	$('.btn_folding').each(function(){
		var $this = $(this);
		var $thisParents = $this.parents('.wrap_folding');
		$this.attr('role','button')
		if ($thisParents.hasClass('active')) {
			$this.attr('aria-expanded', 'true') //[2022-04-25] 윤지현:접근성수정. 오타수정 trud -> true 
		}else{
			$this.attr('aria-expanded','false')
		}
	});
	$('.btn_folding').click(function(){
		var $this = $(this);
		var $wrap = $(this).parents('.wrap_folding');
		$wrap.toggleClass('active');
		if ($wrap.hasClass('active')) {
			$wrap.children('.folding_cont').attr('aria-hidden','false');
			$wrap.children('.folding_cont').slideDown(200);
			$this.attr('aria-expanded','true')
		}else{
			$wrap.children('.folding_cont').attr('aria-hidden','true');
			$wrap.children('.folding_cont').slideUp(200);
			$this.attr('aria-expanded','false');
		}
	});

	// swiper 안에 accordion 있을 경우
	$('.swiper-container .btn_folding').click(function(){
		var $parents = $(this).parents('.wrap_folding');
		var $this = $(this);
		setTimeout(function(){
			var $parentsHeight = $parents.outerHeight();
			$this.parents('.swiper-wrapper').css('height',$parentsHeight)
		},201);
	});

	$('.wrap_scroll_area ul').each(function(){
		$(this).bind('touchmove',function(e){
			e.preventDefault();
		});
		$(this).stop().animate({scrollTop:180},1000);
	});

	//연말정산 시뮬레이션 탭위치 이동(고객요청으로 탭이동시 최상단으로 이동으로 주석처리함)
	/*$('.anchorListdWrap .anchorList a').click(function(){
		var $headerHeight = $('.header').outerHeight();
		$('html, body').scrollTop($headerHeight);
		
	});
*/
	//연말정산 시뮬레이션 접근성
	$('.simulation_content').each(function(){
		if ($(this).hasClass('selected')) {
			$(this).attr('aria-hidden','false');
		}else{
			$(this).attr('aria-hidden','true');
		}
	});

	//금융플래너 코치마크 fullpopup background
	$('.planCoach').each(function(){
		$(this).parents('.fullLayerPop').addClass('planCoachWrap');
	})

	//접근성 관련 시작
	$('.slider-range').attr('aria-hidden','true');
	$('.mainTileArea').attr('role','button');
	$('.mainAssetGraph dt').attr('role','text');
	$('a.txtLink.cArr').attr('role','button');
	$('.mc_label.selected').attr('title','선택됨');
	$('.thumbList li a').attr('title','팝업열림');

	$('.inptSwitch').each(function(){
		var $target = $(this).parents('dl').find('dt');
		if ($target.length > 0) {
			$(this).attr('title',$target.text())
		}
	});

	$('.btnView').each(function(){
		$this = $(this);
		$target = $this.siblings('label').text();
		$this.attr('title',$target)
	});
	$('.agrLinkType').each(function(){
		$this = $(this);
		$thisLink = $this.find('.btn.small.w');
		$thisLink.attr('role','button')
		$target = $thisLink.siblings('.subject').text();
		$thisLink.attr('title',$target)
	});

	//연말정산 가족수 + - 접근성
	$('.personAllow .childBtnWrap button').each(function(){
		var $this = $(this);
		var $targetLabelLess = $this.parents('li').find('.tit a').text();
		var $targetLabel = $this.parents('li').find('.tit').text();
		var $labelSum = $targetLabel.replace($targetLabelLess,'');
		$this.attr('title',$labelSum)
	});
	$('.simulationWrap .childBtnWrap button').each(function(){
		var $this = $(this);
		var $targetLabelLess = $this.parents('.simulationWrap').find('.titlev2 a').text();
		var $targetLabelLess2 = $this.parents('.simulationWrap').find('.titlev2 .an_cont').text();
		var $targetLabel = $this.parents('.simulationWrap').find('.titlev2').text();
		var $labelSum = $targetLabel.replace($targetLabelLess,'').replace($targetLabelLess2,'');
		$this.attr('title',$labelSum)
	});
	$('.familySel .childBtnWrap button').each(function(){
		var $this = $(this);
		var $targetLabel = $this.parents('.childSel').find('label').text();
		$this.attr('title',$targetLabel)
	});
	$('.simulToggleArea.btn_folding').each(function(){
		var $this = $(this);
		var $targetLabel = $this.parents('.childSel').find('label').text();
		$this.attr('title',$targetLabel)
	});
	$('.simulToggleArea.btn_folding').each(function(){
		var $this = $(this);
		var $targetLabelLess = $this.parents('.simulationWrap.wrap_folding').find('.folding_top .tit a').text();
		var $targetLabelLess2 = $this.parents('.simulationWrap.wrap_folding').find('.folding_top .tit .an_cont').text();
		var $targetLabel = $this.parents('.simulationWrap.wrap_folding').find('.folding_top .tit').text();
		var $labelSum = $targetLabel.replace($targetLabelLess,'').replace($targetLabelLess2,'');
		$this.attr('title',$labelSum + ' 상세보기')
	});

	//약관 보기
	/*$('.formWrap.selectAll').each(function(){
		var $this = $(this);
		var $btn = $this.find('.btnShowHide.jsToggle');
		var $target = $this.find('.cont.jsToggleWrap');
		var $check = $this.find('.total input:checkbox');
		var $targetLabel = $this.find('.total label').text();
		$btn.attr('title',$targetLabel)
		$btn.attr('aria-expanded','true');
		$target.attr('aria-hidden','false');
		$btn.click(function(){
			$(this).toggleClass('off');
			$target.toggleClass('off');
			if ($target.hasClass('off')) {
				$target.attr('aria-hidden','true');
				$(this).attr('aria-expanded','false');
			}else{
				$target.attr('aria-hidden','false');
				$(this).attr('aria-expanded','true');
			}
		});
		$check.on('change',function(){
			if (this.checked) {
				$target.addClass('off').attr('aria-hidden','true');
				$btn.addClass('off').attr('aria-expanded','false');
			}
			else{
				$target.removeClass('off').attr('aria-hidden','false');;
				$btn.removeClass('off').attr('aria-expanded','true');
			}
		});
	});*/

	$('.formWrap.selectAll').each(function(){
		var $this = $(this);
		var $btn = $this.find('.btnShowHide.jsToggle');
		var $targetLabel = $this.find('.total label').text();
		$btn.attr('title',$targetLabel)
	});

	//datapicker input action
	$('.inptWrap.dataPicker .inptText').bind('click',function(){
		var $ClickTarget = $(this).siblings('a');
		$ClickTarget.trigger('click');
	});

	//main, submain bg
	$('.container.msBg').each(function(){
		var $targetDiv = $(this).find('.lastWhite').length;;
		if ($targetDiv < 1) {
			$('body').addClass('msBg');
		}
	});

	$('.otherFixed').each(function(){
		$('.content').css('paddingBottom','170px')
	});

	$('.btnSetting').each(function(){
		$(this).attr('role','button')
	});
	$('.popClose').each(function(){
		$(this).attr('role','button')
	});
	$('.btnFail').each(function(){
		$(this).attr('role','button')
	});

	$('.assetsBanner a').each(function(){
		$(this).attr('role','button')
	});
	$('.panels > div.panel').each(function(){
		$(this).removeAttr('role').removeAttr('tabindex')
	});
	$('.simulation_content').each(function(){
		$(this).removeAttr('tabindex')
	});

	/*$('.yearSelect .toggleBtn button').each(function(){
		if ($(this).hasClass('selected')) {
			$(this).attr('title','선택됨')
		}
	});

	$('.yearSelect .toggleBtn button').click(function(){
		if ($(this).hasClass('selected')) {
			$(this).closest('.toggleBtn').find('button').removeAttr('title');
			$(this).attr('title','선택됨')
		}else{
			$(this).removeAttr('title');
		}
	});*/

	/*$('body').scrollTop(100);
	$('.wrapper').scrollTop(100);*/

	/* 테스트 코드 */
	/*$('input:text').on('focusin',function(){
		$(this).css('background','#efefef');
		window.scrollBy(0,2);
		window.scrollBy(0,-2);
		$(this).css('background','#f9cbe6');
	});*/

	/*$(document)
		//.off('focusin', '.popWrap input:text')
		.on('focusin', '.popWrap input:text', function(e) {
			// $(this).css('background','#efefef');
			window.scrollBy(0,2);
			window.scrollBy(0,-2);
			// $(this).css('background','#f9cbe6');
		});*/


	$(document)
	.off('focus','.Android .nhd_allone .popWrap.slidePopConfirm input[type=tel], .Android .nhd_allone .popWrap.slidePopConfirm input[type=text]')
	.on('focus','.Android .nhd_allone .popWrap.slidePopConfirm input[type=tel], .Android .nhd_allone .popWrap.slidePopConfirm input[type=text]',function(){
		var $this = $(this);
		var targetLY  = $this.closest(".popWrap.slidePopConfirm");
		var origH     = targetLY.find(".popInner").height();
		var fixedAdjH = 320;
		targetLY.find(".popCont").append("<div id='AOKeyBoardHeight' style='height:0px;background-color:white;' data-origh="+origH+"></div>");
		targetLY.find(".popInner").css({"height":origH+fixedAdjH+"px"});
	})
	.off('focusout','.Android .nhd_allone .popWrap.slidePopConfirm input[type=tel], .Android .nhd_allone .popWrap.slidePopConfirm input[type=text]')
	.on('focusout','.Android .nhd_allone .popWrap.slidePopConfirm input[type=tel], .Android .nhd_allone .popWrap.slidePopConfirm input[type=text]',function(){
		console.log("[DEBUG] pfm_cb_popupAOKeyPadSettup() :: slidePopConfirm :: focusout");
		if ($("#AOKeyBoardHeight").length > 0) {
			var targetLY  = $(".Android .nhd_allone .popWrap.slidePopConfirm");
			var origH     = $("#AOKeyBoardHeight").data("origh");
			targetLY.find(".popCont").find("#AOKeyBoardHeight").remove();
			targetLY.find(".popInner").css({"height":origH+"px"});
		}
	})
	.off('focus','.Android .nhd_allone .popWrap.fullLayerPop input[type=number], .Android .nhd_allone .popWrap.fullLayerPop input[type=text]')
	.on('focus','.Android .nhd_allone .popWrap.fullLayerPop input[type=number], .Android .nhd_allone .popWrap.fullLayerPop input[type=text]',function(){
		var $this = $(this);
		var targetLY  = $this.closest(".popWrap.fullLayerPop");
		var origH     = targetLY.find(".popInner").height();
		var fixedAdjH = 320;
		targetLY.find(".popCont").append("<div id='AOKeyBoardHeight' style='height:0px;background-color:white;' data-origh="+origH+"></div>");
		targetLY.find("#AOKeyBoardHeight").css({"height":fixedAdjH+"px"});
	})
	.off('focusout','.Android .nhd_allone .popWrap.fullLayerPop input[type=number], .Android .nhd_allone .popWrap.fullLayerPop input[type=text]')
	.on('focusout','.Android .nhd_allone .popWrap.fullLayerPop input[type=number], .Android .nhd_allone .popWrap.fullLayerPop input[type=text]',function(){
		if ($("#AOKeyBoardHeight").length > 0) {
			var targetLY  = $(".Android .nhd_allone .popWrap.fullLayerPop");
			targetLY.find(".popCont").find("#AOKeyBoardHeight").remove();
		}
	})

	//메인 자산연결 플로팅 버튼 추가
	$(window).scroll(function(){
		$('.registBtn').fadeOut();
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
		$('.registBtn').fadeIn();
	});

	// s : [2022-04-25] 윤지현:접근성수정
	$('.wrapSignSelect .SignSelect').each(function (e) { 
		var SignSelectTxt = $('.wrapSignSelect .SignSelect').eq(e).find('label').text();
		$('.wrapSignSelect .SignSelect').find('label').attr('aria-hidden', 'true');
		$('.wrapSignSelect .SignSelect').find('input').eq(e).attr('aria-label', SignSelectTxt);
	})
	// e : [2022-04-25] 윤지현:접근성수정
	
	accB();
	rangeSlider();
	myCarCost();
	anchorWrap();
	loadingSlide();
	insiteSlide();
	carinsurSlide();
});

function accB(){
	$('.btn_folding').each(function(){
		$(this).attr('role','button');
		var $labelLength = $(this).parents('.titWrap').find('.assetSubject strong').length || $(this).parents('.titWrap').find('.planType').length || $(this).parents('.titWrap').find('.bankSubject strong').length;
		var $labelText = $(this).parents('.titWrap').find('.assetSubject strong').text() || $(this).parents('.titWrap').find('.planType').text() || $(this).parents('.titWrap').find('.bankSubject strong').text();
		if ($labelLength > 0) {
			$(this).attr('title',$labelText)
		}
		if ($(this).parents('.wrap_folding').hasClass('active')) { // [2022-04-25] 윤지현:접근성 수정.'.active' -> 'active'
			$(this).attr('aria-expanded','true');
		}else{
			$(this).attr('aria-expanded','false');
		}
	});

	$('.wrap_bank_check ul li.connnecting input').attr('title','자산연결중');
	
	$('.btnDetail').each(function(){
		var $labelText = $(this).parents('dl').find('dt div').text();
		$(this).attr('title',$labelText)
	});
	$('.btnDetail2').each(function(){
		var $labelText = $(this).parents('.planTitleWrap').find('.planTitleInner').text();
		$(this).attr('title',$labelText)
	});
	$('.btnDetail_block').each(function(){
		var $labelText = $(this).parents('dl').find('dt div').text();
		$(this).attr('title',$labelText + ' 상세내역보기')
	});
	$('.widthdrowDetail .btnModify').each(function(){
		var $labelText = $(this).siblings('div').text();
		$(this).attr('aria-haspopup','true').attr('title',$labelText)
	});
	$('.planTitleWrap .btnModify').each(function(){
		var $labelText = $(this).parent().siblings('div').text();
		$(this).attr('aria-haspopup','true').attr('title',$labelText)
	});
	$('.listbox.type2 .radioBtnWrap input.btn_radio').each(function(){
		var $this = $(this);
		var $targetLlabel = $this.parents('dl').find('.assetSubject strong').text();
		$this.attr('title',$targetLlabel)
	});

	$('.slideOnlychild').find('.swiper-slide').attr('aria-hidden','false');
}

function loadingSlide() {
	$('.loadSlide').each(function(){
		var $swiperContainer = $(this);
		var swiper = new Swiper('.loadSlide', {
				autoHeight : true,
				slidesPerView: 1,
				spaceBetween: 10,
				observer:true,
				loop:true,
				observeParents : true,
				autoplay:{
					delay:2000,
				},
				autoplayDisableOnInteraction:false,
				allowTouchMove:false,
				//noSwiping:true,
				/*pagination: {
					el: '.swiper-pagination',
					clickable:true
				},*/
				on : {
					init : function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
					},
					reachBeginning:function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
					}, 
					slideChangeTransitionStart:function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
					}
				}
			});
    	/*$('.stop').click(function(){
			swiper.autoplay.stop();
		})
		$('.play').click(function(){
			swiper.autoplay.start();
		})*/
	});
}

function addSlide() {
	$('.addSlide').each(function(){
		var $swiperContainer = $(this);
		var $swiperCount = $swiperContainer.find('.swiper-slide').length;
    	if ($swiperCount > 1) {
        	var swiper = new Swiper($swiperContainer, {
					autoHeight : true,
					slidesPerView: 1,
					spaceBetween: 20,
					observer:true,
					observeParents : true,
					pagination: {
						el: '.swiper-pagination',
						clickable:true
					},
					on : {
						init : function(){
							$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
							$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
						},
						reachBeginning:function(){
							$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
							$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
							$swiperContainer.find('.swiper-pagination-bullet').attr('title','');
							$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
						}, 
						slideChangeTransitionStart:function(){
							$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
							$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
							$swiperContainer.find('.swiper-pagination-bullet').attr('title','');
							$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
						}
					}
				});
        	$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
        	swiper.update();
        	$(this).removeClass('slideOnlychild');
    	}
    	else{
    		$(this).addClass('slideOnlychild');
    	}
	});
}

function insiteSlide() {
	$('.insiteSlide').each(function(){
		var $swiperContainer = $(this);
		var $swiperCount = $swiperContainer.find('.swiper-slide').length;
		if ($swiperCount > 1) {
			var swiper = new Swiper($swiperContainer, {
				autoHeight : true,
				slidesPerView: 'auto',
				spaceBetween: 20,
				observer:true,
				observeParents : true,
				pagination: {
					el: '.swiper-pagination',
					clickable:true
				},
				on : {
					init : function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
					},
					reachBeginning:function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
						$swiperContainer.find('.swiper-pagination-bullet').attr('title','');
						$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
					}, 
					slideChangeTransitionStart:function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
						$swiperContainer.find('.swiper-pagination-bullet').attr('title','');
						$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
					}
				}
			});
			$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
			swiper.update();
		}
	});
}

//자동차 보험사 슬라이딩
function carinsurSlide() {
	$('.carinsurSlide').each(function(){
		var $swiperContainer = $(this);
		var $swiperCount = $swiperContainer.find('.swiper-slide').length;
		if ($swiperCount > 1) {
			var swiper = new Swiper($swiperContainer, {
				slidesPerView: 'auto',
				spaceBetween: 10,
				centeredSlides:true,
				//observer:true,
				//observeParents : true,
				loop: true,
				autoplay:{
					delay:1500,
				},
				pagination: {
					el: '.swiper-pagination',
					clickable:true
				},
				on : {
					init : function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
					},
					reachBeginning:function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
						$swiperContainer.find('.swiper-pagination-bullet').attr('title','');
						$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
					}, 
					slideChangeTransitionStart:function(){
						$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
						$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
						$swiperContainer.find('.swiper-pagination-bullet').attr('title','');
						$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
					}
				}
			});
			var $psbtn = $swiperContainer.find('.stop');
			$psbtn.click(function(){
				$(this).toggleClass('active');
				if($(this).hasClass('active')){
					$(this).attr('title','시작');
					$(this).find('.blind').text('시작');
					swiper.autoplay.stop();
				}
				else {
					$(this).attr('title','정지');
					$(this).find('.blind').text('정지');
					swiper.autoplay.start();
				}
			});
			$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
			swiper.update();
		}
	});
}

//range Slider
function rangeSlider() {
	$('.slider-range').each(function(){
		var sliderWidget = $(this);
		var sliderRange = $(this).siblings().children('.form-input');
		var sliderBalance = $(this).siblings().children('.balance-display');
		var minVal = $(this).data('min');
		var stepVal = $(this).data('step');
		var sliderPin = $(this).hasClass('pinned');
		var pinData = $(this).data('pin');

		sliderWidget.slider({
			range: "min",
			create: function(event,ui) {
				$(this).slider('option', 'value', $(this).data('value'));
				$(this).slider('option', 'step', $(this).data('step'));
				$(this).slider('option', 'min', $(this).data('min'));
				$(this).slider('option', 'max', $(this).data('max'));
			},
			slide: function(event, ui) { 
				var balance = ui.value;
				//sliderBalance[0].selectIndex = ui.value;
				if(minVal == '0' && stepVal == '10000') {
					if (balance < 10000) {
						//var balance = 0;
					}

					if (sliderRange.length) {				
						sliderRange.val(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					} else if(sliderBalance.length) {
						sliderBalance.val(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					}
				} else {
					if (sliderRange.length) {				
						sliderRange.val(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					} else if(sliderBalance.length) {
						sliderBalance.val(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					}
				}
			},
			start: function(event, ui){
				$(this).on('slidestart', function(){
					$(this).children('.ui-slider-handle').find('.pin-data').fadeOut(300);
				});
			}
		});

		sliderBalance.on('change',function(){
			var $thisVal = $(this).val().replace(/,/g,'');
			sliderWidget.slider('value', $thisVal);
			if(minVal == '0' && stepVal == '10000') {
				if ($thisVal < 10000) {
					//var $thisVal = 0;
				}

				if (sliderRange.length) {				
					sliderRange.val($thisVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				} else if(sliderBalance.length) {
					sliderBalance.val($thisVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				}	
			} else {
				if (sliderRange.length) {				
					sliderRange.val($thisVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				} else if(sliderBalance.length) {
					sliderBalance.val($thisVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				}	
			}
		})

		if (sliderPin) {
			$(this).children('.ui-slider-handle').append('<span class="pin-data">'+ pinData + '</span>');
		}

		var slideVal = sliderWidget.slider('value');
		if(minVal == '0' && stepVal == '10000') {
			if (slideVal < 10000) {
				var slideVal = 1000;
			}

			if (sliderRange.length) {				
				sliderRange.val(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			} else if(sliderBalance.length) {
				sliderBalance.html(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			}	
		} else {
			if (sliderRange.length) {				
				sliderRange.val(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			} else if(sliderBalance.length) {
				sliderBalance.html(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			}	
		}
		$('body').addClass('rangeActive');
		setTimeout(function(){
			$('body').removeClass('rangeActive');
		},1000);
	});
}
//업권선택 앵커이동
function anchorWrap() {
	$('.anchorListdWrap').each(function(){
		$('.anchorListdWrap h3.tit').attr('tabindex','-1');
		if ($(this).hasClass('wrapperPos')) {
			$('.wrapper').addClass('wrapUnset');
		}
		var $winHeight = $(window).outerHeight();
		var $heightHeader = $('.header').outerHeight();
		var $heightTab = $('.anchorSubject').outerHeight();
		var $heightTab = $('.anchorListd').outerHeight();
		$('.anchorContWrap .wrap_bank_check:last-child').css('min-height',$winHeight - ($heightHeader + $heightTab + 140));
	});

	$('.anchorSubject a').click(function(){
		var $this = $(this);
		var $thisAttr = $this.attr('anchor-title');
		$('.wrap_bank_check').each(function(){
			var $thisTarget = $(this);
			var $targetPo = $(this).offset().top;
			//var $headerOffset = $('.header').position().top;
			var $heightHeader = $('.header').outerHeight();
			var $heightTab = $('.anchorSubject').outerHeight();
			var $hightM = $heightHeader + $heightTab;
			if ($(this).attr('anchor-cont') == $thisAttr ) {
				$(this).addClass('active');
				$('html, body').stop().animate({scrollTop:$targetPo - $hightM + 10},400,function(){
					$('.anchorSubject > li').removeClass('selected');
					$this.parent('li').addClass('selected');
					$thisTarget.find('h3.tit').focus();
				});
			}
			//console.log($targetPo)
		});
	});

	$('.anchorListdWrap').each(function(){
		$(window).on('scroll',function(){
			$('.wrap_bank_check').each(function(){
				///var $headerOffset = $('.header').position().top;
				var $targetPo = $(this).offset().top;
				var $heightHeader = $('.header').outerHeight();
				var $heightTab = $('.anchorSubject').outerHeight();
				var $hightM = $heightHeader + $heightTab;
				var $thisCur = $targetPo - $hightM ;
				var $scrollTop = $('html, body').scrollTop();
				var $thisAttr = $(this).attr('anchor-cont');
				var $targetAttr = $('anchorSubject a').attr('anchor-title');
				//console.log($thisCur,$scrollTop)
				if ($thisCur <= $scrollTop ) {
					$('.anchorSubject > li > a').each(function(){
						if ($(this).attr('anchor-title') == $thisAttr ) {
							$('.anchorSubject > li').removeClass('selected');
							$('.anchorSubject > li a').attr('aria-selected','false');
							$(this).parent('li').addClass('selected');
							$(this).attr('aria-selected','true');
							
						}
					});
					//$(this).addClass('active');
					//console.log($targetPo)
				}
			});
		});
		
	});
}

//내차 시세 금액증가
function myCarCost() {
	var $thisCost = $('.myCarValue strong');
	var memberCountContText = $thisCost.text().replace(/,/g,'');
	$({ val : 0}).animate({ val : memberCountContText}, {
		duration: 1500,
		step: function(){
			var num = numberWithCommas(Math.floor(this.val));
			$thisCost.text(num);
		},
		complete: function(){
			var num = numberWithCommas(Math.floor(this.val));
			$thisCost.text(num);
		}
	});
	function numberWithCommas(x){
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

//double Tab
$.fn.doubleTap = function(doubleTapCallback){
	return this.each(function(){
		var elm = this;
		var lastTap = 0;
		$(elm).attr('role','button')
		$(elm).bind('mousedown',function(e){
			var now = (new Date()).valueOf();
			var diff = (now - lastTap);
			lastTap = now;
			if (diff < 500) {
				if ($.isFunction(doubleTapCallback)) {
					doubleTapCallback.call(elm);
				}
			}
		})
	});
}

//반복설정 날자 정렬
function calendarAlign(){
	$('.yearSet').each(function(){
		if ($(this).hasClass('noneAction')) {
			$(this).attr('aria-hidden','true');
		}else{
			$(this).attr('aria-hidden','false');
		}
	});
	$('.yearSet ol').each(function(){
		var $this = $(this);
		var $listIndex = $this.find('a.active,button.active').attr('title','선택됨').parent('li').index() + 1;
		var $listPos = ($listIndex * 40) - 40;
		$this.scrollTop($listPos);
		/*$this.scroll(function(){
			if ($this.scrollTop() + $this.height() == $this.children('li').length * 40) {
				$this.scrollTop(0);
			}
		});*/
	});
	$('.yearSet ol a,.yearSet ol button').click(function(){
		if (!$('.yearSet').hasClass('noneAction')) {
			var $this = $(this);
			var $thisParent = $this.parents('ol').find('a,button');
			$thisParent.removeClass('active').attr('title','');
			$this.addClass('active').attr('title','선택됨');
			var $listIndex = $this.parents('ol').find('a.active,button.active').parent('li').index() + 1;
			var $listPos = ($listIndex * 40) - 40;
			//$this.parents('ol').scrollTop($listPos);
			$this.parents('ol').stop().animate({scrollTop:$listPos},300);
			//console.log($listPos)
		}
	});

	var scrollEndEvntTimerId;
	function visibleEvnt(){
		var el = this;
		var items = $(el).find('li');
		var idx = Math.round($(el).scrollTop() / 40);
		items.eq(idx).addClass('on').children().addClass('active').parent().siblings().removeClass('on').children().removeClass('active');

		//scroll end event capture
		clearTimeout(scrollEndEvntTimerId);
		scrollEndEvntTimerId = setTimeout(function(){
			$('.yearSet > ol').off('scroll',visibleEvnt);
			$(el).stop().animate({scrollTop:idx *40},{
				duration:40,
				step:function(now, fx){
					if(fx.pos == 1){
						$(this).scrollTop((idx *40) - 40);
						setTimeout(function(){
							$('.yearSet > ol').on('scroll',visibleEvnt);
						},100)
					}
				}
			});
		},100);
		
	};

	setTimeout(function(){
		$('.yearSet > ol').on('scroll',visibleEvnt)
	},500);
}

//시뮬레이션 화면이동
function goStep(id){
	var uid = $(id);
	$('.simulation_content').removeClass('selected').attr('aria-hidden','true');
	uid.addClass('selected').attr('aria-hidden','false');
	$('.simulation_content').each(function(){
		$(this).removeAttr('tabindex')
	});
	//$('html, body').stop().animate({scrollTop:0},400);
	$('html, body').scrollTop(0);
}