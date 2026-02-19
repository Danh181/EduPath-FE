import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/stringUtils';

const NewsCard = ({ news }) => {
    // Determine badge color based on category (simple hash or preset)
    const getCategoryColor = (category) => {
        const map = {
            'Tuyển sinh': 'bg-red-600',
            'Học bổng': 'bg-emerald-600',
            'Hướng nghiệp': 'bg-blue-600',
            'Góc học tập': 'bg-purple-600'
        };
        return map[category] || 'bg-gray-600';
    };

    return (
        <Link
            to={`/news/${news.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer no-underline"
        >
            <div className="h-48 overflow-hidden relative">
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className={`absolute top-4 left-4 ${getCategoryColor(news.category)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase`}>
                    {news.category}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {formatDate(news.date)}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                    {news.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                    {news.excerpt}
                </p>

                <span className="text-red-600 text-sm font-bold mt-auto group-hover:underline flex items-center gap-1">
                    Đọc tiếp
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </span>
            </div>
        </Link>
    );
};

export default NewsCard;
