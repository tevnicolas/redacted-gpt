/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';
import { exec as nodeExec } from 'node:child_process';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
  authMiddleware,
} from './lib/index.js';
import { nextTick } from 'node:process';
import { FilterSet } from '../client/src/lib/data.js';
import {
  createAnalysisRun,
  getAnalysisResponse,
  startAnalysisThread,
} from './lib/openai-service.js';

const exec = promisify(nodeExec);

type User = {
  userId: number;
  username: string;
  passwordHash: string;
};
type Auth = {
  username: string;
  password: string;
};

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'Username and Password are required fields');
    }
    const passwordHash = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "passwordHash")
      values ($1, $2)
      returning "userId", "username", "createdAt";
    `;
    const params = [username, passwordHash];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'Invalid Login');
    }
    const sql = `
      select "userId",
            "passwordHash"
        from "users"
        where "username" = $1;
    `;
    const params = [username];
    const result = await db.query(sql, params);
    if (!result.rows[0]) throw new ClientError(401, 'Invalid Login');
    const verify = await argon2.verify(result.rows[0].passwordHash, password);
    if (!verify) throw new ClientError(401, 'Invalid Login');
    const payload = { username, userId: result.rows[0].userId };
    const token = jwt.sign(payload, hashKey);
    res.status(200).json({ user: payload, token });
  } catch (error) {
    next(error);
  }
});

app.get('/api/filter-sets', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
      select *
        from "filterSets"
        where "userId" = $1;
    `;
    const result = await db.query<FilterSet>(sql, [req.user?.userId]);
    const filterSets = result.rows;
    res.status(200).json(filterSets);
  } catch (error) {
    next(error);
  }
});

app.post('/api/filter-sets', authMiddleware, async (req, res, next) => {
  try {
    const filters = [
      req.body.label,
      req.body.person,
      req.body.phoneNumber,
      req.body.emailAddress,
      req.body.dateTime,
      req.body.location,
      req.body.usSsn,
      req.body.usDriverLicense,
      req.body.crypto,
      req.body.usBankNumber,
      req.body.creditCard,
      req.body.ipAddress,
    ];
    const { userId } = req.user!; // <- auth Mw ensures req.user is defined
    // if any filters are undefined -> client side error, but not user error
    if (filters.some((value) => value === undefined)) {
      console.error(
        `Error 412, At least one of the filters in app.post('/api/filterSets' req.body is undefined. Dev problem!`
      );
      throw new ClientError(
        412,
        'Apologies, something has gone horribly awry!'
      );
    }
    // user error if at least one of the filters is not value true
    if (!filters.some((value) => value)) {
      throw new ClientError(
        400,
        "Add at least one filter to save a filter set. If no filter is required, use 'None' before prompting on the Home page."
      );
    }
    const params = [...filters, userId];
    const sql = `
      insert into "filterSets"
        ("label", "person", "phoneNumber", "emailAddress", "dateTime", "location", "usSsn",
        "usDriverLicense", "crypto", "usBankNumber", "creditCard", "ipAddress", "userId")
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      returning *;
    `;
    const result = await db.query<FilterSet>(sql, params);
    const filterSet = result.rows[0];
    res.status(201).json(filterSet);
  } catch (error) {
    next(error);
  }
});

app.put(
  '/api/filter-sets/:filterSetId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const filters = [
        req.body.label,
        req.body.person,
        req.body.phoneNumber,
        req.body.emailAddress,
        req.body.dateTime,
        req.body.location,
        req.body.usSsn,
        req.body.usDriverLicense,
        req.body.crypto,
        req.body.usBankNumber,
        req.body.creditCard,
        req.body.ipAddress,
      ];
      const { filterSetId } = req.params;
      const { userId } = req.user!; // <- auth Mw ensures req.user is defined

      // if any filters are undefined -> client side error, never a user error
      if (filters.some((value) => value === undefined)) {
        console.error(
          `Error 412, At least one of the filters in app.put('/api/filterSets/:filterSetId' req.body is undefined, which is a you (dev) problem!`
        );
        throw new ClientError(
          412,
          'Apologies, something has gone horribly awry!'
        );
      }
      // if filterSetId is !(string(pos integer > 0) w/o leading 0s)
      // -> client side error, never a user error
      if (!/^[1-9]\d*$/.test(filterSetId)) {
        console.error(
          `Error 404, in the req.params of app.put('/api/filterSets/:filterSetId' filterSetId was not a string pos integer > 0, so possibly undefined or empty. Dev problem!`
        );
        throw new ClientError(
          404,
          'Apologies, something has gone horribly awry!'
        );
      }
      // if at least one of the filters is not value true, -> user error
      if (!filters.some((value) => value)) {
        throw new ClientError(
          400,
          "At least one filter must be applied to update the filter set. Add one, or delete / revert the set. If you don't require filters, use 'None' before prompting on the Home page."
        );
      }
      const params = [...filters, filterSetId, userId];
      const sql = `
        update "filterSets"
        set "label" = $1, "person" = $2, "phoneNumber" = $3,
            "emailAddress" = $4, "dateTime" = $5, "location" = $6,
            "usSsn" = $7, "usDriverLicense" = $8, "crypto" = $9,
            "usBankNumber" = $10, "creditCard" = $11, "ipAddress" = $12
        where "filterSetId" = $13 AND "userId" = $14
        returning *;
      `;
      const results = await db.query<FilterSet>(sql, params);
      const updatedFilterSet = results.rows[0];
      if (!updatedFilterSet) {
        throw new ClientError(
          404,
          `Hmm... Something went wrong here. Filter Set changes could not be saved. ${filterSetId}`
        );
      }
      res.status(200).json(updatedFilterSet);
    } catch (error) {
      next(error);
    }
  }
);

app.delete(
  '/api/filter-sets/:filterSetId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.user!; // <- auth Mw ensures req.user is defined
      const { filterSetId } = req.params;
      const params = [filterSetId, userId];
      const sql = `
      delete from "filterSets"
        where "filterSetId" = $1 and "userId" = $2
        returning *;
      `;
      const results = await db.query<FilterSet>(sql, params);
      const deleteFilterSet = results.rows[0];
      if (!deleteFilterSet) {
        throw new ClientError(
          404,
          `Hmm... Something went wrong here. Filter Set could not be deleted.`
        );
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

app.post('/api/presidio', async (req, res, next) => {
  try {
    const { prompt, filterSet } = req.body;
    if (!prompt) throw new ClientError(400, 'Prompt must be provided.');
    if (prompt.length > 4094)
      throw new ClientError(400, 'Prompt must be less than 4096 characters.');
    if (!filterSet) throw new ClientError(400, 'Filter Set must be selected.');
    const { stdout } = await exec(
      `python3 ./try.python "${prompt}" ${filterSet}`
    );
    // regex removes tailing '\n'
    res.status(201).json({ presidio: stdout.replace(/\n$/, '') });
  } catch (error) {
    next(error);
  }
});

app.post('/api/openai', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const threadId = await startAnalysisThread(prompt);
    const runThreadId = await createAnalysisRun(threadId);
    const analysis = await getAnalysisResponse(runThreadId);
    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error in processing OpenAI API request:', error);
    next(error);
  }
});

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
