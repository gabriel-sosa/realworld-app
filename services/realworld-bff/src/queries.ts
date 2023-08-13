export type InsertUserQueryReturn = {
  id: number;
  email: string;
  username: string;
  bio: string;
  image: string;
};

export const insertUserQuery = (email: string, username: string, password: string) => ({
  name: "insert-new-user" as const,
  text: "INSERT INTO users(email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username, bio, image;" as const,
  values: [email, username, password],
});

export type SelectUserByEmailReturn = {
  id: number;
  email: string;
  username: string;
  bio: string;
  image: string;
  password: string;
};

export const selectUserByEmail = (email: string) => ({
  name: "select-user-by-email" as const,
  text: "select id, email, username, bio, image, password from users where email = $1;" as const,
  values: [email],
});
