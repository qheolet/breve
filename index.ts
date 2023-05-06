import { Application, Router, Context, helpers, Status } from "https://deno.land/x/oak/mod.ts";
import { isValidUrl } from "./utility.ts";

const {getQuery} = helpers;

const router = new Router();



router.get("/:url", (ctx: Context) => {
  const {url} = getQuery(ctx,{mergeParams:true})

  if(!isValidUrl(url)) {
    ctx.response.body = {error: "Bad URL",
    code: Status.BadRequest
  };
    ctx.response.type = "json"
    ctx.response.status = Status.BadRequest;
    return;
  }

  ctx.response.body = {url};
  ctx.response.type = "json"
  ctx.response.status = Status.OK;
  return;
});

const app = new Application();


app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/examples/static`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 1776 });


//http://localhost:1776/http%3A%2F%2Fwww.google.com


