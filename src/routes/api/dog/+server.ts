import {
  error,
  json,
  type RequestEvent,
  type RequestHandler,
} from "@sveltejs/kit";

export const GET: RequestHandler = async (e: RequestEvent) => {
  e.cookies;
  e.params;
  e.request.body;
  e.fetch("someURL");
  return new Response();
};

export const POST: RequestHandler = async () => {
  let user = { admin: true };

  if (!user.admin) {
    throw error(401, "Unauthorized");
  }

  return json({ name: "dog" });
};

export const DELETE: RequestHandler = async () => {
  return new Response();
};
