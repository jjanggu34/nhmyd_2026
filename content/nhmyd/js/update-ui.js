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

	// Terms 아코디언(.terms-card, 유의사항 등) — [data-terms-toggle] 버튼을 눌러
	// 같은 .terms-card 안의 divider/body를 펼치고/접습니다. initAccordion()과 달리
	// terms-card는 body가 항상 아니라 접힘 상태 마크업만 문서 흐름에 있을 수도 있어
	// [class$="__body"] 셀렉터 하나로는 부족해서(divider도 같이 접어야 함) 전용 함수로 분리합니다.
	function initTermsToggle() {
		document.querySelectorAll('[data-terms-toggle]').forEach(function (btn) {
			var card = btn.closest('.terms-card');
			if (!card) return;
			var divider = card.querySelector('.terms-card__divider');
			var body = card.querySelector('.terms-card__body');
			if (!divider || !body) return;

			// hidden 속성은 jQuery의 display 애니메이션과 충돌하므로
			// 최초 1회만 display:none으로 치환해 이후 상태를 jQuery에 위임합니다.
			[divider, body].forEach(function (el) {
				if (el.hasAttribute('hidden')) {
					el.removeAttribute('hidden');
					el.style.display = 'none';
				}
			});

			btn.addEventListener('click', function () {
				var open = btn.getAttribute('aria-expanded') === 'true';
				btn.setAttribute('aria-expanded', open ? 'false' : 'true');
				btn.classList.toggle('is-open', !open);
				btn.setAttribute('aria-label', open ? '펼치기' : '접기');

				if (window.jQuery) {
					// slideUp/slideDown은 height만 애니메이션하고 margin은 건드리지 않아서,
					// .terms-card > *:not(:first-child)의 margin-top:20px(gap 대체)이
					// 애니메이션 없이 즉시 붙었다 떨어지며 부자연스럽게 튀는 원인이었다.
					// height/marginTop/opacity를 한 번에 같이 애니메이션해서 간격까지
					// 자연스럽게 늘고 줄게 한다.
					jQuery([divider, body]).stop(true, true).animate(
						{ height: 'toggle', marginTop: 'toggle', opacity: 'toggle' },
						{ duration: 250, easing: 'swing' }
					);
				} else {
					divider.style.display = open ? 'none' : '';
					body.style.display = open ? 'none' : '';
				}
			});
		});
	}

	// Terms 전체동의 연동(.terms-card) — 헤더의 마스터 체크박스를 누르면 목록(.terms-card__list)의
	// 개별 약관 체크박스가 모두 같이 켜지고/꺼지고, 반대로 개별 항목을 하나씩 누르면 일부만 선택된
	// 상태를 마스터 체크박스의 indeterminate로 반영합니다(스크린리더 안내용). 시각적으로는 일부러
	// 선택 전과 동일하게 두므로(요청사항) CSS에 :indeterminate/.is-indeterminate 스타일이 없고,
	// 아래 is-indeterminate 클래스 토글도 순수 훅(hook) 용도일 뿐 현재는 아무 효과가 없습니다.
	// list가 없는 카드(안내문 아코디언 등)는 대상이 아니라서 건너뜁니다.
	function initTermsSelectAll() {
		document.querySelectorAll('.terms-card').forEach(function (card) {
			var master = card.querySelector('.terms-card__header .check-basic__input');
			var list = card.querySelector('.terms-card__list');
			if (!master || !list) return;
			var children = list.querySelectorAll('.check-basic__input');
			if (!children.length) return;

			function syncMasterFromChildren() {
				var checkedCount = 0;
				children.forEach(function (c) { if (c.checked) checkedCount++; });
				var indeterminate = checkedCount > 0 && checkedCount < children.length;
				master.checked = checkedCount === children.length;
				master.indeterminate = indeterminate;
				master.classList.toggle('is-indeterminate', indeterminate);
			}

			master.addEventListener('change', function () {
				master.indeterminate = false;
				master.classList.remove('is-indeterminate');
				children.forEach(function (c) { c.checked = master.checked; });
			});

			children.forEach(function (c) {
				c.addEventListener('change', syncMasterFromChildren);
			});

			syncMasterFromChildren(); // 데모/초기값이 이미 checked인 개별 항목이 있으면 마스터도 맞춰서 시작
		});
	}

	// Tab(tab-line/tab-chip/tab-bar/tab-text 공통) — WAI-ARIA APG의 Tabs(automatic activation)
	// 패턴을 그대로 구현합니다. [role="tablist"] 안의 [role="tab"] 버튼들에 대해:
	//  - 클릭 또는 방향키(←/→, ↑/↓, Home/End)로 탭을 바꾸면 aria-selected/aria-controls로
	//    연결된 [role="tabpanel"]이 즉시 전환됩니다(automatic activation).
	//  - 포커스 이동은 방향키에서만 일어나고(roving tabindex: 선택된 탭만 tabindex="0",
	//    나머지는 "-1"), Tab 키로는 탭리스트 전체를 한 번에 드나들 수 있습니다.
	//  - 활성 스타일 클래스명(예: tab-line__item--active)은 탭마다 하드코딩하지 않고, 첫 번째
	//    탭의 class 목록에서 "__item"으로 끝나는 블록 클래스를 찾아 "그 클래스--active"로
	//    자동 유도합니다 — tab-line/tab-chip/tab-bar/tab-text 4종 모두 이 함수 하나로 동작합니다.
	function initTabs() {
		document.querySelectorAll('[role="tablist"]').forEach(function (tablist) {
			var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
			if (!tabs.length) return;

			// nhasset-ui-myd-mb.js가 DOMContentLoaded에서 document 전역의 [role="tab"]에
			// 자기 changeTabs 핸들러를 이미 붙여둔다(레거시 .mbTabs 탭 전용, 여기 .nds 탭 마크업엔
			// .mbTabs 래퍼가 없어 클릭 시 tabContainer가 null이라 그대로 두면 예외가 난다). update-ui.js는
			// 항상 그 스크립트보다 늦게 로드되므로(head-mb-update.js 순서), 여기서 레거시 핸들러를
			// 먼저 떼어내고 아래 우리 핸들러로 교체한다.
			if (typeof window.changeTabs === 'function') {
				tabs.forEach(function (t) {
					t.removeEventListener('click', window.changeTabs);
				});
			}

			var baseClass = null;
			tabs[0].classList.forEach(function (c) {
				if (/__item$/.test(c)) baseClass = c;
			});
			var activeClass = baseClass ? baseClass + '--active' : null;

			function panelOf(tab) {
				var id = tab.getAttribute('aria-controls');
				return id ? document.getElementById(id) : null;
			}

			function activate(tab, moveFocus) {
				tabs.forEach(function (t) {
					var selected = t === tab;
					t.setAttribute('aria-selected', selected ? 'true' : 'false');
					t.setAttribute('tabindex', selected ? '0' : '-1');
					if (activeClass) t.classList.toggle(activeClass, selected);
					var panel = panelOf(t);
					if (panel) panel.hidden = !selected;
				});
				if (moveFocus) tab.focus();
			}

			tabs.forEach(function (tab, i) {
				tab.addEventListener('click', function () {
					activate(tab, false);
				});
				tab.addEventListener('keydown', function (e) {
					var targetIndex = null;
					if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
						targetIndex = (i + 1) % tabs.length;
					} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
						targetIndex = (i - 1 + tabs.length) % tabs.length;
					} else if (e.key === 'Home') {
						targetIndex = 0;
					} else if (e.key === 'End') {
						targetIndex = tabs.length - 1;
					} else {
						return;
					}
					e.preventDefault();
					// nhasset-ui-myd-mb.js가 페이지의 첫 번째 [role="tablist"]에도 자기 방향키
					// 핸들러를 붙여두고 있어(레거시, 페이지 전체에서 tablist를 하나만 가정), 버블링으로
					// 그 핸들러까지 같이 실행되면 포커스가 우리 로직과 충돌한다. 여기서 막는다.
					e.stopPropagation();
					activate(tabs[targetIndex], true);
				});
			});
		});
	}

	document.addEventListener('DOMContentLoaded', function () {
		initAccordion();
		initTermsToggle();
		initTermsSelectAll();
		initTabs();
	});
})();
