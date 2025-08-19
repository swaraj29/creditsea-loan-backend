import express from "express";
import {
  submitApplication,
  getApplications,
  updateStatus,
  verifyApplication,
  rejectApplication,
  approveApplication,
  adminRejectApplication,
  getDashboardStats
} from "../controllers/application.controller";
import { protect, requireAdmin, requireVerifier } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Loan application endpoints
 */

/**
 * @swagger
 * /applications/submit:
 *   post:
 *     summary: Submit a new loan application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanApplication'
 *     responses:
 *       201:
 *         description: Loan application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/submit", submitApplication);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications (protected)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/", protect, getApplications);

/**
 * @swagger
 * /applications/stats:
 *   get:
 *     summary: Get dashboard stats (protected)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/stats", protect, getDashboardStats);

/**
 * @swagger
 * /applications/{id}/verify:
 *   patch:
 *     summary: Verify an application (verifier only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch("/:id/verify", protect, requireVerifier, verifyApplication);

/**
 * @swagger
 * /applications/{id}/reject:
 *   patch:
 *     summary: Reject an application (verifier only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch("/:id/reject", protect, requireVerifier, rejectApplication);

/**
 * @swagger
 * /applications/{id}/approve:
 *   patch:
 *     summary: Approve an application (admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch("/:id/approve", protect, requireAdmin, approveApplication);

/**
 * @swagger
 * /applications/{id}/admin-reject:
 *   patch:
 *     summary: Admin reject application (admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application rejected by admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch("/:id/admin-reject", protect, requireAdmin, adminRejectApplication);

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Generic status update for application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, verified, rejected, approved]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch("/:id", protect, updateStatus);

export default router;
