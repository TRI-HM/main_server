# Fighting Game Use cases

Thiết bị gồm 2 điện thoại để chơi game app. Một màn hình lớn chạy app windown (hiển thị thể lệ chơi game, và điểm số realtime của 2 người chơi). 2 điện thoại để chơi game app.
Một game thi đấu hứng trứng giữa 2 người chơi cùng lúc. Số điểm mỗi người chơi sẽ được hiển thị realtime lên một client màn hình lớn. Khi điểm số của 1 người chơi đạt đến 100 thì game kết thúc và người chơi đó thắng.
Sau khi kết thúc game, màn hình lớn sẽ hiển thị thể lệ game và điện thoại sẽ được khởi động lại game.

## Events emit

Server emit từ server về client

- `fight-game:start`: Khi game bắt đầu, 2 người chơi đã sẵn sàng, server sẽ emit sự kiện này để màn hình lớn và game phone ở trên app hiển thị game.
- `fight-game:end`: Khi game kết thúc, server sẽ emit sự kiện này để màn hình lớn và game phone ở trên app hiển thị kết quả game.
- `fight-game:restart`: Khi game khởi động lại, 2 người chơi đã sẵn sàng, server sẽ emit sự kiện này để màn hình lớn và game phone ở trên app hiển thị game.
- `fight-game:player:score`: Khi người chơi ghi điểm, điểm số của người chơi sẽ được cập nhật realtime lên màn hình lớn.
- `fight-game:player:lose`: Khi người chơi thua
- `fight-game:player:win`: Khi người chơi thắng
- `fight-game:player:draw`: Khi người chơi hòa

Server listening từ client về server

- `fight-game:response:ready`: Khi game sẵn sàng, chờ đợi 2 người chơi
- `fight-game:response:start`: Khi game bắt đầu, 2 người chơi đã sẵn sàng
- `fight-game:response:end`: Khi game kết thúc
- `fight-game:response:restart`: Khi game khởi động lại, 2 người chơi đã sẵn sàng
- `fight-game:response:player:score`: Khi người chơi ghi điểm, điểm số của người chơi sẽ được cập nhật realtime lên màn hình lớn.
- `fight-game:response:player:lose`: Khi người chơi thua
- `fight-game:response:player:win`: Khi người chơi thắng
- `fight-game:response:player:draw`: Khi người chơi hòa

Client màn hình lớn sẽ listening sự kiện:
`fight-game:response:ready` để hiển thị đang chờ đợi 2 người chơi.
`fight-game:response:start` để hiển thị game đã bắt đầu, countdown 3 giây.
`fight-game:response:end` để hiển thị kết quả game.
`fight-game:response:player:score` để cập nhật điểm số của người chơi realtime lên màn hình lớn.
`fight-game:response:restart` để khởi động lại game sẽ hiển thị thể lệ game. Sau khi khởi động lại game, màn hình lớn sẽ listening sự kiện `fight-game:response:ready` để hiển thị đang chờ đợi 2 người chơi.

Client game phone ở trên app sẽ listening sự kiện:
`fight-game:ready` để gửi sự kiện ready đến server.
`fight-game:response:start` để game đã bắt đầu, countdown 3 giây.
`fight-game:response:end` để hiển thị kết quả game.
`fight-game:player:score` để gửi sự kiện player:score đến server.
`fight-game:response:restart` để gửi sự kiện restart đến server.
