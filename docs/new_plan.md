Đúng, mình hiểu ý bro rồi: không phải user ngồi viết request thủ công. Dữ liệu nên được hình thành ngầm từ hành vi phối đồ, nhưng chỉ được dùng cho B2B khi user đã bật quyền chia sẻ ở mức tổng quát. Mình sẽ chỉnh lại thành một cặp tính năng “đinh” hơn, không chỉ là nút thêm đồ brand + dashboard thống kê.

Đã ngừng suy nghĩ

Đúng rồi bro. User không nên phải chủ động viết request. Hợp lý nhất là hệ thống chạy ngầm sau khi user bật quyền một lần, ví dụ:

Cho phép Closy dùng dữ liệu tủ đồ và hành vi phối đồ đã ẩn danh để cải thiện đề xuất từ local brand.

Nhưng bro nhận xét đúng: chỉ làm:

User bật “phối thêm đồ từ brand”.
Brand xem thống kê về người dùng.

thì chưa đủ đặc biệt.

Whering đã cho phép người dùng đưa item ngoài wardrobe hoặc từ website retailer vào để thử phối với đồ đang sở hữu; còn Stylitics đã cung cấp personalized complete-the-look và product bundling cho retailer. Vì vậy, chỉ “trộn sản phẩm brand vào outfit” rất dễ bị xem là phiên bản khác của tính năng đã có.

Ngoài ra, dashboard thống kê thực chất vẫn là chiều B2C → B2B, vì brand chỉ nhận dữ liệu do user tạo ra. Muốn có chiều B2B → B2C, brand phải gửi được một thứ gì đó có giá trị ngược trở lại trải nghiệm của user.

Cặp tính năng nên nâng thành
B2C: Closy Ghost Closet

Tên tiếng Việt:

Tủ đồ thử trước

User bật:

Mix with Local Brands

Sau đó, trong quá trình phối đồ bình thường, Closy có thể tạm thời đưa một sản phẩm local brand vào wardrobe dưới dạng Ghost Item.

Ghost Item:

Không phải món user đang sở hữu.
Không tự động thêm vào wardrobe.
Chỉ tồn tại trong outfit thử nghiệm.
Có nhãn rõ ràng là sản phẩm từ brand.
Có thể là sản phẩm đang bán hoặc mẫu chưa ra mắt.

Điểm đặc biệt không phải chỉ là “phối được với áo/quần nào”, mà là Closy thử sản phẩm đó với toàn bộ cấu trúc wardrobe.

Wardrobe Impact

Closy cho user thấy:

Luna Black Blazer
Mori Studio

Works with 11 items you own
Unlocks 16 new outfit combinations
Suitable for Work, Meeting and Date
Low duplication with your wardrobe
Fills your Outerwear gap

Các chỉ số có thể gồm:

Owned Item Compatibility: phối được với bao nhiêu món đang có.
New Outfits Unlocked: sản phẩm mở ra bao nhiêu outfit mới.
Wardrobe Gap Filled: giải quyết category hoặc occasion nào còn thiếu.
Redundancy Risk: có quá giống đồ user đã sở hữu không.
Occasion Coverage: mở rộng được những hoàn cảnh nào.
Color Compatibility: phù hợp với bảng màu wardrobe ở mức nào.

User có thể:

Keep in this outfit.
Swap it out.
See more outfits.
Save product.
Hide this brand.
Not my style.
Join waitlist.
Buy hoặc mở Product Detail.
Tại sao đặc biệt hơn?

Một recommendation thông thường hỏi:

“Sản phẩm nào hợp với outfit này?”

Ghost Closet hỏi:

“Nếu món này thực sự được thêm vào tủ, toàn bộ tủ đồ của user sẽ tốt lên bao nhiêu?”

Như vậy sản phẩm không được đánh giá chỉ bằng hình ảnh đẹp hoặc khả năng bán kèm, mà bằng giá trị gia tăng đối với wardrobe thật.

B2B: Closy Digital Sample Lab

Tên tiếng Việt:

Phòng thử mẫu số trên tủ đồ thật

Đây không chỉ là dashboard thống kê.

Brand có thể đưa một mẫu sản phẩm số vào Closy trước khi:

Sản xuất.
Restock.
Chọn màu.
Chốt form.
Mở bán collection.
Quyết định số lượng.

Mẫu này có thể là:

Sản phẩm đang bán.
Sản phẩm dự kiến ra mắt.
Hai phiên bản màu khác nhau.
Hai kiểu dáng khác nhau.
Một sản phẩm chuẩn bị restock.
Brand tạo thử nghiệm

Ví dụ brand upload:

Product concept:
Minimal Structured Blazer

Variants:
Black
Beige
Dark Brown

Target:
Female users interested in Minimal Workwear

Price range:
900,000–1,200,000 VNĐ

Sau đó Closy âm thầm đưa các phiên bản này vào Ghost Closet của nhóm user phù hợp đã bật quyền.

User vẫn dùng AI phối đồ bình thường và không phải trả lời khảo sát dài.

Closy thu tín hiệu hành vi tự nhiên

Hệ thống theo dõi dữ liệu tổng hợp:

Ghost Item được đưa vào bao nhiêu outfit.
User giữ hay swap sản phẩm ra.
User yêu cầu xem thêm outfit hay không.
Save hoặc wishlist rate.
Product detail click rate.
Hide hoặc Not my style.
Màu nào được giữ lại nhiều nhất.
Variant nào tạo được nhiều outfit mới nhất.
Category nào thường được phối cùng.
Occasion nào phù hợp nhất.
Mức độ trùng lặp với wardrobe hiện tại.

Nghiên cứu recommendation trong fashion đã chỉ ra rằng hành vi ngầm có thể cung cấp tín hiệu khác với dữ liệu mua hàng thuần túy, vì quyết định mua còn chịu ảnh hưởng của giá, khuyến mãi và hoạt động thương mại. Điều này ủng hộ việc tách tín hiệu “sản phẩm có ích cho wardrobe” khỏi tín hiệu “sản phẩm đã bán được”.

Brand nhận Wardrobe Fit Report

Ví dụ:

Digital Sample Test

Users exposed: 1,240
Qualified wardrobes: 786

Kept in generated outfit: 64%
Swapped out: 21%
Saved or joined waitlist: 18%

Median new outfits unlocked: 7
Median compatible owned items: 6

Best-performing color:
Black

Best-performing occasions:
Work, Meeting

Most compatible wardrobe items:
White shirts
Neutral trousers
Black skirts

Brand còn có thể xem:

Wardrobe Penetration

Bao nhiêu phần trăm wardrobe trong cohort có thể sử dụng sản phẩm một cách hợp lý.

Incremental Outfit Value

Sản phẩm tạo thêm bao nhiêu outfit mới thay vì chỉ thay thế món tương tự đã có.

Redundancy Risk

Bao nhiêu user đã sở hữu món gần giống, từ đó tránh sản xuất một sản phẩm ít cần thiết.

Variant Comparison

So sánh:

Black với Beige.
Cropped với Regular.
Plain với Pattern.
Giá A với giá B.
Opportunity Cohort

Nhóm người dùng nào thật sự hưởng lợi:

Minimal workwear users.
Người thiếu outerwear.
Người thường yêu cầu outfit đi làm.
Người có nhiều item trung tính nhưng thiếu layer.

Demand sensing và co-creation đã tồn tại trong ngành thời trang, nhưng thường dựa vào dữ liệu bán hàng, social signals, survey hoặc voting. Trong các sản phẩm công khai mình kiểm tra, mình chưa tìm thấy luồng kết hợp đầy đủ giữa mẫu chưa sản xuất → đưa vào phối ngầm với wardrobe thật → đo utility trên toàn wardrobe → trả kết quả tổng hợp cho brand. Vì vậy, đây là phần Closy có thể dùng để xây điểm khác biệt, dù không nên tuyên bố tuyệt đối rằng chưa từng có ai trên thế giới nghiên cứu ý tưởng tương tự.

Hai chiều liên kết thực sự
B2B → B2C

Brand gửi sang user:

Digital sample.
Product đang bán.
Phiên bản màu mới.
Sản phẩm chuẩn bị restock.
Collection chưa ra mắt.
Exclusive member sample.

Closy dùng chúng trong quá trình phối đồ thật của user.

B2C → B2B

User không viết request.

Hành vi tự nhiên tạo tín hiệu:

Giữ sản phẩm trong outfit.
Swap sản phẩm ra.
Xem thêm outfit.
Save.
Hide.
Join waitlist.
Click mua.
Sử dụng trong nhiều occasion khác nhau.

Closy tổng hợp tín hiệu và gửi lại brand.

Điểm mấu chốt

Cặp feature nên được mô tả như sau:

Phía Feature Giá trị đặc biệt
B2C Closy Ghost Closet Cho user thử một sản phẩm như thể nó đã nằm trong wardrobe và đo sản phẩm cải thiện toàn bộ tủ đồ thế nào
B2B Closy Digital Sample Lab Cho brand thử sản phẩm hoặc thiết kế chưa ra mắt trên các wardrobe thật đã ẩn danh trước khi sản xuất

Tên chung:

Closy Wardrobe Simulation Network

Hoặc dễ hiểu hơn:

Try in Real Wardrobes Before You Buy or Produce

Prototype chỉ cần sáu màn hình
B2C
Toggle Mix with Local Brands.
AI Outfit có Ghost Item.
Wardrobe Impact Detail.
Save, Swap hoặc Join Waitlist.
B2B
Upload Digital Sample.
Select Target Cohort.
Wardrobe Fit Report.
Compare Product Variants.

Điểm “wow” khi demo sẽ là:

Brand chưa cần sản xuất chiếc blazer. Closy tạm đưa mẫu số vào hàng trăm tủ đồ phù hợp, quan sát cách người dùng thật sự sử dụng nó trong outfit, rồi cho brand biết thiết kế đó có thực sự hữu ích hay chỉ trông đẹp trên catalog.

Đây mạnh hơn nhiều so với “user phối thêm đồ brand” và “brand xem thống kê”, vì Closy trở thành một phòng thử nghiệm sản phẩm hai chiều dựa trên wardrobe thật.
