// ==UserScript==
// @name         bilibili三连
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.0
// @description  双击分享按钮触发三连
// @author       BlkSword
// @match        https://www.bilibili.com/video/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    // 三连逻辑函数
    function performTriple() {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', 'https://api.bilibili.com/x/web-interface/archive/like/triple');
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        httpRequest.withCredentials = true;

        let aid = window.__INITIAL_STATE__.aid;
        let csrf = getCookieValue("bili_jct");

        httpRequest.send('aid=' + aid + '&csrf=' + csrf);

        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = JSON.parse(httpRequest.responseText);
                console.log(json);
                if (json.code == 0) {
                    alert("三连成功!刷新页面可见");
                } else {
                    alert("三连失败/(ㄒoㄒ)/~~");
                }
            }
        };
    }

    // 通用Cookie获取函数
    function getCookieValue(name) {
        return decodeURIComponent(document.cookie.replace(
            new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[-.+*]/g, "\\$&") + "\\s*=\\s*([^;]*).*$)|^.*$"), "$1"
        )) || null;
    }

    // 监控分享按钮区域
    let observer = new MutationObserver(function (mutations) {
        let shareButton = document.querySelector('.bpx-player-ctrl-share') ||
            document.querySelector('.video-share-wrap') ||
            document.querySelector('[data-share]');

        if (shareButton && !shareButton.dataset.tripleHooked) {
            shareButton.dataset.tripleHooked = 'true';

            shareButton.addEventListener('dblclick', function (e) {
                e.stopPropagation();
                performTriple();
            });
        }
    });

    let targetNode = document.querySelector('.video-toolbar-left') ||
        document.querySelector('.bpx-player-ctrl-bottom') ||
        document.body;

    observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();