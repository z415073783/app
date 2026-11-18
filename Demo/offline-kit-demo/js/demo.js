//
//  demo.js · SimpleOfflineDemo 连通性测试页
//
//  **判定依据只有一个：`location.protocol`。**
//  离线包命中时主文档入口被改写成自定义 scheme（如 `simpleh5:`），
//  未命中 / 走线上回源时仍是 `https:`。除此之外任何东西都不能当作「已命中」的证据——
//  早期版本把标题和 `HTML 本地` 写死在 HTML 里，于是回源时页面也显示「已命中」，
//  这个页面作为验收工具就此失去意义（真实踩过）。
//
//  CSS / JS / 图片三行是「资源是否加载成功」，与「是否命中」是两件事：
//  回源时它们同样会成功。所以它们只用来验证链路完整性，不下结论。
//

(function () {
  'use strict';

  // SDK 注入的命中标记（见 MCH5OfflineConfiguration.injectedHitGlobalName）。
  // 命中才有值，未命中时是 undefined——但**它不能替代 protocol 判定**：
  // 未接 SDK 的 WebView 里两者都缺席，而这里只关心「协议是否已被改写」。
  var markerName = '__OFFLINE_PKG__';
  var marker = window[markerName];
  var isCustomScheme = location.protocol !== 'https:' && location.protocol !== 'http:';

  var verdict = document.getElementById('verdict');
  var htmlStatus = document.getElementById('html-status');
  var jsStatus = document.getElementById('js-status');
  var imgStatus = document.getElementById('img-status');
  var markerStatus = document.getElementById('marker-status');
  var cssStatus = document.getElementById('css-status');
  var loc = document.getElementById('loc');

  if (loc) loc.textContent = location.href;

  // 结论行：命中 / 回源，由 protocol 决定。
  if (verdict) {
    if (isCustomScheme) {
      verdict.textContent = '离线包已命中本地';
      verdict.className = 'hit';
    } else {
      verdict.textContent = '未命中 · 走线上回源';
      verdict.className = 'miss';
    }
  }
  if (htmlStatus) {
    htmlStatus.textContent = isCustomScheme ? '本地' : '线上';
    htmlStatus.className = isCustomScheme ? 'ok' : 'warn';
  }

  // 标记行：只用于确认 SDK 的注入脚本生效，不参与「是否命中」的结论。
  if (markerStatus) {
    if (marker && marker.hit === 1) {
      markerStatus.textContent = 'hit=1';
      markerStatus.className = 'ok';
    } else if (marker) {
      markerStatus.textContent = '存在但 hit≠1';
      markerStatus.className = 'warn';
    } else {
      markerStatus.textContent = '未注入';
      markerStatus.className = 'warn';
    }
  }

  if (jsStatus) {
    jsStatus.textContent = '已执行';
    jsStatus.className = 'ok';
  }

  // CSS 生效的判据：样式表里给 body 设一个探针颜色，读到即说明 CSS 真的加载了。
  if (cssStatus) {
    var probe = getComputedStyle(document.body).getPropertyValue('--demo-css-probe').trim();
    var cssOk = probe === 'ok';
    cssStatus.textContent = cssOk ? '已生效' : '未生效';
    cssStatus.className = cssOk ? 'ok' : 'warn';
  }

  var mark = document.querySelector('.mark');
  function settleImage() {
    if (!imgStatus) return;
    var ok = mark && mark.complete && mark.naturalWidth > 0;
    imgStatus.textContent = ok ? '已加载' : '失败';
    imgStatus.className = ok ? 'ok' : 'warn';
  }
  if (mark) {
    if (mark.complete) {
      settleImage();
    } else {
      mark.addEventListener('load', settleImage);
      mark.addEventListener('error', settleImage);
    }
  }
})();
