(function () {
  var loc = document.getElementById("loc");
  var jsStatus = document.getElementById("js-status");
  var imgStatus = document.getElementById("img-status");
  var mark = document.querySelector(".mark");
  if (loc) loc.textContent = location.href;
  if (jsStatus) jsStatus.textContent = "本地";
  if (!mark || !imgStatus) return;
  if (mark.complete && mark.naturalWidth > 0) {
    imgStatus.textContent = "本地";
    return;
  }
  mark.addEventListener("load", function () {
    imgStatus.textContent = "本地";
  });
  mark.addEventListener("error", function () {
    imgStatus.textContent = "失败";
  });
})();
