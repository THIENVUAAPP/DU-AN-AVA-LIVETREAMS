sed -i '' -e '/<head>/a\
    <script>window.onerror = function(msg, url, line) { alert("Error: " + msg + "\\nURL: " + url + "\\nLine: " + line); return false; }; window.onunhandledrejection = function(e) { alert("Unhandled promise rejection: " + e.reason); };</script>' index.html
