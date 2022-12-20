import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller";
import { getUserMotivators } from "../controllers/handler.factory";
import {
  createMotivator,
  getAllMotivators,
  getMotivatorsMain,
  getMotivatorsPurgatory,
  getMotivatorsWaiting,
  getMotivator,
  updateMotivator,
  deleteMotivator,
  vote,
  VoteKind,
  VoteMethod,
  accept,
} from "../controllers/motivator.controller";
import { setUserId } from "../middleware/motivator.middleware";
import { Place } from "../models/motivator.model";
import { Role } from "../models/user.model";
import { authorize, checkIfAlreadyVoted } from "../services/motivator.service";

const router = express.Router();

router
  .route("/")
  .post(protect, setUserId, createMotivator)

  //Motivators in Purgatory and on Main Page
  .get(getAllMotivators);

//Motivators on Main Page
router.get("/getMotivatorsMain", getMotivatorsMain);
//Motivators in Purgatory
router.get("/getMotivatorsPurgatory", getMotivatorsPurgatory);
//Motivators waiting to be accepted
router.get(
  "/getMotivatorsWaiting",
  protect,
  restrictTo(Role.admin, Role.moderator),
  getMotivatorsWaiting
);
//Get Motivators By User
//Logged in User
router.route("/getMyMotivators").get(protect, getUserMotivators);
//User By Id
router.route("/getUserMotivators/:id").get(protect, getUserMotivators);

//Voting Routes
router
  .route("/:id")
  .get(getMotivator)
  .patch(protect, authorize, updateMotivator)
  .delete(protect, authorize, deleteMotivator);

router
  .route("/givethumbup/:id")
  // Give Like
  .put(protect, checkIfAlreadyVoted, vote(VoteKind.thumbUp, VoteMethod.give));
router
  // Undo Like
  .route("/undothumbup/:id")
  // Give DisLike
  .put(protect, vote(VoteKind.thumbUp, VoteMethod.take));
router
  // Undo DisLike
  .route("/givethumbdown/:id")
  .put(protect, checkIfAlreadyVoted, vote(VoteKind.thumbDown, VoteMethod.give));
router
  .route("/undothumbdown/:id")
  .put(protect, vote(VoteKind.thumbDown, VoteMethod.take));

router.put(
  "/accept/:id",
  protect,
  restrictTo(Role.admin, Role.moderator),
  accept(Place.purgatory)
);

export default router;
