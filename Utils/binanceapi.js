const api = require('binance');

const binanceapi = async ({ symbol, side, qty: quantity, otype: type }) => {
  try {
    const bRest = new api.BinanceRest({
      key: process.env.binanceapikey,
      secret: process.env.binanceseckey,
      timeout: 15000,
      recvWindow: 20000,
      disableBeautification: false,
      handleDrift: true,
    });
    await bRest.newOrder({
      quantity,
      side,
      symbol,
      type,
      newOrderRespType: 'FULL',
    });
    return {
      status: 'success',
      message: `new ${side} order placed for ${symbol}`,
      ts: Date.now(),
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'error',
      message: JSON.stringify(err),
      ts: Date.now(),
    };
  }
};

module.exports = binanceapi;
