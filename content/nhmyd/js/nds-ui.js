/* 2026-07-28 */
/*
 * [di9] UI Dev Team
 * update/ , sample_update/ 화면(.nds 컴포넌트)에서 공통으로 쓰는 UI 스크립트.
 * head-mb-update.js가 <head>에서 document.write로 주입하므로,
 * DOM 참조는 반드시 DOMContentLoaded 이후에 실행합니다.
 */

/*
 * popClose() / calendarAlign() 오버라이드
 * ---------------------------------------------------------------
 * 레거시 common_ui.js/nhasset-ui.js의 popClose()/calendarAlign()은 다음을 하드코딩한다:
 *   - popClose(): $(".dim")로 페이지 내 모든 dim을 한번에 닫음 (팝업이 한 번에 하나만 뜬다는 가정)
 *   - calendarAlign(): .yearSet의 행 높이를 40px로 하드코딩(scrollTop = index*40)
 * 두 가정 모두 NH_MD_UI_05_05(bottomsheet + centerLayer 동시 노출, yearSet 커스텀 padding)에서
 * 깨졌다. common_ui.js/nhasset-ui.js는 사이트 전역 250여개 레거시 페이지가 그 가정에 맞춰 쓰고
 * 있으므로 그대로 두고, 여기 nds-ui.js(= head-mb-update.js를 쓰는 update/·sample_update/ 화면만
 * 로드, 현재 5개 페이지)에서만 재정의해서 .nds 화면 전체가 이 개선된 동작을 공유하도록 한다.
 * (처음에는 NH_MD_UI_05_05.html 페이지 로컬 <script>에 있었으나, 다른 .nds 화면에서도 재사용
 * 가능하도록 여기로 옮김.)
 */

window.popClose = function (e) {
	scrollPosY = ($("body").css("top"));
	var $popWrap = $(e).closest(".popWrap");
	var $slidePopInner = $popWrap.find(".popInner");
	var isSlidePop = $popWrap.hasClass("slidePopOption") || $popWrap.hasClass("slidePopConfirm") || $popWrap.hasClass("bankSetWrap");

	// 클릭한 popWrap 자신의 dim만 닫는다(전역 $(".dim") 대신 스코프 적용) —
	// 다른 popWrap(예: 뒤에 남은 bottomsheet)이 열려있어도 그쪽 dim은 그대로 유지된다.
	$popWrap.find(".dim").fadeOut(100);

	if (isSlidePop) {
		$slidePopInner.animate({ height: 0 }, 150, function () {
			$popWrap.hide();
		});
	} else {
		$popWrap.hide();
	}

	// 다른 popWrap이 아직 열려있으면 scrollUnlock하지 않는다 —
	// 그렇지 않으면 뒤에 남은 popWrap이 모달인데도 배경 스크롤이 풀려버린다.
	if ($(".popWrap:visible").not($popWrap).length === 0) {
		scrollUnlock(scrollPosY);
	}

	$("#popupLayer_div").children(".fullLayerPop").children(".fullLayerPop").attr("aria-hidden", false).removeAttr('inert');
	$("#popupLayer_div").children(".fullLayerPop").attr("aria-hidden", false).removeAttr('inert');
};

window.calendarAlign = function () {
	$('.yearSet').each(function () {
		if ($(this).hasClass('noneAction')) {
			$(this).attr('aria-hidden', 'true');
		} else {
			$(this).attr('aria-hidden', 'false');
		}
	});

	$('.yearSet > ol').each(function () {
		var $ol = $(this);
		var rowH = $ol.children('li').first().outerHeight(); // 실제 행 높이 측정(하드코딩 40 대신)
		if (!rowH) { return; }
		// box-sizing:border-box인 <ol>에 jQuery .height()를 쓰면 "현재 padding을 뺀"
		// content-height가 나와서(예: 200px 박스에 padding:80px 0이 남아있으면 40으로 잘못
		// 측정됨) 실제 고정 뷰포트 높이(200px)를 얻으려면 .outerHeight()를 써야 한다.
		var viewH = $ol.outerHeight();
		var padY = Math.max(0, (viewH - rowH) / 2); // 실측 행 높이 기준으로 센터링 여백 계산
		// update.css의 ".yearSet > ol{padding:80px 0 !important}" 폴백 규칙을 이겨야 하므로
		// jQuery .css() 대신 !important를 직접 지정한다(인라인 스타일이라도 !important 없이는
		// 스타일시트의 !important 규칙을 이길 수 없다).
		this.style.setProperty('padding', padY + 'px 0', 'important');
		$ol.data('rowH', rowH);

		var $listIndex = $ol.find('a.active,button.active').attr('title', '선택됨').parent('li').index();
		$ol.scrollTop($listIndex * rowH);
	});

	$('.yearSet ol a,.yearSet ol button').click(function () {
		if ($('.yearSet').hasClass('noneAction')) { return; }
		var $this = $(this);
		var $ol = $this.parents('ol');
		var rowH = $ol.data('rowH') || $ol.children('li').first().outerHeight();
		var $thisParent = $ol.find('a,button');
		$thisParent.removeClass('active').attr('title', '');
		$this.addClass('active').attr('title', '선택됨');
		var $listIndex = $this.parent('li').index();
		$ol.stop().animate({ scrollTop: $listIndex * rowH }, 300);
	});

	var scrollEndEvntTimerId;
	function visibleEvnt() {
		var $el = $(this);
		var rowH = $el.data('rowH') || $el.children('li').first().outerHeight();
		var items = $el.find('li');
		var idx = Math.round($el.scrollTop() / rowH);
		items.eq(idx).addClass('on').children().addClass('active').parent().siblings().removeClass('on').children().removeClass('active');

		clearTimeout(scrollEndEvntTimerId);
		scrollEndEvntTimerId = setTimeout(function () {
			$('.yearSet > ol').off('scroll', visibleEvnt);
			$el.stop().animate({ scrollTop: idx * rowH }, {
				duration: 40,
				step: function (now, fx) {
					if (fx.pos == 1) {
						$(this).scrollTop((idx * rowH) - rowH);
						setTimeout(function () {
							$('.yearSet > ol').on('scroll', visibleEvnt);
						}, 100);
					}
				}
			});
		}, 100);
	}

	setTimeout(function () {
		$('.yearSet > ol').on('scroll', visibleEvnt);
	}, 500);
};

(function () {
	'use strict';

	// Accordion (notice / box / line / gray 공통)
	// 레거시 [data-toggle="wrap/btn/con"] 방식(nhasset-ui-myd.js)과 동일하게
	// jQuery slideUp/slideDown('fast')로 부드럽게 열고 닫습니다.
	function initAccordion() {
		document.querySelectorAll('[data-acc-toggle]').forEach(function (btn) {
			var body = btn.parentElement.querySelector('[class$="__body"], [class$="__list"]');
			if (!body) return;

			// hidden 속성은 jQuery의 display 애니메이션과 충돌하므로
			// 최초 1회만 display:none으로 치환해 이후 상태를 jQuery에 위임합니다.
			if (body.hasAttribute('hidden')) {
				body.removeAttribute('hidden');
				body.style.display = 'none';
			}

			btn.addEventListener('click', function () {
				var open = btn.getAttribute('aria-expanded') === 'true';
				btn.setAttribute('aria-expanded', open ? 'false' : 'true');

				if (window.jQuery) {
					jQuery(body).stop(true, true)[open ? 'slideUp' : 'slideDown']('fast');
				} else {
					body.style.display = open ? 'none' : 'block';
				}
			});
		});
	}

	document.addEventListener('DOMContentLoaded', function () {
		initAccordion();
	});
})();
