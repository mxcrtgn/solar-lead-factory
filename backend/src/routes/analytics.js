const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET dashboard stats
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Total leads count
    const totalLeads = await prisma.lead.count();

    // Leads by status
    const leadsByStatus = await prisma.lead.groupBy({
      by: ['status'],
      _count: true
    });

    // Leads this month
    const leadsThisMonth = await prisma.lead.count({
      where: { createdAt: { gte: startOfMonth } }
    });

    // Leads validated (VALIDATED status)
    const leadsValidated = await prisma.lead.count({
      where: { status: 'VALIDATED' }
    });

    // Average quality score
    const avgScore = await prisma.lead.aggregate({
      _avg: { qualityScore: true },
      where: { qualityScore: { not: null } }
    });

    // Average completeness
    const avgCompleteness = await prisma.lead.aggregate({
      _avg: { completeness: true }
    });

    // Total estimated MWc
    const totalMWc = await prisma.lead.aggregate({
      _sum: { estimatedMWc: true },
      where: { estimatedMWc: { not: null } }
    });

    // Total estimated TRI
    const avgTRI = await prisma.lead.aggregate({
      _avg: { estimatedTRI: true },
      where: { estimatedTRI: { not: null } }
    });

    // AI-assisted tasks completed
    const aiAssistedCompleted = await prisma.checklistItem.count({
      where: {
        completed: true,
        aiAssisted: true
      }
    });

    // Manual tasks completed
    const manualCompleted = await prisma.checklistItem.count({
      where: {
        completed: true,
        aiAssisted: false
      }
    });

    // Total checklist items
    const totalChecklistItems = await prisma.checklistItem.count();

    // Completion rate by stage
    const completionByStageRaw = await prisma.$queryRaw`
      SELECT
        stage,
        COUNT(*) as total,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
      FROM ChecklistItem
      GROUP BY stage
    `;

    // Convert BigInt to Number
    const completionByStage = completionByStageRaw.map(stage => ({
      stage: stage.stage,
      total: Number(stage.total),
      completed: Number(stage.completed)
    }));

    // Leads by region
    const leadsByRegion = await prisma.lead.groupBy({
      by: ['region'],
      _count: true,
      _sum: { estimatedMWc: true },
      orderBy: { _count: { region: 'desc' } }
    });

    // Recent activity (last 10)
    const recentActivity = await prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true }
        },
        lead: {
          select: { internalName: true }
        }
      }
    });

    // Top performers (by leads assigned)
    const topPerformers = await prisma.lead.groupBy({
      by: ['assignedToId'],
      where: {
        assignedToId: { not: null }
      },
      _count: true,
      orderBy: { _count: { assignedToId: 'desc' } },
      take: 5
    });

    // Get user details for top performers
    const topPerformersWithNames = await Promise.all(
      topPerformers.map(async (p) => {
        const user = await prisma.user.findUnique({
          where: { id: p.assignedToId },
          select: { firstName: true, lastName: true, email: true }
        });
        return {
          user: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          email: user?.email,
          count: p._count
        };
      })
    );

    // AI efficiency metrics
    const aiEfficiency = aiAssistedCompleted + manualCompleted > 0
      ? Math.round((aiAssistedCompleted / (aiAssistedCompleted + manualCompleted)) * 100)
      : 0;

    // Revenue metrics - current month
    const currentDate = new Date();
    const currentMonthGoal = await prisma.revenueGoal.findUnique({
      where: {
        year_month: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1
        }
      }
    });

    // Total revenue from sold leads
    const soldLeads = await prisma.lead.findMany({
      where: {
        salePrice: { not: null },
        soldAt: { not: null }
      },
      select: {
        salePrice: true,
        soldAt: true,
        soldTo: true
      }
    });

    const totalRevenue = soldLeads.reduce((sum, lead) => sum + (lead.salePrice || 0), 0);
    const soldLeadsCount = soldLeads.length;

    // Revenue last 6 months
    const revenueGoals = await prisma.revenueGoal.findMany({
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
      take: 6
    });

    res.json({
      // Main metrics
      totalLeads,
      leadsThisMonth,
      leadsValidated,
      avgScore: avgScore._avg.qualityScore || 0,
      avgCompleteness: avgCompleteness._avg.completeness || 0,
      totalMWc: totalMWc._sum.estimatedMWc || 0,
      avgTRI: avgTRI._avg.estimatedTRI || 0,

      // Revenue metrics
      totalRevenue,
      soldLeadsCount,
      currentMonthGoal: currentMonthGoal || null,
      revenueGoals: revenueGoals.reverse(), // Oldest to newest

      // Pipeline metrics
      leadsByStatus,
      completionByStage,

      // AI metrics
      aiAssistedCompleted,
      manualCompleted,
      totalChecklistItems,
      aiEfficiency,

      // Regional data
      leadsByRegion,

      // Activity
      recentActivity,
      topPerformers: topPerformersWithNames
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET lead production timeline
router.get('/timeline', authenticate, async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const leads = await prisma.lead.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: 'asc' }
    });

    // Group by day
    const timeline = {};
    leads.forEach(lead => {
      const date = lead.createdAt.toISOString().split('T')[0];
      if (!timeline[date]) {
        timeline[date] = { date, created: 0, delivered: 0 };
      }
      timeline[date].created += 1;
      if (lead.status === 'DELIVERED') {
        timeline[date].delivered += 1;
      }
    });

    res.json(Object.values(timeline));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
