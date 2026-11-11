/* DEVOTION mobile compatibility layer — independent of desktop edition. */
(() => {
  "use strict";
  if (window.__devotionMobileReady) return;
  window.__devotionMobileReady = true;

  // Keep the original soundtrack and narrative timing. When mobile browsers
  // reject a scripted play(), provide an explicit, user-initiated unlock.
  const nativePlay = HTMLMediaElement.prototype.play;
  let blockedAudio = null;
  let prompt = null;

  function ensurePrompt() {
    if (prompt) return prompt;
    prompt = document.createElement("div");
    prompt.id = "dv-mobile-audio-prompt";
    prompt.setAttribute("role", "dialog");
    prompt.setAttribute("aria-label", "啟動音訊");
    prompt.innerHTML = '<div class="dv-audio-panel"><div class="dv-audio-code">[ AUDIO_PERMISSION_REQUIRED ]</div><p>此裝置需要玩家手動授權播放音樂。</p><button type="button" id="dv-mobile-audio-unlock">[ 點擊啟動音訊 ]</button><button type="button" id="dv-mobile-audio-skip">暫時靜音繼續</button></div>';
    document.body.appendChild(prompt);
    prompt.querySelector("#dv-mobile-audio-unlock").addEventListener("click", () => {
      const target = blockedAudio;
      if (!target) { prompt.hidden = true; return; }
      // Invoke the native method immediately in the trusted click handler.
      let p;
      try { p = nativePlay.call(target); }
      catch (err) { prompt.querySelector("p").textContent = "音訊啟動失敗，請確認裝置音量與媒體格式。"; return; }
      Promise.resolve(p).then(() => {
        blockedAudio = null;
        prompt.hidden = true;
      }).catch(() => {
        prompt.querySelector("p").textContent = "仍無法播放，請檢查瀏覽器音訊權限後重試。";
      });
    });
    prompt.querySelector("#dv-mobile-audio-skip").addEventListener("click", () => {
      blockedAudio = null;
      prompt.hidden = true;
    });
    return prompt;
  }

  HTMLMediaElement.prototype.play = function (...args) {
    let promise;
    try { promise = nativePlay.apply(this, args); }
    catch (err) { return Promise.reject(err); }
    if (!promise || typeof promise.catch !== "function") return promise;
    return promise.catch(err => {
      if (err && (err.name === "NotAllowedError" || err.name === "SecurityError")) {
        blockedAudio = this;
        const overlay = ensurePrompt();
        overlay.hidden = false;
      } else {
        console.warn("[DEVOTION mobile] Audio unavailable:", this.currentSrc || this.src, err);
      }
      // Existing story scripts may not await play(). Avoid unhandled rejections:
      // the audio prompt is the recovery path, and the narrative can proceed.
      return undefined;
    });
  };

  const isEditable = (target) => target && target.closest && target.closest("input, textarea, select, button");

  function enableSecretReveal() {
    const report = document.getElementById("report");
    if (!report) return;
    const secrets = report.querySelectorAll(".hidden-text");
    if (!secrets.length) return;
    const hint = document.createElement("p");
    hint.className = "dv-mobile-secret-hint";
    hint.textContent = "[ 觸控模式：長按報告中的可疑空白處，可嘗試恢復隱藏文字 ]";
    report.insertBefore(hint, report.firstChild);
    secrets.forEach((node) => {
      node.classList.add("dv-mobile-secret");
      node.setAttribute("tabindex", "0");
      node.setAttribute("aria-label", "可長按解密的隱藏文字區域");
      let timer = null;
      const clear = () => { if (timer !== null) { clearTimeout(timer); timer = null; } };
      const reveal = () => {
        node.classList.add("dv-mobile-revealed");
        node.setAttribute("aria-label", "已解密文字");
        if (navigator.vibrate) navigator.vibrate(30);
      };
      node.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse") return;
        clear();
        timer = setTimeout(reveal, 550);
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach(type => node.addEventListener(type, clear));
      node.addEventListener("contextmenu", (e) => { e.preventDefault(); reveal(); });
      node.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); }
      });
    });
  }

  function enableTouchActions() {
    // Prevent double-tap zoom on buttons, without disabling pinch zoom or selection.
    document.querySelectorAll("button, .btn").forEach(el => { el.style.touchAction = "manipulation"; });
    if (document.getElementById("puzzle-input")) {
      const input = document.getElementById("puzzle-input");
      input.setAttribute("enterkeyhint", "done");
    }
  }

  const setup = () => { enableSecretReveal(); enableTouchActions(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup, {once:true});
  else setup();
})();
