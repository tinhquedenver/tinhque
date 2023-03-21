import tryCatch from './utils/tryCatch.js';
import Fund from '../models/Fund.js';

export const getFunds = tryCatch(async (req, res) => {
    const funds = await Fund.find().sort({ _id: -1 });
    res.status(200).json({ success: true, result: funds });
  });

  export const createFund= tryCatch(async (req, res) => {
    const { id: uid, name: uName, photoURL: uPhoto } = req.user;
    const newFund = new Fund({ ...req.body, uid, uName, uPhoto });
    await newFund.save();
    res.status(201).json({ success: true, result: newFund });
  });

  export const updateFund = tryCatch(async (req, res) => {
    const updatedFund = await Fund.findByIdAndUpdate(
      req.params.fundId,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, result: updatedFund });
  });

  export const deleteFund = tryCatch(async (req, res) => {
    const { _id } = await Fund.findByIdAndDelete(req.params.fundId);
    res.status(200).json({ success: true, result: { _id } });
  });