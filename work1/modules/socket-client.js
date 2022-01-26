const Ws = require('ws');

// 모든 소켓 서버에 접속
const count = 1;
let cs = [];

cs[0] = new clientSocket({
  url: `http://127.0.0.1:3000`,
  type: null,
  name: null,
  idx: 0,
});

cs[0].init();

module.exports = {
  broadCast(_message) {
    // 모든 소켓 서버에 전달.
    // 지금은 한개 서버에 붙지만 나중에는 여러 소켓서버에 붙음.
    if (cs && cs[0]) {
      cs[0].emit(_message);
    }
  },
};

function clientSocket({ url, type, name, idx }) {
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

    let query = { connectServerType: '', clientId: '', conn: '' };

    query = JSON.stringify(query);

    Idx = idx;
    let connectUrl = `ws://${url}/?${query}`;
    //console.log('[webWorker_socket.js] socket start : ' + connectUrl);
    ws = new Ws(connectUrl);

    ws.on('message', onMessage);
    ws.on('open', onOpen);
    ws.on('error', onError);
    ws.on('close', onClose);
  }

  function onMessage(_message) {
    console.log('서버로 부터 받는 메시지');
    //console.log(_message);
    let m = JSON.parse(_message);
    let router = m.router;
  }

  function onOpen() {
    console.log('🔌 API SERVER > SOCKET > OPEN');
    //ws.send(JSON.stringify({test:'test'}));
  }

  function onError() {
    //console.log('client socket onError occur');
  }

  function onClose() {
    //console.log('close');

    setTimeout(() => {
      reConnect();
    }, 50);
  }

  function reConnect() {
    Ws.message = undefined;
    Ws.open = undefined;
    Ws.error = undefined;
    Ws.close = undefined;
    delete Ws.message;
    delete Ws.open;
    delete Ws.error;
    delete Ws.close;

    init();
  }
}
