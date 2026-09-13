// Serve only the standalone prototype; no arbitrary file or directory access.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'../prototypes/m1/index.html');
http.createServer((req,res)=>{const pathname=new URL(req.url,'http://127.0.0.1').pathname;if(pathname!=='/'&&pathname!=='/index.html'){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(fs.readFileSync(file))}).listen(4178,'127.0.0.1',()=>console.log('Cart Crash test server: http://127.0.0.1:4178'));
