import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export enum Role {
  admin = "Admin",
  moderator = "Moderator",
  user = "User",
}

export interface UserDocument extends mongoose.Document {
  email: string;
  login: string;
  password: string | undefined;
  passwordConfirm: string;
  userPhoto: string;
  role: Role;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      maxLength: [40, "Title must have less than or equal 40 characters"],
    },
    email: {
      type: String,
      lowercase: "true",
      required: [true, "Email is required"],
      unique: [true, "this email already exist"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
      // WORKS ONLY ON CREATE AND SAVE
      validate: [
        function (this: { password: string }, el: string) {
          return el === this.password;
        },
        "password and confirmation password must be the same",
      ],
    },
    role: {
      type: String,
      enum: {
        values: [Role.user, Role.moderator, Role.admin],
      },
      default: Role.user,
    },
    active: {
      type: Boolean,
      select: false,
      default: true,
    },
    description: {
      type: String,
      maxLength: [999, "Subtitle must have less than or equal 40 characters"],
    },

    userPhoto: {
      type: String,
      default: "default.jpg",
    },

    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre(
  "save",
  async function (
    this: {
      password: string;
      passwordConfirm: string | undefined;
      isModified: (password: string) => boolean;
    },
    next: (err?: Error) => void
  ) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));

    const hash = await bcrypt.hashSync(this.password, salt);

    this.password = hash;
    this.passwordConfirm = undefined;
  }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
