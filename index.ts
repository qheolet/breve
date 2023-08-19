import { Application, Router, Context, helpers, Status } from "https://deno.land/x/oak/mod.ts";
import { isValidUrl } from "./server/utility.ts";
import { memory } from "./server/kv.ts";

const {getQuery} = helpers;

const router = new Router();

router.get("/api/short/:url", (ctx: Context) => {
  const {url} = getQuery(ctx,{mergeParams:true})

  if(!isValidUrl(url)) {
    ctx.response.body = {error: "Bad URL",
    code: Status.BadRequest
  };
    ctx.response.type = "json"
    ctx.response.status = Status.BadRequest;
    return;
  }

  const {id} = memory.add(url);
  ctx.response.body = {"id":id, "url":url, "link":`http://localhost:1776/to/${id}` };
  ctx.response.type = "json"
  ctx.response.status = Status.OK;
  return;
});

router.get("/to/:id", (ctx: Context) => {
  const {id} = getQuery(ctx,{mergeParams:true})

  ctx.response.redirect(memory.get(id))

  // ctx.response.body = {"id":id, url: memory.get(id)};
  // ctx.response.type = "json"
  // ctx.response.status = Status.OK;


  return;
});


const app = new Application();


app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/static`,
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


