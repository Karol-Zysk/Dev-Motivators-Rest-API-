import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

export enum Place {
  main = "Main",
  waiting = "Waiting",
  purgatory = "Purgatory",
}

export interface MotivatorDocument extends mongoose.Document {
  title: string;
  subTitle: string;
  sluck: string;
  image: string;
  thumbUp: string[];
  thumbDown: string[];
  place: Place;
  createdAt: Date;
  updatedAt: Date;
  author: { id: Schema.Types.ObjectId };
  keyWords: string[];
  safeIn: number;
}

const motivatorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: [40, "Title must have less than or equal 40 characters"],
    },
    subTitle: {
      type: String,
      required: true,
      maxLength: [999, "Subtitle must have less than or equal 40 characters"],
    },
    slug: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },

    thumbUp: [{ type: Schema.Types.ObjectId, ref: "User" }],

    thumbDown: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    place: {
      type: String,
      enum: {
        values: [Place.main, Place.purgatory, Place.waiting],
      },
      default: Place.purgatory,
    },
    keyWords: {
      type: [String],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Motivator must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

motivatorSchema.pre("save", function () {
  this.slug = slugify(this.title, { lower: true });
});



motivatorSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    options: { select: "login" },
  });

  next();
});

const Motivator = mongoose.model<MotivatorDocument>(
  "Motivator",
  motivatorSchema
);

export default Motivator;
