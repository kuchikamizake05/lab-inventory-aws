import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export function createApp() {
  const items = new Map();
  return createServer(async (req, res) => {
    const send = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(data === undefined ? undefined : JSON.stringify(data));
    };
    const path = (req.url ?? '').split('?')[0];
    const { method } = req;
    if (method === 'GET' && path === '/health') return send(200, {status:'ok'});
    const id = /^\/items\/([a-f0-9-]{36})$/.exec(path)?.[1];
    const create = method === 'POST' && path === '/items';
    if (!create && (!id || !['GET','PUT','DELETE'].includes(method))) {
      return send(404,{error:'route not found'});
    }
    if (!create && !items.has(id)) return send(404,{error:'item not found'});
    if (method === 'GET') return send(200,items.get(id));
    if (method === 'DELETE') {
      items.delete(id);
      return send(204);
    }
    let body = '';
    try {
      req.setEncoding('utf8');
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 8192) return send(413,{error:'body too large'});
      }
      const {name,quantity} = JSON.parse(body);
      if (typeof name !== 'string' || !name.trim() || name.length > 120 ||
          !Number.isSafeInteger(quantity) || quantity < 0) {
        return send(400,{error:'invalid name or quantity'});
      }
      const item = {itemId: create ? randomUUID() : id,name:name.trim(),quantity};
      items.set(item.itemId,item);
      return send(create ? 201 : 200,item);
    } catch {
      return send(400,{error:'invalid request body'});
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(8080,'0.0.0.0');
}
