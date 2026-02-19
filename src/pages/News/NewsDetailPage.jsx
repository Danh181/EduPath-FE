import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsBySlug, getRelatedNews } from '../../services/newsService';
import { formatDate } from '../../utils/stringUtils';
import NewsCard from '../../components/News/NewsCard';
import NewsSkeleton from '../../components/News/NewsSkeleton';
import Breadcrumbs from '../../components/Common/Breadcrumbs';

const NewsDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            // Scroll to top when slug changes
            window.scrollTo(0, 0);

            try {
                const newsData = await getNewsBySlug(slug);
                setNews(newsData);

                const related = await getRelatedNews(newsData.id);
                setRelatedNews(related);
            } catch (err) {
                console.error("Error fetching news detail:", err);
                setError("Không tìm thấy bài viết này.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-24 px-4">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
                    <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 w-full bg-gray-200 rounded mb-8"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">😕 Mất dấu rồi!</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => navigate('/news')}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Quay lại trang tin tức
                </button>
            </div>
        );
    }

    if (!news) return null;

    const breadcrumbItems = [
        { label: 'Tin tức', link: '/news' },
        { label: news.title, link: null }
    ];

    return (
        <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-6 font-sans">
            <article className="max-w-4xl mx-auto">
                <Breadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {news.category}
                        </span>
                        <span>{formatDate(news.date)}</span>
                        <span>•</span>
                        <span>{news.author}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        {news.title}
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-red-500 pl-4 italic">
                        {news.excerpt}
                    </p>
                </header>

                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg mb-10">
                    <img src={news.image} alt={news.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg prose-red max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                ></div>

                {/* Related News */}
                <div className="mt-20 border-t border-gray-100 pt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <span className="w-1 h-8 bg-red-600 rounded"></span>
                        Tin liên quan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedNews.map(item => (
                            <NewsCard key={item.id} news={item} />
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default NewsDetailPage;
