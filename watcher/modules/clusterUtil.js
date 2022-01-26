const Cluster = require('cluster');
const Path = process.cwd();

const serverDownTest = (downTimeInterval, count) => {
	let downCount = 0;
	let thisInterval = setInterval(()=>{ 
		let workerIds = Object.keys(Cluster.workers);
		let rnd = Math.floor(Math.random() * workerIds.length) + 0;			
		const killTargetId = workerIds[rnd];

		Cluster.workers[killTargetId].send({messageType: "processKill"});

		downCount++;

		if(downCount === count) {
			clearInterval(thisInterval);
		} 
	}, downTimeInterval);
}

const broadcastTest = (message) => {	
	let workerIds = Object.keys(Cluster.workers);
	
	for(let i=0, c=workerIds.length; i < c; i++) {
		const workerNo = workerIds[i];		
		
		Cluster.workers[workerNo].send({messageType: "test", message});
	}
}

module.exports = {
  serverDownTest,
  broadcastTest
};