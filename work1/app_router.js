let sw = 0;

//API서버 로직을 위한 공간, 현재는 Demo를 진행하기 때문에 아무일도 하지 않습니다.
info();

//Cluster mast가 보내는 메시지
process.on('message', async (_message) => {
  //console.log( `${process.pid} : hello`, _message);
  sw = 1;
  info();
});

function info() {
	console.log(`Watcher core ${process.pid}, sw=${sw}`);	
}

process.send({type: "PROCESS_INIT"});