/**
* Head include
* ------------------
* css & script 공통 include
*/

(function(){
	var str=''
		+'<meta charset="utf-8">'
		+'<meta http-equiv="Content-Script-Type" content="text/javascript">'
		+'<meta http-equiv="Content-Style-Type" content="text/css">'
		+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'
		+'<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
		+'<meta name="apple-mobile-web-app-title" content="NH마이데이터">'
		+'<meta http-equiv="imagetoolbar" content="no">'
		+'<meta name="robots" content="no-index,follow">'
		+'<meta name="title" content="">'
		+'<meta name="author" content="">'
		+'<meta name="content" content="">'
		+'<meta name="keywords" content="NH마이데이터">'
		+'<meta name="description" content="NH마이데이터">'
		+'<meta http-equiv="Pragma" content="no-cache">'
		+'<meta http-equiv="Expires" content="-1">'
		// title은 공통 include에 넣지 않음 — 각 html 파일에서 <title>로 직접 지정

		+'<link type="text/css" rel="stylesheet" href="../../css/swiper.min.css">'
		+'<link type="text/css" rel="stylesheet" href="../../css/nh_base.css">'
		+'<link rel="stylesheet" type="text/css" href="../../css/nh_layout.css">'
		+'<link rel="stylesheet" type="text/css" href="../../css/nh_comm.css">'
		+'<link rel="stylesheet" type="text/css" href="../../css/nhasset_logos.css">'
		+'<link rel="stylesheet" type="text/css" href="../../css/nhasset_com.css" id="changeCom">'
		+'<link rel="stylesheet" type="text/css" href="../../css/nhasset_cont.css" id="changeCont">'
		+'<link rel="stylesheet" type="text/css" href="../../css/nhasset_myd.css">' //2023 마이데이터 고도화
		+'<link type="text/css" rel="stylesheet" href="../../css/ms_allone.css">'
		+'<link type="text/css" rel="stylesheet" href="../../css/ms_pay.css">' //NH-Pay
		+'<link rel="stylesheet" type="text/css" href="../../css/nhasset_myd_mb.css?20250912">' //2025 NH농협은행 비대면 마이데이터 고객여정 개선
		+'<link rel="stylesheet" type="text/css" href="../../css/update.css">' //2026 NH농협은행 nds 적용

		+'<script src="../../js/jquery-1.9.1.min.js"></script>'
		+'<script src="../../js/jquery-ui.min.js"></script>'
		+'<script src="../../js/jquery.ui.touch-punch.min.js"></script>'
		+'<script src="../../js/swiper.7.4.1.min.js"></script>'
		+'<script src="../../js/common_ui.js"></script>'
		+'<script src="../../js/nhasset-ui.js"></script>'
		+'<script src="../../js/nhasset-ui-myd.js"></script>' //2023 마이데이터 고도화
		+'<script src="../../js/nhasset-ui-myd-mb.js"></script>' //2025 NH농협은행 비대면 마이데이터 고객여정 개선
		+'<script src="../../js/nds-ui.js"></script>' //2026 NH농협은행 nds 적용 화면 UI 스크립트

		+'<link type="text/css" rel="stylesheet" href="../pub-assets/css/guide.css">'//가이드용 css 실제 서비스에는 불필요
		+'<script src="../pub-assets/js/guide.js"></script>'// 가이드용 js 실제 서비스에는 불필요
		// +'<script src="../pub-assets/js/guide-mb.js"></script>'// 가이드용 js 실제 서비스에는 불필요 //2025 NH농협은행 비대면 마이데이터 고객여정 개선
	;

	document.write(str);
})();