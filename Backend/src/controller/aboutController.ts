import { Request, Response } from "express";
import { AboutDao } from "../dao/about.dao";
import { RESPONSE_MESSAGES } from "../constants/response";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const AboutController = {
  // ========== CREATE ==========
  createAbout: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        badge,
        title,
        subtitle,
        description,
        content,
        image,
        image2,
        videoUrl,
        layout,
        itemsLayout,
        alignment,
        ctaEnabled,
        ctaText,
        ctaLink,
        ctaTarget,
        isActive,
        items,
        sections,
        // Legacy fields fallback
        titleOne,
        titleTwo,
        descriptionOne,
        descriptionTwo,
      } = req.body;

      const about = await AboutDao.createAbout({
        badge: typeof badge === "string" ? badge : undefined,
        title: title || titleOne || "About Us",
        subtitle: subtitle || titleTwo || undefined,
        description: description || descriptionOne || undefined,
        content: content || descriptionTwo || undefined,
        image: typeof image === "string" ? image : undefined,
        image2: typeof image2 === "string" ? image2 : undefined,
        videoUrl: typeof videoUrl === "string" ? videoUrl : undefined,
        layout: layout || "image-left",
        itemsLayout: itemsLayout || "grid",
        alignment: alignment || "left",
        ctaEnabled: ctaEnabled !== undefined ? Boolean(ctaEnabled) : false,
        ctaText: ctaText || "Know More",
        ctaLink: ctaLink || undefined,
        ctaTarget: ctaTarget || "_self",
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        items: Array.isArray(items) ? items : [],
        sections: Array.isArray(sections) ? sections : [],
      });

      res.status(201).json({
        success: true,
        message: "About section created successfully.",
        data: about,
      });
    } catch (error: any) {
      console.error("Create About Error:", error);
      res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  },

  // ========== GET ALL ==========
  getAllAbout: async (req: Request, res: Response): Promise<void> => {
    try {
      const aboutData = await AboutDao.getAllAbout();
      res.status(200).json({ success: true, data: aboutData });
    } catch (error: any) {
      console.error("Get All About Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // ========== GET BY ID ==========
  getAboutById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const about = await AboutDao.getAboutById(Number(id));

      if (!about) {
        res.status(404).json({ success: false, message: "About section not found" });
        return;
      }

      res.status(200).json({ success: true, data: about });
    } catch (error: any) {
      console.error("Get About By ID Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // ========== UPDATE ABOUT ==========
  updateAbout: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        badge,
        title,
        subtitle,
        description,
        content,
        image,
        image2,
        videoUrl,
        layout,
        itemsLayout,
        alignment,
        ctaEnabled,
        ctaText,
        ctaLink,
        ctaTarget,
        isActive,
        items,
        sections,
        titleOne,
        titleTwo,
        descriptionOne,
        descriptionTwo,
      } = req.body;

      const existing = await AboutDao.getAboutById(Number(id));
      if (!existing) {
        res.status(404).json({ success: false, message: "About section not found" });
        return;
      }

      // Cleanup old media from MinIO if changed
      if (image !== undefined && existing.image && existing.image !== image) {
        await deleteFileFromMinIO(existing.image);
      }
      if (image2 !== undefined && (existing as any).image2 && (existing as any).image2 !== image2) {
        await deleteFileFromMinIO((existing as any).image2);
      }
      if (videoUrl !== undefined && existing.videoUrl && existing.videoUrl !== videoUrl) {
        await deleteFileFromMinIO(existing.videoUrl);
      }

      const updated = await AboutDao.updateAbout(Number(id), {
        badge: badge !== undefined ? badge : existing.badge,
        title: title !== undefined ? title : (titleOne !== undefined ? titleOne : existing.title),
        subtitle: subtitle !== undefined ? subtitle : (titleTwo !== undefined ? titleTwo : existing.subtitle),
        description: description !== undefined ? description : (descriptionOne !== undefined ? descriptionOne : existing.description),
        content: content !== undefined ? content : (descriptionTwo !== undefined ? descriptionTwo : existing.content),
        image: image !== undefined ? image : existing.image,
        image2: image2 !== undefined ? image2 : (existing as any).image2,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        layout: layout !== undefined ? layout : existing.layout,
        itemsLayout: itemsLayout !== undefined ? itemsLayout : existing.itemsLayout,
        alignment: alignment !== undefined ? alignment : existing.alignment,
        ctaEnabled: ctaEnabled !== undefined ? Boolean(ctaEnabled) : existing.ctaEnabled,
        ctaText: ctaText !== undefined ? ctaText : existing.ctaText,
        ctaLink: ctaLink !== undefined ? ctaLink : existing.ctaLink,
        ctaTarget: ctaTarget !== undefined ? ctaTarget : existing.ctaTarget,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        items: items !== undefined ? items : undefined,
        sections: sections !== undefined ? sections : undefined,
      });

      res.status(200).json({
        success: true,
        message: "About section updated successfully.",
        data: updated,
      });
    } catch (error: any) {
      console.error("Update About Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // ========== DELETE ABOUT ==========
  deleteAbout: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existing = await AboutDao.getAboutById(Number(id));
      if (!existing) {
        res.status(404).json({ success: false, message: "About section not found" });
        return;
      }

      // Delete media from MinIO
      if (existing.image) {
        await deleteFileFromMinIO(existing.image);
      }
      if ((existing as any).image2) {
        await deleteFileFromMinIO((existing as any).image2);
      }
      if (existing.videoUrl) {
        await deleteFileFromMinIO(existing.videoUrl);
      }

      await AboutDao.deleteAbout(Number(id));

      res.status(200).json({
        success: true,
        message: "About section deleted successfully.",
      });
    } catch (error: any) {
      console.error("Delete About Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },
};
