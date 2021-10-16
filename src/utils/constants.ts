const JWT_SECRET = "hello";

/**
 * 2xx => success
 * 4xx => client mistake
 * 5xx => server mistake
 */

enum COLLECTION {
  USERS = "users",
  PROJECTS = "projects",
  EVENTS = "events",
  LOGS = "logs",
}

export { COLLECTION, JWT_SECRET };
