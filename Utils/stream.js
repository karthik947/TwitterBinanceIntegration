const { client } = require('../Utils/twitter');
const E = require('events');

const data = require('../Data/data');

let stream = {
  eventEmiter: new E(),
  async start() {
    try {
      const { items } = await data.get();
      const fitems = items.filter((d) => d.status === 'OPEN');
      if (!fitems.length) return;
      const follow = fitems.map((d) => d.id_str).join(',');
      stream.ws = client
        .stream('statuses/filter', { follow })
        .on('start', stream.startFn)
        .on('data', stream.processEvent)
        .on('error', stream.closeStream)
        .on('end', stream.closeStream);
    } catch (err) {
      console.error(err);
    }
  },
  startFn() {
    console.log('Twitter Stream started successfully!');
  },
  closeStream() {
    console.log(`Twitter stream ended!`);
    process.exit();
  },
  processEvent(tweet) {
    const { retweeted_status } = tweet;
    const tweettype =
      typeof retweeted_status === 'object' ? 'RETWEET' : 'TWEET';
    //Ignore retweets
    if (tweettype === 'RETWEET') return;
    //Ignore replies
    const {
      in_reply_to_screen_name,
      in_reply_to_status_id,
      in_reply_to_status_id_str,
      in_reply_to_user_id,
      in_reply_to_user_id_str,
    } = tweet;
    const isReply = Boolean(
      [
        in_reply_to_screen_name,
        in_reply_to_status_id,
        in_reply_to_status_id_str,
        in_reply_to_user_id,
        in_reply_to_user_id_str,
      ].filter((d) => d).length
    );
    if (isReply) return;
    const { extended_tweet, text } = tweet;
    const { screen_name: tuname } = tweet.user;
    const tweetText = extended_tweet ? extended_tweet?.full_text : text;
    stream.eventEmiter.emit('TWEET', { tuname, tweetText });
  },
};

module.exports = stream;
