module.exports = {
    OK: "성공",
    NULL_VALUE: "필요한 값이 없습니다.",
    OUT_OF_VALUE: "파라미터 값이 잘못 되었습니다.",
    NEED_LOGIN: '로그인이 필요합니다.',
    CANT_ACCESS: '접근할 수 없습니다.',
    INVALID_IDENTIFIER: '유효하지 않은 식별자',
    NO_CONTENT:"데이터가 없습니다.",
    REPEATED_VALUE: "중복된 데이터입니다.",
    UNAUTHORIZED: "권한이 없습니다",
  
    // TOKEN
    EXPIRED_TOKEN: '만료된 토큰',
    INVALID_TOKEN: '유효하지 않은 토큰',
    NO_REGEN_TOKEN: '재로그인 필요',
    SUCCESS_TOKEN: '토큰 발급 성공',
    NO_TOKEN: '토큰이 없습니다',

    // SIGNUP, LOGIN
    SIGN_UP_SUCCESS: "회원 가입 및 기본카테고리 생성 성공.",
    SIGN_UP_FAIL: "회원 가입 실패.",
    SIGN_IN_SUCCESS: "로그인 성공.",
    SIGN_IN_FAIL: "로그인 실패.",
    ALREADY_NICKNAME: "이미 존재하는 닉네임 입니다.",
    NO_NICKNAME: "존재하지않는 닉네임 입니다.",
    ALREADY_EMAIL: "이미 존재하는 이메일 입니다.",
    NO_EMAIL: '존재하지 않는 이메일 입니다.',
    NOT_VALID_EMAIL: '올바르지 않은 이메일 형식 입니다.',
    NOT_VALID_NICKNAME: '올바르지 않은 닉네임 형식 입니다.',
    MISS_MATCH_PW: "비밀번호가 일치하지 않습니다",
    CHANGE_PW_SUCCESS: "비밀번호 변경 성공",
    MAIL_SEND_SUCCESS: '이메일 인증번호 전송 성공',
  
    // USER
    READ_USER_SUCCESS: "사용자 조회 성공",
    READ_USER_FAIL: "사용자 조회 실패",
    UPDATE_USER_SUCCESS: "사용자 정보 업데이트 성공",
    UPDATE_USER_FAIL: "사용자 정보 업데이트 실패",
    DELETE_USER_SUCCESS: "회원 탈퇴 성공",
    DELETE_USER_FAIL: "회원 탈퇴 실패",
    READ_USERINFO_SUCCESS: "사용자 정보 조회 성공",
    READ_USERINFO_FAIL: "사용자 정보 조회 실패",
    
    // CAFETI
    CAFETI_TEST_SUCCESS: "CAFETI 검사 완료",
    CAFETI_TEST_FAIL: "CAFETI 검사 실패",

    // REVIEW
    REVIEW_SUCCESS: "리뷰 작성 성공",
    REVIEW_FAIL: "리뷰 작성 실패",
    EDIT_REVIEW_SUCCESS: "리뷰 수정 성공",
    EDIT_REVIEW_FAIL: "리뷰 수정 실패",
    DELETE_REVIEW_SUCCESS: "리뷰 삭제 성공",
    DELETE_REVIEW_FAIL: '리뷰 삭제 실패',
    READ_CAFE_REVIEW_SUCCESS: "카페 리뷰 목록 조회 성공",
    READ_CAFE_REVIEW_FAIL: "카페 리뷰 목록 조회 실패",
    READ_MY_REVIEW_SUCCESS: "내 리뷰 목록 조회 성공",
    READ_MY_REVIEW_FAIL: "내 리뷰 목록 조회 실패",
    REVIEW_REQUEST_FAIL: "리뷰 요청에 필요한 값이 잘못되었습니다.",
    REPORT_REVIEW_FAIL: "리뷰 신고 실패",

    // CAFE
    CAFE_LOCATION_SUCCESS: "카페 위치 목록 조회 성공",
    CAFE_LOCATION_FAIL: "카페 위치 목록 조회 실패",
    MYMAP_LOCATION_SUCCESS: "마이맵 카페 위치 목록 조회 성공",
    MYMAP_LOCATION_FAIL: "마이맵 카페 위치 목록 조회 실패",
    CAFE_DETAIL_SUCCESS: "카페 상세 정보 조회 성공",
    CAFE_MENU_SUCCESS: "카페 메뉴 정보 조회 성공",

    // CATEGORY
    CREATE_CATEGORY_SUCCESS: "카테고리 생성 성공",
    CREATE_CATEGORY_FAIL: "카테고리 생성 실패",
    ADD_PIN_SUCCESS: "카테고리에 핀 추가/해제 성공",
    ADD_PIN_FAIL: "카테고리에 핀 추가 실패",
    DELETE_CATEGORY_SUCCESS: "카테고리 삭제 성공",
    DELETE_CATEGORY_FAIL: "카테고리 삭제 실패",
    DELETE_DEFAULT_FAIL: "기본 카테고리는 삭제할 수 없습니다.",
    EDIT_DEFAULT_FAIL: "기본 카테고리는 수정할 수 없습니다.",
    READ_CATEGORY_CAFE_SUCCESS: "카테고리에 포함된 카페 리스트 조회 성공",
    READ_CATEGORY_CAFE_FAIL: "카테고리에 포함된 카페 리스트 조회 성공",
    READ_MY_CATEGORY_SUCCESS: "내 카테고리 목록 조회 성공",
    READ_MY_CATEGORY_FAIL: "내 카테고리 목록 조회 실패",
    EDIT_CATEGORY_SUCCESS: "카테고리 이름/색상 수정 성공",
    DELETE_CAFES_IN_CATEGORY_SUCCESS: "선택된 카페 삭제 성공",

    //Search
    SEARCH_SUCCESS: "카페명으로 카페 검색 성공",
    // Server Error
    INTERNAL_SERVER_ERROR: "서버 내부 오류",
  };