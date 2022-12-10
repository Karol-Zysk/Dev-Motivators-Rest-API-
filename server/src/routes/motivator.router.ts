import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller";
import {
  createMotivator,
  getAllMotivators,
  getMotivatorsMain,
  getMotivatorsPurgatory,
  getMotivatorsWaiting,
  getMotivator,
  updateMotivator,
  deleteMotivator,
  deleteAllMotivators,
  setTourUserIDs,
  likeMotivator,
  giveThumbUp,
} from "../controllers/motivator.controller";
import { Role } from "../models/user.model";
import { authorize, checkIfAlreadyVoted } from "../services/motivator.service";

const router = express.Router();

router
  .route("/")
  .post(protect, setTourUserIDs, createMotivator)

  //Motivators in Purgatory and on Main Page
  .get(getAllMotivators)
  .delete(deleteAllMotivators);

//Motivators on Main Page
router.get("/getMotivatorsMain", getMotivatorsMain);
//Motivators in Purgatory
router.get("/getMotivatorsPurgatory", getMotivatorsPurgatory);
//Motivators waiting to be accepted
router.get(
  "/getMotivatorsWaiting",
  restrictTo(Role.admin, Role.moderator),
  getMotivatorsWaiting
);

router
  .route("/:id")
  .get(getMotivator)
  .patch(protect, authorize, updateMotivator)
  .delete(protect, authorize, deleteMotivator);

router.route("/like/:id").put(protect, checkIfAlreadyVoted, giveThumbUp);

export default router;
