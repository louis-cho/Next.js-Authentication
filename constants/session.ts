export const SESSION_DURATION = {
  DEFAULT: 1000 * 30 * 60 * 1,        // 30분 (체크 안 했을 때)
  KEEP_SIGNED: 1000 * 60 * 60 * 24 * 365,  // 365일 (체크했을 때)
  UPDATE: 10 * 60,    // 세션이 10분 남았을 때 갱신하기
};