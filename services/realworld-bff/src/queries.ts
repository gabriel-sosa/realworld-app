export type InsertUserQueryReturn = {
  id: number;
  email: string;
  username: string;
  bio: string;
  image: string;
};

export const insertUserQuery = (email: string, username: string, password: string) => ({
  name: "insert-new-user",
  text: "INSERT INTO users(email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username, bio, image;",
  values: [email, username, password],
});
