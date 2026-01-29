const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new customer
router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    tell: req.body.tell,
    pass_no: req.body.pass_no,
    sex: req.body.sex
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
