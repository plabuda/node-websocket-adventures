# Python 3

import sys
import socketserver
from http.server import SimpleHTTPRequestHandler

class WasmHandler(SimpleHTTPRequestHandler):
    def end_headers(self):        
        # Include additional response headers here. CORS for example:
        #self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def translate_path(self, path):
        print("Translate path called for {}".format(path))
        if(path == FROM):
            print("Path overriden to {}".format(TO))
            result = SimpleHTTPRequestHandler.translate_path(self, TO)
            print("Translation result is {}".format(result))
            return result
        result = SimpleHTTPRequestHandler.translate_path(self, path)
        print("Translation result is {}".format(result))
        return result


# Python 3.7.5 adds in the WebAssembly Media Type. If this is an older
# version, add in the Media Type.
if sys.version_info < (3, 7, 5):
    WasmHandler.extensions_map['.wasm'] = 'application/wasm'


if __name__ == '__main__':
    PORT = 8000
    if(len(sys.argv) == 3):
        FROM = sys.argv[1]
        TO = sys.argv[2]
    with socketserver.TCPServer(("", PORT), WasmHandler) as httpd:
        print("Listening on port {}. Press Ctrl+C to stop.".format(PORT))
        httpd.serve_forever()