import express from "express";
import {
  createMotivator,
  getAllMotivators,
  getMotivatorsMain,
  getMotivatorsPurgatory,
  getMotivatorsWaiting,
  getOneMotivator,
  updateOneMotivator,
  deleteOneMotivator,
  deleteAllMotivators,
} from "../controllers/motivator.controller";

const router = express.Router();

router
  .route("/")
  .post(createMotivator)

  //Motivators in Purgatory and on Main Page
  .get(getAllMotivators)
  .delete(deleteAllMotivators);

//Motivators on Main Page
router.get("/getMotivatorsMain", getMotivatorsMain);
//Motivators in Purgatory
router.get("/getMotivatorsPurgatory", getMotivatorsPurgatory);
//Motivators waiting to be accepted
router.get("/getMotivatorsWaiting", getMotivatorsWaiting);

router
  .route("/:id")
  .get(getOneMotivator)
  .patch(updateOneMotivator)
  .delete(deleteOneMotivator);

export default router;
