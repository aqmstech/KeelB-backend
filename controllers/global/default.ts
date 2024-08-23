import express from 'express';
import { RMQ } from '../../server/queues/rabbitmq';
// import { WorkerManager } from '../../utils/worker-manager';

const routes = express.Router();

routes.get('/test', async (req, res) => {
  try {
 
    res.send('Mail Sent');
  } catch (error) {
    console.log('error in testing Mail');
    res.status(200).send({ status: 'error' });
  }
});

routes.use('/stop', async (req, res) => {
  // await LeaguesDatabase.Disconnect();
  // HTTPServer.StopServer(true);
  res.send({ msg: 'Stopping' });
  // process.kill(process.pid,'SIGINT')
  process.emit('SIGINT' as any);
  //Kill The Process so that It will be restarted by PM2 or any other process manager
});


//Comment If we Don't want to Entertain All routes and generate Error
// routes.use('/', (req, res) => { console.log('Default : '); res.send('Hello World'); });

routes.use('*', (req, res) => {
  res.status(401).send('Unknown Router Default Handled');
});

export const router = routes;
