/**
 * NH마이데이터/자산관리 로컬 프리뷰 전용 네이티브 브릿지(OF) Mock
 * ------------------------------------------------------------
 * 실제 서비스에서는 앱 WebView가 전역객체 `OF`를 주입합니다(OF.exeStatus 등).
 * 일반 브라우저(로컬 서버)로 화면을 열면 OF가 없어 스크립트가
 * "ReferenceError: OF is not defined" 로 멈추고, 팝업/네이티브 연동 동작이
 * 전혀 실행되지 않습니다. 이 파일은 그 문제를 우회해 로컬에서 눈으로
 * 확인할 수 있게 해주는 개발/QA 전용 목업입니다.
 *
 * 절대 프로덕션 빌드/배포본에 포함하지 마세요.
 *
 * 사용법
 * ------
 * 확인하려는 html 파일의 </head> 바로 앞, 다른 <script>(jquery, common_ui.js,
 * nhasset-ui.js 등)보다 "먼저" 아래 줄을 추가합니다.
 *
 *   <script src="/claude/of-mock.local.js"></script>
 *
 * 이미 페이지가 열려 있다면 개발자도구 콘솔에 이 파일 내용을 붙여넣거나,
 * 아래 한 줄만 실행해도 됩니다.
 *
 *   window.OF = { exeStatus: 0 };
 *
 * 새 화면(50건) 작업 중 콘솔에
 *   [OF-MOCK] OF.xxx 읽기 감지 ...
 * 경고가 뜨면, 그 화면이 아직 이 mock에 없는 브릿지 값을 사용한다는 뜻입니다.
 * 아래 knownDefaults 객체에 실제 동작에 맞는 기본값을 추가해주세요.
 */
(function () {
  if (window.OF) {
    console.info('[OF-MOCK] 이미 실제 OF 객체가 존재합니다. mock을 적용하지 않습니다.');
    return;
  }

  // 지금까지 저장소 전체에서 확인된 실사용 값: OF.exeStatus (nhasset-ui.js)
  // 필요해지면 여기에 계속 추가하세요.
  var knownDefaults = {
    exeStatus: 0,       // OF.exeStatus == 5 분기(iOS 팝업 스크롤 보정)를 건드리지 않는 기본값
    osType: 'A',        // 'I'(iOS) / 'A'(Android) 분기 테스트 시 바꿔서 사용
    appVersion: '9.9.9'
  };

  var warned = {};
  function warnOnce(key, msg) {
    if (warned[key]) return;
    warned[key] = true;
    console.warn('[OF-MOCK] ' + msg);
  }

  window.OF = new Proxy(knownDefaults, {
    get: function (target, prop) {
      if (prop in target) return target[prop];
      warnOnce('get:' + String(prop),
        'OF.' + String(prop) + ' 읽기 감지 — of-mock.local.js의 knownDefaults에 기본값을 추가해주세요.');
      return undefined;
    },
    set: function (target, prop, value) {
      target[prop] = value;
      return true;
    }
  });

  // 네이티브 함수 호출형 브릿지(OF.xxx()) 대응 — 필요한 함수명이 생기면 배열에 추가
  ['callApp', 'moveApp', 'closeWebView', 'openPopup'].forEach(function (fn) {
    window.OF[fn] = function () {
      warnOnce('call:' + fn,
        'OF.' + fn + '() 호출 감지 — 현재는 아무 동작 안 함(no-op). 필요하면 of-mock.local.js에서 구현하세요.');
    };
  });

  console.info('[OF-MOCK] 로컬 프리뷰용 네이티브 브릿지 mock 적용됨 (exeStatus=' + knownDefaults.exeStatus + ')');
})();
