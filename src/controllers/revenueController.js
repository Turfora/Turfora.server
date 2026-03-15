const revenueService = require('../services/implementations/revenueService.impl');

/**
 * GET /api/revenue
 * Get revenue statistics for owner
 */
const getRevenue = async (req, res, next) => {
  try {
    console.log('[RevenueController] Getting revenue stats');
    const ownerId = req.user.id;

    const stats = await revenueService.getRevenueStats(ownerId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/revenue/turf/:turfId
 * Get revenue for specific turf
 */
const getTurfRevenue = async (req, res, next) => {
  try {
    console.log('[RevenueController] Getting turf revenue');
    const ownerId = req.user.id;
    const { turfId } = req.params;

    const revenue = await revenueService.getRevenueByTurf(ownerId, turfId);

    return res.status(200).json({
      success: true,
      data: { turfId, revenue },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/revenue/date-range
 * Get revenue for date range
 */
const getRevenueByDateRange = async (req, res, next) => {
  try {
    console.log('[RevenueController] Getting revenue by date range');
    const ownerId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const err = new Error('Missing required query parameters: startDate, endDate');
      err.statusCode = 400;
      throw err;
    }

    const stats = await revenueService.getRevenueByDateRange(ownerId, startDate, endDate);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/revenue/monthly/:month/:year
 * Get revenue for specific month
 */
const getMonthlyRevenue = async (req, res, next) => {
  try {
    console.log('[RevenueController] Getting monthly revenue');
    const ownerId = req.user.id;
    const { month, year } = req.params;

    if (!month || !year) {
      const err = new Error('Missing required parameters: month, year');
      err.statusCode = 400;
      throw err;
    }

    const revenue = await revenueService.calculateMonthlyRevenue(
      ownerId,
      parseInt(month),
      parseInt(year)
    );

    return res.status(200).json({
      success: true,
      data: {
        month: parseInt(month),
        year: parseInt(year),
        revenue,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRevenue,
  getTurfRevenue,
  getRevenueByDateRange,
  getMonthlyRevenue,
};