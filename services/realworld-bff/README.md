# @services/realworld-bff

DB data structure

```
    ┌──────────────────────────────────────────┐
    │ users                                    │
    └──────────────────────────────────────────┘
┌───► id         :SERIAL                       ◄──┐
│   │                                          │  │
│   │ email      :VARCHAR(254) UNIQUE NOT NULL │  │
│   │                                          │  │
│   │ username   :VARCHAR(36) UNIQUE NOT NULL  │  │
│   │                                          │  │
│   │ bio        :VARCHAR(3500)                │  │
│   │                                          │  │
│   │ image      :VARCHAR(254)                 │  │
│   │                                          │  │
│   │ password   :VARCHAR(256) NOT NULL        │  │
│   │                                          │  │
│   │ created_at :TIMESTAMP NOT NULL           │  │
│   │                                          │  │ ┌────────────────────────────────┐
│   │ updated_at :TIMESTAMP NOT NULL           │  │ │ comments                       │
│   └──────────────────────────────────────────┘  │ ├────────────────────────────────┤
│                                                 │ │ id         :SERIAL             │
│                                                 │ │                                │
│                                                 │ │ created_at :TIMESTAMP NOT NULL │
│   ┌───────────────────────────────┐             │ │                                │
│   │ likes                         │             │ │ updated_at :TIMESTAMP NOT NULL │
│   ├───────────────────────────────┤             │ │                                │
├───┤ user_id :INTEGER NOT NULL     │             │ │ body       :TEXT NOT NULL      │
│   │                               │             │ │                                │
│ ┌─┤ article_id :INTEGER NOT NULL  │             └─┤ author_id  :INTEGER NOT NULL   │
│ │ └───────────────────────────────┘               │                                │
│ │                                               ┌─┤ article_id :INTEGER NOT NULL   │
│ │                                               │ └────────────────────────────────┘
│ │                                               │
│ │                                               │
│ │ ┌──────────────────────────────────────┐      │
│ │ │ articles                             │      │
│ │ └──────────────────────────────────────┘      │  ┌────────────────────────────────────────┐
│ └─► id          :SERIAL                  ◄──────┤  │ article_tags                           │
│   │                                      │      │  ├────────────────────────────────────────┤
│   │ slug        :VARCHAR UNIQUE NOT NULL │      └──┤ article_id :INTEGER NOT NULL           │
│   │                                      │         │                                        │
│   │ title       :VARCHAR(256) NOT NULL   │      ┌──┤ tag_id     :VARCHAR(256) NOT NULL      │
│   │                                      │      │  └────────────────────────────────────────┘
│   │ description :TEXT NOT NULL           │      │
│   │                                      │      │  ┌────────────────────────────────────┐
│   │ body        :TEXT NOT NULL           │      │  │ tags                               │
│   │                                      │      │  └────────────────────────────────────┤
│   │ created_at  :TIMESTAMP NOT NULL      │      └──► id :SERIAL PRIMARY KEY             │
│   │                                      │         │                                    │
│   │ updated_at  :TIMESTAMP NOT NULL      │         │ name :VARCHAR(256) UNIQUE NOT NULL │
│   │                                      │         │                                    │
└───┤ author_id   :INTEGER NOT NULL        │         │ created_at :TIMESTAMP NOT NULL     │
    └──────────────────────────────────────┘         │                                    │
                                                     │ updated_at :TIMESTAMP NOT NULL     │
                                                     └────────────────────────────────────┘
```
