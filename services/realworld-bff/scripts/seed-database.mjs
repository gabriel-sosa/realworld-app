import pkg from "pg";
const { Client } = pkg;

const pgClient = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

await pgClient.connect();

const query = `
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS article_tags;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tags;



CREATE TABLE users (
	id serial PRIMARY KEY,
	email varchar(256) UNIQUE NOT NULL,
	username varchar(36) UNIQUE NOT NULL,
	bio varchar(3500),
	image varchar(256),
	password varchar(256) NOT NULL
);

CREATE TABLE articles (
	id serial PRIMARY KEY,
	title varchar(256) NOT NULL,
	slug varchar UNIQUE NOT NULL,
	description text NOT NULL,
	body text NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW(),
	author_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
	id serial PRIMARY KEY,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW(),
	body text NOT NULL,
	author_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	article_id integer NOT NULL REFERENCES articles(id) ON DELETE CASCADE
);

CREATE TABLE tags (
	id serial PRIMARY KEY,
	name varchar(256) UNIQUE NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE article_tags (
	article_id integer NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
	tag_id integer NOT NULL REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE likes (
	user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	article_id integer NOT NULL REFERENCES articles(id) ON DELETE CASCADE
);

INSERT INTO users(email, username, password)
VALUES ('seed-user@gmail.com', 'seed-user', 'password');
`;

await pgClient.query(query);
await pgClient.end();

console.log("done");
