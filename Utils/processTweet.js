const stream = require('../Utils/stream');

const data = require('../Data/data');
const binanceapi = require('../Utils/binanceapi');

const processTweet = async ({ tuname, tweetText }) => {
  try {
    let { items } = await data.get();

    const itemsPromises = items.map(async (d) => {
      if (d.status !== 'OPEN') return d;
      if (d.tuname !== tuname) return d;
      //Check if keyword matches
      const { keywords } = d;
      const kwstring =
        keywords.slice(-1) === ';' ? keywords.slice(0, -1) : keywords;
      const kwMatch = Boolean(
        kwstring
          .split(';')
          .map(
            (pkw) =>
              !Boolean(
                pkw
                  .split(',')
                  .map((skw) => tweetText.includes(skw))
                  .filter((d) => !d).length
              )
          )
          .filter((d) => d).length
      );
      if (!kwMatch) return d;
      //Place order if matched
      const tlog = {
        status: 'success',
        message: `Tweet with matching keyword received: ${tweetText}`,
        ts: Date.now(),
      };
      const { symbol, side, qty, otype } = d;
      const olog = await binanceapi({
        symbol,
        side,
        qty,
        otype,
      });
      d.logs = [tlog, olog];
      d.status = 'CLOSE';
      return d;
    });

    newItems = await Promise.all(itemsPromises);
    console.log(newItems);
    //save new items
    return await data.saveAll(newItems);
  } catch (err) {
    console.error(err);
  }
};

module.exports = processTweet;
