const JotSkeletonLoader = () => {
    return (
        <div className="flex gap-1 pb-1" data-testid="loader">
            <div className="w-6 h-6 rounded-full animate-pulse bg-slate-300"></div>
            <div className="flex-auto h-6 rounded animate-pulse bg-slate-300"></div>
        </div>
    )
}

export default JotSkeletonLoader;