/* 2026-07-28 */
/*
 * [di9] UI Dev Team
 * update/ , sample_update/ 화면(.nds 컴포넌트)에서 공통으로 쓰는 UI 스크립트.
 * head-mb-update.js가 <head>에서 document.write로 주입하므로,
 * DOM 참조는 반드시 DOMContentLoaded 이후에 실행합니다.
 */

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
