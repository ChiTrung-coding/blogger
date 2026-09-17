# Requirements Document

## Introduction

Trang blog cá nhân (Personal Blogger) là một website dành riêng cho cá nhân để chia sẻ bài viết kỹ thuật, kinh nghiệm làm việc, dự án cá nhân và thông tin bản thân. Giao diện mang phong cách hiện đại với dark navy/blue theme, hỗ trợ dark/light mode, responsive design và tối ưu SEO. Blog bao gồm hệ thống quản lý bài viết, danh mục, tags, bình luận và trang portfolio cá nhân.

## Glossary

- **Blog**: Ứng dụng web blog cá nhân tổng thể
- **Visitor**: Người dùng truy cập trang web (chỉ đọc)
- **Admin**: Chủ sở hữu blog, có quyền quản trị và đăng bài
- **Article**: Bài viết được đăng trên blog, có tiêu đề, nội dung, thumbnail, danh mục và tags
- **Category**: Danh mục phân loại bài viết (ví dụ: IT Support, Web Development)
- **Tag**: Nhãn gắn thêm cho bài viết để phân loại chi tiết hơn
- **Comment**: Bình luận của Visitor dưới mỗi Article
- **Project**: Dự án cá nhân được hiển thị trong trang portfolio
- **Experience**: Mục kinh nghiệm làm việc và học tập dạng timeline
- **Sidebar**: Thanh bên phải trên trang chủ và trang danh sách bài viết
- **Hero_Section**: Phần giới thiệu cá nhân nổi bật ở đầu trang chủ
- **Search_Engine**: Chức năng tìm kiếm bài viết theo từ khóa
- **Theme_Manager**: Chức năng quản lý và chuyển đổi giao diện sáng/tối
- **SEO_Manager**: Chức năng tối ưu hóa công cụ tìm kiếm cho các trang
- **Contact_Form**: Biểu mẫu liên hệ trên trang Liên hệ
- **Admin_Panel**: Giao diện quản trị dành cho Admin
- **Comment_System**: Hệ thống quản lý bình luận của Visitor

---

## Requirements

### Yêu cầu 1: Trang chủ và Hero Section

**User Story:** Là một Visitor, tôi muốn thấy thông tin cá nhân của chủ blog ngay khi vào trang chủ, để tôi có thể hiểu về người viết và các lĩnh vực blog này tập trung.

#### Tiêu chí chấp nhận

1. THE Blog SHALL hiển thị Hero_Section bao gồm ảnh avatar tròn, họ tên đầy đủ, chức danh nghề nghiệp, câu motto và thông tin địa điểm/học vấn.
2. WHEN Visitor nhấn vào một biểu tượng mạng xã hội (GitHub, LinkedIn, Facebook, Discord) trong Hero_Section, THE Blog SHALL mở liên kết tương ứng trong tab mới của trình duyệt.
3. THE Blog SHALL hiển thị logo dạng `</> Trung's Blog` ở góc trên bên trái của navigation bar.
4. THE Blog SHALL hiển thị thanh navigation gồm các mục: Trang chủ, Bài viết, Dự án, Kinh nghiệm, Giới thiệu, Liên hệ, cùng biểu tượng tìm kiếm và biểu tượng chuyển đổi theme.
5. THE Blog SHALL hiển thị tối đa 5 bài viết mới nhất (hoặc tất cả nếu tổng số bài viết ít hơn 5) trong phần "Bài viết mới nhất" ở cột chính của trang chủ, sắp xếp theo thời gian đăng mới nhất.
6. WHEN Visitor nhấn vào link "Xem tất cả →" trong phần bài viết mới nhất, THE Blog SHALL điều hướng đến trang Bài viết.
7. THE Blog SHALL hiển thị Sidebar trên trang chủ bao gồm 4 widget: Giới thiệu, Kỹ năng chính, Danh mục và Bài viết gần đây (tối đa 5 bài).

---

### Yêu cầu 2: Hiển thị và Danh sách Bài viết

**User Story:** Là một Visitor, tôi muốn xem danh sách tất cả bài viết và lọc theo danh mục, để tôi có thể nhanh chóng tìm các bài viết phù hợp với chủ đề tôi quan tâm.

#### Tiêu chí chấp nhận

1. THE Blog SHALL hiển thị mỗi Article trong danh sách với các thông tin: ảnh thumbnail, nhãn category có màu sắc riêng biệt theo từng danh mục, tiêu đề, mô tả ngắn (tối đa 150 ký tự, cắt bớt nếu dài hơn), ngày đăng, số bình luận và nút "Xem chi tiết" điều hướng.
2. WHEN Visitor truy cập trang Bài viết, THE Blog SHALL hiển thị toàn bộ danh sách Article đã xuất bản được sắp xếp theo thời gian đăng từ mới nhất đến cũ nhất, với bộ lọc danh mục mặc định là "Tất cả".
3. WHEN Visitor chọn một Category từ bộ lọc danh mục, THE Blog SHALL chỉ hiển thị các Article thuộc Category đó.
4. WHEN Visitor nhấn vào một Article trong danh sách, THE Blog SHALL điều hướng đến trang chi tiết của Article đó.
5. WHEN Visitor truy cập trang Bài viết, THE Blog SHALL hiển thị số lượng bài viết trong mỗi Category ở widget Danh mục trong Sidebar.
6. WHEN Visitor chọn một Category từ bộ lọc và Category đó không có Article nào, THE Blog SHALL hiển thị thông báo "Không có bài viết nào trong danh mục này."

---

### Yêu cầu 3: Trang chi tiết Bài viết

**User Story:** Là một Visitor, tôi muốn đọc nội dung đầy đủ của một bài viết với trải nghiệm đọc thoải mái, để tôi có thể tiếp thu kiến thức được chia sẻ.

#### Tiêu chí chấp nhận

1. THE Blog SHALL hiển thị trang chi tiết Article bao gồm: tiêu đề, ảnh thumbnail, tên hiển thị và ảnh đại diện của tác giả, ngày đăng, danh mục, tags, và toàn bộ nội dung bài viết được render từ định dạng Markdown (hỗ trợ tối thiểu: heading, bold, italic, list, code block, blockquote, link, image).
2. IF nội dung Article có ít nhất một heading (h2 hoặc h3), THEN THE Blog SHALL hiển thị mục lục (table of contents) tự động sinh từ các heading đó, cho phép Visitor nhấn để cuộn đến phần tương ứng. IF Article không có heading nào, THEN THE Blog SHALL ẩn mục lục.
3. THE Blog SHALL hiển thị tối đa 5 bài viết liên quan ở cuối trang chi tiết Article, ưu tiên theo Tags trùng nhau trước, sau đó Category trùng nhau, sau đó theo ngày mới nhất. IF không có bài viết nào liên quan, THEN THE Blog SHALL ẩn phần bài viết liên quan.
4. WHEN Visitor truy cập trang chi tiết Article, THE Blog SHALL hiển thị phần Comment_System bên dưới nội dung bài viết.
5. WHEN Visitor nhấn nút chia sẻ lên một mạng xã hội (Facebook, Twitter/X, LinkedIn) trên trang chi tiết Article, THE Blog SHALL mở cửa sổ chia sẻ với URL bài viết và tiêu đề bài viết được điền sẵn.

---

### Yêu cầu 4: Hệ thống Bình luận

**User Story:** Là một Visitor, tôi muốn đọc và gửi bình luận dưới bài viết, để tôi có thể trao đổi với tác giả và các độc giả khác.

#### Tiêu chí chấp nhận

1. WHEN Visitor truy cập trang chi tiết Article, THE Comment_System SHALL hiển thị danh sách tất cả Comment đã được duyệt của Article đó, sắp xếp theo thời gian từ cũ nhất đến mới nhất.
2. WHEN Visitor truy cập trang chi tiết Article, THE Comment_System SHALL hiển thị biểu mẫu gửi bình luận gồm các trường bắt buộc: tên (tối đa 100 ký tự), email (đúng định dạng, tối đa 254 ký tự) và nội dung bình luận (tối đa 1000 ký tự).
3. WHEN Visitor điền đầy đủ tên, email hợp lệ và nội dung bình luận rồi gửi, THE Comment_System SHALL lưu Comment với trạng thái "chờ duyệt" và hiển thị thông báo xác nhận rằng bình luận đang chờ duyệt.
4. IF Visitor gửi biểu mẫu bình luận với trường bắt buộc bị bỏ trống hoặc email không hợp lệ, THEN THE Comment_System SHALL hiển thị thông báo lỗi inline ngay bên dưới từng trường không hợp lệ và không gửi dữ liệu lên server.
5. WHEN Admin duyệt một Comment trong Admin_Panel, THE Comment_System SHALL cập nhật trạng thái Comment sang "đã duyệt" và hiển thị Comment đó công khai dưới Article tương ứng.
6. WHEN Admin từ chối một Comment trong Admin_Panel, THE Comment_System SHALL xóa vĩnh viễn Comment đó khỏi hệ thống và không hiển thị công khai, đồng thời hiển thị thông báo xác nhận cho Admin.
7. WHEN một Article chưa có Comment nào được duyệt, THE Comment_System SHALL hiển thị thông báo "Chưa có bình luận nào. Hãy là người đầu tiên bình luận!"

---

### Yêu cầu 5: Tìm kiếm Bài viết

**User Story:** Là một Visitor, tôi muốn tìm kiếm bài viết theo từ khóa, để tôi có thể nhanh chóng tìm thấy nội dung mình cần.

#### Tiêu chí chấp nhận

1. WHEN Visitor nhấn vào biểu tượng tìm kiếm trên navigation, THE Blog SHALL hiển thị thanh tìm kiếm.
2. WHEN Visitor nhập từ khóa có độ dài từ 2 đến 100 ký tự vào thanh tìm kiếm và nhấn Enter hoặc nút tìm kiếm, THE Search_Engine SHALL tìm kiếm trong tiêu đề, mô tả ngắn và nội dung của tất cả Article đã xuất bản.
3. WHEN Search_Engine hoàn thành tìm kiếm, THE Search_Engine SHALL hiển thị tối đa 20 kết quả phù hợp, mỗi kết quả bao gồm tiêu đề, mô tả ngắn (tối đa 160 ký tự) và ngày đăng.
4. IF từ khóa tìm kiếm không khớp với bất kỳ Article nào, THEN THE Search_Engine SHALL hiển thị thông báo cho biết không có bài viết nào phù hợp với từ khóa đã nhập.
5. IF Visitor nhập từ khóa ít hơn 2 ký tự hoặc chỉ chứa khoảng trắng và kích hoạt tìm kiếm, THEN THE Search_Engine SHALL hiển thị thông báo lỗi yêu cầu nhập ít nhất 2 ký tự và không thực hiện tìm kiếm.
6. WHEN Visitor nhấn vào một kết quả tìm kiếm, THE Blog SHALL điều hướng đến trang chi tiết Article tương ứng.

---

### Yêu cầu 6: Chuyển đổi Giao diện Sáng/Tối

**User Story:** Là một Visitor, tôi muốn chuyển đổi giữa giao diện sáng và tối, để tôi có trải nghiệm đọc phù hợp với môi trường và sở thích cá nhân.

#### Tiêu chí chấp nhận

1. THE Theme_Manager SHALL hiển thị biểu tượng chuyển đổi theme (mặt trời khi đang ở dark mode, mặt trăng khi đang ở light mode) trên navigation bar.
2. WHEN Visitor nhấn vào biểu tượng chuyển đổi theme, THE Theme_Manager SHALL chuyển đổi màu nền, màu chữ, màu border và màu nền các thành phần UI (navigation, sidebar, card, footer) trên toàn bộ Blog giữa light mode và dark mode ngay lập tức.
3. WHEN Visitor thay đổi theme, THE Theme_Manager SHALL lưu lựa chọn theme vào localStorage của trình duyệt với key `theme`.
4. WHEN Visitor quay lại Blog sau khi đóng trình duyệt và localStorage có chứa giá trị `theme` hợp lệ, THE Theme_Manager SHALL tải lại theme đã được lưu. IF localStorage không có giá trị `theme` hoặc giá trị không hợp lệ, THEN THE Theme_Manager SHALL áp dụng theme theo quy tắc ở tiêu chí 5.
5. WHERE Visitor truy cập Blog lần đầu tiên (localStorage chưa có giá trị `theme`) và thiết bị của Visitor có cài đặt hệ thống ưu tiên dark mode (prefers-color-scheme: dark), THE Theme_Manager SHALL áp dụng dark mode làm theme mặc định. Ngược lại, THE Theme_Manager SHALL áp dụng light mode.

---

### Yêu cầu 7: Trang Dự án (Portfolio)

**User Story:** Là một Visitor, tôi muốn xem các dự án cá nhân của chủ blog, để tôi có thể đánh giá kỹ năng và kinh nghiệm thực tế của họ.

#### Tiêu chí chấp nhận

1. WHEN Visitor truy cập trang Dự án, THE Blog SHALL hiển thị danh sách các Project, mỗi Project bao gồm: tên dự án, ảnh minh họa, mô tả ngắn (tối đa 200 ký tự), danh sách công nghệ sử dụng (dạng tags) và liên kết đến mã nguồn (GitHub) hoặc demo (hoặc cả hai nếu có).
2. WHEN Visitor nhấn vào liên kết GitHub hoặc Demo của một Project, THE Blog SHALL mở liên kết trong tab mới của trình duyệt.
3. THE Blog SHALL hiển thị danh sách Project theo thứ tự số thứ tự (sort order) do Admin chỉ định trong Admin_Panel, từ nhỏ đến lớn.

---

### Yêu cầu 8: Trang Kinh nghiệm (Timeline)

**User Story:** Là một Visitor, tôi muốn xem lịch sử học tập và kinh nghiệm làm việc của chủ blog dưới dạng timeline, để tôi có thể hiểu hành trình phát triển nghề nghiệp của họ.

#### Tiêu chí chấp nhận

1. WHEN Visitor truy cập trang Kinh nghiệm, THE Blog SHALL hiển thị danh sách các mục Experience dưới dạng timeline dọc, mỗi mục bao gồm: tên tổ chức/trường học, vai trò/chức danh, khoảng thời gian (tháng/năm bắt đầu – tháng/năm kết thúc, hiển thị "Hiện tại" nếu chưa kết thúc) và mô tả chi tiết (tối đa 500 ký tự).
2. THE Blog SHALL sắp xếp các mục Experience theo thứ tự thời gian từ mới nhất (ngày bắt đầu lớn nhất) đến cũ nhất.
3. THE Blog SHALL phân biệt trực quan các mục thuộc loại "Làm việc" và loại "Học tập" trong timeline bằng cả màu sắc riêng biệt lẫn biểu tượng khác nhau (ví dụ: biểu tượng briefcase cho "Làm việc", biểu tượng sách/graduation cap cho "Học tập").
4. IF không có mục Experience nào được cấu hình, THEN THE Blog SHALL hiển thị thông báo "Chưa có thông tin kinh nghiệm."

---

### Yêu cầu 9: Trang Giới thiệu (About)

**User Story:** Là một Visitor, tôi muốn đọc thông tin chi tiết về chủ blog, để tôi có thể hiểu rõ hơn về cá nhân, kỹ năng và mục tiêu của họ.

#### Tiêu chí chấp nhận

1. WHEN Visitor truy cập trang Giới thiệu, THE Blog SHALL hiển thị ảnh đại diện, tiểu sử cá nhân (tối đa 1000 ký tự), danh sách kỹ năng kỹ thuật (tối đa 20 kỹ năng) và danh sách kỹ năng mềm (tối đa 10 kỹ năng).
2. WHEN Visitor truy cập trang Giới thiệu, THE Blog SHALL hiển thị mỗi kỹ năng kỹ thuật dưới dạng tag có nhãn tên kỹ năng hoặc thanh tiến độ có nhãn tên kỹ năng và phần trăm từ 1 đến 100.
3. WHEN Visitor truy cập trang Giới thiệu, THE Blog SHALL hiển thị ít nhất một liên kết đến trang Liên hệ và ít nhất một liên kết đến hồ sơ mạng xã hội; khi Visitor nhấn vào liên kết mạng xã hội, trình duyệt SHALL mở liên kết trong tab mới.

---

### Yêu cầu 10: Trang Liên hệ

**User Story:** Là một Visitor, tôi muốn gửi tin nhắn liên hệ đến chủ blog, để tôi có thể đặt câu hỏi hoặc đề xuất hợp tác.

#### Tiêu chí chấp nhận

1. THE Blog SHALL hiển thị trang Liên hệ với Contact_Form gồm các trường bắt buộc: họ tên (tối đa 100 ký tự), địa chỉ email (tối đa 254 ký tự, đúng định dạng RFC 5322), tiêu đề (tối đa 150 ký tự) và nội dung tin nhắn (tối đa 2000 ký tự).
2. WHEN Visitor điền đầy đủ thông tin hợp lệ vào Contact_Form và nhấn gửi, THE Contact_Form SHALL gửi email thông báo đến địa chỉ email của Admin và hiển thị thông báo xác nhận gửi thành công cho Visitor.
3. IF Visitor gửi Contact_Form với trường bắt buộc bị bỏ trống hoặc email không đúng định dạng, THEN THE Contact_Form SHALL hiển thị thông báo lỗi inline ngay bên dưới từng trường không hợp lệ và không gửi dữ liệu lên server.
4. IF Contact_Form gặp lỗi server khi gửi, THEN THE Contact_Form SHALL giữ nguyên dữ liệu đã nhập của Visitor và hiển thị thông báo lỗi yêu cầu thử lại.
5. THE Blog SHALL hiển thị thông tin liên hệ trực tiếp của Admin (địa chỉ email và các liên kết mạng xã hội) bên cạnh Contact_Form trên trang Liên hệ.

---

### Yêu cầu 11: Giao diện Responsive

**User Story:** Là một Visitor, tôi muốn truy cập blog trên mọi thiết bị (điện thoại, máy tính bảng, máy tính), để tôi có thể đọc bài viết mọi lúc mọi nơi.

#### Tiêu chí chấp nhận

1. THE Blog SHALL hiển thị nội dung trên các kích thước màn hình: mobile (dưới 768px), tablet (768px–1024px) và desktop (trên 1024px) mà không có nội dung bị tràn ra ngoài viewport theo chiều ngang và không xuất hiện thanh cuộn ngang.
2. WHEN Visitor truy cập Blog trên thiết bị mobile, THE Blog SHALL thay thế navigation bar bằng biểu tượng hamburger; WHEN Visitor nhấn biểu tượng hamburger, THE Blog SHALL mở menu điều hướng dạng dropdown hoặc overlay; WHEN Visitor chọn một mục menu hoặc nhấn ra ngoài vùng menu, THE Blog SHALL đóng menu.
3. WHEN Visitor truy cập Blog trên thiết bị mobile, THE Blog SHALL hiển thị layout 1 cột thay vì 2 cột, với Sidebar xuất hiện bên dưới nội dung chính.
4. THE Blog SHALL đảm bảo tất cả ảnh thumbnail được hiển thị với thuộc tính `object-fit: contain` hoặc `object-fit: cover` để không bị méo tỉ lệ và không bị tràn ra ngoài container trên mọi kích thước màn hình.

---

### Yêu cầu 12: Tối ưu SEO

**User Story:** Là một Visitor đến từ công cụ tìm kiếm, tôi muốn tìm thấy các bài viết trong blog thông qua Google, để tôi có thể tiếp cận kiến thức hữu ích từ blog này.

#### Tiêu chí chấp nhận

1. THE SEO_Manager SHALL sinh meta title (tối đa 60 ký tự) và meta description (tối đa 160 ký tự) riêng biệt cho mỗi trang: trang chủ, trang danh sách bài viết, trang chi tiết Article, trang Dự án, trang Giới thiệu và trang Liên hệ.
2. THE SEO_Manager SHALL sinh các thẻ Open Graph (og:title, og:description, og:image, og:url, og:type) cho mỗi Article; IF Article không có ảnh thumbnail, THEN THE SEO_Manager SHALL sử dụng ảnh mặc định của Blog làm giá trị og:image.
3. WHEN Admin xuất bản hoặc hủy xuất bản một Article, THE SEO_Manager SHALL cập nhật sitemap.xml tự động, liệt kê tất cả URL công khai của Blog kèm thuộc tính `lastmod` là thời điểm cập nhật gần nhất.
4. THE Blog SHALL sử dụng cấu trúc URL thân thiện dạng `/bai-viet/[slug-bai-viet]` cho trang chi tiết Article, trong đó slug chỉ chứa ký tự chữ thường, số và dấu gạch ngang.
5. THE Blog SHALL sử dụng đúng một thẻ h1 duy nhất trên mỗi trang, và các thẻ heading con (h2, h3, ...) phải lồng nhau đúng thứ bậc để hỗ trợ SEO.
6. THE SEO_Manager SHALL chèn thẻ canonical URL (`<link rel="canonical">`) vào phần `<head>` của mỗi trang, trỏ đến URL chính thức của trang đó.

---

### Yêu cầu 13: Admin Panel - Quản lý Bài viết

**User Story:** Là Admin, tôi muốn tạo, chỉnh sửa và xóa bài viết thông qua giao diện quản trị, để tôi có thể duy trì và cập nhật nội dung blog.

#### Tiêu chí chấp nhận

1. WHEN Visitor truy cập đường dẫn Admin_Panel, THE Admin_Panel SHALL yêu cầu đăng nhập bằng tên đăng nhập và mật khẩu trước khi cho phép truy cập.
2. IF Admin nhập sai thông tin đăng nhập quá 5 lần liên tiếp, THEN THE Admin_Panel SHALL khóa đăng nhập trong 15 phút và hiển thị thông báo thời gian chờ còn lại (cập nhật mỗi phút).
3. THE Admin_Panel SHALL cung cấp trình soạn thảo bài viết hỗ trợ định dạng Markdown với chức năng xem trước (preview) nội dung được render theo thời gian thực.
4. WHEN Admin tạo hoặc chỉnh sửa một Article, THE Admin_Panel SHALL cho phép Admin nhập: tiêu đề (bắt buộc), slug URL duy nhất (bắt buộc, hệ thống tự sinh từ tiêu đề nhưng có thể chỉnh sửa), nội dung Markdown, mô tả ngắn, ảnh thumbnail, danh mục và tags.
5. WHEN Admin cố lưu một Article với tiêu đề bỏ trống hoặc slug trùng với Article đã tồn tại, THEN THE Admin_Panel SHALL hiển thị thông báo lỗi tương ứng và không lưu Article.
6. WHEN Admin lưu một Article ở trạng thái "đã xuất bản", THE Admin_Panel SHALL hiển thị Article đó công khai trên Blog.
7. WHEN Admin lưu một Article ở trạng thái "nháp", THE Admin_Panel SHALL không hiển thị Article đó cho Visitor.
8. WHEN Admin xóa một Article và xác nhận trong hộp thoại xác nhận, THE Admin_Panel SHALL xóa vĩnh viễn Article đó khỏi hệ thống và cập nhật danh sách bài viết.

---

### Yêu cầu 14: Admin Panel - Quản lý Danh mục và Tags

**User Story:** Là Admin, tôi muốn quản lý danh mục và tags của bài viết, để tôi có thể tổ chức nội dung blog một cách có hệ thống.

#### Tiêu chí chấp nhận

1. THE Admin_Panel SHALL cho phép Admin tạo, chỉnh sửa và xóa Category; mỗi Category có tên và màu sắc hiển thị.
2. WHEN Admin xóa một Category đang có Article liên kết, THE Admin_Panel SHALL hiển thị cảnh báo số lượng Article bị ảnh hưởng và yêu cầu Admin chọn Category thay thế; IF Admin không chọn Category thay thế và xác nhận xóa, THEN THE Admin_Panel SHALL chuyển các Article đó sang trạng thái "Không có danh mục".
3. THE Admin_Panel SHALL cho phép Admin tạo, chỉnh sửa và xóa Tag; WHEN Admin xóa một Tag, THE Admin_Panel SHALL gỡ Tag đó khỏi tất cả Article đang liên kết mà không xóa các Article đó.
4. THE Admin_Panel SHALL hiển thị số lượng Article liên kết với mỗi Category và Tag trong giao diện quản lý.

---

### Yêu cầu 15: Hiệu suất Tải trang

**User Story:** Là một Visitor, tôi muốn trang blog tải nhanh, để tôi không phải chờ đợi lâu khi duyệt nội dung.

#### Tiêu chí chấp nhận

1. WHEN Visitor truy cập trang chủ Blog trên kết nối internet có băng thông tối thiểu 10 Mbps, THE Blog SHALL đạt chỉ số First Contentful Paint (FCP) dưới 3 giây, trong đó "nội dung chính" được định nghĩa là văn bản above-the-fold và các thumbnail hiển thị trong viewport đầu tiên.
2. THE Blog SHALL áp dụng lazy loading cho tất cả ảnh thumbnail nằm ngoài viewport ban đầu, chỉ tải ảnh khi ảnh cách viewport dưới 200px.
3. WHEN Admin tải ảnh lên thông qua Admin_Panel, THE Blog SHALL nén ảnh để kích thước file xuống dưới 500KB trong khi vẫn giữ kích thước hiển thị tối thiểu 800×600px cho ảnh ngang (hoặc giữ nguyên kích thước gốc nếu nhỏ hơn giới hạn này).
4. WHEN Admin tải lên một file không phải định dạng ảnh (JPEG, PNG, WebP, GIF) hoặc file ảnh vượt quá 10MB trước khi nén, THEN THE Admin_Panel SHALL hiển thị thông báo lỗi và từ chối file đó.
