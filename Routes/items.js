const express = require('express');
const router = express.Router();
const path = require('path');
const data = require('../Data/data');
const { getuserdata } = require('../Utils/twitter');
const restart = require('../Utils/restart');

const saveItem = async (req, res) => {
  try {
    if (!req.body?.id_str) {
      //new row
      const id_str = await getuserdata(req.body);
      const rec = { ...req.body, id_str };
      await data.set(rec);
      restart.update();
      return res.status(200).json(rec);
    } else {
      //old row
      await data.set(req.body);
      return res.status(200).send('success');
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

const getItems = async (_, res) => {
  try {
    const { items } = await data.get();
    return res.status(200).json(items);
  } catch (err) {
    res.status(400).send(err);
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await data.delete({ id });
    restart.update();
    return res.status(200).send('success');
  } catch (err) {
    res.status(400).send(err);
  }
};

router.post('/', saveItem);
router.delete('/:id', deleteItem);
router.get('/', getItems);

module.exports = router;
