import React from 'react';

const PostCard = ({ post }) => {
    return (
        <div className="group relative flex flex-col h-full animate-fade-in bg-white rounded-retail shadow-retail hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100">
            {/* Image Container */}
            {post.image && (
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-50 border-b border-gray-50">
                    <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4">
                        <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm ${
                            post.category === 'Offer' ? 'bg-orange text-white' :
                            'bg-teal text-white'
                        }`}>
                            {post.category}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="p-6 flex flex-col flex-1">
                <div className="text-[9px] text-gray-400 mb-3 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
                <h3 className="text-xl font-bold text-onyx group-hover:text-teal transition-colors font-heading leading-tight mb-4">
                    {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-light mb-8">
                    {post.content}
                </p>
                <div className="mt-auto">
                    <button className="text-teal text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:gap-5 transition-all group-hover:text-orange">
                        Discover More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
