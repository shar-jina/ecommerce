import React from 'react';

const PostCard = ({ post }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {post.image && (
                <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 backdrop-blur-sm text-xs font-bold rounded-full shadow-sm uppercase tracking-wider ${
                            post.category === 'Offer' ? 'bg-green-500/80 text-white' :
                            post.category === 'Update' ? 'bg-blue-500/80 text-white' :
                            'bg-purple-500/80 text-white'
                        }`}>
                            {post.category}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-gray-400 mb-2 font-medium">
                    {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.content}
                </p>
                <div className="mt-auto">
                    <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                        Read Full Story
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
