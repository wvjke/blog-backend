import { body } from "express-validator";

export const loginValidation = [
  body("email", 'Incorrect email').isEmail(),
  body("password", 'Minimal password length is 5 symbols').isLength({ min: 5 })
];

export const registerValidation = [
  body("email", 'Incorrect email').isEmail(),
  body("password", 'Minimal password length is 5 symbols').isLength({ min: 5 }),
  body("fullName", 'Minimal name length is 3 symbols').isLength({ min: 3 }),
  body("avatarUrl", 'Incorrect URL').optional().isURL(),
];

export const postCreateValidation = [
  body("title", 'Enter title').isLength({ min: 3 }).isString(),
  body("text", 'Enter post text').isLength({ min: 3 }).isString(),
  body("tags", 'Incorrect tags format (array expected)').optional().isArray(),
  body("imageUrl", 'Incorrect URL').optional().isString(),
];


