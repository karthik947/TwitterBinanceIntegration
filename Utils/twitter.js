const Twitter = require('twitter-lite');

const { consumer_key, consumer_secret, access_token_key, access_token_secret } =
  process.env;

const client = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
});

const getuserdata = async ({ tuname }) => {
  try {
    const resp = await client.get('users/lookup', { screen_name: tuname });
    if (!resp[0]?.id_str) throw 'Invalid Twitter Handler Name!';
    return resp[0]?.id_str;
  } catch (err) {
    throw JSON.stringify(err);
  }
};

module.exports = { getuserdata, client };
