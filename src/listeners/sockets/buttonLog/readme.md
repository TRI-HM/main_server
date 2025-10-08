# API

Websocket event emit : `clickLog:create`
Websocket event listening : `clickLog:createResponse`
JSON data:

Gửi nút thực hiện bấm

```JSON
{
  "button1": true
}
```

Hoặc cập nhật cho 2 nút

```JSON
{
  "button1": true,
  "button2": true
}
```
