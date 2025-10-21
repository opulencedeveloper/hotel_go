import bcrypt from "bcrypt";

export const hashPassCode = (password: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (error, hashed: string) => {
        if (error) {
          reject(error);
        }
        resolve(hashed);
      });
    });
  });
};

export const comparePassCode = (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};
