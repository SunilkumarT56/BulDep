import jwt from "jsonwebtoken";

export const generateJWT = (id: string | null): string => {
  console.log("Generating JWT for user:", id);
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing env var: JWT_SECRET");
  }
  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error("Missing env var: JWT_EXPIRES_IN");
  }
  if (!id) {
    throw new Error("User ID is required for JWT generation");
  }
  //@ts-ignore
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  console.log(token);
  return token;
};
