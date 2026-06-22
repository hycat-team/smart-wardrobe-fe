hiện tại chức năng chat với AI và tạo bộ phối từ AI đang gộp ở 1 trang ai-stylist
tui muốn tách 2 chức năng này ra hoàn toàn: tạo phối đồ từ AI sẽ ở ai-stylist, còn chat vơi AI mình sẽ tạo 1 icon chat nằm ở bên trái và hiển thị ở các trang, khi người dùng muốn chỉ cần bấm vào đó sẽ mở lên 1 modal chat kế bên 

mô tả lại giao diện trang ai-stylist hiện tại: sẽ giữ lại khung canvas để chức năng tạo bộ phối từ AI, thanh navigation bên phải để chứa các request của api `POST` `/api/v1/ai/outfit-recommendations` 

cho chức năng tạo bộ phối từ AI: hiện tại người dùng nhập request vào ô input, sau đó bấm nút generate thì phộ phối sẽ được tạo và hiển thị trên canvas như luồng hiện tại đang làm đúng, mình sẽ điều chỉnh giao diện tại chức năng này người dùng ko cần thấy chat, người dùng chỉ cần nhập input và nhận được bộ outfit trên canvas và thao tác với các outfit đó trên canvas như save, edit, delete 

cho chức năng chat với AI: sẽ tạo 1 icon chat nằm ở bên trái và hiển thị ở các trang, khi người dùng muốn chỉ cần bấm vào đó sẽ mở lên 1 modal chat kế bên 
