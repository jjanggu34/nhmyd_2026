/*
 * [SEPTEM] UI Dev Team
 * @description [SEPTEM] Core Library
 */
;(function() {
	var Class = {
		winHeight:0
		, winWidth:0
		, didScroll:false
		, isMobile: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? true : false
		, isWide : false
		, evTouchStart: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchstart' : 'mousedown'
		, evTouchMove: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchmove' : 'mousemove'
		, evTouchEnd: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchend' : 'mouseup'
		, evTouchCancel: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchcancel' : 'mouseover'
		, animEndEventName : {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		}[ Modernizr.prefixed( 'animation' ) ],
		/* initBrowser */	initBrowserOnce: function initBrowserOnce() {
			var ua = navigator.userAgent;
			if((/Android/i).test(ua)) {
				$('html').addClass('Android').data('browser', 'Android');
				var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
				// ua.match(/android\s([0-9\.]*)/i);
				// console.log(androidversion);
				if (androidversion < 4.5) $('html').addClass('androidLow');
				if (androidversion == 4.4) $('html').addClass('android4d4');
			} else if((/iPad|iPhone|iPod/i).test(ua)) {
				$('html').addClass('iOS').data('browser', 'iOS');
			} else if((/Chrome/i).test(ua)) {
				$('html').addClass('Chrome').data('browser', 'Chrome');
			}
		}, 
		/* a preventDefault */	initHrefOnce: function initHrefOnce(){
			$(document)
				.on('click', 'a[href="#"]', function(e){
					e.preventDefault();
				});
		},
		/* address bar 감추기 */	initHideAddressBarOnce: function initHideAddressBarOnce() {
			setTimeout(function() {window.scrollTo(0, 1)}, 100);
		},
		/* jsTabs */	initTabsCtrlOnce: function initTabsCtrlOnce(){
			var $tabWrap = $('.dfs .jsTabs');
			var $scrollTabWrap = $('.dfs .jsTabs.scroll');
			var $tabIndex = 1000;
			Class.winWidth = window.innerWidth;
			for(var i=0; i<$tabWrap.length; i++) {
				var $tabWraps = $($tabWrap[i]).data('order', $tabIndex++);
				if($($tabWrap[i]).hasClass('scroll')){
					$($tabWrap[i]).find('>ul').wrap('<div class="scrollWrap"></div>');
                }
                if($($tabWrap[i]).hasClass('scroll')){
					var $num = $($tabWrap[i]).find('.tabs>li').length;
					$($tabWrap[i]).children('ul, a').wrapAll('<div class="scrollWrap"></div>');
				} else {
					$num = $($tabWrap[i]).find('>.tabs>li').length;
				}
                if(!$($tabWrap[i]).hasClass('noDivision')){
					if($num == 1){
						$($tabWrap[i]).addClass('alone');
					} else if ($num>1){
						$($tabWrap[i]).find('>.tabs>li').css({'width' : 100/$num +'%'});
						//if($($tabWrap[i]).hasClass('scroll') && $($tabWrap[i]).hasClass('type03'))$($tabWrap[i]).find('.tabs>li').css({'width' : (Class.winWidth-40)/3});
					}
				}
			}
			//스크롤 tab 위치조정
			if($scrollTabWrap.find('.tabs .selected').length){
				setTimeout(function(){
					$scrollTabWrap.each(function() {
						var $obj = $(this);
						var $tabPos = $obj.find('.selected').position().left;
						$tabPos = Math.floor($tabPos);
						if($tabPos >= (Class.winWidth*.5)){
							$obj.find('.scrollWrap').scrollLeft($tabPos - ($tabPos - (Class.winWidth + 20)));
						}
					});
				},300);
			} 

			$(document)
				.off('click', '.dfs .jsTabs:not(.link) .tabs>li a')
				.on('click', '.dfs .jsTabs:not(.link) .tabs>li a', function(e) {
					var $current = $(this).closest('li');
					var index = $current.index();
					var $panels = $current.parent().siblings('.panels').length > 0 ? $current.parent().siblings('.panels') : $current.parents('.scrollWrap').siblings('.panels');
					$current.addClass('selected').find('>a').attr('aria-selected','true');
					$current.siblings().removeClass('selected').find('>a').attr('aria-selected','false');
					var $target = $panels.find('>.panel:eq(' + index + ')');
					if($current.closest('.boxMyNhUserSet').length){
						var $targetH = $target.outerHeight();
						$current.closest('.boxMyNhUserSet').css({'height': $targetH + 60});
						setTimeout(function(){
							$target.addClass('selected').siblings().removeClass('selected').removeAttr('tabindex');
						},100);
					} else {
						$target.addClass('selected').siblings().removeClass('selected').removeAttr('tabindex');
					}

					// 공통, 추천서비스
					if($('.popInner.dfs.service').length){
						var $obj = $('.popInner.dfs.service');
						var $txt = $current.find('>a').text();
						if(!$obj.hasClass('nhsh')){
							if($txt == '농·축협'){
								$obj.addClass('nhsh');
							}
						} else {
							if($txt == '농협은행'){
								$obj.removeClass('nhsh');
							}
						}
					}
					e.stopPropagation();
					e.preventDefault();
				});
		},
		/* jsAcc */	initAccordionOnce: function initAccordionOnce(){
			$(document)
				.off('showAcc', '.dfs .jsAcc .view')
				.on('showAcc', '.dfs .jsAcc .view', function(e) {
					$(this).closest('.jsAcc').find('.view').slideUp(200).attr('aria-hidden', "true");
					$(this).slideDown(200).attr('aria-hidden', "false");
					e.preventDefault();
					e.stopPropagation();
				})
				.off('hideAcc', '.dfs .jsAcc .view')
				.on('hideAcc', '.dfs .jsAcc .view', function(e) {
					$(this).closest('.jsAcc').find('.view').slideUp(200).attr('aria-hidden', "true");
					e.preventDefault();
					e.stopPropagation();
				})
				.off('showOneAcc', '.dfs .jsAcc .view')
				.on('showOneAcc', '.dfs .jsAcc .view', function(e) {
					$(this).slideDown(200).attr('aria-hidden', "false");
					e.preventDefault();
					e.stopPropagation();
				})
				.off('hideOneAcc', '.dfs .jsAcc .view')
				.on('hideOneAcc', '.dfs .jsAcc .view', function(e) {
					$(this).slideUp(200).attr('aria-hidden', "true");
					e.preventDefault();
					e.stopPropagation();
				})
				.off('showAllAcc', '.dfs .jsAcc .view')
				.on('showAllAcc', '.dfs .jsAcc .view', function(e) {
					$(this).closest('.jsAcc').find('.view').slideDown(200).attr('aria-hidden', "false");
					e.preventDefault();
					e.stopPropagation();
				})
				.off('hideAllAcc', '.dfs .jsAcc .view')
				.on('hideAllAcc', '.dfs .jsAcc .view', function(e) {
					$(this).closest('.jsAcc').find('.view').slideUp(200).attr('aria-hidden', "true");
					e.preventDefault();
					e.stopPropagation();
				})
				.off('click', '.dfs .jsAcc:not(.multi) .header')
				.on('click', '.dfs .jsAcc:not(.multi) .header', function(e) {
					var $obj = $(this);
					var $target = $obj.attr('aria-controls');
					if(!$obj.hasClass('active')){
						$obj.closest('.jsAcc').find('.header').removeClass('active').attr('aria-expanded', 'false');
						$obj.closest('.jsAcc').find('.view').removeClass('active');
						$('.view[data-acc-view="'+ $target +'"]').addClass('active').trigger('showAcc');
						$obj.addClass('active').attr('aria-expanded', 'true');
					} else {
						$obj.closest('.jsAcc').find('.header').removeClass('active').attr('aria-expanded', 'false');
						$obj.closest('.jsAcc').find('.view').removeClass('active');
						$('.view[data-acc-view="'+ $target +'"]').removeClass('active').trigger('hideAcc');
						$obj.removeClass('active').attr('aria-expanded', 'false');
					}
					e.preventDefault();
					e.stopPropagation();
				})
				.off('click', '.dfs .jsAcc.multi .header')
				.on('click', '.dfs .jsAcc.multi .header', function(e) {
					var $obj = $(this);
					var $target = $obj.attr('aria-controls');

					if(!$obj.hasClass('active')){
						$('.view[data-acc-view="'+ $target +'"]').addClass('active').trigger('showOneAcc');
						$obj.parent('.holder').addClass('active');
						$obj.addClass('active').attr('aria-expanded', 'true');
					} else {
						$('.view[data-acc-view="'+ $target +'"]').removeClass('active').trigger('hideOneAcc');
						$obj.parent('.holder').removeClass('active');
						$obj.removeClass('active').attr('aria-expanded', 'false');
					}
					e.preventDefault();
				})
				.off('click','.jsAcc.multi .jsSHowAll')
				.on('click','.jsAcc.multi .jsSHowAll',function(e){
					var $obj = $(this);
					var $target = $obj.data('acc');
					var $acc = $('.view[data-acc-view="'+ $target +'"]');
					$acc.closest('.jsAcc').find('.header').addClass('active').attr('aria-expanded', 'true');
					$acc.closest('.jsAcc').find('.view').addClass('active').trigger('showAllAcc');
					e.preventDefault();
				})
				.off('click','.jsAcc.multi .jsHideAll')
				.on('click','.jsAcc.multi .jsHideAll',function(e){
					var $obj = $(this);
					$obj.closest('.jsAcc').find('.header').removeClass('active').attr('aria-expanded', 'false');
					$obj.closest('.jsAcc').find('.view').removeClass('active').trigger('hideAllAcc');
					e.preventDefault();
				})
				.off('click','.jsAccShowAll')
				.on('click','.jsAccShowAll',function(e){
					var $obj = $(this);
					var $target = $obj.data('acc');
					var $acc = $('.view[data-acc-view="'+ $target +'"]');
					$acc.find('.header').addClass('active').attr('aria-expanded', 'true');
					$acc.find('.view').addClass('active').trigger('showAllAcc');
					e.preventDefault();
				})
				.off('click','.jsAccHideAll')
				.on('click','.jsAccHideAll',function(e){
					var $obj = $(this);
					var $target = $obj.data('acc');
					var $acc = $('.view[data-acc-view="'+ $target +'"]');
					$acc.find('.header').removeClass('active').attr('aria-expanded', 'false');
					$acc.find('.view').removeClass('active').trigger('hideAllAcc');
					e.preventDefault();
				});
		},
		/* Toggle */	initToggleOnce: function initToggleOnce() {
			//if ($('.jsToggle').hasClass('icoQuestion')) {
				$(document)
				.off('toggleHide','.dfs .jsToggleWrap')
				.on('toggleHide','.dfs .jsToggleWrap',function(e) {
					var container = $('.jsToggleWrap.on');
					if (!container.is(e.target) && container.has(e.target).length === 0){
							$('.jsToggle.on').removeClass('on').attr('aria-expanded', 'false');
							$('.jsToggleWrap.on').slideUp(200).removeClass('on').attr('aria-hidden', 'true');
						}
				})
				.off('click', '.dfs .jsToggle')
				.on('click', '.dfs .jsToggle', function(e) {
					var $obj = $(this);
					var target = $obj.data('toggle-target');
					var $text = $obj.text();
					if(typeof target === 'undefined') {
						$target= $obj;
					} else {
						$target = $('.jsToggleWrap[data-toggle-view="'+ target +'"]');
					}
	                if(!$obj.hasClass('on')){
						$obj.addClass('on').attr('aria-expanded', 'true');
						if($obj.data('text')){
							var $textTo = $obj.data('text');
							$obj.data('text', $text).text($textTo);
						}
						if(typeof target === 'undefined') {
							$target= $obj;
						} else {
							//$( 'html, body' ).stop().animate({scrollTop:$target.offset().top},400);
							$target.addClass('on').show().attr('aria-hidden', 'false')/*.attr('tabindex', -1).focus()*/;
							//$target.find('.cls').focus();
						}
	                } else {
						$obj.removeClass('on').attr('aria-expanded', 'false');
						if($obj.data('text')){
							var $textTo = $obj.data('text');
							$obj.data('text', $text).text($textTo);
						}
						if(typeof target === 'undefined') {
							$target= $obj;
						} else {
							$target.removeClass('on').hide().attr('aria-hidden','true'); //.attr('tabindex', 0).focus();
						}
	                }
					e.preventDefault();
				})
				.off('click','.dfs .jsToggleWrap .cls')
				.on('click','.dfs .jsToggleWrap .cls', function(e){
					var target = $(this).data('toggle-origin');
					var $target = $('.jsToggle.on[data-toggle-target="'+ target +'"]');
					$(this).closest('.jsToggleWrap').hide().removeClass('on').attr('aria-hidden', 'true');
					$target.removeClass('on').attr('aria-expanded', 'false').focus();
				})
				/*.off('focusout','.dfs .jsToggleWrap')
				.on('focusout','.dfs .jsToggleWrap', function(e){
					var target = $(this).find('.cls').data('toggle-origin');
					var $target = $('.jsToggle.on[data-toggle-target="'+ target +'"]');
					$(this).closest('.jsToggleWrap').hide().removeClass('on').attr('aria-hidden', 'true');
					$target.removeClass('on').attr('aria-expanded', 'false')//.focus();
				})*/
				.off('click','.dfs .jsToggleWrap.accInfoMore ul li a')
				.on('click','.dfs .jsToggleWrap.accInfoMore ul li a', function(e){
					var $obj = $(this);
					var target = $obj.closest('.jsToggleWrap.accInfoMore').data('toggle-view');
					$('.jsToggle[data-toggle-target="'+ target +'"]').removeClass('on').attr('aria-expanded', 'false');
					$obj.closest('.jsToggleWrap.accInfoMore').slideUp(200).removeClass('on').attr('aria-hidden', 'true');
				})
				.off(Class.evTouchEnd)
				.on(Class.evTouchEnd,function(e) {
					var container = $('.accInfoMore.jsToggleWrap.on, .btnAccAdm.jsToggle.on');//.inptWrap.on,
					if (!container.is(e.target) && container.has(e.target).length === 0){
							$('.btnAccAdm.jsToggle.on').removeClass('on').attr('aria-expanded', 'false');
							$('.accInfoMore.jsToggleWrap.on').slideUp(200).removeClass('on').attr('aria-hidden', 'true');
						}
				});
			//}
		},
		/* link focus */ linkFocus: function linkFocus(){
			var $touchObj = $(this);
			$touchObj.closest('li').addClass('touch');
			setTimeout(function(){
				$touchObj.closest('li').removeClass('touch');
			},500);
		},	
		/* form 삭제버튼 */	initFormMotionOnce : function initFormMotionOnce(){
			var $html = $('html');
			var $body = $('body');
			if($('.dfs .inptWrap:not(.noDel)').length>0){
				$('.dfs .inptWrap:not(.noDel)').each(function(){
					if($(this).find('input').val().length>0){
						$(this).find('input').addClass('inputed');
					} 
					// if(!$(this).find('.btnInptReset').length){
					// 	$(this).append('<button type="button" class="btnInptReset"><span class="blind">입력 텍스트 삭제</span></button>');
					// }
				});
			}
			$(document)
				.off('click', '.dfs .inptWrap .btnInptReset')
				.on('click', '.dfs .inptWrap .btnInptReset', function(e){
					var $reset = $(this);
					if($reset.closest('.popWrap:not(.fullLayerPop)').length){ 
						setTimeout(function(){
							$reset.siblings('input').val('').focus().removeClass('inputed');
							$reset.css({'display':'none'});
						},500);
					} else {
						$reset.siblings('input').val('').focus().removeClass('inputed');
						$reset.css({'display':'none'});
					}
					//e.preventDefault();
				})
				.off('focus, focusin', '.dfs .inptWrap input:not([readonly])')
				.on('focus, focusin', '.dfs .inptWrap input:not([readonly])' , function(e){
					if($(this).val()!==''){
						$(this).siblings('.btnInptReset').css({'display':'block','opacity':'1'});
					}
					$(this).parent('.inptWrap').addClass('on');
					if($(this).closest('.fieldGroup.type').length || $(this).closest('.flexGroup').length){
						$(this).closest('.fieldGroup.type').addClass('on');
						$(this).closest('.flexGroup').addClass('on');
					}
					$(this).css('paddingRight','0px');
				})
				.off('keyup', '.dfs .inptWrap input:not([readonly])')
				.on('keyup', '.dfs .inptWrap input:not([readonly])' , function(e){
					if($(this).val()!==''){
						$(this).addClass('inputed').siblings('.btnInptReset').css({'display':'block','opacity':'1'});
						$(this).parent('.inptWrap').addClass('on');
					} else {
						$(this).removeClass('inputed').siblings('.btnInptReset').css({'opacity':'0'});
						$(this).parent('.inptWrap').removeClass('on');
					}
				})
				.off('blur, focusout', '.dfs .inptWrap input:not([readonly])')
				.on('blur, focusout', '.dfs .inptWrap input:not([readonly])' , function(e){
					var $input = $(this);
					if($input.closest('.fieldGroup.type').length || $input.closest('.flexGroup').length){
						$input.closest('.fieldGroup.type').removeClass('on');
						$input.closest('.flexGroup').removeClass('on');
						setTimeout(function(){
							$input.parent('.inptWrap').removeClass('on');

						},100);
					} else {
						$input.parent('.inptWrap').removeClass('on');

					}
					//$input.siblings('.btnInptReset').css({'opacity':'0'});
					$input.css('paddingRight','22px');

				});
		},
		/* swiper js */   initSwiperOnce : function initSwiperOnce(){
			if($('.dfs .swiper-container:not(.global)').length>0){
                var $swiperContainer = $('.dfs .swiper-container');
                $swiperContainer.each(function(){
                    var $swiperContainer = $(this);
                    if($swiperContainer.hasClass('fraction')){
                        var swiper = new Swiper($swiperContainer, {
                            slidesPerView: 1,
							spaceBetween: 10,
							observer:true,
							observeParents : true,
							pagination: {
                                el: '.swiper-pagination',
                                type: 'fraction',
							},
							on: {
								init : function(){
									$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
									$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
								}, 
								slideChangeTransitionEnd : function(){
									$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
									$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									$swiperContainer.find('.swiper-slide .jsToggleWrap').trigger('toggleHide');
								}
							}
                        });
                    } else if($swiperContainer.hasClass('prevNext')){
                        var swiper = new Swiper($swiperContainer, {
                            slidesPerView: 1,
                            spaceBetween: 12,
                            observer:true,
                            observeParents : true,
                            // loop: true,
                            pagination: {
                                el: '.swiper-pagination',
                                type: 'fraction',
                            },
                            navigation: {
                                nextEl: '.next',
                                prevEl: '.prev',
							},
							on : {
								init : function(){
									$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
									$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
								}, slideChangeTransitionEnd:function(){
									$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
									$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
								}
							}
                        });
                    } else if($swiperContainer.hasClass('brMainAcc') || $swiperContainer.hasClass('gbMainSwiper')){
                        var swiper = new Swiper($swiperContainer, {
                            slidesPerView: 1,
							spaceBetween: 10,
							observer:true,
							observeParents : true,
							pagination: {
								el: '.swiper-pagination',
								clickable:true
							},
							on: {
								init: function () {
									var slidesLen = $swiperContainer.find('.swiper-slide:not(.swiper-slide-duplicate)').length;
									if($swiperContainer.hasClass('gbMainSwiper')){
										$swiperContainer.find('.swiper-slide .swPaging .pageNum').html(1+'<span class="blind">' + common_cfGetGlMessage("G1001") + '</span>'); 
										$swiperContainer.find('.swiper-slide .swPaging .totalNum').html('<span class="blind">' + common_cfGetGlMessage("G1002") + '</span>' + slidesLen);
									} else {
										$swiperContainer.find('.swiper-slide .swPaging .pageNum').html(1+'<span class="blind">번째 목록</span>'); 
										$swiperContainer.find('.swiper-slide .swPaging .totalNum').html('<span class="blind">전체 목록은</span>' + slidesLen);
									}
									$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
									$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									//console.log($swiperContainer.attr('class'));
								},
								slideChangeTransitionEnd : function(){
									var slidesLen = swiper.slides.length;
									$swiperContainer.find('.swPaging .pageNum').html(swiper.realIndex + 1 + '<span class="blind">번째 목록</span>');
									$swiperContainer.find('.swPaging .totalNum').html('<span class="blind">전체 목록은</span>' + slidesLen);
									if($swiperContainer.hasClass('gbMainSwiper')){
										$swiperContainer.find('.swPaging .pageNum').html(swiper.realIndex + 1 + '<span class="blind">' + common_cfGetGlMessage("G1001") + '</span>');
										$swiperContainer.find('.swPaging .totalNum').html('<span class="blind">' + common_cfGetGlMessage("G1002") + '</span>' + slidesLen);
									} else {
										$swiperContainer.find('.swPaging .pageNum').html(swiper.realIndex + 1 + '<span class="blind">번째 목록</span>');
										$swiperContainer.find('.swPaging .totalNum').html('<span class="blind">전체 목록은</span>' + slidesLen);
									}
									$swiperContainer.find('.swiper-slide .jsToggleWrap').trigger('toggleHide');
									if(!$swiperContainer.is('.nhAcc, .gbMainSwiper')){
										endSwiper(swiper.realIndex);
									}
									$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
									$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
								}
							}
						});
                    } else if ($swiperContainer.hasClass('autoplay')) {
                    	var $swiperCount = $swiperContainer.find('.swiper-slide').length;
                    	if ($swiperCount > 1) {
                    		var swiper = new Swiper($swiperContainer, {
								autoHeight : true,
								slidesPerView: 1,
								spaceBetween: 10,
								observer:true,
								loop:true,
								observeParents : true,
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
							$swiperContainer.find('.stop').show()
							$swiperContainer.find('.swiper-pagination-bullet.swiper-pagination-bullet-active').attr('title','현재 페이지');
                    	}else{
                    		$swiperContainer.find('.stop').hide()
                    	}
                    } else if ($swiperContainer.hasClass('msBannerWrap')) {
                    	var $swiperCount = $swiperContainer.find('.swiper-slide').length;
                    	if ($swiperCount > 1) {
	                    	var swiper = new Swiper($swiperContainer, {
									autoHeight : true,
									slidesPerView: 1,
									spaceBetween: 10,
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
	                    	$(this).removeClass('slideOnlychild');
                    	}else{
                    		$(this).addClass('slideOnlychild');
                    	}
                    } else {
						if($swiperContainer.hasClass('col2')){
							var swiper = new Swiper($swiperContainer, {
								slidesPerView: 2,
								slidesPerGroup: 2,
								spaceBetween: 15,
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
									slideChangeTransitionEnd:function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									}
								}
							});
						} else {
							var swiper = new Swiper($swiperContainer, {
								autoHeight : true,
								slidesPerView: 1,
								spaceBetween: 10,
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
									}, 
									slideChangeTransitionStart:function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									}
								}
							});
						}
					}
				});
			}
		},
		/* radio, checkbox 세팅 */		initCheckboxRadioOnce: function initCheckboxRadioOnce() {
			$(document)
				.off('click', 'input:radio, input:checkbox')
				.on('click', 'input:radio, input:checkbox', function(e) {
					var $input = $(this);
					var name = $input.attr('name');
					var id = $input.attr('id');
					var type = $input.attr('type');

					if(type=='radio') {
						$('input[name="'+name+'"]')
							.each(function() {
								var id=$(this).attr('id');
								$('label[for="'+id+'"]').closest('.formHolder.radio:not(.noCtrl), .btnHolder.radio:not(.noCtrl)').removeClass('active');
								//$('label[for="'+id+'"]').siblings('input').removeAttr('checked');
							});
							$('label[for="'+id+'"]').closest('.formHolder.radio:not(.noCtrl), .btnHolder.radio:not(.noCtrl)').addClass('active');
							//$('label[for="'+id+'"]').siblings('input').attr('checked','true');
					} else {
						if(!$input.closest('.formHolder:not(.noCtrl)').hasClass('active')) {
							$('label[for="'+id+'"]').closest('.formHolder.check:not(.noCtrl), .formHolder.switchType:not(.noCtrl)').addClass('active');
						} else {
							$('label[for="'+id+'"]').closest('.formHolder.check:not(.noCtrl), .formHolder.switchType:not(.noCtrl)').removeClass('active');
						}
					}
				});
		},
		/* scroll */	initWindowScroll: function initWindowScroll(){
			var $html = $('html');
			var $headerH = $html.find('div.header').outerHeight();
			var $content = $html.find('.container>.content');
			var $areaBtmQuick = $(".areaBtmQuick");
		}, 
		/* 스크린 크기 변경시 */	initResizeOnce: function initResizeOnce() {
			$(window)
				.on('resize', function() {
					Class.winWidth = window.innerWidth;
					Class.winHeight = window.innerHeight;

					/* 가로비율 */
					if(Class.winWidth>=768) {
						$('html').removeClass('wine small normal').addClass('mobile wide');
						Class.isWide = true;
					} else if(Class.winWidth<=320) {
						$('html').removeClass('wine wide normal').addClass('mobile small');
						if(Class.winHeight<=455){
							$('html').addClass('wine');
						}
						Class.isWide = false;
					} else {
						$('html').removeClass('wine wide small').addClass('mobile normal');
						Class.isWide = false;
					}
					Class.setLayout();
				})
				.trigger('resize');
		},
		/* window load */   initLoadOnce: function initLoadOnce(){
			$(window)
				.on('load',function(){
				});
		},
		/* 레이아웃 세팅 */	setLayout: function setLayout() {
			var $html = $('html');
			var $header = $('div.header');
			Class.winWidth = window.innerWidth;
			Class.winHeight = window.innerHeight;
			if($('.areaBtnDefault').length){
				$('.areaBtnDefault, .btnWrap.foot').each(function(e){
					var $num = $(this).find('>a, .btn').length;
					$num = 'n'+$num;
					$(this).addClass($num);
				});
			}
            if($('.popWrap .popBtnWrap .popBtn').length){
				$('.popWrap .popBtnWrap .popBtn').each(function(e){
					var $text = $(this).find('>a:first-child, .btn:first-child').text();
					var $textNum = $text.replace(/ /gi,"").length;
					var $btn = $(this).find('>a:first-child, .btn:first-child');
					if($textNum>5) $btn.addClass('half');
				});
			}
			if($('.balanceSet .formHolder.switchType').length){
				if($('.balanceSet .formHolder.switchType').hasClass('active')){
					$('.swiper-container.brMainAcc').each(function(){
						$(this).find('.accGbPrice .isBal, .accGbPrice .errBal').addClass('on');
						$(this).find('.accGbPrice .notBal').removeClass('on');
					});
				} else{
					$('.swiper-container.brMainAcc').each(function(){
						$(this).find('.accGbPrice .isBal, .accGbPrice .errBal').removeClass('on');
						$(this).find('.accGbPrice .notBal').addClass('on');
					});
				}
			}
			if($('.dfs .jsTabs.boxMyNhUserSet').length){
				var $obj = $('.jsTabs.boxMyNhUserSet');
				var $targetH = $obj.find('.panel.selected').outerHeight();
				console.log($targetH);
				$obj.css({'height': $targetH + 60});
			}
			if($('.popInner.dfs.service').length){
				// var $class = $('.popInner.dfs.service').find('.jsTabs.type01>.tabs .selected').index();
				// if($class){
				// 	$('.popInner.dfs.service').addClass('nhsh');
				// } else {
				// 	$('.popInner.dfs.service').removeClass('nhsh');
				// }
				setTimeout(function(){
					var $popContH = $('.popInner.dfs.service').find('.popCont').outerHeight();
					$('.popInner.dfs.service').find('.jsTabs.type01').css({'height':$popContH - 176});
				},0)
			}
			if($('.formHolder.active').length || $('.btnHolder.active').length){
				$('.formHolder.active, .btnHolder.active').each(function(){
					$(this).find('input').attr('checked','true');
				});
			}
			if($('.dfs .swiper-container:not(.global)').length>0){
				var $swiperContainer = $('.dfs .swiper-container');
				$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
				$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
			}
		},
		/* nhComUi 초기화 */
		init: function() {
			for(var func in Class) {
				if(Class.hasOwnProperty(func)) {
					if(func !== 'init' && func.indexOf('init')==0) {
						var $document = $(document);
						if(func.lastIndexOf('Once')+4 == func.length && !$document.data(func)) {
							$document.data(func, true);
							Class[func].call(this);
						} else if (func.lastIndexOf('Once')+4 != func.length) {
							Class[func].call(this);
						}
					}
				}
			}
		}
	};
	if(typeof this['nhComUi'] !== 'undefined') {
		this['nhComUi']['mobile']=Class;
	} else {
		this['nhComUi'] = {mobile:Class};
	}
})();

//nhComUi.mobile.toast(navigator.userAgent);
$.fn.nhComUi = nhComUi.mobile.init;
$(function() {
	var $html = $('html');
	var $body = $('body');
	$(document).nhComUi();

	if($('.container').hasClass('dfs')){
		$('html').addClass('dfs');
	} else {
		var ua = navigator.userAgent;
		if((/Android/i).test(ua)) {
			$('html').addClass('Android').data('browser', 'Android');
			var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
		} else if((/iPad|iPhone|iPod/i).test(ua)) {
			$('html').addClass('iOS').data('browser', 'iOS');
		} else if((/Chrome/i).test(ua)) {
			$('html').addClass('Chrome').data('browser', 'Chrome');
		}
		$('.areaBtnDefault, .btnWrap.foot').each(function(e){
			var $num = $(this).find('>a, .btn').length;
			$num = 'n'+$num;
			$(this).addClass($num);
		});
		$('.popWrap.centerLayer .popBtnWrap .popBtn').each(function(e){
			var $textNum = $(this).find('>a:first-child, .btn:first-child').text().length;
			var $btn = $(this).find('>a:first-child, .btn:first-child');
			if($textNum>5) $btn.addClass('half');
			//console.log($textNum);
		});
	}
	$(document)
		.on('focus, focusin, click', 'input:not([type=radio]):not([type=checkbox])', function(e){
			$html.addClass('keypad');
		})
		.on('keypress, keyup', 'input:not([type=radio]):not([type=checkbox])', function(e){
			$html.addClass('keypad');
		})
		.on('blur, focusout', 'input:not([type=radio]):not([type=checkbox])' , function(e){
			$html.removeClass('keypad');
		});
});

