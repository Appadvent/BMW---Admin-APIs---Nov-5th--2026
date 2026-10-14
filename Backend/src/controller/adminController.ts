import { Request, Response } from "express";
import { AdminDAO } from "../dao/admin.dao";
import { RESPONSE_MESSAGES } from "../constants/response";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { replyEmail } from "../utils/mailSender";

const adminController = {
  loginUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find admin by email
      const user = await AdminDAO.findAdminByEmail(email);
      if (!user) {
        res.status(400).json(RESPONSE_MESSAGES.ERROR.USER_NOT_FOUND);
        return;
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json(RESPONSE_MESSAGES.ERROR.INCORRECT_PASSWORD);
        return;
      }

      // Generate JWT token
      const token = generateToken(user);

      res.status(200).json({
        message: "User logged in successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  getDashboardStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, range } = req.query;

      const data = await AdminDAO.getDashboardStats({
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        range: range as string | undefined,
      });

      res.status(200).json(RESPONSE_MESSAGES.SUCCESS.GET_STATS(data));
    } catch (error: any) {
      console.error("Get Dashboard Stats Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  sendEmail: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, subject, content } = req.body;
      await replyEmail(email, subject, content);
      res.status(200).json(RESPONSE_MESSAGES.SUCCESS.EMAIL_SENT);
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to send email",
      });
    }
  },
};

export default adminController;
