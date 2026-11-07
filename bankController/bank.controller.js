const { BankModel, Transictions } = require('../model/bank.model');

// Customers may go this far below zero (overdraft limit).
const CREDIT_LIMIT = 1000;

// Turns "", undefined or null into 0, otherwise a number (NaN if not numeric).
const toAmount = (value) => (value === '' || value === undefined || value === null ? 0 : Number(value));

const isValidAmount = (n) => Number.isFinite(n) && n >= 0;

//! ===================== get all customers =================
const getAllCostumers = async (req, res) => {
    try {
        const customers = await BankModel.find({});
        return res.status(200).json(customers);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'could not load customers' });
    }
};

//! ===================== get all transactions =================
const allTransictions = async (req, res) => {
    try {
        const transactions = await Transictions.find({}).sort({ _id: -1 });
        return res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'could not load transactions' });
    }
};

//! ======================= get one customer ================
const getOneUserData = async (req, res) => {
    const accountNumber = Number(req.params.accountNumber);
    if (!Number.isInteger(accountNumber)) {
        return res.status(400).json({ error: 'account number must be a number' });
    }
    try {
        const customer = await BankModel.findOne({ accountNumber });
        if (!customer) {
            return res.status(404).json({ error: 'user does not exist' });
        }
        return res.status(200).json(customer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'could not load user' });
    }
};

//! ===================== add customer ==========
const addCostumers = async (req, res) => {
    const { costumerName, email, firstDeposit, accountNumber, id } = req.body;
    const deposit = toAmount(firstDeposit);

    if (!costumerName || !email || !id || !/^\d{6}$/.test(String(accountNumber))) {
        return res.status(400).json({ error: 'name, email, id and a 6-digit account number are required' });
    }
    if (!isValidAmount(deposit)) {
        return res.status(400).json({ error: 'first deposit must be a positive number' });
    }

    try {
        await BankModel.create({
            costumerName,
            email,
            firstDeposit: deposit,
            accountNumber: Number(accountNumber),
            joinedIn: new Date().toISOString(),
            id,
        });
        return res.status(201).json({ message: 'customer added' });
    } catch (err) {
        // 11000 = MongoDB duplicate key (account number already used)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'account number already exists' });
        }
        console.error(err);
        return res.status(400).json({ error: 'invalid customer data' });
    }
};

//! ========================= deposit / withdraw / transfer =================
const trackTransiction = async (req, res) => {
    const fromWho = Number(req.body.fromWho);
    const inMoney = toAmount(req.body.deposit);
    const outMoney = toAmount(req.body.withdraw);
    const transferMoney = toAmount(req.body.transfer);
    const toWho = transferMoney > 0 ? Number(req.body.toWho) : null;

    // Negative amounts would let a user pull money out of someone else's account.
    if (![inMoney, outMoney, transferMoney].every(isValidAmount)) {
        return res.status(400).json({ error: 'amounts must be positive numbers' });
    }
    if (inMoney + outMoney + transferMoney === 0) {
        return res.status(400).json({ error: 'nothing to do' });
    }
    if (transferMoney > 0 && (!Number.isInteger(toWho) || toWho === fromWho)) {
        return res.status(400).json({ error: 'a valid, different target account is required' });
    }

    try {
        if (toWho !== null && !(await BankModel.exists({ accountNumber: toWho }))) {
            return res.status(404).json({ error: 'target account does not exist' });
        }

        const netChange = inMoney - outMoney - transferMoney;
        // Atomic: only update if the balance after the change stays above the credit limit.
        // This prevents two parallel requests from both spending the same money.
        const updatedSender = await BankModel.findOneAndUpdate(
            { accountNumber: fromWho, firstDeposit: { $gte: -CREDIT_LIMIT - netChange } },
            { $inc: { firstDeposit: netChange } },
            { new: true }
        );

        if (!updatedSender) {
            const exists = await BankModel.exists({ accountNumber: fromWho });
            return exists
                ? res.status(400).json({ error: 'not enough money' })
                : res.status(404).json({ error: 'user does not exist' });
        }

        if (toWho !== null) {
            const updatedReceiver = await BankModel.findOneAndUpdate(
                { accountNumber: toWho },
                { $inc: { firstDeposit: transferMoney } },
                { new: true }
            );
            if (!updatedReceiver) {
                // Receiver vanished in between: give the sender their money back.
                await BankModel.updateOne({ accountNumber: fromWho }, { $inc: { firstDeposit: transferMoney } });
                return res.status(404).json({ error: 'target account does not exist' });
            }
            await Transictions.create({
                fromWho,
                transfer: transferMoney,
                toWho,
                transictionTime: new Date().toISOString(),
            });
        }

        return res.status(200).json(updatedSender);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'transaction failed' });
    }
};

module.exports = {
    getAllCostumers,
    addCostumers,
    allTransictions,
    getOneUserData,
    trackTransiction,
};
