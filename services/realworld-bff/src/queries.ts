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
  text: "SELECT id, email, username, bio, image, password FROM users WHERE email = $1;" as const,
  values: [email],
});

export type SelectUserByIdReturn = {
  email: string;
  username: string;
  bio: string;
  image: string;
};

export const selectUserById = (id: number) => ({
  name: "select-user-by-id" as const,
  text: "SELECT email, username, bio, image FROM users WHERE id = $1;" as const,
  values: [id],
});

export type UpdateUserByIdReturn = {
  email: string;
  username: string;
  bio: string;
  image: string;
};

export const updateUserById = (
  id: number,
  email?: string | null,
  username?: string | null,
  bio?: string | null,
  image?: string | null,
  password?: string | null,
) => ({
  name: "update-user-by-id" as const,
  text: "UPDATE users SET email = COALESCE($2, email), username = COALESCE($3, username), bio = COALESCE($4, bio), image = COALESCE($5, image), password = COALESCE($6, password), updated_at = NOW() WHERE id = $1 RETURNING email, username, bio, image;" as const,
  values: [id, email, username, bio, image, password],
});
