'use strict';

global.Cluster = require('cluster');

// 클러스터 워커 스케쥴을 Round-Robin 방식,  Cluster.schedulingPolicy = cluster.SCHED_NONE;// 클러스터 워커 스케쥴을 OS 위탁
Cluster.schedulingPolicy = Cluster.SCHED_RR;

if (Cluster.isMaster) {
  (async () => {
    const Os = require('os');
    const process = require('process')
    const watcherClient = require('./modules/watcher-client.js');
    
    let countCPU = 2;

    //생성된 모든 프로세스 정보를 보관.
    global.processList = [];

    //현재 생성된 프로세스 카운트 정보.
    global.processCount = 0;

    //생성된 프로세스 정보를 매핑
    global.SubProcessNo = new Map();

    //Cluster로 생성된 모든 프로세스(./app_router.js)에 연락 로직
    global.ClusterBroadCast = (_message) => {
    }
   

    processCount = processList.length;

    Cluster.on('online', (worker) => {
      //프로세스 리스트 추가
      processList.push(worker.id);

      //프로세스 pid기준 id정보 저장
      SubProcessNo.set(worker.process.pid, worker.id);
      
      //생성된 프로세스 총수량
      processCount = processList.length;     
    });

    Cluster.on('exit', (worker, code, signal) => {
      console.log('exit');
    });

    Cluster.on('message', (worker, _message) => {
      switch(_message.type) {
        case 'PROCESS_INIT':
          //준비된 CPU에 모든 프로세스가 로드
          if(processCount === countCPU) {
            watcherClient.init();
          }
        break;

        default:
          console.log('기타 메시지');
        break;
      }
    });

    // worker create
    for (let i = 0; i < countCPU; i++) {
      const thisProcess = Cluster.fork();

      SubProcessNo.set(thisProcess.process.pid, thisProcess.id);
    }
  })();
} else {
  const appRouter = require('./app_router.js');
}
