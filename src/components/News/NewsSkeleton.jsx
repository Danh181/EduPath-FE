const NewsSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200 w-full relative">
                <div className="absolute top-4 left-4 h-6 w-24 bg-gray-300 rounded-full"></div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Date */}
                <div className="h-3 w-32 bg-gray-200 rounded mb-4"></div>

                {/* Title */}
                <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-2/3 bg-gray-200 rounded mb-4"></div>

                {/* Excerpt */}
                <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded mb-4"></div>

                {/* Button */}
                <div className="h-4 w-20 bg-gray-200 rounded mt-auto"></div>
            </div>
        </div>
    );
};

export default NewsSkeleton;
