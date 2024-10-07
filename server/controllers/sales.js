import OverallStat from '../models/OverallStat.js'; // Correct import path and extension

export const getSales = async (req, res) => {
    try {
        // Use `OverallStat` as the model name and rename the variable to `overallStats`
        const overallStats = await OverallStat.find();
        
        // Return the first result or handle empty result case
        res.status(200).json(overallStats[0] || {});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export default getSales;
