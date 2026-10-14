import jwt from "jsonwebtoken";

// export const generateToken = (user: any) => {
//     return jwt.sign(
//         { id: user.id, email: user.email, name: user.name, number: user.number },
//         process.env.JWT_SECRET as string,
//         { expiresIn: "7d" } // move to .env
//     )
// }

export const generateToken = (user: { id: number; email: string; name?: string }) => {
  return jwt.sign(
    {
      id: user.id, // keep this as a number
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};