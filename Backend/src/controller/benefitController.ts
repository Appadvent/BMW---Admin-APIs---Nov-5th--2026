import { Request, Response } from "express";
import { BenefitDao } from "../dao/benefit.dao";

export const BenefitController = {
  // CREATE BENEFIT
//   createBenefit: async (req: Request, res: Response) => {
//     try {
//       const { heading, description, items } = req.body;
//       const parsedItems = JSON.parse(items || "[]");

//       const newBenefit = await BenefitDao.createBenefit({
//         heading,
//         description,
//         items: parsedItems,
//       });

//       res.status(201).json({ success: true, data: newBenefit });
//     } catch (error) {
//       console.error("Create Benefit Error:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   },

createBenefit: async (req: Request, res: Response) => {
  try {
    const { heading, description, items } = req.body;

    const parsedItems = Array.isArray(items) ? items : [];

    const newBenefit = await BenefitDao.createBenefit({
      heading,
      description,
      items: parsedItems,
    });

    res.status(201).json({ success: true, data: newBenefit });

  } catch (error) {
    console.error("Create Benefit Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},


  // GET ALL BENEFITS
  getAllBenefits: async (req: Request, res: Response) => {
    try {
      const benefits = await BenefitDao.getAllBenefits();
      res.status(200).json({ success: true, data: benefits });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // GET BENEFIT BY ID
  getBenefitById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const benefit = await BenefitDao.getBenefitById(id);
      if (!benefit) {res.status(404).json({ success: false, message: "Benefit not found" });
     return
    }

      res.status(200).json({ success: true, data: benefit });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // UPDATE BENEFIT
//   updateBenefit: async (req: Request, res: Response) => {
//     try {
//       const id = Number(req.params.id);
//       const { heading, description, items } = req.body;
//       const parsedItems = JSON.parse(items || "[]");

//       const existing = await BenefitDao.getBenefitById(id);
//       if (!existing) {res.status(404).json({ success: false, message: "Benefit not found" }); 
//       return
//     }

//       const updatedBenefit = await BenefitDao.updateBenefit(id, heading, description, parsedItems);
//       res.status(200).json({ success: true, data: updatedBenefit });
//     } catch (error) {
//       console.error("Update Benefit Error:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   },

updateBenefit: async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { heading, description, items } = req.body;

    const parsedItems = Array.isArray(items) ? items : [];

    const existing = await BenefitDao.getBenefitById(id);
    if (!existing) {
       res.status(404).json({ success: false, message: "Benefit not found" });
       return
    }

    const updatedBenefit = await BenefitDao.updateBenefit(
      id,
      heading,
      description,
      parsedItems
    );

    res.status(200).json({ success: true, data: updatedBenefit });

  } catch (error) {
    console.error("Update Benefit Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},


  // DELETE BENEFIT
  deleteBenefit: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existing = await BenefitDao.getBenefitById(id);
      if (!existing) { res.status(404).json({ success: false, message: "Benefit not found" });
      return
    }

      await BenefitDao.deleteBenefit(id);
      res.status(200).json({ success: true, message: "Benefit deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
};
