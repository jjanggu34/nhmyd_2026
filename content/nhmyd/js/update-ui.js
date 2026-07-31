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

	// aria-controls용 id 자동 부여 — 토글 버튼이 제어하는 대상 요소에 id가 없으면
	// 하나 만들어 붙이고, 있으면 그대로 재사용합니다(중복 id 생성 방지).
	var autoIdSeq = 0;
	function ensureId(el, prefix) {
		if (!el.id) {
			autoIdSeq += 1;
			el.id = prefix + '-' + autoIdSeq;
		}
		return el.id;
	}

	// Accordion (notice / box / line / gray 공통)
	// 레거시 [data-toggle="wrap/btn/con"] 방식(nhasset-ui-myd.js)과 동일하게
	// jQuery slideUp/slideDown('fast')로 부드럽게 열고 닫습니다.
	function initAccordion() {
		document.querySelectorAll('[data-acc-toggle]').forEach(function (btn) {
			var body = btn.parentElement.querySelector('[class$="__body"], [class$="__list"]');
			if (!body) return;

			// aria-expanded만으로는 버튼이 "무엇을" 펼치고 접는지 스크린리더가 알 수 없어서,
			// 대상 요소를 aria-controls로 명시적으로 연결합니다(4.1.2 Name, Role, Value).
			btn.setAttribute('aria-controls', ensureId(body, 'acc-body'));

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

			// 버튼이 펼치고 접는 실제 내용(body)을 aria-controls로 연결합니다.
			btn.setAttribute('aria-controls', ensureId(body, 'terms-body'));

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

	// terms-link 체크박스 연동 아코디언(.terms-accordion) — "개인(신용)정보 수집·이용 동의
	// (상품서비스 안내 등)"처럼, 상위 동의 체크박스에 체크해야만 전화/문자메세지/우편물/이메일
	// 같은 세부 수신채널을 고를 수 있는 패턴(Figma node 1008:35375). .terms-link 바로 다음
	// 형제로 .terms-accordion이 있으면, 그 .terms-link의 체크박스 change에 맞춰 패널을
	// 열고/닫습니다(initTermsToggle과 같은 jQuery slideDown/slideUp 방식).
	function initTermsAccordionCheck() {
		document.querySelectorAll('.terms-link').forEach(function (link) {
			var panel = link.nextElementSibling;
			if (!panel || !panel.classList.contains('terms-accordion')) return;
			var input = link.querySelector('.terms-link__check .check-basic__input');
			if (!input) return;

			// aria-controls로 체크박스와 패널을 명시적으로 연결합니다(4.1.2 Name, Role, Value).
			input.setAttribute('aria-controls', ensureId(panel, 'terms-accordion'));

			// hidden 속성은 jQuery의 display 애니메이션과 충돌하므로
			// 최초 1회만 display:none으로 치환해 이후 상태를 jQuery에 위임합니다.
			if (panel.hasAttribute('hidden')) {
				panel.removeAttribute('hidden');
				panel.style.display = 'none';
			}

			function sync(animate) {
				var open = input.checked;
				input.setAttribute('aria-expanded', open ? 'true' : 'false');
				if (animate && window.jQuery) {
					jQuery(panel).stop(true, true)[open ? 'slideDown' : 'slideUp']('fast');
				} else {
					panel.style.display = open ? '' : 'none';
				}
			}

			input.addEventListener('change', function () {
				sync(true);
			});

			sync(false); // 초기 체크 상태에 맞춰 애니메이션 없이 시작
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

	// Sticky footer(.sticky-footer) — 화면이 짧아도 하단 콘텐츠(알아두세요 아코디언 + CTA 버튼
	// 등)가 항상 뷰포트 바닥에 붙어 있도록 position:fixed로 띄운 뒤, 그 실제 높이만큼
	// .container에 padding-bottom을 채워 스크롤 콘텐츠가 가려지지 않게 합니다. ResizeObserver로
	// 감시하므로 안쪽 아코디언을 펼치고/접어 푸터 높이가 바뀌면(애니메이션 도중 포함) 자동으로
	// 다시 맞춰집니다.
	function initStickyFooter() {
		document.querySelectorAll('.sticky-footer').forEach(function (footer) {
			var container = document.querySelector('.container');
			if (!container) return;

			function sync() {
				container.style.paddingBottom = footer.offsetHeight + 'px';
			}
			sync();

			if (window.ResizeObserver) {
				new ResizeObserver(sync).observe(footer);
			} else {
				window.addEventListener('resize', sync);
			}

			// ResizeObserver 콜백은 브라우저 렌더링 사이클에 맞춰 비동기로 실행되는데, 환경에
			// 따라 안쪽 아코디언이 jQuery slideUp/slideDown('fast', 약 200ms)으로 애니메이션되는
			// 동안 콜백이 늦게 실행되거나 누락될 수 있어, 토글 버튼 클릭 시점에 애니메이션이
			// 끝나는 시점(250ms)에도 한 번 더 확실히 다시 맞춰줍니다.
			footer.querySelectorAll('[data-acc-toggle]').forEach(function (btn) {
				btn.addEventListener('click', function () {
					setTimeout(sync, 250);
				});
			});
		});
	}

	// Chip Accordion(.chip-accordion) — [펼치기/접기] 버튼(.chip-accordion__toggle)을 누르면
	// 부모 .chip-accordion에 is-open 클래스를 토글합니다. is-open 여부에 따라 CSS가 칩 목록을
	// 가로 스크롤(닫힘) ↔ 여러 줄로 줄바꿈(열림, 높이 auto)으로 전환합니다.
	function initChipAccordion() {
		document.querySelectorAll('.chip-accordion__toggle').forEach(function (btn) {
			var wrap = btn.closest('.chip-accordion');
			if (!wrap) return;

			// 버튼이 펼치고 접는 칩 목록(.chip-accordion__chips)을 aria-controls로 연결합니다.
			var chips = wrap.querySelector('.chip-accordion__chips');
			if (chips) btn.setAttribute('aria-controls', ensureId(chips, 'chip-list'));

			btn.addEventListener('click', function () {
				var open = wrap.classList.toggle('is-open');
				btn.setAttribute('aria-expanded', open ? 'true' : 'false');
				btn.setAttribute('aria-label', open ? '접기' : '펼치기');
			});
		});
	}

	// Chip 단일선택(.chip-single) — 업권 필터 등 같은 부모 요소 아래 나란히 있는 .chip-single
	// 버튼들 중 하나를 클릭하면 그 버튼만 active(.chip-single--active, aria-pressed="true")가 되고
	// 나머지 형제 버튼은 모두 해제됩니다(라디오 그룹처럼 상호 배타적 단일 선택). 부모 클래스명을
	// 하드코딩하지 않고 같은 parentElement를 공유하는 .chip-single끼리 자동으로 그룹을 구성하므로,
	// .chip-accordion__chips 안이든 밖이든 동일하게 동작합니다.
	function initChipSingle() {
		var seenParents = [];
		document.querySelectorAll('.chip-single').forEach(function (chip) {
			var parent = chip.parentElement;
			if (!parent || seenParents.indexOf(parent) !== -1) return;
			seenParents.push(parent);

			var group = Array.prototype.filter.call(parent.children, function (el) {
				return el.classList.contains('chip-single');
			});

			group.forEach(function (btn) {
				btn.addEventListener('click', function () {
					group.forEach(function (c) {
						var active = c === btn;
						c.classList.toggle('chip-single--active', active);
						c.setAttribute('aria-pressed', active ? 'true' : 'false');
					});
				});
			});
		});
	}

	// Chip 앵커 이동 + 스크롤 스파이(.chips--sticky) — MSPS3120(기관선택) 등에서 업권 칩을
	// 클릭하면 같은 부모(.chips--sticky의 부모) 아래 있는 .inst-list__group 목록 중 같은
	// 순서(index)의 그룹으로 스크롤 이동하고, 반대로 스크롤해서 어떤 그룹이 화면에 보이는지에
	// 따라 해당 칩이 자동으로 chip-single--active가 됩니다(레거시 content/nhmyd/pub/ps/
	// MSPS3120.html의 anchorWrap() 스크롤 앵커+스크롤스파이와 동일한 동작). 칩 active 토글
	// 자체는 initChipSingle()이 이미 클릭 시 처리하므로, 여기서는 (1) 클릭 시 스크롤 이동과
	// (2) 스크롤 중 active 판정만 추가로 담당합니다. 칩 개수와 그룹 개수가 다르면(예: chip.html
	// 가이드의 독립 데모처럼 짝지을 목록이 없는 경우) 안전하게 아무 것도 하지 않습니다.
	function initChipAnchorScroll() {
		document.querySelectorAll('.chips--sticky').forEach(function (chipsEl) {
			var chips = Array.prototype.slice.call(chipsEl.querySelectorAll('.chip-single'));
			var scope = chipsEl.parentElement;
			if (!scope) return;
			var groups = Array.prototype.slice.call(scope.querySelectorAll('.inst-list__group'));
			if (!chips.length || !groups.length || chips.length !== groups.length) return;

			function headerOffset() {
				var header = document.querySelector('.header');
				var headerH = header ? header.getBoundingClientRect().height : 0;
				return headerH + chipsEl.getBoundingClientRect().height;
			}

			function setActive(index) {
				chips.forEach(function (c, i) {
					var active = i === index;
					c.classList.toggle('chip-single--active', active);
					c.setAttribute('aria-pressed', active ? 'true' : 'false');
				});
			}

			chips.forEach(function (chip, i) {
				chip.addEventListener('click', function () {
					var target = groups[i];
					var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 8;
					window.scrollTo({ top: top, behavior: 'smooth' });
					// 칩 목록 자체도 가로 스크롤이라 방금 누른 칩이 화면 밖으로 밀려있을 수
					// 있어 가로 방향으로도 보이는 위치까지 맞춰줍니다(레거시의 anchorSubjectWrap
					// 가로 스크롤 보정과 동일한 목적).
					chip.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
				});
			});

			var lastActive = 0;
			var ticking = false;
			function updateActiveByScroll() {
				ticking = false;
				var threshold = headerOffset() + 16;
				var current = 0;
				groups.forEach(function (g, i) {
					if (g.getBoundingClientRect().top - threshold <= 0) {
						current = i;
					}
				});
				if (current !== lastActive) {
					lastActive = current;
					setActive(current);
					chips[current].scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
				}
			}
			window.addEventListener(
				'scroll',
				function () {
					if (ticking) return;
					ticking = true;
					window.requestAnimationFrame(updateActiveByScroll);
				},
				{ passive: true }
			);
		});
	}

	// .wrapper(.nhasset)에 nds 클래스가 있는 화면(= 이 update-ui.js를 쓰는 .nds 화면)이면
	// <html>에도 같은 nds 클래스를 추가합니다. html.nds 스코프로 걸어야 하는 전역 스타일
	// (예: 뷰포트/세이프에어리어 보정 등)이 .nds 화면에서만 적용되도록 하기 위함입니다.
	function syncNdsClassToHtml() {
		var wrapper = document.querySelector('.wrapper');
		if (wrapper && wrapper.classList.contains('nds')) {
			document.documentElement.classList.add('nds');
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		syncNdsClassToHtml();
		initAccordion();
		initTermsToggle();
		initTermsSelectAll();
		initTermsAccordionCheck();
		initTabs();
		initChipAccordion();
		initChipSingle();
		initChipAnchorScroll();
		initStickyFooter();
	});
})();
