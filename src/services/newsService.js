import { generateSlug } from '../utils/stringUtils';

// Mock Data
const MOCK_NEWS = [
    {
        id: 1,
        title: "Công bố phương án tuyển sinh đại học chính quy năm 2026",
        slug: "cong-bo-phuong-an-tuyen-sinh-dai-hoc-chinh-quy-nam-2026",
        category: "Tuyển sinh",
        date: "2026-05-19",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        excerpt: "Bộ Giáo dục và Đào tạo chính thức công bố quy chế tuyển sinh mới với nhiều thay đổi quan trọng về phương thức xét tuyển và tổ chức thi, nhằm nâng cao chất lượng đầu vào.",
        content: `
      <p>Bộ Giáo dục và Đào tạo vừa chính thức công bố phương án tuyển sinh đại học, cao đẳng hệ chính quy năm 2026. Theo đó, kỳ thi tốt nghiệp THPT năm nay sẽ tiếp tục được tổ chức theo hướng ổn định, đảm bảo tính chính xác, khách quan và công bằng.</p>
      
      <h3>Những điểm mới đáng chú ý</h3>
      <p>Một trong những điểm mới quan trọng là việc tăng cường ứng dụng công nghệ thông tin trong khâu đăng ký xét tuyển. Thí sinh sẽ được đăng ký nguyện vọng trực tuyến 100% trên Cổng thông tin tuyển sinh quốc gia.</p>
      
      <h3>Các phương thức xét tuyển</h3>
      <p>Các trường đại học vẫn duy trì đa dạng phương thức xét tuyển như:</p>
      <ul>
        <li>Xét tuyển thẳng theo quy chế của Bộ GD&ĐT.</li>
        <li>Xét tuyển dựa trên kết quả thi tốt nghiệp THPT.</li>
        <li>Xét tuyển dựa trên kết quả học tập THPT (Học bạ).</li>
        <li>Xét tuyển dựa trên kết quả các kỳ thi đánh giá năng lực, đánh giá tư duy.</li>
      </ul>
      
      <p>Các thí sinh cần lưu ý theo dõi thông tin chi tiết từ các trường đại học mục tiêu để có chiến lược đăng ký hiệu quả nhất.</p>
    `,
        author: "Ban Giáo Dục",
        relatedIds: [2, 3]
    },
    {
        id: 2,
        title: "Top 5 học bổng toàn phần dành cho sinh viên khối ngành CNTT",
        slug: "top-5-hoc-bong-toan-phan-danh-cho-sinh-vien-khoi-nganh-cntt",
        category: "Học bổng",
        date: "2026-05-18",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        excerpt: "Tổng hợp các chương trình học bổng giá trị từ các tập đoàn công nghệ lớn và các trường đại học danh tiếng trong nước, mở ra cơ hội học tập miễn phí.",
        content: `
      <p>Ngành công nghệ thông tin (CNTT) luôn là một trong những ngành học "hot" nhất hiện nay. Để khuyến khích nhân tài, nhiều tổ chức và trường đại học đã tung ra các gói học bổng hấp dẫn.</p>
      
      <h3>1. Học bổng Tài năng Công nghệ Vingroup</h3>
      <p>Dành cho các sinh viên xuất sắc với giá trị lên tới 100% học phí và sinh hoạt phí.</p>
      
      <h3>2. Học bổng RMIT Technology Scholarship</h3>
      <p>Dành cho sinh viên đăng ký các ngành IT tại đại học RMIT Việt Nam, bao gồm toàn bộ học phí chương trình đại học.</p>
      
      <h3>3. Học bổng FPT University Talent</h3>
      <p>Đại học FPT trao tặng hàng trăm suất học bổng toàn phần và bán phần cho các thí sinh có thành tích học tập tốt hoặc đạt giải trong các kỳ thi học sinh giỏi.</p>
      
      <p>Để săn được các học bổng này, ngoài thành tích học tập, các bạn cần chuẩn bị hồ sơ năng lực (portfolio), chứng chỉ tiếng Anh và kỹ năng phỏng vấn tốt.</p>
    `,
        author: "Minh Tú",
        relatedIds: [1, 3]
    },
    {
        id: 3,
        title: "Xu hướng nghề nghiệp 2026: Những ngành nghề nào sẽ lên ngôi?",
        slug: "xu-huong-nghe-nghiep-2026-nhung-nganh-nghe-nao-se-len-ngoi",
        category: "Hướng nghiệp",
        date: "2026-05-15",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        excerpt: "Báo cáo mới nhất về thị trường lao động cho thấy sự dịch chuyển mạnh mẽ sang các nhóm ngành liên quan đến trí tuệ nhân tạo, năng lượng tái tạo và chăm sóc sức khỏe.",
        content: `
      <p>Thế giới đang thay đổi nhanh chóng với sự bùng nổ của công nghệ AI và xu hướng phát triển bền vững. Điều này tác động mạnh mẽ đến nhu cầu nhân lực trong tương lai gần.</p>
      
      <h3>1. Trí tuệ nhân tạo (AI) và Khoa học dữ liệu</h3>
      <p>Không ngạc nhiên khi đây là nhóm ngành đứng đầu bảng. Nhu cầu về kỹ sư AI, chuyên gia phân tích dữ liệu đang tăng trưởng theo cấp số nhân.</p>
      
      <h3>2. Năng lượng tái tạo & Môi trường</h3>
      <p>Với cam kết Net Zero của chính phủ, các ngành liên quan đến kỹ thuật môi trường, năng lượng xanh đang rất khát nhân lực chất lượng cao.</p>
      
      <h3>3. Chăm sóc sức khỏe & Tâm lý học</h3>
      <p>Sau đại dịch, sự quan tâm đến sức khỏe thể chất và tinh thần ngày càng lớn, mở ra cơ hội cho các ngành Y, Dược, Tâm lý học trị liệu.</p>
      
      <p>Các bạn trẻ nên cân nhắc kỹ lưỡng sở thích và năng lực của bản thân kết hợp với xu hướng thị trường để đưa ra lựa chọn nghề nghiệp phù hợp nhất.</p>
    `,
        author: "TS. Lê Thẩm Dương",
        relatedIds: [2, 4]
    },
    {
        id: 4,
        title: "Bí quyết ôn thi THPT Quốc gia đạt điểm cao môn Toán",
        slug: "bi-quyet-on-thi-thpt-quoc-gia-dat-diem-cao-mon-toan",
        category: "Góc học tập",
        date: "2026-05-10",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        excerpt: "Chia sẻ từ thủ khoa khối A năm 2025 về phương pháp hệ thống kiến thức và rèn luyện kỹ năng giải nhanh trắc nghiệm môn Toán.",
        content: `
      <p>Môn Toán luôn là môn thi quan trọng trong kỳ thi THPT Quốc gia. Dưới đây là những chia sẻ từ các thủ khoa để giúp bạn đạt điểm tối đa.</p>
      
      <h3>Nắm chắc kiến thức cơ bản</h3>
      <p>Đừng vội lao vào giải các bài toán khó. Hãy chắc chắn rằng bạn đã nắm vững toàn bộ kiến thức trong sách giáo khoa. Các câu hỏi nhận biết và thông hiểu chiếm tới 60-70% số điểm.</p>
      
      <h3>Luyện đề có chiến thuật</h3>
      <p>Khi luyện đề, hãy bấm giờ như thi thật. Phân bổ thời gian hợp lý: 30 câu đầu làm trong 30 phút, các câu còn lại dành thời gian nhiều hơn.</p>
      
      <h3>Sử dụng Casio hiệu quả</h3>
      <p>Kỹ năng bấm máy tính cầm tay là vũ khí lợi hại để giải nhanh các bài toán trắc nghiệm. Hãy học các thủ thuật bấm máy để tiết kiệm thời gian.</p>
    `,
        author: "Nguyễn Văn A",
        relatedIds: [1]
    }
];

// Service Methods
export const getNews = async (page = 1, limit = 6) => {
    // Simulate API Network Delay
    return new Promise((resolve) => {
        setTimeout(() => {
            const start = (page - 1) * limit;
            const end = start + limit;
            const data = MOCK_NEWS.slice(start, end);

            resolve({
                data: data,
                total: MOCK_NEWS.length,
                page: page,
                totalPages: Math.ceil(MOCK_NEWS.length / limit)
            });
        }, 800); // 800ms delay
    });
};

export const getLatestNews = async (limit = 3) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_NEWS.slice(0, limit));
        }, 600);
    });
};

export const getNewsBySlug = async (slug) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const news = MOCK_NEWS.find(item => item.slug === slug);
            if (news) {
                resolve(news);
            } else {
                reject(new Error("News not found"));
            }
        }, 600);
    });
};

export const getRelatedNews = async (currentId, limit = 3) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const related = MOCK_NEWS.filter(item => item.id !== currentId).slice(0, limit);
            resolve(related);
        }, 500);
    });
};
