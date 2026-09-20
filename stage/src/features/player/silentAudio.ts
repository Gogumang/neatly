/** 아주 짧은 무음 WAV (data URL). iOS 에서 사용자 탭 순간에 한 번 재생해 오디오 재생 권한을 풀어 둔다 */
export const SILENT_WAV = (() => {
  const samples = 800; // 8kHz 에서 0.1초
  const buf = new DataView(new ArrayBuffer(44 + samples));
  const text = (at: number, s: string) => {
    for (const [i, ch] of [...s].entries()) buf.setUint8(at + i, ch.charCodeAt(0));
  };
  text(0, "RIFF");
  buf.setUint32(4, 36 + samples, true);
  text(8, "WAVEfmt ");
  buf.setUint32(16, 16, true);
  buf.setUint16(20, 1, true); // PCM
  buf.setUint16(22, 1, true); // 모노
  buf.setUint32(24, 8000, true);
  buf.setUint32(28, 8000, true);
  buf.setUint16(32, 1, true);
  buf.setUint16(34, 8, true); // 8비트
  text(36, "data");
  buf.setUint32(40, samples, true);
  for (let i = 0; i < samples; i++) buf.setUint8(44 + i, 128); // 8비트 PCM 의 무음 = 128
  let binary = "";
  for (const byte of new Uint8Array(buf.buffer)) binary += String.fromCharCode(byte);
  return `data:audio/wav;base64,${btoa(binary)}`;
})();
