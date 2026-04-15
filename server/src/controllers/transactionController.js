const transactionService = require("../services/transactionService");

async function createTransaction(req, res, next) {
  try {
    const data = await transactionService.createTransaction({
      ...req.body,
      fromUserId: req.user.id,
    });
    return res.status(201).json({ success: true, data });
  } catch (error) {
    if (error.message.includes("not found")) {
       return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message.includes("Must be one of")) {
       return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
}

async function getTransactionsByVehicle(req, res, next) {
  try {
    const data = await transactionService.getTransactionsByVehicleCode(req.params.vehicleId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getMyTransactions(req, res, next) {
  try {
    const data = await transactionService.getMyTransactionsList(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function updateTransactionStatus(req, res, next) {
  try {
    const data = await transactionService.updateTransactionStatusRecord(req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.message === "Transaction not found.") {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message.includes("Must be one of")) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
}

module.exports = {
  createTransaction,
  getTransactionsByVehicle,
  getMyTransactions,
  updateTransactionStatus,
};
