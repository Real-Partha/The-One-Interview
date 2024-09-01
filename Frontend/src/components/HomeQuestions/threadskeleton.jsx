import { Skeleton } from '@mui/material';
const ThreadSkeleton = () => {
    return (
        <div className="thread-card-link">
            <div className="thread-card" >
                <h3 className="thread-title"><Skeleton variant="text"  /></h3>
                <p className="thread-answer-preview">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                </p>
                <div className="thread-info">
                    <Skeleton variant="circular" width={50} height={50} style={{ marginRight: '1rem' }} />
                    <div className="thread-details">
                    <p className="thread-meta" style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="username">
                                <Skeleton variant="rounded" width={80} height={10} />
                            </span> •
                            <span className="date">
                                <Skeleton variant="rounded" width={80} height={10} />
                            </span>
                        </p>
                        <div className="thread-tags">
                            <span className="tag"><Skeleton variant="rounded" width={50} height={10} /></span>
                            <span className="tag"><Skeleton variant="rounded" width={50} height={10} /></span>
                            <span className="tag"><Skeleton variant="rounded" width={50} height={10} /></span>
                        </div>
                    </div>
                </div>
                <div className="thread-footer">
                    <div className="thread-votes">
                        <span className="upvotes">
                            <i className="fas fa-arrow-alt-circle-up"></i>{" "}
                            <Skeleton variant="rounded" width={70} height={10} />
                        </span>
                        <span className="downvotes">
                            <i className="fas fa-arrow-alt-circle-down"></i>{" "}
                            <Skeleton variant="rounded" width={70} height={10} />
                        </span>
                    </div>
                    <div className="thread-stats">
                        <div className="thread-views">
                            <i className="fa-solid fa-eye"></i>
                            <span><Skeleton variant="rounded" width={60} height={10} /></span>
                            <div className="thread-comments">
                                <i className="fa-solid fa-comments"></i>
                                <span><Skeleton variant="rounded" width={60} height={10} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreadSkeleton;