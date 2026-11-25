import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from './api.mjs';

test('health, validation, and item lifecycle', async (t) => {
  const server = createApp().listen(0, '127.0.0.1');
  t.after(() => server.close());
  await once(server, 'listening');
  const base = 'http://127.0.0.1:' + server.address().port;
  const call = (method, route, body) => fetch(base + route, {
    method, body: body === undefined ? undefined : JSON.stringify(body),
    headers: {'content-type': 'application/json'},
  });
  assert.equal((await call('GET','/health')).status,200);
  assert.equal((await call('POST','/items',{name:'',quantity:-1})).status,400);
  const added = await call('POST','/items',{name:'Kabel',quantity:5});
  assert.equal(added.status,201);
  const route = '/items/' + (await added.json()).itemId;
  assert.equal((await (await call('GET',route)).json()).quantity,5);
  assert.equal((await (await call('PUT',route,{name:'Kabel',quantity:8})).json()).quantity,8);
  assert.equal((await call('DELETE',route)).status,204);
  for (const method of ['GET','PUT','DELETE']) {
    assert.equal((await call(method,route,method==='PUT'?{name:'Kabel',quantity:1}:undefined)).status,404);
  }
});
