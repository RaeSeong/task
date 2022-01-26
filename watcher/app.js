'use strict';
global.Cluster = require('cluster');
Cluster.schedulingPolicy = Cluster.SCHED_RR; 		// 클러스터 워커 스케쥴을 Round-Robin 방식,  Cluster.schedulingPolicy = cluster.SCHED_NONE;// 클러스터 워커 스케쥴을 OS 위탁

if (Cluster.isMaster) {
	(async () => {
		const Path = process.cwd();
		const Os = require('os');
		const ClusterUtil = require("./modules/clusterUtil.js");
		const countCPU = 2;

		//생성된 모든 프로세스 정보를 보관.
		global.processList = [];

		//현재 생성된 프로세스 카운트 정보.
		global.processCount = 0;

		//생성된 프로세스 정보를 매핑
		global.SubProcessNo = new Map();

		//프로세스가 생성 이벤트
		Cluster.on('online', (worker) => {
			//console.log(`worker pid: [${worker.process.pid}]`);

			//프로세스 리스트 추가
			processList.push(worker.id);

			//프로세스 pid기준 id정보 저장
			SubProcessNo.set(worker.process.pid, worker.id);
			
			//생성된 프로세스 총수량
			processCount = processList.length;

			//준비된 CPU에 모든 프로세스가 로드되면 출력합니다.
			if(processCount ===countCPU) {
				ClusterUtil.broadcastTest('hello world!');
			}
		});

		//프로세스가 종료 이벤트
		Cluster.on('exit', (worker, code, signal) => {

		});


		Cluster.on('message', (worker, _message) => {
			console.log( `[/app.js] Cluster.on.message}\n`, _message);
		});

		// worker create
		for (let i = 0; i < countCPU; i++) {
			const thisProcess = Cluster.fork();

			SubProcessNo.set(thisProcess.process.pid, thisProcess.id);
		}
		
		/*worker down test*/
		ClusterUtil.serverDownTest(5000, 5);
	})();
} else {
	//console.log('socket server');
	const frontSocket = require('./modules/socketServer.js');
}