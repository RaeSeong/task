// index.js 파일
const Path = process.cwd();
const qs = require('qs');

const BinToStr = require('./binaryToString.js');
const uWS = require('uWebSockets.js');

const port = 3000;
const app = uWS.App();

let ServerManagement = {
			system: {},
			web: {},
			socket: {},
			api: {},
			discord: {},
			oApi: {}
		};

let Client = {};

app
.ws('/*', {
	compression: 1,
	idleTimeout: 0,
	upgrade: (res, req, context) => {
		res.upgrade({
				url: req.getUrl(),
				socketKey: req.getHeader('sec-websocket-key'),
				query: req.getQuery()
		},
			req.getHeader('sec-websocket-key'),
			req.getHeader('sec-websocket-protocol'),
			req.getHeader('sec-websocket-extensions'),
			context
		);
	},
	open: async (ws, req) => {
    
    let socketKey = ws.socketKey;
    let query = ws.query;   
    let m = qs.parse(query);
  
  	ServerManagement[m.type][socketKey] = m;
  	
  	Client[socketKey] = ws;
  	
  	ws['type'] = m.type;

  	setTimeout(()=>{
  		ws.send(JSON.stringify({message: null}));	
  	}, 3000)
	},
	close: (ws, code, message) => {
    let socketKey = ws.socketKey;
		
    ServerManagement[ws.type][socketKey] = undefined;
    delete ServerManagement[ws.type][socketKey];
    
    Client[socketKey] = undefined;
    delete Client[socketKey];
	},
  message: async (ws, message, isBinary) => {
		console.log('cache message receive');
  },
  end: (ws, code, message) => {
	  console.log('end');
	}
});


app.listen(port, (token) => {
  if (token) {
    console.log(`Watcher core ${process.pid} Listening to port ${port}`);
  } else {
    console.log(`Watcher core ${process.pid} Failed to listen to port ${port}`);
  }
});


//Master core(app.js)에서 발송한 메시지 수신
process.on('message', async (_message) => {
  console.log( `${process.pid}:./modules/socketServer.js process.on.message\n`, _message);console.log( ``);
  messageTypeRouting(_message)
});


function messageTypeRouting(m) {
  let fn = {
    test(){
    	console.log(m.message);
    },
    processKill() {
    	k;
    }
  };
  
	
	if (fn[m.messageType] === undefined) {
	  return 0;	
	}

  fn[m.messageType](m);  
}