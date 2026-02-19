import { useState, useEffect } from 'react';
import { getNews } from '../../services/newsService';
import NewsCard from '../../components/News/NewsCard';
import NewsSkeleton from '../../components/News/NewsSkeleton';
import Breadcrumbs from '../../components/Common/Breadcrumbs';

const NewsListPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchNews();
    }, [page]);

    const fetchNews = async () => {
        try {
            if (page === 1) setLoading(true);
            const response = await getNews(page);

            setNews(prev => page === 1 ? response.data : [...prev, ...response.data]);
            setHasMore(news.length + response.data.length < response.total);
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbItems = [
        { label: 'Tin tức', link: '/news' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs items={breadcrumbItems} />

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Tin Tức & Sự Kiện
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Cập nhật những thông tin mới nhất về tuyển sinh, hướng nghiệp và xu hướng giáo dục.
                    </p>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading && page === 1 ? (
                        // Show skeletons on first load
                        Array(6).fill(0).map((_, idx) => <NewsSkeleton key={idx} />)
                    ) : (
                        <>
                            {news.map(item => (
                                <NewsCard key={item.id} news={item} />
                            ))}
                            {/* Show skeletons for loading more */}
                            {loading && page > 1 && Array(3).fill(0).map((_, idx) => <NewsSkeleton key={`more-${idx}`} />)}
                        </>
                    )}
                </div>

                {/* Load More Button */}
                {hasMore && !loading && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-red-600 hover:text-red-600 transition-all shadow-sm"
                        >
                            Xem thêm tin cũ hơn
                        </button>
                    </div>
                )}

                {!hasMore && news.length > 0 && (
                    <div className="text-center mt-12 text-gray-500 text-sm">
                        Bạn đã xem hết tin tức.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsListPage;
