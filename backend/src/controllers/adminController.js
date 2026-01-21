const User = require("../models/user");
const Opportunity = require("../models/Opportunity");
const AdminLog = require("../models/AdminLog");

// ================= OVERVIEW =================
exports.getOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeNGOs = await User.countDocuments({ role: "ngo" });
    const activeVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalOpportunities = await Opportunity.countDocuments();

    // Fetch real recent activity from AdminLog
    const recentActivity = await AdminLog.find()
      .populate("admin_id", "name")
      .sort({ timestamp: -1 })
      .limit(5);

    // Format recent activity
    const formattedActivity = recentActivity.map(log => ({
      id: log._id,
      type: log.action,
      details: log.metadata,
      adminName: log.admin_id?.name || "System",
      timestamp: log.timestamp,
    }));

    // Get user growth data by month from database
    const userGrowthData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let userGrowth = [];
    let cumulativeUsers = 0;

    userGrowthData.forEach(data => {
      cumulativeUsers += data.count;
      userGrowth.push({
        month: monthNames[data._id.month - 1],
        users: cumulativeUsers,
      });
    });

    // If no growth data, return current total
    if (userGrowth.length === 0) {
      userGrowth = [{ month: "Today", users: totalUsers }];
    }

    res.json({
      totalUsers,
      activeNGOs,
      activeVolunteers,
      totalOpportunities,
      recentActivity: formattedActivity,
      userGrowth,
    });
  } catch (err) {
    next(err);
  }
};

// ================= USERS =================
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 100 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    // Handle status filter for suspended/active
    if (status) {
      if (status === "suspended") {
        filter.isSuspended = true;
      } else if (status === "active") {
        filter.isSuspended = false;
      }
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.isSuspended ? "suspended" : "active",
        location: u.location,
        createdAt: u.createdAt,
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot modify own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle suspend/activate status
    const { status } = req.body;
    if (status === "suspended") {
      user.isSuspended = true;
    } else if (status === "active") {
      user.isSuspended = false;
    }

    await user.save();

    await AdminLog.create({
      action: "UPDATE_USER_STATUS",
      admin_id: req.user._id,
      target_id: user._id,
      metadata: { 
        previousStatus: !user.isSuspended ? "suspended" : "active",
        newStatus: user.isSuspended ? "suspended" : "active",
        userId: user._id,
      },
    });

    res.json({ 
      message: "User status updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.isSuspended ? "suspended" : "active",
      }
    });
  } catch (err) {
    next(err);
  }
};

// ================= OPPORTUNITIES =================
exports.getAllOpportunitiesAdmin = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 100 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const opportunities = await Opportunity.find(filter)
      .populate("ngo_id", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Opportunity.countDocuments(filter);

    res.json({
      opportunities: opportunities.map(o => ({
        id: o._id,
        title: o.title,
        description: o.description,
        status: o.status || "active",
        location: o.location,
        ngoName: o.ngo_id?.name || "Unknown",
        ngoEmail: o.ngo_id?.email,
        createdAt: o.createdAt,
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteOpportunityAdmin = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: "Not found" });

    await opp.deleteOne();

    await AdminLog.create({
      action: "DELETE_OPPORTUNITY",
      admin_id: req.user._id,
      target_id: opp._id,
    });

    res.json({ message: "Opportunity removed" });
  } catch (err) {
    next(err);
  }
};

// ================= REPORTS =================
exports.getReports = async (req, res, next) => {
  try {
    const { period = "30d" } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    if (period !== "all") {
      const days = parseInt(period);
      startDate.setDate(endDate.getDate() - days);
    } else {
      startDate.setFullYear(2000);
    }

    // Get summary data from database
    const totalUsers = await User.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalOpportunities = await Opportunity.countDocuments();

    // Get user growth data by month
    const userGrowthData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: period === "all" ? 1000 : (period === "365d" ? 12 : Math.ceil(parseInt(period) / 30)) },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let userGrowth = [];
    let cumulativeUsers = 0;

    userGrowthData.forEach(data => {
      cumulativeUsers += data.count;
      userGrowth.push({
        date: `${monthNames[data._id.month - 1]} ${data._id.year}`,
        users: cumulativeUsers,
      });
    });

    // If no data, create default
    if (userGrowth.length === 0) {
      userGrowth = [{ date: "Today", users: totalUsers }];
    }

    // Get opportunity trends by creation date
    const opportunityTrendsData = await Opportunity.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      { $limit: 12 },
    ]);

    let opportunityTrends = opportunityTrendsData.map((data, index) => ({
      date: `Week ${data._id.week}`,
      opportunities: data.count,
    }));

    if (opportunityTrends.length === 0) {
      opportunityTrends = [{ date: "Today", opportunities: totalOpportunities }];
    }

    // Get volunteer participation by opportunity with participant counts
    const opportunityParticipationData = await Opportunity.aggregate([
      {
        $project: {
          title: 1,
          participantCount: { $size: "$participants" },
          status: 1,
        },
      },
      { $sort: { participantCount: -1 } },
      { $limit: 8 },
    ]);

    let volunteerParticipation = opportunityParticipationData.map(data => ({
      name: data.title.substring(0, 30),
      participants: data.participantCount,
      fullTitle: data.title,
    }));

    if (volunteerParticipation.length === 0) {
      volunteerParticipation = [{ name: "No Opportunities", participants: 0, fullTitle: "No opportunities yet" }];
    }

    res.json({
      summary: {
        totalUsers,
        totalOpportunities,
        totalVolunteers,
      },
      userGrowth,
      opportunityTrends,
      volunteerParticipation,
    });
  } catch (err) {
    next(err);
  }
};

// ================= DOWNLOAD REPORTS =================
exports.downloadReport = async (req, res, next) => {
  try {
    const { format = "csv", period = "30d" } = req.query;

    // Get the same data as reports
    const totalUsers = await User.countDocuments();
    const activeNGOs = await User.countDocuments({ role: "ngo" });
    const activeVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalOpportunities = await Opportunity.countDocuments();

    const userGrowthData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let userGrowth = [];
    let cumulativeUsers = 0;

    userGrowthData.forEach(data => {
      cumulativeUsers += data.count;
      userGrowth.push({
        month: monthNames[data._id.month - 1],
        users: cumulativeUsers,
      });
    });

    if (format === "csv") {
      // Generate CSV
      let csv = "WasteZero Admin Report\n";
      csv += `Generated: ${new Date().toLocaleDateString('de-DE')}\n\n`;
      csv += "SUMMARY\n";
      csv += `Total Users,${totalUsers}\n`;
      csv += `Active NGOs,${activeNGOs}\n`;
      csv += `Active Volunteers,${activeVolunteers}\n`;
      csv += `Total Opportunities,${totalOpportunities}\n\n`;
      csv += "USER GROWTH\n";
      csv += "Month,Users\n";
      userGrowth.forEach(row => {
        csv += `${row.month},${row.users}\n`;
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="reports-${period}.csv"`);
      res.send(csv);
    } else if (format === "pdf") {
      // Generate HTML that can be printed as PDF
      const currentDate = new Date().toLocaleDateString('de-DE');
      const userGrowthRows = userGrowth.map(row => 
        `<tr><td style="padding: 10px; border: 1px solid #ddd;">${row.month}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${row.users}</td></tr>`
      ).join('');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>WasteZero Admin Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #10b981;
              padding-bottom: 20px;
            }
            h1 {
              margin: 0;
              color: #1f2937;
            }
            .meta-info {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 10px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              color: #1f2937;
              border-bottom: 2px solid #10b981;
              padding-bottom: 10px;
              margin-bottom: 15px;
              font-size: 18px;
            }
            .metrics {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .metric-box {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #10b981;
            }
            .metric-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th {
              background: #10b981;
              color: white;
              padding: 10px;
              text-align: left;
            }
            td {
              padding: 10px;
              border: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background: #f9fafb;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #9ca3af;
              font-size: 11px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>WasteZero Admin Report</h1>
            <div class="meta-info">
              <p>Generated: ${currentDate} | Period: ${period}</p>
            </div>
          </div>

          <div class="section">
            <h2>Summary Metrics</h2>
            <div class="metrics">
              <div class="metric-box">
                <div class="metric-label">Total Users</div>
                <div class="metric-value">${totalUsers.toLocaleString()}</div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Active NGOs</div>
                <div class="metric-value">${activeNGOs.toLocaleString()}</div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Active Volunteers</div>
                <div class="metric-value">${activeVolunteers.toLocaleString()}</div>
              </div>
              <div class="metric-box">
                <div class="metric-label">Total Opportunities</div>
                <div class="metric-value">${totalOpportunities.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>User Growth Trend</h2>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th style="text-align: right;">Cumulative Users</th>
                </tr>
              </thead>
              <tbody>
                ${userGrowthRows}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>This report was automatically generated by WasteZero Admin Panel</p>
          </div>
        </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", `inline; filename="reports-${period}.html"`);
      res.send(html);
    } else {
      res.status(400).json({ message: "Invalid format. Use 'csv' or 'pdf'" });
    }
  } catch (err) {
    next(err);
  }
};

// ================= LOGS =================
exports.getAdminLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = {};

    const skip = (page - 1) * limit;
    const logs = await AdminLog.find(filter)
      .populate("admin_id", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await AdminLog.countDocuments(filter);

    // Fetch target details for each log
    const logsWithTargets = await Promise.all(
      logs.map(async (log) => {
        let targetName = "Unknown";
        let targetType = "unknown";

        if (log.target_id) {
          // Try to find in User model first
          const user = await User.findById(log.target_id).select("name email");
          if (user) {
            targetName = user.name || user.email || "Unknown";
            targetType = "user";
          } else {
            // Try to find in Opportunity model
            const opp = await Opportunity.findById(log.target_id).select("title");
            if (opp) {
              targetName = opp.title || "Unknown";
              targetType = "opportunity";
            }
          }
        } else if (log.metadata?.name) {
          targetName = log.metadata.name;
        }

        return {
          id: log._id,
          action: log.action,
          adminName: log.admin_id?.name || "System",
          adminEmail: log.admin_id?.email,
          targetId: log.target_id,
          targetName: targetName,
          targetType: targetType,
          timestamp: log.timestamp || log.createdAt,
          metadata: log.metadata,
        };
      })
    );

    res.json({
      logs: logsWithTargets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      pageSize: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
};
