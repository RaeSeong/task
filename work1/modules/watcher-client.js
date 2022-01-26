const Path = process.cwd();
const Os = require('os');
const Ws = require('ws');


// 모든 소켓 서버에 접속
let connect = null;
//let workerTaskTicket = 0;

  
module.exports = {
  init() {
    if(connect === null) {
      connect = new clientSocket({ url: '127.0.0.1', type: 'api' });
      connect.init();
    }
  },
  emit(_message) {
    if (connect) connect.emit(_message);
  }
};

function clientSocket({ url, type }) {
  let ws = null;
  let signiture = null;
  let Idx = null;
  let initSw = 0;
  let reConnectCount = 0;

  return {
    init: init,
    reConnect: reConnect,
    emit(_message) {
      ws.send(encodeURI(JSON.stringify(_message)));
    },
  };

  function init() {
    //console.log('client socket connect');

    let query = { connectServerType: type };

    //query = JSON.stringify( query );

    //Idx = idx;
    let connectUrl = `http://127.0.0.1:3000/?type=${type}&host=localhost`;
    ws = new Ws(connectUrl);

    ws.on('message', onMessage);
    ws.on('open', onOpen);
    ws.on('error', onError);
    ws.on('close', onClose);
  }

  function onMessage(receiveMessage) {
    let m = JSON.parse(receiveMessage);
        
    console.log('소켓서버로 부터 메시지를 받았다.', receiveMessage);

    ClusterBroadCast(m);
  }

  function onOpen() {
    console.log('🔭 Watcher connection open');
    //ws.send(JSON.stringify({test:'test'}));
  }

  function onError() {
    //console.log('client socket onError occur');
  }

  function onClose() {
    //console.log('close');
    setTimeout(() => {
      reConnect();
    }, 1);
  }

  function reConnect() {
    Ws.message = undefined;
    Ws.open = undefined;
    Ws.error = undefined;
    Ws.close = undefined;

    init();
  }
}