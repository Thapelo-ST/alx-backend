import kue from "kue";
import redis from "redis";

const client = redis.createClient();
const queue = kue.createQueue();

client.on("error", function (err) {
  console.log(`Redis client not connected to server: ${err}`);
});

let queueData = {
  phoneNumber: "222648480",
  message: "This is the code to verify your account",
};

const job = queue.create("push_notification_code", queueData).save(function(err) {
  if (!err){
    console.log(`Notification job created: ${job.id}`);
  } else {
    console.log(`Error creating notification job: ${err}`);
  }
});

job.on('complete', function(){
  console.log('Notification job completed');
});

job.on('failed', function(){
  console.log('Notification job failed');
});