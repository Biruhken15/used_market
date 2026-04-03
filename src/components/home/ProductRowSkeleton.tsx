import React from 'react';

export const ProductRowSkeleton = ({ title }: { title: string }) => {
    return (
        <section className="px-4 md:px-10 py-10 space-y-6">
            <div className="flex items-center justify-between">
                <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-20 bg-slate-100 rounded-md animate-pulse" />
            </div>
            
            <div className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i} 
                        className="min-w-[280px] h-[380px] bg-white rounded-[2rem] border border-slate-100 p-4 space-y-4 shadow-sm"
                    >
                        <div className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-slate-50 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between pt-4">
                            <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                            <div className="h-6 w-12 bg-slate-50 rounded-full animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
