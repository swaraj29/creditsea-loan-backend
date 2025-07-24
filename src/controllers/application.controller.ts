import { Request, Response } from "express";
import Application from "../models/Application";
import { 
  ILoanApplicationInput, 
  ApplicationStatus, 
  UserRole,
  IDashboardStats 
} from "../types";
import { ResponseUtil } from "../utils/responseUtil";
import { ValidationUtil } from "../utils/validationUtil";

/**
 * Submit a new loan application with comprehensive validation
 */
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationInput: ILoanApplicationInput = req.body;

    // Validate input
    const validationErrors = ValidationUtil.validateLoanApplicationInput(applicationInput);
    if (validationErrors.length > 0) {
      ResponseUtil.validationError(res, validationErrors);
      return;
    }

    // Create application
    const application = await Application.create({
      name: ValidationUtil.sanitizeString(applicationInput.name),
      email: applicationInput.email.toLowerCase(),
      phone: ValidationUtil.sanitizeString(applicationInput.phone),
      amount: applicationInput.amount,
      purpose: ValidationUtil.sanitizeString(applicationInput.purpose),
      tenure: applicationInput.tenure,
      monthlyIncome: applicationInput.monthlyIncome,
      employmentType: ValidationUtil.sanitizeString(applicationInput.employmentType),
      panCard: applicationInput.panCard ? ValidationUtil.sanitizeString(applicationInput.panCard) : undefined,
      aadharCard: applicationInput.aadharCard ? ValidationUtil.sanitizeString(applicationInput.aadharCard) : undefined,
      submittedBy: req.ip || req.connection.remoteAddress || "unknown",
      status: ApplicationStatus.PENDING,
    });

    ResponseUtil.success(res, "Application submitted successfully", {
      id: application._id,
      status: application.status,
      submittedAt: application.createdAt,
    }, 201);
  } catch (error) {
    console.error("Application submission error:", error);
    ResponseUtil.error(res, "Failed to submit application", 500);
  }
};

/**
 * Get all applications with role-based filtering
 */
export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    let filter = {};
    
    // Role-based filtering for assignment requirements
    if (req.user?.role === UserRole.VERIFIER) {
      // Verifier sees pending applications to verify/reject
      filter = { status: ApplicationStatus.PENDING };
    }
    else if (req.user?.role === UserRole.ADMIN) {
      const { status } = req.query;
      if (status && status !== 'all') {
        filter = { status: status as ApplicationStatus };
      } else if (status === 'all') {
        filter = {}; // Show all applications
      } else {
        // Admin sees pending applications to approve/reject (as per assignment)
        filter = { status: ApplicationStatus.PENDING };
      }
    }

    const applications = await Application.find(filter)
      .populate("submittedBy", "name email")
      .populate("verifiedBy", "name email")
      .populate("adminActionBy", "name email")
      .sort({ createdAt: -1 });

    ResponseUtil.success(res, "Applications fetched successfully", applications);
  } catch (error) {
    console.error("Get applications error:", error);
    ResponseUtil.error(res, "Failed to fetch applications", 500);
  }
};

/**
 * Update application status (generic status update)
 */
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!application) {
      ResponseUtil.error(res, "Application not found", 404);
      return;
    }

    ResponseUtil.success(res, "Application status updated successfully", application);
  } catch (error) {
    console.error("Update status error:", error);
    ResponseUtil.error(res, "Failed to update application", 500);
  }
};

/**
 * Verify application (verifier only)
 */
export const verifyApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!req.user || req.user.role !== UserRole.VERIFIER) {
      ResponseUtil.error(res, "Only verifiers can verify applications", 403);
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      ResponseUtil.error(res, "Application not found", 404);
      return;
    }

    if (application.status !== ApplicationStatus.PENDING) {
      ResponseUtil.error(res, "Only pending applications can be verified", 400);
      return;
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      {
        status: ApplicationStatus.VERIFIED,
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      },
      { new: true }
    ).populate("verifiedBy", "name email");

    ResponseUtil.success(res, "Application verified successfully", updated);
  } catch (error) {
    console.error("Verify application error:", error);
    ResponseUtil.error(res, "Failed to verify application", 500);
  }
};

/**
 * Reject application (verifier only) 
 */
export const rejectApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    if (!req.user || req.user.role !== UserRole.VERIFIER) {
      ResponseUtil.error(res, "Only verifiers can reject applications", 403);
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      ResponseUtil.error(res, "Application not found", 404);
      return;
    }

    if (application.status !== ApplicationStatus.PENDING) {
      ResponseUtil.error(res, "Only pending applications can be rejected", 400);
      return;
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      {
        status: ApplicationStatus.REJECTED,
        rejectionReason: rejectionReason || "Application rejected by verifier",
        verifiedBy: req.user.id,
        verifiedAt: new Date(),
      },
      { new: true }
    ).populate("verifiedBy", "name email");

    ResponseUtil.success(res, "Application rejected successfully", updated);
  } catch (error) {
    console.error("Reject application error:", error);
    ResponseUtil.error(res, "Failed to reject application", 500);
  }
};

// ADMIN ACTIONS: Approve application
export const approveApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ msg: "Only admins can approve applications" });
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json({ msg: "Application not found" });
      return;
    }

    if (application.status !== "pending") {
      res.status(400).json({ msg: "Only pending applications can be approved" });
      return;
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      {
        status: "approved",
        adminActionBy: req.user.id,
        adminActionAt: new Date()
      },
      { new: true }
    ).populate("adminActionBy", "name email");

    res.json({
      success: true,
      message: "Application approved successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to approve application", error: err });
  }
};

// ADMIN ACTIONS: Final reject application
export const adminRejectApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ msg: "Only admins can reject verified applications" });
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json({ msg: "Application not found" });
      return;
    }

    if (application.status !== "pending") {
      res.status(400).json({ msg: "Only pending applications can be rejected by admin" });
      return;
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        adminActionBy: req.user.id,
        adminActionAt: new Date(),
        rejectionReason
      },
      { new: true }
    ).populate("adminActionBy", "name email");

    res.json({
      success: true,
      message: "Application rejected by admin",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to reject application", error: err });
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (_: Request, res: Response): Promise<void> => {
  try {
    // Get all applications count by status
    const stats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    // Get total applications
    const totalApplications = await Application.countDocuments();
    
    // Get total loan amount
    const totalAmountResult = await Application.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Get approved loan amount
    const approvedAmountResult = await Application.aggregate([
      { $match: { status: ApplicationStatus.APPROVED } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Format stats with proper typing
    const dashboardStats: IDashboardStats = {
      totalApplications,
      pendingApplications: stats.find(s => s._id === ApplicationStatus.PENDING)?.count || 0,
      verifiedApplications: stats.find(s => s._id === ApplicationStatus.VERIFIED)?.count || 0,
      approvedApplications: stats.find(s => s._id === ApplicationStatus.APPROVED)?.count || 0,
      rejectedApplications: stats.find(s => s._id === ApplicationStatus.REJECTED)?.count || 0,
      totalLoanAmount: totalAmountResult[0]?.total || 0,
      approvedLoanAmount: approvedAmountResult[0]?.total || 0,
      averageLoanAmount: totalApplications > 0 ? (totalAmountResult[0]?.total || 0) / totalApplications : 0
    };

    ResponseUtil.success(res, "Dashboard statistics fetched successfully", dashboardStats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    ResponseUtil.error(res, "Failed to fetch dashboard statistics", 500);
  }
};