# 開發用伺服器：不快取，改了程式重新整理就會生效
import http.server


class Handler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"  # 預設 1.0 會在大檔案（>64KB）偶爾被截斷，頁面變空白

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


http.server.test(HandlerClass=Handler, port=8000)
