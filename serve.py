# 開發用伺服器：不快取，改了程式重新整理就會生效
import http.server


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


http.server.test(HandlerClass=Handler, port=8000)
