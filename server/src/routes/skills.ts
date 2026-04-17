import { Router } from "express";
import * as skillController from "@/controllers/skillController";

const router = Router();

router.post("/", skillController.createSkill);
router.get("/", skillController.getAllSkills);
router.get("/category/:category", skillController.getSkillsByCategory);
router.get("/:id", skillController.getSkillById);
router.patch("/:id", skillController.updateSkill);
router.delete("/:id", skillController.deleteSkill);

export default router;
