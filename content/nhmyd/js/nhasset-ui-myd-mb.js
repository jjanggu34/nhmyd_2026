// 2025-11-26 올뱅 푸터 ASIS 재정의 ///////////////////////
(function(window, $) {
	uiInit = function(){
		uiSetScrollEvent();
	};
	$(window).on('load',uiInit);
})(window, jQuery);
uiSetScrollEvent = function(){
  if($('body').hasClass('nhd_allone') && $('.alloneFooterNew').length){
    $('body').attr('data-scroll','off');
    var timer;
    $(window).off('scroll.body').on('scroll.body',function(){
      $('body').attr('data-scroll','on');
      clearTimeout(timer);
      timer = setTimeout(function(){
        $('body').attr('data-scroll','off');
      },200); // 2025-11-28 작동 시간 올뱅과 비슷하게 요청
    });
  }
}
// 2025-11-26 올뱅 푸터 ASIS 재정의 끝/////////////////////////

$(document).ready(function() {
  // 알아두세요 토글 2025-09-29 수정
  $(document).on('click', '.noticeBtn', function() {
    const $toggleBtn = $(this);
    const targetSelector = $toggleBtn.data('target');
    const $targetContent = $(targetSelector);

    // '.noticeCont'가 동적으로 생성될 수 있으므로, 클릭 시점에 tabindex를 부여
    $targetContent.attr('tabindex', '-1');

    const isExpanded = $toggleBtn.attr('aria-expanded') === 'true';

    if (!isExpanded) {
      $targetContent.slideDown(100, function() {
          $('html, body').animate({
              scrollTop: $targetContent.offset().top - 100
          }, 600);
          $targetContent.focus();
      });
      $toggleBtn.find('span').text('접기');
      $toggleBtn.attr('aria-expanded', 'true');
    } else {
      $targetContent.slideUp(300);
      $toggleBtn.find('span').text('펼치기');
      $toggleBtn.attr('aria-expanded', 'false');
      $toggleBtn.focus();
    }
  });

  // 메인 알림톡 운영 지정 메시지 클로즈
  $('.yaTopBanner.trans .btnClose').click(function() {
    $(this).closest(".yaTopBanner.trans").hide();
  });
  $('.BannerTrans .btnClose').click(function() {
    $(this).closest(".BannerTrans").hide();
  });

  // 목표설정 갯수에 따른 화면 크기 컨트롤 스크립트 안 넣을시를 대비해 css에도 기본값 넣어둠 스크립트가 있어야 3개 이상도 계산 (대신 3개이상시 2개만 표시후 스크롤)
  const boxes = document.querySelectorAll('.nhasset .hScrollBox');
  boxes.forEach((box) => {
    const items = box.querySelectorAll('.hScrollBoxItem').length;
    if (items === 1) box.classList.add('is-1');
    else if (items === 2) box.classList.add('is-2');
    else if (items>= 3) box.classList.add('is-3');
  });

  // 나만의 메뉴 이동
  var sortOn = function () {
    $('.sortable.-mb').sortable({ axis: 'y', disabled: false, handle: $('.dragBtn') });
  };
  var sortOff = function () {
    $('.sortable.-mb').sortable('option', 'disabled', true);
  };
  sortOn();
});

/** 툴팁 ASIS 보정 */
$(document).on('click', '.tooltipWrap .toolTipBtn, .tooltipWrap .close', function() {
  const $toolTipBtn = $(this);
  const $parentElement = $toolTipBtn.closest('.boxTypeWrap');
  if($toolTipBtn.attr('class') == 'close'){
    $parentElement.removeClass('-unset');
  } else {
    $parentElement.addClass('-unset');
  }
});
/* ***************************** */

/** 앵커 스크롤 ASIS 보정
 * Sticky 메뉴와 앵커 스크롤 기능을 초기화하는 공통 함수
 * @param {object} options - 기능에 필요한 설정값 객체
 * @param {string} options.header - 헤더 선택자
 * @param {string} options.menuContainer - 스티키 될 메뉴 컨테이너 선택자
 * @param {string} options.menuItems - 메뉴 각 항목(li)의 선택자
 * @param {string} options.menuLinks - 클릭할 메뉴 링크(a)의 선택자
 * @param {string} options.contentSections - 스크롤에 따라 감지될 콘텐츠 섹션 선택자
 * @param {number} [options.customPadding=0] - 추가로 적용할 패딩 값 (옵션)
 * @param {number} [options.scrollOffset=100] - 스크롤 시 활성화 위치를 보정할 오프셋 값
 * @param {number} [options.clickOffset=25] - 클릭 시 스크롤 위치를 보정할 오프셋 값
 * @param {string} [options.stickyClass='likeSticky'] - 스티키 상태일 때 추가될 CSS 클래스명
 */
function initializeAnchorScroll(options) {
  // 기본값과 사용자 옵션을 병합합니다.
  const settings = $.extend({
    header: '.header',
    menuContainer: '.billLisMenu',
    menuItems: '.billMenu > li',
    menuLinks: '.billMenu > li a',
    contentSections: '.billListCont .inoutListWrap',
    customPadding: 10, // 스티키 메뉴쪽으로(위로) 붙이면 결함 올림 수정 금지
    scrollOffset: 150, // 스티키 메뉴쪽으로(위로) 붙이면 결함 올림 수정 금지
    clickOffset: 30,
    stickyClass: 'likeSticky'
  }, options);

  const $header = $(settings.header);
  const $menuContainer = $(settings.menuContainer);
  const $menuItems = $(settings.menuItems);
  const $contentSections = $(settings.contentSections);

  if (!$menuContainer.length || !$contentSections.length) {
    console.warn("Anchor scroll elements not found.");
    return;
  }

  const headerHeight = $header.outerHeight() || 0;
  const menuContainerTop = $menuContainer.offset().top;
  const scrollMoveTop = menuContainerTop - headerHeight;

  // 스크롤 이벤트 핸들러
  $(window).on('scroll', function() {
    const scrollTop = $(this).scrollTop();

    // 1. 메뉴 스티키 처리
    if (scrollTop > scrollMoveTop) {
      $menuContainer.addClass(settings.stickyClass);
    } else {
      $menuContainer.removeClass(settings.stickyClass);
    }

    // 2. 스크롤 위치에 따른 메뉴 활성화
    $contentSections.each(function(i) {
      const sectionTop = $(this).offset().top;
      const triggerPosition = sectionTop - (headerHeight + $menuContainer.height() + settings.customPadding + settings.scrollOffset);

      if (scrollTop >= triggerPosition) {
        // $menuItems.removeClass("selected");
        const $currentItem = $menuItems.eq(i);
        // $currentItem.addClass("selected");
          if( $menuItems.eq(i).index() >= $menuItems.last().index() - 3 || $menuItems.last().index() == i){ // 2025-12-19 뒤에서 3번째 메뉴부터 포그 걷어내기
            $(".fogOverlay").hide();
          } else {
            $(".fogOverlay").show();
          }
        // 활성화된 메뉴가 보이도록 메뉴 컨테이너 스크롤
        $menuContainer.stop().animate({
          scrollLeft: $currentItem.position().left
        }, 400);
        $menuItems.removeClass("selected");
        $currentItem.addClass("selected");
      }
    });

    // 3. 페이지 최하단 도달 시 마지막 메뉴 활성화
    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
      $menuItems.removeClass("selected");
      $menuItems.last().addClass("selected");
      $(".fogOverlay").hide();
    }
  });

  // 클릭 이벤트 핸들러
  $(document).off("click", settings.menuLinks).on("click", settings.menuLinks, function(e) {
    e.preventDefault();
    const idx = $(this).closest("li").index();
    scrollToSection(idx);
  });

  // 특정 섹션으로 스크롤하는 내부 함수
  function scrollToSection(idx) {
    const $targetSection = $contentSections.eq(idx);
    if ($targetSection.length) {
      const $targetMenuItem = $menuItems.eq(idx);
      // 메뉴 활성화 및 스크롤
      //$menuItems.removeClass("selected");
      //$targetMenuItem.addClass("selected");
      if($menuItems.eq(idx).index() >= $menuItems.last().index() - 3 || $menuItems.last().index() == idx){ //2025-12-19 뒤에서 3번째 메뉴부터 포그 걷어내기
        $(".fogOverlay").hide();
      } else {
        $(".fogOverlay").show();
      }
      $menuContainer.stop().animate({
        scrollLeft: $targetMenuItem.position().left
      }, 400);

      // 페이지 스크롤
      const scrollTo = $targetSection.offset().top - (headerHeight + $menuContainer.height() + settings.customPadding + settings.clickOffset);
      // const scrollTo = $targetSection.offset().top - (headerHeight + $menuContainer.height() + settings.clickOffset);
      $('html, body').stop().animate({
        scrollTop: scrollTo
      }, 400, function() {
        // 접근성을 위해 해당 섹션의 제목에 포커스
        $targetSection.find(".togTit").attr('tabindex', '0').focus();
      });
    }
  }
}
//////////////// 앵커 스크롤 ASIS 보정 /////////////////// */


//토스트팝업
function tostpop(){
  var $tostCont = '<div class="tostpopupWrap" aria-live="assertive"><div class="tostMsg">업데이트가 완료되었습니다.</div></div>'
  //부정형 일때
  // var $tostCont = '<div class="tostpopupWrap" aria-live="assertive"><div class="tostMsg error">잠시후 다시 시도해주세요.</div></div>'
  $('.container').after($tostCont);
  setTimeout(function(){
    $('.tostpopupWrap').remove();
  },4000);
}

// 전체메뉴 2025-12-03 OS fixed 구형 웹뷰 호환
/**
 * NH마이데이터 - 전체 메뉴 UI 공통 스크립트 (최종 수정본)
 */
// document.addEventListener('DOMContentLoaded', function() {
//   // --- 1. 주요 요소 선택 ---
//   const container = document.querySelector('.container');
//   const allMenuNav = document.querySelector('.allMenuNav');
//   const allMenuWrap = document.querySelector('.allMenuWrap');
//   const tabsNav = document.querySelector('.tabsNav');
//   // const tabLinks = document.querySelectorAll('.tabLink');
//   const contentArea = document.querySelector('.contentArea');
//   const tabLinksNodeList = document.querySelectorAll('.tabLink');
//   const contentSectionsNodeList = document.querySelectorAll('.contentSec');
//   const tabLinks = Array.prototype.slice.call(tabLinksNodeList);
//   const contentSections = Array.prototype.slice.call(contentSectionsNodeList);

//   // --- 2. 필수 요소 존재 여부 확인 (null 에러 방지) ---
//   // 스크립트 실행에 필요한 요소 중 하나라도 없으면 오류를 방지하기 위해 즉시 실행 중단
//   if (!container || !allMenuNav || !allMenuWrap || !tabsNav || !contentArea || contentSections.length === 0) {
//     return;
//   }
//   let isTabClick = false; // 탭 클릭으로 인한 스크롤 동작 여부 플래그
//   let scrollAnimationId = null;
//   let sectionOffsets = []; // 각 섹션 오프셋
//   let activeIndex = 0; // 현재 활성 인덱스
//   let pendingIndex = null; //클릭으로 이동중인 목표 인덱스

//   function applyActiveTabByIndex(idx){
//     if(idx < 0 || idx >= contentSections.length) return;
//     const targetId = contentSections[idx].id;
//     tabLinks.forEach(function(link){
//       const linkTarget = link.dataset.target || link.getAttribute('data-target');
//       link.classList.toggle('active', linkTarget === targetId);
//     });
//     activeIndex = idx;
//   }

//   function recalcSectionOffsets(){
//     sectionOffsets = contentSections.map(function(section){
//       return section.offsetTop;
//     });
//   }

//   // --- 3. 동적 스타일 설정 함수 ---
//   /** 초기 CSS 재정의 및 상단 고정 영역 높이 계산 적용 */
//   function initializeStyles() {
//     // 스크롤 및 레이아웃 관련 스타일을 JS로 제어
//     container.style.overflow = 'hidden';
//     container.style.maxHeight = '100vh';
//     container.style.paddingBottom = '0';

//     // 실제 스크롤되는 영역 보장 (안드에서 중요)
//     contentArea.style.overflowY = 'auto';
//     contentArea.style.webkitOverflowScrolling = 'touch'; // iOS 도 부드럽게

//     const navHeight = allMenuNav.offsetHeight || 0;
//     allMenuWrap.style.paddingTop = navHeight + 'px';

//     adjustContentPadding();
//     recalcSectionOffsets();
//     applyActiveTabByIndex(0); // 처음 무조건 첫번째 
//     updateActiveTabByScroll(); //초기화 탭 상태도 한 번 계산
//   }

//   /** 마지막 콘텐츠가 잘 보이도록 하단 여백 동적 조절 */
//   function adjustContentPadding() {
//     // const lastContentSection = document.querySelector('.contentSec:last-child');
//     const lastContentSection = contentSections[contentSections.length - 1];
//     if (!lastContentSection) return;

//     const containerHeight = contentArea.clientHeight;
//     const lastElementHeight = lastContentSection.offsetHeight;
//     const paddingNeeded = containerHeight - lastElementHeight - 20;

//     contentArea.style.paddingBottom = (paddingNeeded > 0) ? (paddingNeeded + 'px') : '20px';
//   }

//   // --- 4. 안드 스크롤 직접 구현 ---
//   function smoothScrollTo(targetElement) {
//     if(!targetElement) return;
//     // 돌고 있는 애니메 정지
//     if(scrollAnimationId !== null){
//       cancelAnimationFrame(scrollAnimationId);
//       scrollAnimationId = null;
//     }

//     // 1) 브라우저가 네이티브 스무스 스크롤 지원하면 그걸 사용
//     const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style && typeof contentArea.scrollTo === 'function';
//     const targetTop = targetElement.offsetTop - 5;
//     const duration = 450;

//     if(supportsSmoothScroll){
//       contentArea.scrollTo({
//         top: targetTop,
//         behavior: 'smooth'
//       });
//       //네이티브가 처리하게 두고 플래그만 일정 시간 뒤에 내려줌
//       setTimeout(function(){
//         if(pendingIndex != null){
//           applyActiveTabByIndex(pendingIndex);
//         }
//         isTabClick = false;
//         pendingIndex = null;
//       }, duration + 50); // 500
//       return;
//     }
    
//     // 2)네이티브 미지원
//     const start = contentArea.scrollTop;
//     const distance = targetTop - start;
//     let startTime = null;

//     function easeOutCubic(t){
//       return 1 -Math.pow(1 - t, 3);
//     }

//     function step(timestamp){
//       if(!startTime) startTime = timestamp;
//       const progress = Math.min((timestamp - startTime) / duration, 1);
//       const eased = easeOutCubic(progress);
      
//       contentArea.scrollTop = start + distance * eased;

//       if(progress < 1){
//         scrollAnimationId = requestAnimationFrame(step);
//       } else {
//         scrollAnimationId = null;
//         if(pendingIndex != null){
//           applyActiveTabByIndex(pendingIndex);
//         }
//         isTabClick = false;
//         pendingIndex = null;
//       }
//     }

//     scrollAnimationId = requestAnimationFrame(step);
//   }

//   // --- 5. 탭 클릭 이벤트 ---
//   tabsNav.addEventListener('click', function(event) {
//     const link = event.target.closest ? event.target.closest('.tabLink') : null;
//     if (!link) return;

//     event.preventDefault();
//     const clickedIndex = tabLinks.indexOf(link);
//     if(clickedIndex < 0 || clickedIndex >= contentSections.length) return;

//     const targetId = link.getAttribute('data-target');
//     const targetElement = document.getElementById(targetId);

//     // 여기서 바로 active 안하고 스크롤 끝에서 한번만 active
//     smoothScrollTo(targetElement, clickedIndex);
//   });

//   function updateActiveTabByScroll(){
//     if (isTabClick) return; // 탭 클릭으로 스크롤 중일 때는 무시
//     // 맨위 근처에서는 무조건 첫번째 탭 활성화
//     const scrollTop = contentArea.scrollTop;
//     const topThreshold = 25; //5
//     const triggerGap = 50; // 각 섹션 시작점에서 얼마 위에서 잡을지(px)

//     // 맨위 긑처 첫 섹션
//     if(scrollTop <= topThreshold){
//       applyActiveTabByIndex(0);
//       return;
//     }

//     //현재 스크롤 기준, 트리거 지점 넘은 섹션 중 가장 마지막 인덱스
//     let idx = 0;
//     for(let i = 0; i < sectionOffsets.length; i++){
//       const triggerPos = sectionOffsets[i] - triggerGap; // 이 지점을 지나면 i섹션으로 간주
//       if(scrollTop >= triggerPos){
//         idx = i;
//       } else {
//         break;
//       }
//     }

//     if(idx !== activeIndex){
//       applyActiveTabByIndex(idx);
//     }
//   }

//   contentArea.addEventListener('scroll', updateActiveTabByScroll, {passive: true});

//   // --- 6. 초기화 실행 ---
//   initializeStyles();
//   //window.addEventListener('resize', initializeStyles); // 창 크기 변경 시 스타일 다시 계산
//   window.addEventListener('resize', function(){
//     adjustContentPadding();
//     recalcSectionOffsets();
//     updateActiveTabByScroll();
//   });
// });

// 2025-09-26 백틱 제거 투자위험 수준 선택 게이지바 및 말풍선 스크립트
// 말풍선 위치를 업데이트하는 함수
function updatePopOver(radio) { // 2025-09-29 위치변경요청
    // 요소가 없는 경우 오류를 방지하기 위해 중단
    var popOverBox = document.querySelector('.popOverBox');
    var popOverArrow = document.querySelector('.popOverArrow');
    var radioContainer = document.querySelector('.gaugeContainer');

    if (!radio || !popOverBox || !radioContainer || !popOverArrow) {
        return;
    }

    var label = document.querySelector('label[for="' + radio.id + '"]');
    var popOverBoxWidth = popOverBox.offsetWidth;
    var containerRect = radioContainer.getBoundingClientRect();
    var labelRect = label.getBoundingClientRect();
    var labelCenterRelativeToContainer = (labelRect.left + labelRect.width / 2) - containerRect.left;
    var popOverLeft;

    // 라디오 버튼 ID에 따라 말풍선 위치 조정
    if (radio.id === 'gauge-2' || radio.id === 'gauge-3' || radio.id === 'gauge-4') {
        popOverLeft = (containerRect.width / 2) - (popOverBoxWidth / 2);
    } else if (radio.id === 'gauge-1') {
        popOverLeft = 0;
    } else if (radio.id === 'gauge-5') {
        popOverLeft = containerRect.width - popOverBoxWidth;
    }

    var arrowLeft = labelCenterRelativeToContainer - popOverLeft;

    // 계산된 위치 적용 및 말풍선 표시
    popOverBox.style.left = popOverLeft + 'px';
    popOverArrow.style.left = arrowLeft + 'px';
    popOverBox.classList.add('show');
}

document.addEventListener('DOMContentLoaded', function() {
    // 위험수준 선택 UI 요소 찾기
    var radioButtons = document.querySelectorAll('input[name="gaugeRadio"]');
    var popOverBox = document.querySelector('.popOverBox');
    //var popOverArrow = document.querySelector('.popOverArrow');
    //var radioContainer = document.querySelector('.gaugeContainer');
    var closeButton = document.querySelector('.popOverClose');
    var isPopOverVisible = true; // 말풍선 상태 추적 변수

    // 말풍선 위치를 업데이트하는 함수 // 2025-09-29 위치변경요청
    // function updatePopOver(radio) {...}

    // 페이지 로드 시, 기본 선택된 버튼 위치에 말풍선 표시
    var initialChecked = document.querySelector('input[name="gaugeRadio"]:checked');
    if (initialChecked) {
        updatePopOver(initialChecked);
    }

    // 각 라디오 버튼에 'change' 이벤트 추가
    radioButtons.forEach(function(radio) {
        radio.addEventListener('change', function(event) {
            // 버튼 선택 시 말풍선 숨기기
            if (popOverBox) {
                popOverBox.classList.remove('show');
            }
            isPopOverVisible = false;
        });
    });

    // 말풍선 닫기 버튼에 'click' 이벤트 추가
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (popOverBox) {
                popOverBox.classList.remove('show');
            }
            isPopOverVisible = false;
        });
    }

    // 접근성: 키보드(Enter, Space)로 라벨 선택 가능하게 설정
    document.querySelectorAll('label').forEach(function(label) {
        if (label.getAttribute('for') && label.getAttribute('for').indexOf('gauge-') === 0) {
            label.tabIndex = 0;
            label.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // 기본 동작(페이지 스크롤 등) 방지
                    document.getElementById(label.getAttribute('for')).click();
                }
            });
        }
    });
});

// 2025-09-26 백틱 제거 및 0% 일때 최소크기 제거 버전
// 2025-11-24 대상 자산 없음 case 추가 및 대표 label 노출
//차트 하드코딩 /////////////////////////////////////////////////////////////
// 각 차트 인스턴스를 저장할 변수 선언
var stackedBarChartInstance;  // 내 포트폴리오
var stackedBarChartInstance2; // 최적 포트폴리오
var isBarChartDrawn = false;

var chartLabelsAndColors = {
    type1: [
        { label: "현금", color: "#ffec40" },
        { label: "국내주식", color: "#12732e" },
        { label: "해외선진국주식", color: "#3cdb61" },
        { label: "해외신흥국주식", color: "#ace3bc" },
        { label: "국내채권", color: "#2357a9" },
        { label: "해외채권", color: "#66a1ff" }
    ]
};

function createChartData(percentageData) {
  var totalPercentage = percentageData.reduce(function(sum, item) { return sum + item.percent; }, 0);

  // 2025-11-24 [추가] 모든 항목이 0%면 '대상 자산 없음' 100% 한 덩어리로 반환
  if (totalPercentage === 0) {
      return [{
          label: '대상 자산 없음',
          value: 100,
          isEmpty: true   // 나중에 회색 처리 & 기본툴팁 구분용 플래그
      }];
  }

  var factor = 100 / totalPercentage;
  return percentageData.map(function(item) {
      return {
          label: item.label,
          value: item.percent * factor
      };
  });
}

// BaseChart 클래스를 생성자 함수로 변경
function BaseChart(canvasId, data, options) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.tooltip = this.canvas.parentElement.querySelector('.tooltip');
    this.data = data;
    this.options = Object.assign({
        totalFrames: 60
    }, options);
    this.finalData = null;
    this.animationFrameId = null;
    this.resizeTimeout = null;
    this.init();
}

BaseChart.prototype.init = function() {
    this.setupEvents();
    if (this.canvas.parentElement.offsetParent !== null) {
        this.resizeCanvas();
    }
};

BaseChart.prototype.setupEvents = function() {
    var self = this;
    window.addEventListener('resize', function() {
        if (self.canvas.parentElement.offsetParent !== null) {
            clearTimeout(self.resizeTimeout);
            self.resizeTimeout = setTimeout(function() { self.resizeCanvas(); }, 100);
        }
    });
    this.canvas.addEventListener('click', function(e) { self.handleEvent(e); });
    this.canvas.addEventListener('touchstart', function(e) { self.handleEvent(e); });
    this.canvas.addEventListener('touchmove', function(e) { e.preventDefault(); });
    document.addEventListener('click', function(e) {
        if (self.canvas.parentElement && !self.canvas.parentElement.contains(e.target)) {
            if(self.data.length === 1 && self.data[0].isEmpty) return; // 모두 0일때 클릭 안되게
            self.hideTooltip();
        }
    });
};

BaseChart.prototype.handleEvent = function(e) {
    e.preventDefault();
    var rect = this.canvas.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    this.checkHit(x, y);
};

BaseChart.prototype.resizeCanvas = function() {
    var container = this.canvas.parentElement;
    if (!container || container.offsetWidth === 0) return;

    var ratio = window.devicePixelRatio || 1;
    var displayWidth, displayHeight;
    if (this.options.width && this.options.height) {
        displayWidth = this.options.width;
        displayHeight = this.options.height;
    } else {
        displayWidth = container.offsetWidth;
        displayHeight = container.offsetHeight;
    }
    this.canvas.width = displayWidth * ratio;
    this.canvas.height = displayHeight * ratio;
    this.canvas.style.width = displayWidth + 'px';
    this.canvas.style.height = displayHeight + 'px';
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(ratio, ratio);
    this.animateChart();
};

BaseChart.prototype.showTooltip = function(content, x, y, positionInfo) {
    this.tooltip.innerHTML = content;
    var finalX = x;
    var finalY = y;
    var transformValue = 'translate(-50%, -140%)';

    if (positionInfo.type === 'center') {
        var containerRect = this.canvas.parentElement.getBoundingClientRect();
        finalX = containerRect.width / 2;
        finalY = containerRect.height / 2;
        transformValue = 'translate(-50%, -50%)';
    }

    this.tooltip.style.left = finalX + 'px';
    this.tooltip.style.top = finalY + 'px';
    this.tooltip.style.transform = transformValue;
    this.tooltip.style.opacity = '1';
    this.tooltip.setAttribute("aria-hidden", "false");

    var self = this;
    setTimeout(function() {
        var containerRect = self.canvas.parentElement.getBoundingClientRect();
        var tooltipRect = self.tooltip.getBoundingClientRect();
        var currentLeft = parseFloat(self.tooltip.style.left);
        var padding = 5;

        if (tooltipRect.left < containerRect.left + padding) {
            var overflow = (containerRect.left + padding) - tooltipRect.left;
            self.tooltip.style.left = (currentLeft + overflow) + 'px';
        } else if (tooltipRect.right > containerRect.right - padding) {
            var overflow = tooltipRect.right - (containerRect.right - padding);
            self.tooltip.style.left = (currentLeft - overflow) + 'px';
        }
    }, 0);
};

BaseChart.prototype.hideTooltip = function() {
    if (this.tooltip) this.tooltip.style.opacity = '0';
    if (this.tooltip) this.tooltip.setAttribute("aria-hidden", "true");
};

BaseChart.prototype.assignLabelsAndColors = function() {
  var options = this.options;
  var presets = chartLabelsAndColors[options.colorType] || chartLabelsAndColors.type1;
  var totalValue = this.data.reduce(function(sum, item) { return sum + item.value; }, 0);

  var calculatedData = this.data.map(function(item, index) {
      var newItem = {};
      for (var key in item) {
          newItem[key] = item[key];
      }
      newItem.percent = (item.value / totalValue) * 100;
      newItem.label = item.label || presets[index % presets.length].label;
      newItem.color = presets[index % presets.length].color;
      return newItem;
  });

  // 2025-11-24 [추가] '대상 자산 없음' 케이스이면 회색 100%로 덮어쓰기
  if (this.data.length === 1 && this.data[0].isEmpty) {
      calculatedData[0].label   = this.data[0].label || '대상 자산 없음';
      calculatedData[0].percent = 100;
      calculatedData[0].color   = '#f0f0f0';  // 원하는 회색으로 조정 가능
      calculatedData[0].isEmpty = true;
  }

  this.finalData = calculatedData.map(function(item) {
      var adjustedPercent = item.percent;
      if (options.minimumSlicePercent && item.percent > 0 && item.percent < options.minimumSlicePercent) {
          adjustedPercent = options.minimumSlicePercent;
      }
      var newItem = {};
      for (var key in item) {
          for (var k in item) {
              newItem[k] = item[k];
          }
      }
      newItem._adjustedPercent = adjustedPercent;
      return newItem;
  });

  var adjustedTotal = this.finalData.reduce(function(sum, item) { return sum + item._adjustedPercent; }, 0);

  this.finalData = this.finalData.map(function(item) {
      var newItem = {};
      for (var key in item) {
          newItem[key] = item[key];
      }
      newItem._adjustedPercent = (item._adjustedPercent / adjustedTotal) * 100;
      return newItem;
  });
};

BaseChart.prototype.animateChart = function() {
  if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
  }
  var totalFrames = this.options.totalFrames || 60;
  var currentFrame = 0;
  var self = this;

  // 2025-11-24 [추가] 매번 애니메이션 시작할 때 기본툴팁 상태 리셋
  this._defaultTooltipShown = false;

  function step() {
      currentFrame++;
      var progress = Math.min(currentFrame / totalFrames, 1);
      self.draw(progress);
      if (currentFrame < totalFrames) {
          self.animationFrameId = requestAnimationFrame(step);
      }
  }
  step();
};

BaseChart.prototype.updateData = function(newData) {
    this.data = newData;
    this.animateChart();
};

// StackedBarChart
function StackedBarChart(canvasId, data, options) {
    BaseChart.call(this, canvasId, data, Object.assign({
        barHeight: 50,
        padding: 10
    }, options));
    this.barRects = [];
}
StackedBarChart.prototype = Object.create(BaseChart.prototype);
StackedBarChart.prototype.constructor = StackedBarChart;

StackedBarChart.prototype.resizeCanvas = function() {
    var container = this.canvas.parentElement;
    if (!container || container.offsetWidth === 0) return;
    var ratio = window.devicePixelRatio || 1;
    var displayWidth = this.options.width || container.offsetWidth;
    var displayHeight = this.options.height || (this.options.barHeight * 1.5);
    this.canvas.width = displayWidth * ratio;
    this.canvas.height = displayHeight * ratio;
    this.canvas.style.width = displayWidth + 'px';
    this.canvas.style.height = displayHeight + 'px';
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(ratio, ratio);
    this.animateChart();
};

StackedBarChart.prototype.draw = function(progress) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.assignLabelsAndColors();
  var padding = this.options.padding;
  var barHeight = this.options.barHeight;
  var ratio = window.devicePixelRatio || 1;
  var canvasWidth = this.canvas.width / ratio;
  var canvasHeight = this.canvas.height / ratio;
  var totalBarWidth = canvasWidth - padding * 2;
  var currentX = padding;
  var barY = (canvasHeight - barHeight) / 2;
  this.barRects = [];
  var self = this;

  this.finalData.forEach(function(item) {
      var barSegmentWidth = (item._adjustedPercent / 100) * totalBarWidth * progress;
      self.ctx.fillStyle = item.color;
      self.ctx.fillRect(currentX, barY, barSegmentWidth, barHeight);
      self.barRects.push({
          x: currentX * ratio,
          y: barY * ratio,
          width: barSegmentWidth * ratio,
          height: barHeight * ratio,
          data: item
      });
      currentX += barSegmentWidth;
  });

  // 2025-11-24 [추가] 애니메이션이 끝났을 때, %가 제일 큰 label을 기본 툴팁으로 한 번 보여주기
  if (progress === 1 && !this._defaultTooltipShown && this.finalData && this.finalData.length > 0) {
      this._defaultTooltipShown = true;

      // '대상 자산 없음' 케이스, 바차트는 바차트 처럼 한 번만
      if (this.finalData.length === 1 && this.finalData[0].isEmpty) {
          var emptyItem = this.finalData[0];
          var emptyTooltip = '<p>' + emptyItem.label + '</p>';
          var bar = this.barRects[0];
          var ratio = window.devicePixelRatio || 1;
          var cx = (bar.x + bar.width / 2) / ratio;
          var cy = (bar.y) / ratio;
          // 기본 바차트 툴팁포지션 { type: 'aboveSegment' }
          this.showTooltip(emptyTooltip, this.canvas.offsetLeft + cx, this.canvas.offsetTop + cy, { type: 'aboveSegment' });
          return;
      }

      // 일반 케이스: percent가 가장 큰 항목 찾기 (동률이면 첫 번째)
      var maxIndex = 0;
      var maxPercent = this.finalData[0].percent;
      for (var i = 1; i < this.finalData.length; i++) {
          if (this.finalData[i].percent > maxPercent) {
              maxPercent = this.finalData[i].percent;
              maxIndex = i;
          }
      }

      var targetBar = this.barRects[maxIndex];
      if (targetBar) {
          var tooltipContent = '<p>' + targetBar.data.label + ' ' + targetBar.data.percent.toFixed(1) + '%</p>';
          var segmentCenterX_css = (targetBar.x + targetBar.width / 2) / ratio;
          var segmentTopY_css = targetBar.y / ratio;
          var tooltipX_container = this.canvas.offsetLeft + segmentCenterX_css;
          var tooltipY_container = this.canvas.offsetTop + segmentTopY_css;
          this.showTooltip(tooltipContent, tooltipX_container, tooltipY_container, { type: 'aboveSegment' });
      }
  }
};

StackedBarChart.prototype.checkHit = function(x, y) {
    if(this.data.length === 1 && this.data[0].isEmpty){
      return; // 모두 0일때 클릭 안되게
    }  
    var ratio = window.devicePixelRatio || 1;
    var scaledX = x * ratio;
    var scaledY = y * ratio;
    for (var i = 0; i < this.barRects.length; i++) {
        var bar = this.barRects[i];
        if (scaledX >= bar.x && scaledX <= bar.x + bar.width &&
            scaledY >= bar.y && scaledY <= bar.y + bar.height) {

            var tooltipContent = '<p>' + bar.data.label + ' ' + bar.data.percent.toFixed(1) + '%</p>';

            var segmentCenterX_css = (bar.x + bar.width / 2) / ratio;
            var segmentTopY_css = bar.y / ratio;
            var tooltipX_container = this.canvas.offsetLeft + segmentCenterX_css;
            var tooltipY_container = this.canvas.offsetTop + segmentTopY_css;
            this.showTooltip(tooltipContent, tooltipX_container, tooltipY_container, { type: 'aboveSegment' });
            return;
        }
    }
    this.hideTooltip();
};

// DoughnutChart
function DoughnutChart(canvasId, data, options) {
    BaseChart.call(this, canvasId, data, Object.assign({
        sizeFactor: 0.8,
        thicknessRatio: 0.25
    }, options));
    this.sliceAngles = [];
}
DoughnutChart.prototype = Object.create(BaseChart.prototype);
DoughnutChart.prototype.constructor = DoughnutChart;

DoughnutChart.prototype.resizeCanvas = function() {
    var container = this.canvas.parentElement;
    if (!container || container.offsetWidth === 0) return;
    var ratio = window.devicePixelRatio || 1;
    var displayWidth, displayHeight;
    if (this.options.width && this.options.height) {
        displayWidth = this.options.width;
        displayHeight = this.options.height;
    } else {
        var containerSize = Math.min(container.offsetWidth, container.offsetHeight);
        displayWidth = containerSize * this.options.sizeFactor;
        displayHeight = containerSize * this.options.sizeFactor;
    }
    this.canvas.width = displayWidth * ratio;
    this.canvas.height = displayHeight * ratio;
    this.canvas.style.width = displayWidth + 'px';
    this.canvas.style.height = displayHeight + 'px';
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(ratio, ratio);
    this.animateChart();
};

DoughnutChart.prototype.draw = function(progress) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.assignLabelsAndColors();
  var ratio = window.devicePixelRatio || 1;
  var canvasWidth = this.canvas.width / ratio;
  var canvasHeight = this.canvas.height / ratio;
  var centerX = canvasWidth / 2;
  var centerY = canvasHeight / 2;
  var radius = Math.min(centerX, centerY);
  var thickness = radius * this.options.thicknessRatio;
  var startAngle = -Math.PI / 2;
  this.sliceAngles = [];
  var self = this;

  this.finalData.forEach(function(item) {
      var sliceAngle = (item._adjustedPercent / 100) * 2 * Math.PI;
      var animatedSliceAngle = sliceAngle * progress;
      self.ctx.beginPath();
      self.ctx.moveTo(centerX, centerY);
      self.ctx.arc(centerX, centerY, radius, startAngle, startAngle + animatedSliceAngle);
      self.ctx.fillStyle = item.color;
      self.ctx.fill();
      self.sliceAngles.push({
          start: startAngle,
          end: startAngle + sliceAngle,
          data: item
      });
      startAngle += sliceAngle;
  });

  this.ctx.beginPath();
  this.ctx.arc(centerX, centerY, radius - thickness, 0, 2 * Math.PI);
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fill();

  // 2025-11-24 [추가] 애니메이션 끝나면 %가 제일 큰 label을 중앙에 기본 툴팁으로 표시
  // 애니메이션이 끝났을 때 기본 툴팁 표시
  if (progress === 1 && !this._defaultTooltipShown && this.finalData && this.finalData.length > 0) {
      this._defaultTooltipShown = true;

      var targetItem = this.finalData[0];

      if (!(this.finalData.length === 1 && this.finalData[0].isEmpty)) {
          var maxIndex = 0;
          var maxPercent = this.finalData[0].percent;
          for (var i = 1; i < this.finalData.length; i++) {
              if (this.finalData[i].percent > maxPercent) {
                  maxPercent = this.finalData[i].percent;
                  maxIndex = i;
              }
          }
          targetItem = this.finalData[maxIndex];
      }

      var tooltipContent;

      // ⭐ 여기만 바뀜!
      if (targetItem.isEmpty) {
          tooltipContent = '<p>' + targetItem.label + '</p>';
      } else {
          tooltipContent = '<p>' + targetItem.label + '<br>' + targetItem.percent.toFixed(1) + '%</p>';
      }

      this.showTooltip(tooltipContent, null, null, { type: 'center' });
  }

};

DoughnutChart.prototype.checkHit = function(x, y) {
    if(this.data.length === 1 && this.data[0].isEmpty){
      return; // 모두 0일때 클릭 안되게
    }    
    var rect = this.canvas.getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    var canvasX = (x / rect.width) * (this.canvas.width / ratio);
    var canvasY = (y / rect.height) * (this.canvas.height / ratio);
    var centerX = this.canvas.width / ratio / 2;
    var centerY = this.canvas.height / ratio / 2;
    var radius = Math.min(centerX, centerY);
    var thickness = radius * this.options.thicknessRatio;
    var dx = canvasX - centerX;
    var dy = canvasY - centerY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius - thickness || distance > radius) {
        this.hideTooltip();
        return;
    }

    var angle = Math.atan2(dy, dx);
    if (angle < -Math.PI / 2) {
        angle += 2 * Math.PI;
    }

    for (var i = 0; i < this.sliceAngles.length; i++) {
        var slice = this.sliceAngles[i];
        if (angle >= slice.start && angle < slice.end) {
            var tooltipContent = '<p>' + slice.data.label + '<br>' + slice.data.percent.toFixed(1) + '%</p>';
            this.showTooltip(tooltipContent, null, null, { type: 'center' });
            return;
        }
    }
    this.hideTooltip();
};
// 2025-11-24 /////////////// 수정 끝 ///////////////////////////////////////////////////////////

// 금융소득 모니터링 포함/제외 토글
document.addEventListener('DOMContentLoaded', function() {
  // 페이지 내의 모든 '.toggleInput' 체크박스를 선택합니다.
  // var checkboxes = document.querySelectorAll('.incomeList .toggleInput');
  var checkboxes = document.querySelectorAll('.incomeItem .toggleInput');
  // 각 체크박스에 대해 이벤트 리스너를 추가합니다.
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function(event) {
      // 이벤트가 발생한 바로 그 체크박스 요소를 가져옵니다.
      var currentCheckbox = event.target;
      var boxTypeWrap = currentCheckbox.closest('.boxTypeWrap.-only'); // 카드 박스 안에서 쓸 때
      var incomeItem = currentCheckbox.closest('.incomeItem');
      var label = currentCheckbox.closest('.incomeToggleLabel');
      var textSpan = label.querySelector('.fs13.color3');
      // 체크박스가 체크 해제되었을 때 (체크가 아닐 때)
      if (!currentCheckbox.checked) {
        if(boxTypeWrap){
          boxTypeWrap.classList.add('-disabled');
        } else {
          incomeItem.classList.add('-disabled');
        }
        textSpan.childNodes[0].nodeValue = '제외';
      }
      // 체크박스가 다시 체크되었을 때
      else {
        if(boxTypeWrap){
          boxTypeWrap.classList.remove('-disabled');
        } else {
          incomeItem.classList.remove('-disabled');
        }
        textSpan.childNodes[0].nodeValue = '포함';
      }
    });
  });
});

// document.addEventListener('DOMContentLoaded', () => {
//   // 말풍선 닫기
//   const popOverBox = document.querySelector('.popOverBox');
//   const closeButton = document.querySelector('.popOverClose');
//   if (closeButton) {
//     closeButton.addEventListener('click', () => {
//       if (popOverBox) { // Also check if popOverBox exists
//         popOverBox.classList.remove('show');
//       }
//       isPopOverVisible = false;
//     });
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  // 말풍선 닫기
  const closeButtones = document.querySelectorAll('.popOverClose');
  closeButtones.forEach(closeButtonEl => {
    closeButtonEl.addEventListener('click', function (event) {
      const parentPopOverBox = closeButtonEl.closest('.popOverBox');
      if (parentPopOverBox) {
        parentPopOverBox.classList.remove('show');
      }
      // isPopOverVisible = false;
    });
  });
  // 다시 진단하기 클릭시 말풍선 닫기
  const closeButtones2 = document.querySelectorAll('.reTry.-refresh');
  closeButtones2.forEach(closeButtonEl2 => {
    closeButtonEl2.addEventListener('click', function (event) {
      const nextSiblingPopOverBox = closeButtonEl2.nextElementSibling;
      if (nextSiblingPopOverBox) {
        nextSiblingPopOverBox.classList.remove('show');
      }
    });
  });  
});


// 탭메뉴
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[role="tab"]');
  const tabList = document.querySelector('[role="tablist"]');
  // 각 탭에 클릭 이벤트 리스너를 추가합니다.
  tabs.forEach(tab => {
    tab.addEventListener('click', changeTabs);
  });
  // 탭 리스트 내에서 키보드 네비게이션을 처리합니다.
  let tabFocus = 0; // 현재 포커스된 탭의 인덱스
  if (tabList) {
    tabList.addEventListener('keydown', e => {
      // 왼쪽 또는 오른쪽 화살표 키가 눌렸는지 확인합니다.
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        // 기존 포커스된 탭의 tabindex를 -1로 설정하여 탭 순서에서 제외합니다.
        tabs[tabFocus].setAttribute('tabindex', -1);

        if (e.key === 'ArrowRight') {
          tabFocus++;
          // 마지막 탭에서 오른쪽으로 이동하면 첫 번째 탭으로 순환합니다.
          if (tabFocus >= tabs.length) {
            tabFocus = 0;
          }
        } else if (e.key === 'ArrowLeft') {
          tabFocus--;
          // 첫 번째 탭에서 왼쪽으로 이동하면 마지막 탭으로 순환합니다.
          if (tabFocus < 0) {
            tabFocus = tabs.length - 1;
          }
        }

        // 새로운 탭에 tabindex="0"을 설정하여 탭 순서에 포함시키고 포커스를 줍니다.
        tabs[tabFocus].setAttribute('tabindex', 0);
        tabs[tabFocus].focus();
      }
    });
  }
});

/**
 * 탭을 변경하는 함수
 * @param {MouseEvent} e - 클릭 이벤트 객체
 */
function changeTabs(e) {
  const targetTab = e.target;
  const tabContainer = targetTab.closest('.mbTabs');

  // 현재 탭 목록 내 모든 탭의 aria-selected를 false로, tabindex를 -1로 변경합니다.
  tabContainer.querySelectorAll('[role="tab"]').forEach(tab => {
    //tab.setAttribute('aria-selected', 'false'); // common_ui.js 접근성 처리 중복
    tab.classList.remove('active');
    tab.setAttribute('tabindex', '-1');
  });

  // 클릭된 탭을 선택 상태로 변경합니다.
  //targetTab.setAttribute('aria-selected', 'true'); // common_ui.js 접근성 처리 중복
  targetTab.classList.add('active');
  targetTab.setAttribute('tabindex', '0');

  // 모든 탭 패널을 숨깁니다.
  tabContainer.querySelectorAll('[role="tabpanel"]').forEach(panel => {
    panel.setAttribute('hidden', 'true');
  });

  // 클릭된 탭과 연결된 패널을 보여줍니다.
  const targetPanelId = targetTab.getAttribute('aria-controls');
  // const targetPanel = tabContainer.querySelector(`#${targetPanelId}`);
  const targetPanel = tabContainer.querySelector('#' + targetPanelId);
  targetPanel.removeAttribute('hidden');
}

// 밸런스 진단 프로그래스바BAR ////////////////////////////////////
// 2025-09-26 백틱 제거
// 2025-11-24 0.0 단위로 출력 및 함수로 실행되게 수정
  /* 그룹/페어 구조용 애니메이션 (라벨/바 각각 묶음) */
  /* 라벨/바 묶음을 pair 단위로만 관찰/재생 */

// =========================================
// 공통 포맷 유틸
// =========================================
var DECIMALS = 1;

// 소수 첫째 자리까지 표현 (예: 50 → "50.0")
var fmtSmart = function(n) {
  var v = Math.max(0, Number(n) || 0);
  return v.toFixed(DECIMALS);
};

// 외부에서도 사용 가능 (툴팁/표 등)
window.fmtHBarValue = fmtSmart;


// =========================================
// DOMContentLoaded 이후 바 애니메이션 로직
// =========================================
document.addEventListener('DOMContentLoaded', function() {
  var SPEED_MS        = 2000;
  var EASE            = 'cubic-bezier(0.22,1,0.36,1)';
  var NUMBER_DURATION = 900;
  var STAGGER_ROW     = 120;
  var IO_THRESHOLD    = 0.85;

  // ---------------- len 보정 규칙 ----------------
// value <= 0         → 0%
// 5 < value <= 50    → 5에서 11% → 50%까지 선형 보간
// value > 50         → v 그대로 (최대 100%)
function normalizeLen(n) {
  var v = Number(n) || 0;

  if (v <= 0) return 0;  // 0 일 때 11퍼 보정 제거 2025-11-27 수정

  if (v > 0 && v <= 5) return 5; // 0 < v <= 5 -> 11%

  // if(v > 5 && v <= 50){
  //   var t = (v - 5) / (50 - 5);
  //   var from = 11;
  //   var to = 50;
  //   return from + t * (to - from); 
  // }

  return Math.min(v, 100);
}

  // ---------------- ease 함수 ----------------
  var easeNumber = function(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  function applyZeroClass(bar, value){
    var v = Number(value) || 0;
    if(v === 0){
      bar.classList.add('-zero');
    }else{
      bar.classList.remove('-zero');
    }
  }
  // ---------------- hbarVal 텍스트 업데이트 (raw 값 그대로) ----------------
  function updateLabel(bar) {
    var valEl = bar.querySelector('.hbarVal');
    if (!valEl) return;

    var raw = Number(bar.dataset.value) || 0;
    valEl.textContent = fmtSmart(raw); // 예: 2.0, 10.0
  }

  // ---------------- aria 업데이트 (시각 len 기준) ----------------
  function updateAria(bar) {
    var raw   = Number(bar.dataset.value) || 0;
    var vVis  = normalizeLen(raw); // 길이 기준 비율
    var label =
      bar.dataset.label ||
      (bar.classList.contains('hbarBarMy') ? 'MY' : '권장');

    var formatted = fmtSmart(vVis);
    bar.setAttribute('aria-valuenow', formatted);
    bar.setAttribute('aria-valuetext', label + ' ' + formatted + '%');
  }

  // ---------------- 숫자 카운트업 (raw 값 기준) ----------------
  function countUp(el, target, dur) {
    if (!dur) dur = NUMBER_DURATION;

    var startT = performance.now();
    var T = Math.max(0, Number(target) || 0); // 원래 값 그대로

    function tick(now) {
      var p   = Math.min(1, (now - startT) / dur);
      var cur = T * easeNumber(p);

      el.textContent = fmtSmart(cur);
      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // ---------------- 바 초기화 ----------------
  function resetBar(bar) {
    bar.style.transition = 'none';

    var len  = getComputedStyle(bar).getPropertyValue('--len').trim() || '0';
    var zero = len.endsWith('%') ? '0%' : '0px';
    bar.style.width = zero;

    var val = bar.querySelector('.hbarVal');
    if (val) val.textContent = '0';

    bar.setAttribute('aria-valuenow', '0');
    var label =
      bar.dataset.label ||
      (bar.classList.contains('hbarBarMy') ? 'MY' : '권장');
    bar.setAttribute('aria-valuetext', label + ' 0%');
  }

  // ---------------- 바 애니메이션 ----------------
  function animateBar(bar, delayMs) {
    var len = getComputedStyle(bar).getPropertyValue('--len').trim() || '0';

    bar.style.transition =
      'width ' + SPEED_MS + 'ms ' + EASE + ' ' + delayMs + 'ms';

    requestAnimationFrame(function() {
      bar.style.width = len;
    });

    var raw = Number(bar.dataset.value) || 0; // raw 값 그대로

    var valEl = bar.querySelector('.hbarVal');
    if (valEl) {
      setTimeout(function() {
        countUp(valEl, raw, NUMBER_DURATION);
      }, delayMs);
    }

    updateLabel(bar);
    updateAria(bar);
  }

  // ---------------- pair 전체 재생 ----------------
  function playPair(pairEl) {
    var bars = pairEl.querySelectorAll('.hbarBars .hbarBar');

    bars.forEach(resetBar);
    pairEl.offsetWidth; // 리플로우

    bars.forEach(function(b, i) {
      animateBar(b, i * STAGGER_ROW);
    });
  }

  // ---------------- IO로 최초 1회 자동 재생 ----------------
  (function observePairs() {
    var pairs = document.querySelectorAll('.hBarPair');

    if (!('IntersectionObserver' in window)) {
      pairs.forEach(playPair);
      return;
    }

    var io = new IntersectionObserver(
      function(entries, obs) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;

          var el = entry.target;
          if (el.dataset.played === '1') {
            obs.unobserve(el);
            return;
          }

          playPair(el);
          el.dataset.played = '1';
          obs.unobserve(el);
        });
      },
      { root: null, threshold: IO_THRESHOLD }
    );

    pairs.forEach(function(p) {
      io.observe(p);
    });
  })();

  // ===================================================================
  // 1) pair 강제 재생 (값은 그대로 두고 애니만 다시)
  //
  //    playHBarPairNow('#pairId');
  //    playHBarPairNow('.hBarPair');  // 여러 개 선택 가능
  // ===================================================================
  window.playHBarPairNow = function(selector) {
    if (!selector) selector = '.hBarPair';

    var list = (typeof selector === 'string')
      ? document.querySelectorAll(selector)
      : selector;

    if (!list) return;

    list.forEach
      ? list.forEach(run)
      : run(list);

    function run(el) {
      playPair(el);
      el.dataset.played = '1';
    }
  };

  // ===================================================================
  // 2) 단일 bar 컨트롤: data-value / --len 각각 또는 동시에 조절
  //
  //    hbarVal가 있는 bar를 직접 선택해서 호출:
  //
  //    hbarSetValue('#barMy', {
  //      value: 2,        // 숫자: 2.0으로 표시
  //      // len 생략 시 -> 규칙에 따라 자동:
  //      //   <=0 → 0%, 0~5→11%, 5초과→11+(v-5)*5.1 (max 100)
  //      replay: true,
  //      updateAria: true
  //    });
  //
  //    hbarSetValue('#barMy', {
  //      value: 2,
  //      len: 30,         // len 수동 제어 (normalizeLen 미적용)
  //      unit: '%'
  //    });
  // ===================================================================
  window.hbarSetValue = function(selector, options) {
    if (!options) options = {};

    var bar = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector;

    if (!bar) return;

    var hasValue = Object.prototype.hasOwnProperty.call(options, 'value');
    var hasLen   = Object.prototype.hasOwnProperty.call(options, 'len');

    // 1) 값 적용 (data-value + hbarVal 텍스트)
    if (hasValue) {
      var rawV = Number(options.value) || 0;
      bar.dataset.value = rawV;

      applyZeroClass(bar, rawV);

      updateLabel(bar); // raw 값으로 즉시 갱신

      // len이 따로 안 온 경우: value 기반으로 len 자동 계산
      if (!hasLen) {
        var vis = normalizeLen(rawV);
        bar.style.setProperty('--len', vis + '%');
      }
    }

    // 2) len이 명시되면 수동 컨트롤 (normalize 없이)
    if (hasLen) {
      var lenVal = Number(options.len) || 0;
      var unit   = options.unit === 'px' ? 'px' : '%';
      bar.style.setProperty('--len', lenVal + unit);
    }

    // 3) aria만 갱신하고 싶을 때
    if (options.updateAria) {
      updateAria(bar);
    }

    // 4) 애니메이션 재생
    if (options.replay) {
      var delayMs = typeof options.delayMs === 'number' ? options.delayMs : 0;
      resetBar(bar);
      setTimeout(function() {
        animateBar(bar, 0);
      }, delayMs);
    }
  };

  // ===================================================================
  // 3) pair 전체 컨트롤: 값 배열 / 길이 배열 각각 전달 가능
  //
  //    hBarPair에 id 달고 호출:
  //
  //    hbarSetPair('#pairAsset', {
  //      values: [0, 2, 10],
  //      // lens 생략 시:
  //      //   len은 normalizeLen(value) 기준으로 자동 설정
  //      replay: true,
  //      updateAria: true
  //    });
  //
  //    hbarSetPair('#pairAsset', {
  //      values: [10, 20, 30],
  //      lens:   [15, 25, 60], // len 수동: 15%,25%,60%
  //      unit: '%',
  //      replay: true,
  //      updateAria: true
  //    });
  // ===================================================================
  window.hbarSetPair = function(pairSelector, options) {
    if (!options) options = {};

    var pairEl = (typeof pairSelector === 'string')
      ? document.querySelector(pairSelector)
      : pairSelector;

    if (!pairEl) return;

    var bars   = pairEl.querySelectorAll('.hbarBars .hbarBar');
    var values = options.values || [];
    var lens   = options.lens   || [];
    var unit   = options.unit === 'px' ? 'px' : '%';

    bars.forEach(function(bar, idx) {
      var hasValForIdx = idx < values.length && values[idx] != null;
      var hasLenForIdx = idx < lens.length   && lens[idx]   != null;

      // 1) 값 세팅 (data-value + label)
      var rawV;
      if (hasValForIdx) {
        rawV = Number(values[idx]) || 0;
        bar.dataset.value = rawV;

        applyZeroClass(bar, rawV);

        updateLabel(bar); // raw 값 기준 텍스트
      } else {
        // values를 안 줬으면 기존 data-value 유지
        rawV = Number(bar.dataset.value) || 0;
      }

      // 2) len 세팅
      if (hasLenForIdx) {
        // lens가 있으면 수동 컨트롤 (normalize 미적용)
        var lenVal = Number(lens[idx]) || 0;
        bar.style.setProperty('--len', lenVal + unit);
      } else if (hasValForIdx) {
        // lens 없음 + values 있음 -> normalizeLen 기반 자동 len
        var vis = normalizeLen(rawV);
        bar.style.setProperty('--len', vis + '%');
      }
      // values도 lens도 안 주면 기존 style 유지

      // 3) aria 갱신
      if (options.updateAria) {
        updateAria(bar);
      }
    });

    // 4) pair 재생
    if (options.replay) {
      pairEl.dataset.played = '';
      playPair(pairEl);
    }
  };

});
// 밸런스 진단 프로그래스바BAR 2025-11-24 수정 끝 //////////////////////////////////

/* ==========================================================================
   NHAsset Common (Standalone)
   - 자동 초기화 + 수동 API 제공(전역 NHAsset)
   - ChartCounter: .visualWrap 내 숫자 카운트업 (#gray-amount/#green-amount 또는 data-role 사용)
   - ListZeroState: .nhasset .boxTypeWrap .prodListWrap 0원 항목 비활성/스타일 처리
   - HTML 의존 최소화: 데이터는 data-*로, 실행은 자동. 필요시 수동 API로 제어.
   --------------------------------------------------------------------------
   전역 data-옵션(없으면 기본값)
     <body
       data-nhasset-auto-init="true"
       data-nhasset-threshold="0.25"
       data-nhasset-duration="1000"
       data-nhasset-delay="200"
       data-nhasset-unit="만원"
       data-nhasset-once="true"
     >
========================================================================== */
(function (global) {
  'use strict';

  // ------------------------ Utils ------------------------
  const Utils = {
    toNum(v) { const n = Number(v); return isNaN(n) ? NaN : n; },
    parseCurrencyInt(str) {
      if (!str) return NaN;
      const s = String(str).replace(/[^\d-]/g, '');
      return s === '' || s === '-' ? NaN : parseInt(s, 10);
    },
    qsa(root, sel){ return Array.from((root||document).querySelectorAll(sel)); },
    onReady(fn){
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once:true });
      else fn();
    },
    raf2(fn){ requestAnimationFrame(()=>requestAnimationFrame(fn)); },
  };

  // ------------------------ Config from <body data-*> ------------------------
  function readBodyOpt(name, fallback){
    const el = document.body;
    if (!el) return fallback;
    const v = el.getAttribute(name);
    if (v == null) return fallback;
    if (v === 'true') return true;
    if (v === 'false') return false;
    const num = Number(v);
    return isNaN(num) ? v : num;
  }

  // ------------------------ ChartCounter 2025- 11 -27 숫자 마이너스 표기 수정 요청 ------------------------
  const ChartCounter = (function(){
    // 기본값(데이터셋 없을 때)
    let DEFAULT_GRAY = 50;
    let DEFAULT_GREEN = 150;

    const config = {
      unit: '만원',
      duration: 1000,
      delay: 200,
      threshold: 0.85,
      once: true,
      graySelector: '#gray-amount, [data-role="gray-amount"]',
      greenSelector: '#green-amount, [data-role="green-amount"]',
      sectionSelector: '.visualWrap',
      guardAttr: 'data-nhasset-counted',
    };

    // body data-*로 오버라이드
    function applyBodyOptions(){
      const b = document.body || {};
      if (!b) return;
      const u = readBodyOpt('data-nhasset-unit', null);
      const d = readBodyOpt('data-nhasset-duration', null);
      const dl = readBodyOpt('data-nhasset-delay', null);
      const th = readBodyOpt('data-nhasset-threshold', null);
      const once = readBodyOpt('data-nhasset-once', null);
      if (u != null) config.unit = u;
      if (d != null) config.duration = Number(d);
      if (dl != null) config.delay = Number(dl);
      if (th != null) config.threshold = Number(th);
      if (once != null) config.once = !!once;
    }

    let io = null;

    function setDefaults(gray, green){
      if (!isNaN(Number(gray))) DEFAULT_GRAY = Number(gray);
      if (!isNaN(Number(green))) DEFAULT_GREEN = Number(green);
    }
    function setOptions(opts = {}){ Object.assign(config, opts); }

    function animateAmount(el, target, duration = config.duration, unit = config.unit){
      if (!el) return;

      const numTarget = Number(target) || 0; // 숫자로 변환
      const finalValue = Math.abs(numTarget);
      const sign =  numTarget < 0 ? '-' : '';

      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = ts - start;
        
        const value = Math.min(
          Math.round((p / duration) * finalValue),
          finalValue
        );
        el.textContent = sign + value.toLocaleString() + unit;

        if(p < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step)
  }

    function run(section, grayTarget, greenTarget){
      if (!section) return;
      if (section.getAttribute(config.guardAttr) === '1') return; // 재실행 방지
      section.setAttribute(config.guardAttr, '1');

      const grayEl = section.querySelector(config.graySelector);
      const greenEl = section.querySelector(config.greenSelector);
      if (grayEl) grayEl.textContent = '0' + config.unit;
      if (greenEl) greenEl.textContent = '0' + config.unit;

      setTimeout(()=>{
        if (grayEl) animateAmount(grayEl, Number(grayTarget)||0);
        if (greenEl) animateAmount(greenEl, Number(greenTarget)||0);
      }, config.delay);
    }

    // 수동 시작: 인덱스/셀렉터/요소
    function start(sectionTarget, gray, green){
      const sections = Utils.qsa(document, config.sectionSelector)
        .filter(sec => sec.querySelector('.chartContainer'));
      let section = null;
      if (typeof sectionTarget === 'number') {
        section = sections[sectionTarget] || null;
      } else if (typeof sectionTarget === 'string') {
        const el = document.querySelector(sectionTarget);
        section = el && (el.closest(config.sectionSelector) || el);
      } else if (sectionTarget && sectionTarget.nodeType === 1) {
        section = sectionTarget.closest(config.sectionSelector) || sectionTarget;
      }
      if (!section) return;

      const gd = Utils.toNum(section.dataset.grayTarget);
      const gn = Utils.toNum(section.dataset.greenTarget);

      const grayTarget = !isNaN(Utils.toNum(gray)) ? Number(gray)
                        : isNaN(gd) ? DEFAULT_GRAY : gd;
      const greenTarget = !isNaN(Utils.toNum(green)) ? Number(green)
                        : isNaN(gn) ? DEFAULT_GREEN : gn;

      if (section.querySelector('.chartContainer')) run(section, grayTarget, greenTarget);
    }

    function observe({ root=null, threshold=null } = {}){
      if (io) return io;
      applyBodyOptions();
      const th = threshold == null ? config.threshold : threshold;

      io = new IntersectionObserver((entries, observer)=>{
        entries.forEach((entry)=>{
          if (!entry.isIntersecting) return;
          const section = entry.target;
          section.classList.add('is-inview');

          const chart = section.querySelector('.chartContainer');
          if (chart){
            const gd = Utils.toNum(section.dataset.grayTarget);
            const gn = Utils.toNum(section.dataset.greenTarget);
            const grayTarget = isNaN(gd) ? DEFAULT_GRAY : gd;
            const greenTarget = isNaN(gn) ? DEFAULT_GREEN : gn;
            run(section, grayTarget, greenTarget);
          }
          if (config.once) observer.unobserve(section);
        });
      }, { root, threshold: th });

      Utils.qsa(document, config.sectionSelector).forEach(v => io.observe(v));
      return io;
    }

    function unobserveAll(){
      if (!io) return;
      Utils.qsa(document, config.sectionSelector).forEach(v => io.unobserve(v));
      io.disconnect(); io = null;
    }

    function resetFlags(scope){
      Utils.qsa(scope || document, config.sectionSelector).forEach(s => s.removeAttribute(config.guardAttr));
    }

    return { setDefaults, setOptions, start, observe, unobserveAll, resetFlags };
  })();


  // ------------------------ ListZeroState ------------------------
  const ListZeroState = (function(){
    const defaults = {
      scope: document,
      itemSelector: '.nhasset .boxTypeWrap .prodListWrap > li',
      anchorSelector: 'a',
      amountSelector: '.assetAmount>span',
      zeroClass: 'is-zero',
      ariaDisable: true,
      disableTabFocus: true,
      parseAmount: Utils.parseCurrencyInt,
    };

    function init(options = {}){
      const opt = { ...defaults, ...options };
      const root = opt.scope || document;
      Utils.qsa(root, opt.itemSelector).forEach(li=>{
        const a = li.querySelector(opt.anchorSelector);
        const amtEl = li.querySelector(opt.amountSelector);
        if (!a || !amtEl) return;

        const val = opt.parseAmount(amtEl.textContent || '');
        const isZero = val === 0;

        a.classList.toggle(opt.zeroClass, !!isZero);

        if (opt.ariaDisable) {
          if (isZero) a.setAttribute('aria-disabled', 'true');
          else a.removeAttribute('aria-disabled');
        }
        if (opt.disableTabFocus) {
          if (isZero) a.tabIndex = -1;
          else a.removeAttribute('tabindex');
        }
      });
    }

    return { init };
  })();

  // ------------------------ Auto Init (HTML 독립) ------------------------
  function autoInit(){
    // 전역 data-nhasset-auto-init=false 면 자동 실행 안 함
    const auto = readBodyOpt('data-nhasset-auto-init', true);
    if (!auto) return;

    // 차트 관찰 + 리스트 0원 처리
    ChartCounter.observe();
    ListZeroState.init();

    // SPA/지연 로딩 대비 다음 프레임에 한 번 더 스캔
    Utils.raf2(()=> ChartCounter.observe());
  }

  Utils.onReady(autoInit);

  // ------------------------ Export ------------------------
  const NHAsset = { Utils, ChartCounter, ListZeroState };
  if (typeof global !== 'undefined') global.NHAsset = NHAsset;
  if (typeof module !== 'undefined' && module.exports) module.exports = NHAsset;
  else if (typeof define === 'function' && define.amd) define(function(){ return NHAsset; });

})(typeof window !== 'undefined' ? window : this);


// 20250926 자산 변동 내역 무학 스크롤
/*! marqueeY.common.js v1.2 - 공용 + 자동 초기화 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MarqueeY = factory();
})(this, function () {
  "use strict";

  var WRAP_SELECTOR = ".bannerMarqueeY";
  var TRACK_SELECTOR = ".marqueeTrackY";

  var DEFAULTS = {
    speed: 40,        // px/s
    minSpeed: 10,
    maxSpeed: 200,
    pauseOnHover: true
  };

  var mmSM = window.matchMedia("(max-width: 480px)");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function toArray(nl){ return Array.prototype.slice.call(nl || []); }
  function clamp(n,a,b){ return Math.min(Math.max(n,a), b); }

  function readSpeed(wrap, opts){
    var raw = (mmSM.matches && wrap.getAttribute("data-speed-sm")) || null;
    if (raw == null) raw = wrap.getAttribute("data-speed");
    if (raw == null) raw = getComputedStyle(wrap).getPropertyValue("--speed");
    var n = parseFloat(raw);
    if (isNaN(n) || !isFinite(n)) n = opts.speed;
    if (prefersReduced) n *= 0.5;
    return clamp(n, opts.minSpeed, opts.maxSpeed);
  }

  function getGap(track){
    var cs = getComputedStyle(track);
    return parseFloat(cs.rowGap || cs.gap) || 0;
  }

  function measureOriginalHeight(track, originalCount){
    var gap = getGap(track);
    var firstN = toArray(track.children).slice(0, originalCount);
    var sum = 0;
    for (var i=0;i<firstN.length;i++){
      sum += firstN[i].getBoundingClientRect().height;
    }
    return sum + gap * Math.max(0, originalCount - 1);
  }

  function Instance(wrap, track, userOpts){
    var self = this;
    self.wrap = wrap;
    self.track = track;
    self.opts = Object.assign({}, DEFAULTS, userOpts || {});
    self.originals = toArray(track.children);
    self.originalCount = self.originals.length;

    // 끊김없는 루프 위해 복제
    for (var i=0;i<self.originals.length;i++){
      track.appendChild(self.originals[i].cloneNode(true));
    }

    self.computeDuration = function(){
      var speed = readSpeed(self.wrap, self.opts);   // px/s
      var distance = measureOriginalHeight(self.track, self.originalCount); // px
      var duration = distance / (speed || self.opts.speed);                 // s
      self.track.style.setProperty("--duration", `${duration}s`);
    };

    // 초기 계산
    requestAnimationFrame(self.computeDuration);

    // 리사이즈 대응(간단 디바운스)
    var raf = 0;
    self.onResize = function(){
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(self.computeDuration);
    };
    window.addEventListener("resize", self.onResize);

    // 내용 변화 대응
    self.ro = (typeof ResizeObserver !== "undefined")
      ? new ResizeObserver(function(){ requestAnimationFrame(self.computeDuration); })
      : null;
    if (self.ro) self.ro.observe(self.track);

    // 화면 밖 자동 일시정지
    self.io = (typeof IntersectionObserver !== "undefined")
      ? new IntersectionObserver(function(entries){
          var e = entries && entries[0];
          self.track.style.animationPlayState = (e && e.isIntersecting) ? "running" : "paused";
        }, {threshold:0})
      : null;
    if (self.io) self.io.observe(self.wrap);

    // 호버 일시정지 주석 풀면 호버시 일시 정지 기능 사용가능
    // var hoverAttr = self.wrap.getAttribute("data-pause-on-hover");
    // var pauseOnHover = (hoverAttr == null) ? self.opts.pauseOnHover : (hoverAttr === "true");
    // if (pauseOnHover){
    //   self.onEnter = function(){ self.track.style.animationPlayState = "paused"; };
    //   self.onLeave = function(){ self.track.style.animationPlayState = "running"; };
    //   self.wrap.addEventListener("mouseenter", self.onEnter);
    //   self.wrap.addEventListener("mouseleave", self.onLeave);
    // }
  }

  Instance.prototype.refresh = function(){ this.computeDuration(); };
  Instance.prototype.destroy = function(){
    window.removeEventListener("resize", this.onResize);
    if (this.ro) this.ro.disconnect();
    if (this.io) this.io.disconnect();
    if (this.onEnter) this.wrap.removeEventListener("mouseenter", this.onEnter);
    if (this.onLeave) this.wrap.removeEventListener("mouseleave", this.onLeave);
    while (this.track.firstChild) this.track.removeChild(this.track.firstChild);
    for (var i=0;i<this.originals.length;i++){
      this.track.appendChild(this.originals[i]);
    }
  };

  var API = {
    init: function(wrap, track, options){
      var w = typeof wrap === "string" ? document.querySelector(wrap) : wrap;
      var t = typeof track === "string" ? document.querySelector(track) : track;
      if (!w || !t) return null;
      return new Instance(w, t, options);
    },
    initAll: function(options){
      var wraps = toArray(document.querySelectorAll(WRAP_SELECTOR));
      var list = [];
      for (var i=0;i<wraps.length;i++){
        var w = wraps[i], t = w.querySelector(TRACK_SELECTOR);
        if (!t) continue;
        list.push(new Instance(w, t, options));
      }
      return list;
    },
    setDefaults: function(next){
      Object.assign(DEFAULTS, next || {});
    }
  };

  return API;
});

/* ===== 자동 초기화 코드 ===== */
document.addEventListener("DOMContentLoaded", function(){
  // 전역 기본값 세팅
  if (window.MarqueeY) {
    MarqueeY.setDefaults({ speed: 44 });
    MarqueeY.initAll(); // 페이지 내 모든 배너 자동 초기화
  }
});

/* ===== 금융소득모니터링 ===== */
(function () {
  // 주석/공백만 있으면 true
  /** @param {HTMLElement} panel */
  function isPanelEmpty(panel) {
    // 이미 panelInner가 있다면 그 안의 “의미 있는” 노드만 체크
    const target = panel.querySelector(':scope > .panelInner') || panel;
    for (const n of target.childNodes) {
      if (n.nodeType === Node.COMMENT_NODE) continue; // 주석은 무시
      if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) continue; // 공백 텍스트 무시
      return false; // 요소 노드 or 유의미 텍스트 발견 → 비어있지 않음
    }
    return true; // 주석/공백만 존재
  }

  function ensurePanelInner(panel) {
    let inner = panel.querySelector(':scope > .panelInner');
    if (!inner) {
      inner = document.createElement('div');
      inner.className = 'panelInner';
      while (panel.firstChild) inner.appendChild(panel.firstChild);
      panel.appendChild(inner);
    }
    return inner;
  }

  function initAccordions(root = document) {
    const blocks = root.querySelectorAll('.grayAccordion');
    blocks.forEach((acc, i) => {
      const btn = acc.querySelector('.analysisCate');
      const panel = acc.querySelector('.accordionPanel');
      if (!panel) return;

      // ✅ 1) 먼저 “비었는지” 판정
      if (isPanelEmpty(panel)) {
        panel.hidden = true; // 패널 숨김
        btn.classList.add('unset');
        //console.log('내용없음');
        return; // 바인딩 종료
      }

      // ✅ 2) 그 다음에 래퍼 보장
      ensurePanelInner(panel);
    });
  }

  document.addEventListener('DOMContentLoaded', () => initAccordions());
  window.initAccordions = initAccordions;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

function playContinuous(chart) {
  const stacks = chart.querySelectorAll('.incomeStack');
  if (stacks.length < 1) return;

  // 각 스택의 비중 합 (퍼센트 → 1로 정규화)
  const values = Array.from(stacks).map((s) =>
    parseFloat(s.style.getPropertyValue('--v')) / 100
  );
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const ratios = values.map((v) => v / total);

  const dur = parseFloat(chart.style.getPropertyValue('--dur')) || 900;

  stacks.forEach((s) => (s.style.transform = 'scaleX(0)'));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    stacks.forEach((s) => (s.style.transform = ''));
    return;
  }

  let t0;
  function step(t) {
    if (!t0) t0 = t;
    const p = Math.min(1, (t - t0) / dur);

    let cumulative = 0;
    stacks.forEach((s, i) => {
      const start = cumulative;
      const end = start + ratios[i];
      cumulative = end;
      let localP = 0;
      if (p > start) localP = Math.min(1, (p - start) / (end - start));
      s.style.transform = `scaleX(${localP})`;
    });

    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


  function initCharts() {
    const charts = document.querySelectorAll('.incomeChart');
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            playContinuous(e.target);
            if (e.target.dataset.animate === 'once') io.unobserve(e.target);
          } else if (e.target.dataset.animate !== 'once') {
            // 필요 시 리셋
            e.target
              .querySelectorAll('.incomeStack')
              .forEach((s) => (s.style.transform = 'scaleX(0)'));
          }
        });
      },
      { threshold: 0.2 }
    );
    charts.forEach((c) => io.observe(c));
  }
  document.addEventListener('DOMContentLoaded', initCharts);
})();

/* 금융소득모니터링 말풍선 2025-11-24 외부호출 변경 */
function initPopOver(){
  const popOverToggles = document.querySelectorAll('.popOverToggle');
  popOverToggles.forEach( popOverToggleEl => {
    popOverToggleEl.addEventListener('click', function (event) {
      const container = this.closest('.popOverWrap');
      if (container) {
        const popOverBoxEl = container.querySelector('.popOverBox');
        if (popOverBoxEl) {
            popOverBoxEl.classList.add('show');
        }
      }
    });
  });
  // 말풍선 닫기
  const closeButtones = document.querySelectorAll('.popOverClose');
  closeButtones.forEach(closeButtonEl => {
    closeButtonEl.addEventListener('click', function (event) {
      const parentPopOverBox = closeButtonEl.closest('.popOverBox');
      if (parentPopOverBox) {
        parentPopOverBox.classList.remove('show');
      }
    });
  });  
}
/* 금융소득모니터링 말풍선 2025-11-24 외부호출 변경 끝 */
/* 금융소득모니터링 말풍선 2025-11-24 외부호출 추가 */
document.addEventListener('DOMContentLoaded', function () {
  // 공통 클래스를 가진 모든 체크버튼을 선택.
  const popOverToggles = document.querySelectorAll('.popOverToggle');
  popOverToggles.forEach( popOverToggleEl => {
      popOverToggleEl.addEventListener('click', function (event) {
        // 'active' 클래스를 가지고 있는지 확인
        // if (popOverToggles && popOverToggles.classList && !popOverToggles.classList.contains('active')) {
        //   //console.log('클래스가 존재');
        // } else {
        //   //console.log('클래스가 존재하지 않음');
        //   const container = this.closest('.popOverWrap');
        //   if (container) {
        //     const popOverBoxEl = container.querySelector('.popOverBox');
        //     if (popOverBoxEl) {
        //         popOverBoxEl.classList.add('show');
        //     }
        //   }
        // }
        // 2025-11-24 'active' 여부 상관없이 변경
        const container = this.closest('.popOverWrap');
        if (container) {
          const popOverBoxEl = container.querySelector('.popOverBox');
          if (popOverBoxEl) {
              popOverBoxEl.classList.add('show');
          }
        }
      });
  });
});
/* 금융소득모니터링 말풍선 2025-11-24 외부호출 추가 끝 */

/* 서비스안내 스와이프 */
document.addEventListener('DOMContentLoaded', function() {
  const hasSpecificChild = document.querySelector('.lookSwiper.balanceReview');
  if (hasSpecificChild) {
    document.body.classList.add('overYhid');
  }
});

/* 금융소득모니터링 맨 위로 */
document.addEventListener("DOMContentLoaded", function() {
  const scrollBtn = document.querySelector(".scrollToTopBtn");
  // 버튼이 나타나기 시작할 스크롤 위치
  const scrollTrigger = 400;
  if(scrollBtn){
    // ----------------------------------------------------
    // 스크롤 위치 감지 및 버튼 표시/숨김
    // ----------------------------------------------------
    window.onscroll = function() {
      if (window.scrollY > scrollTrigger) {
          // 스크롤이 트리거 위치보다 크면 (화면 중간쯤 내려가면) 버튼을 **보이게** 함
          scrollBtn.classList.add("show");
      } else {
          // 그렇지 않으면 (맨 위 또는 트리거 위치보다 작으면) 버튼을 **숨김**
          scrollBtn.classList.remove("show");
      }
    };
    // ----------------------------------------------------
    // 버튼 클릭 시 맨 위로 부드럽게 이동
    // ----------------------------------------------------
    scrollBtn.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
  }
});

/*! 금융소득 모니터링 서비스 안내
  * RevealFX Lite v3 — 최소 data-* API
  * 그룹: data-fx="scale" (필수)
  *  - data-s: stagger(ms)        [기본 150]
  *  - data-t: threshold(0~1)     [기본 .2]
  *  - data-o: once(1/0)          [기본 1]
  *  - data-m: mode attr|dom|random|center [기본 attr]
  *  - data-d: duration (예: .6s) [기본 .6s]
  *  - data-e: easing  (예: ease-out) [기본 ease]
  *
  * 아이템(.revealItem):
  *  - data-order: 순서(숫자↑ 먼저). 미지정은 맨 뒤
  *  - data-scale: 퍼센트(예: 120 → 1.2). 미지정=100% (1.0)
  *  - (선택)data-l: 개별 추가 지연(ms)
  *  - (선택)data-d, data-e: 개별 duration/ease 오버라이드
  */
 //2025-11-10 reset 기능 추가
 (function (w, d) {
  const DEF = {
    stagger: 150,
    threshold: 0.2,
    once: true,
    mode: 'attr',
    duration: '.6s',
    ease: 'ease',
    target: '.revealItem',
  };
  let obs = [];

  // 초기 페인트 후 전환 활성화
  if (!d.documentElement.classList.contains('jsReady')) {
    requestAnimationFrame(() => d.documentElement.classList.add('jsReady'));
  }

  const pb = (v, fb) =>
    v == null || v === '' ? fb : String(v) === '1' || String(v).toLowerCase() === 'true';

  function getOpts(g) {
    return {
      target: DEF.target,
      stagger: Number(g.getAttribute('data-s')) || DEF.stagger,
      threshold: Number(g.getAttribute('data-t')) || DEF.threshold,
      once: pb(g.getAttribute('data-o'), DEF.once),
      mode: (g.getAttribute('data-m') || DEF.mode).toLowerCase(),
      duration: g.getAttribute('data-d') || DEF.duration,
      ease: g.getAttribute('data-e') || DEF.ease,
    };
  }

  function sortItems(items, mode, group) {
    const list = items.map((el, i) => ({ el, i }));
    if (mode === 'dom') return list;
    if (mode === 'random') return list.sort(() => Math.random() - 0.5);
    if (mode === 'center') {
      const r = group.getBoundingClientRect(),
        cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      return list
        .map((o) => {
          const rr = o.el.getBoundingClientRect(),
            x = rr.left + rr.width / 2,
            y = rr.top + rr.height / 2;
          return { ...o, dist: Math.hypot(x - cx, y - cy) };
        })
        .sort((a, b) => (a.dist === b.dist ? a.i - b.i : a.dist - b.dist));
    }
    // attr (기본): data-order 오름차순 → 동점은 DOM 순 → 미지정은 뒤
    return list
      .map((o) => {
        const a = o.el.getAttribute('data-order');
        const ord = a == null || a === '' ? Number.POSITIVE_INFINITY : Number(a);
        return { ...o, ord };
      })
      .sort((a, b) => (a.ord === b.ord ? a.i - b.i : a.ord - b.ord));
  }

  const toScale = (v) => {
    if (v == null || v === '') return 1; // 기본 100%
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n / 100 : 1; // 퍼센트 → 배율
  };

  function apply(el, opts, orderIdx) {
    el.style.setProperty('--fx-duration', opts.duration);
    el.style.setProperty('--fx-ease', opts.ease);
    const id = el.getAttribute('data-d');
    const ie = el.getAttribute('data-e');
    if (id) el.style.setProperty('--fx-duration', id);
    if (ie) el.style.setProperty('--fx-ease', ie);

    el.style.setProperty('--target-scale', String(toScale(el.getAttribute('data-scale'))));

    const extra = Number(el.getAttribute('data-l')) || 0;
    el.style.transitionDelay = `${orderIdx * opts.stagger + extra}ms`;
  }

  // 2025-11-10 reset 함수  추가
  function reset(root = d){
    const items = root.querySelectorAll(DEF.target);
    items.forEach((el) => {
      el.classList.remove('active');
      el.style.transitionDelay= '';
      el.style.removeProperty('--0-scale');
      el.style.removeProperty('--fx-duration');
      el.style.removeProperty('--fx-ease');
    })
  }

  function init(root = d) {
    const groups = root.querySelectorAll('[data-fx="scale"]');
    groups.forEach((group) => {
      const opts = getOpts(group);
      const items = Array.from(group.querySelectorAll(DEF.target));
      if (!items.length) return;

      items.forEach((el) => {
        el.classList.remove('active');
        el.style.transitionDelay = '';
        el.style.removeProperty('--target-scale');
        el.style.removeProperty('--fx-duration');
        el.style.removeProperty('--fx-ease');
      });

      // 2025-11-26 IntersectionObserver 미지원 fall back
      if(!('IntersectionObserver' in window)){
        const ordered = sortItems(items, opts.mode, group);
        ordered.forEach((o, idx) => {
          apply.apply(o.el, opts, idx);
          requestAnimationFrame(() => o.el.classList.add('active'));
        });
        return;
      }
      // 2025-11-26 IntersectionObserver 미지원 fall back 끝
      
      const io = new IntersectionObserver(
        (ents) => {
          ents.forEach((ent) => {
            if (ent.target !== group) return;
            if (ent.isIntersecting) {
              const ordered = sortItems(items, opts.mode, group);
              ordered.forEach((o, idx) => {
                apply(o.el, opts, idx);
                requestAnimationFrame(() => o.el.classList.add('active'));
              });
              if (opts.once) io.unobserve(group);
            } else if (!opts.once) {
              items.forEach((el) => {
                el.classList.remove('active');
                el.style.transitionDelay = '';
              });
            }
          });
        },
        { threshold: opts.threshold }
      );

      io.observe(group);
      obs.push(io);
    });
  }

  function destroy() {
    obs.forEach((o) => o.disconnect());
    obs = [];
  }
  //2025-11-13 수정
  w.RevealFX = { init, destroy, reset };

  d.addEventListener('DOMContentLoaded', () => RevealFX.init());
})(window, document);

// 2025-11-26 통합메인 반응형 지원
// document.addEventListener('DOMContentLoaded', function() {
//   var hasStyles = document.querySelectorAll('.amountRow');
//   hasStyles.forEach(element =>{
//     if (element.getAttribute('style') == '--offset:50px') {
//       element.setAttribute('style','--offset:60px');
//     }
//   });  
//   const mediaQueryList = window.matchMedia('(min-width:375px)')
//   function handleBreakpointChange(event){
//     if(event.matches){
//       hasStyles = document.querySelectorAll('.amountRow');
//       hasStyles.forEach(element =>{
//         if (element.getAttribute('style') == '--offset:60px') {
//           element.setAttribute('style','--offset:60px;margin-top:clamp(5px, 0.5rem, 10px)');
//         }
//       });    
//     }
//   }
//   mediaQueryList.addEventListener('change', handleBreakpointChange);
//   handleBreakpointChange(mediaQueryList);
// });

// 2025-12-01 자산모아보기 디자인 변경
document.addEventListener('DOMContentLoaded', function() {
  const connStyles = document.querySelectorAll('.mbAccListItem.-button .connect');
  const amountStyles = document.querySelectorAll('.mbAccList.-gather .arrowDown');
  connStyles.forEach(element =>{
    if (element.previousElementSibling) {
      const childElement = element.previousElementSibling.querySelector('.mbAccTit');
      childElement.setAttribute('style','color:#929292');
    }
  });
  amountStyles.forEach(element =>{
    const parentElement = element.closest('.mbAccRate');
    if (parentElement) {      
      const parentElementPrev = parentElement.previousElementSibling
      parentElementPrev.setAttribute('style','color:#929292');
    }    
  });  
});

//////  /* 2025-12-02 밸런스진단 카운터 */ js///////////////////////////////////////
(function (global) {
  function parseNumber(text) {
    const n = Number(String(text || "").replace(/,/g, "").trim());
    return isNaN(n) ? 0 : n;
  }
  
  function getEl(target) {
    return (target instanceof Element) ? target : document.querySelector(target);
  }

  // 내부: 무한 루프 (숫자 직접 증가 방식)
  function startNumberLoop(el, start, end, opts) {
    if (!el || el._numLoopRunning || el._finalLocked) return;

    const o = opts || {};

    const intervalMs  = o.intervalMs != null ? o.intervalMs : 40;
    const durationSec = o.loopDuration != null ? o.loopDuration : 2.0;
    const durationMs  = durationSec * 1000;

    // ★ NEW: 숫자/범위 정리
    let rawStart = Number(start) || 0;                 // 시작값
    let rawEnd   = Number(end);                        // 끝값
    if (!isFinite(rawEnd)) rawEnd = rawStart + 1;

    // ★ NEW: 맨 앞자리 제한 옵션
    const maxFirstDigit = (o.maxFirstDigit != null)
      ? Number(o.maxFirstDigit)
      : null;

    // ★ NEW: maxFirstDigit를 고려한 실제 끝값 계산
    let effectiveEnd = rawEnd;
    if (maxFirstDigit != null && maxFirstDigit >= 0) {
      const absEnd  = Math.abs(rawEnd);
      const digits  = String(Math.floor(absEnd) || 0).length || 1;
      const capStr  = String(maxFirstDigit) + '9'.repeat(Math.max(0, digits - 1));
      const capEnd  = Number(capStr);
      // rawEnd와 capEnd 중 더 작은 쪽으로 제한
      effectiveEnd = rawEnd >= 0
        ? Math.min(rawEnd, capEnd)
        : -Math.min(Math.abs(rawEnd), capEnd); // 음수 쓸 일은 거의 없지만 방어용
    }

    // ★ CHANGED: range / step 계산에 effectiveEnd 사용
    const range = Math.max(1, effectiveEnd - rawStart);
    let   steps = Math.max(1, Math.round(durationMs / intervalMs));
    let   step  = Math.max(1, Math.round(range / steps) * 199+3); // * 단위 배수로 조정

    let current = rawStart;
    el._numLoopRunning = true;

    function tick() {
      if (!el._numLoopRunning || el._finalLocked) return;

      el.textContent = Math.round(current).toLocaleString("ko-KR");

      current += step;

      // end를 넘어가면 다시 start로 (0 -> … -> effectiveEnd -> 0 …)
      if (current > effectiveEnd) {
        current = rawStart;
      }

      el._numLoopTimer = setTimeout(tick, intervalMs);
    }
    tick();
  }

  function stopNumberLoop(el) {
    if (!el) return;
    el._numLoopRunning = false;
    if (el._numLoopTimer) {
      clearTimeout(el._numLoopTimer);
      el._numLoopTimer = null;
    }
  }

// 내부: 최종값으로 부드럽게 정지 / 또는 즉시 정지
function stopLoopToFinal(el, finalValue, durationSec) {
  if (!el) return;
  el._finalLocked = true;
  el._loopRunning = false;
  el._numLoopRunning = false;
  stopNumberLoop(el);

  const startVal = parseNumber(el.textContent);
  const endVal   = parseNumber(finalValue);

  // durationSec이 안 들어오면 기본 1.5초, 0 이하이면 즉시 반영
  const actualSec = (typeof durationSec === 'number') ? durationSec : 1.5;

  if (actualSec <= 0) {
    // ★ 즉시 최종값으로 변경
    el.textContent = endVal.toLocaleString("ko-KR");
    return;
  }

  const total = actualSec * 1000;
  const t0    = performance.now();

  function frame(t) {
    const p = Math.min((t - t0) / total, 1);
    if (p >= 1) {
      el.textContent = endVal.toLocaleString("ko-KR");
      return;
    }
    const v = Math.round(startVal + (endVal - startVal) * p);
    el.textContent = v.toLocaleString("ko-KR");
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (!el) return;
      if (entry.isIntersecting) {
        el._visible = true;
        if (el._pendingActions && el._pendingActions.length) {
          el._pendingActions.forEach(fn => fn());
          el._pendingActions = [];
        }
        io.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  function ensureObserved(el) {
    if (!el._observed) {
      io.observe(el);
      el._observed = true;
    }
  }

  // --- API ---
  function runLoopInfinite(target, opts) {
    const el = getEl(target);
    if (!el) return;
    const o = opts || {};
    const loopStart = o.loopStart != null ? o.loopStart : parseNumber(el.textContent);
    const loopEnd   = o.loopEnd   != null ? o.loopEnd   : 9999999;

    const action = () => {
      stopNumberLoop(el);
      el._finalLocked = false;
      startNumberLoop(el, loopStart, loopEnd, o); // ★ maxFirstDigit 포함한 opts 통째로 전달
    };

    if (el._visible) action();
    else {
      ensureObserved(el);
      el._pendingActions = el._pendingActions || [];
      el._pendingActions.push(action);
    }
  }

  function stopCounter(target, finalValue, opts) {
    const el = getEl(target);
    const elPrent = el.closest('.valueAsset');
    elPrent.classList.remove('-count');
    stopLoopToFinal(el, finalValue, opts?.duration);
  }

  global.FimCounter = {
    runLoopInfinite: runLoopInfinite,
    stop: stopCounter
  };
})(window);

// =========================================================
// [실행 부분] 여기서 동작을 설정합니다.
// =========================================================

// 단일 사용 방법
document.addEventListener('DOMContentLoaded', () => {
  startLoading();
});

function startLoading() {
  FimCounter.runLoopInfinite('#balanceTotal', {
    loopStart: 5678901,
    loopEnd: 9999999,   // 이건 넉넉하게 잡고
    loopDuration: 1500.0,   // ★ 0 → (실제 end)까지 도는 시간
    intervalMs: 10,      // ★ 프레임 간격 (줄이면 더 부드러움)
    maxFirstDigit: 9     // ★ 맨 앞자리가 5를 넘지 않게 (0~5까지 움직임)
  });
}
// 붙여서 테스트
//  FimCounter.stop('#balanceTotal', 12345678, {duration:0});
function finishLoading() {
 FimCounter.stop('#balanceTotal', 12345678, {duration:0});
}

// 여러개 사용방법
// document.addEventListener('DOMContentLoaded', () => {
//   startLoading();
// });

// function startLoading() {
//   // .js-fimCounter 전부 무한 루프 시작
//   document.querySelectorAll('.js-fimCounter').forEach(el => {
//     FimCounter.runLoopInfinite(el, {
//       loopStart: 0,
//       loopEnd: 9999999,   // 넉넉하게
//       loopDuration: 20.0, // 0 → end까지 도는 시간(초)
//       intervalMs: 30,
//       maxFirstDigit: 9    // 맨 앞자리 제한 옵션 (원하는 대로 조절)
//     });
//   });
// }

// 2025-12-02 ASIS 인풋 reset 버튼 fixed (일부 iOS 안됨)
// (function () {
//   var jquerySelector = "input:not([readonly],[type='checkbox'],[type='radio'],[type='image'],[type='submit'],[type='button'])";
//   // 네이티브 인풋 판단
//   function isTargetInput(el){
//     if(!el || el.tagName !== 'INPUT') return false;
//     if(el.readOnly) return false;
//     var type = (el.type || '').toLowerCase();
//     if(type === 'checkbox' || type === 'radio' || type === 'image' ||type === 'submit' ||type === 'button'){
//       return false;
//     }
//     return true;
//   }

//   // 기존 ASIS 무력화
//   if(window.jQuery){
//     var $doc = jQuery(document);
//     $doc.off('blur focusout', jquerySelector);
//     $doc.off('focus focusin', jquerySelector);
//     $doc.off('keyup', jquerySelector);
//     $doc.off('click', '.btnReset');
//     //console.log("ASIS 인풋 reset 지워지냐");
//   }

//   document.addEventListener('focusin', function(e){
//     var el = e.target;
//     if(!isTargetInput(el)) return;

//     var parent = e.target.parentElement;
//     if(parent){
//       parent.classList.add('on');
//       var btn = parent.querySelector('.btnReset');
//       if(btn && el.value !== ''){
//         btn.style.display = '';
//       }      
//     }
//   });
//   document.addEventListener('focusout', function(e){
//     var el = e.target;
//     if(!isTargetInput(el)) return;

//     var parent = el.parentElement;
//     if(!parent) return;
    
//     parent.classList.remove('on');

//     if(el.value === ''){
//       var btn = parent.querySelector('.btnReset');
//       if(btn){
//         btn.style.display = 'none';
//       }
//     }
//   });
//   document.addEventListener('keyup', function(e){
//     var el = e.target;
//     if(!isTargetInput(el)) return;
//     var parent = el.parentElement;
//     if(!parent) return;

//     var btn = parent.querySelector('.btnReset');
//     if(!btn) return;

//     if(el.value !== ''){
//       btn.style.display = '';
//     } else {
//       btn.style.display = 'none';
//     }    
//   });
//   document.addEventListener('click', function(e){
//     var btn = e.target.closest ? e.target.closest('.btnReset') : null;
//     if(!btn) return;
//     e.preventDefault();
//     var parent = btn.parentElement;
//     if(!parent) return;

//     var input = null;
//     var inputs = parent.getElementsByTagName('input');
//     for(var i = 0; i < inputs.length; i++){
//       if(isTargetInput(inputs[i])){
//         input = inputs[i];
//         break;
//       }
//     }
//     if(!input) return;

//     //console.log("ASIS 인풋 reset 이벤트 지워지냐");
//     input.value = '';
//     btn.style.display = 'none';

//     setTimeout(function(){
//       try{
//         if(input.focus){
//           if(typeof input.focus === 'function'){
//             input.focus({preventScroll: true});
//           } else {
//             input.focus();
//           }
//         }
//       } catch(err){
//         input.focus && input.focus();
//       }
//     }, 50);
//   });
// })();

/* 2025-12-02 ASIS 인풋 reset 버튼 fixed 추가 버전 (jQuery버전) */
$(function() {
  var $inp = "input:not([readonly],[type='checkbox'],[type='radio'],[type='image'],[type='submit'],[type='button'])";
  $(document)
    .off('blur focusout', $inp)
    .off('focus focusin', $inp)
    .off('keyup', $inp)
    .off('click', '.btnReset');

  $(document)
    .on('blur focusout', $inp, function(e){
      var $this = $(this);
      setTimeout(function(){
        if(!$this.is(':focus')){
          $this.parent().removeClass('on');
          if($this.val() == ''){
            $this.siblings('.btnReset').hide();
          }
        }
      }, 200);
    })

    .on('focus focusin', $inp, function(e){
      $(this).parent().addClass('on');
      if($(this).val() !== ''){
        $(this).siblings('.btnReset').show();
      }
    })

    .on('keyup input', $inp, function(e){
      $(this).parent().addClass('on');
      if($(this).val() !== ''){
        $(this).siblings('.btnReset').show();
      } else {
        $(this).siblings('.btnReset').hide();
      }
    })

    .on('touchstart mousedown', '.btnReset', function(e){
      e.preventDefault();
    })

    .on('click', '.btnReset', function(e){
      console.log('reset click :: FIXED js');
      var $input = $(this).siblings('input');
      $input.val('');
      $input.focus();
      $(this).hide();
    });

  $($inp).each(function(){
    if($(this).val() !== ''){
      $(this).siblings('.btnReset').show();
    }
  });
});

/* 2025-12-05 롱프레스 제스처 차단 css 보정 보류 */
// (function(){
//   'use strict';

//   document.addEventListener('DOMContentLoaded', function(){
//     var aLinks = document.querySelectorAll('a');

//     aLinks.forEach(function(a){
//       var href = a.getAttribute('href') || '';
//       href = href.trim();

//       if(/^javascript:/i.test(href)){
//         var fnCode = href.replace(/^javascript:/i, '').trim();
//         a.setAttribute('data-js-fn', fnCode);
//       }

//       if(a.getAttribute('onclick')) return;

//       a.setAttribute('href', '#');
//     }); 
//   });

//   function closestAnchor(el){
//     while(el){
//       if(el.tagName && el.tagName.toLowerCase() === 'a') return el;
//       el = el.parentElement;
//     }
//     return null;
//   }

//   document.addEventListener('click', function(e){
//     var a = e.target.cloest ? e.target.cloest('a') : closestAnchor(e.target);
//     if(!a) return;
//     var jsCode = a.getAttribute('data-js-fn');
    
//     if(jsCode){
//       e.preventDefault();
//       try {
//         new Function(jsCode)();
//       } catch(err) {
//         console.error('JS link error:', err);
//       }
//       return;
//     }

//     if(a.getAttribute('onclick')) return;  

//     var href = a.getAttribute('href') || '';
//     if(href && href !== '#'){
//       e.preventDefault();
//       window.location.href = href;
//     }
//   }, false);
// })();

/* 2025-12-05 iOS 더블 탭 보정 */
(function(){
  var lastTouchEnd = 0;
  document.addEventListener('touchend', function(event){
    var now = Date.now();
    if(now - lastTouchEnd <= 300){
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, {passive: false});
})();