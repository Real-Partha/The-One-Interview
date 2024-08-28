import { Skeleton } from '@mui/material';
const ThreadSkeleton = () => {
    return (
        <div className="thread-card">
            <h3 className="thread-title"><Skeleton variant="text" /></h3>
            <p className="thread-answer-preview"><Skeleton variant="text" /></p>
            <div className="thread-info">
                <Skeleton variant="circular" width={50} height={50} style={{ marginRight: '1rem' }} />
                <div className="thread-details">
                    <p className="thread-meta" style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="username" style={{ marginRight: '0.6rem', marginBottom: "0.2rem" }}>
                            <Skeleton variant="rounded" width={80} height={10} />
                        </span>
                        <span className="date" style={{ marginRight: '0.1rem', marginBottom: "0.2rem" }}>
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
                <p className="view-message">
                    <Skeleton variant="rounded" width={300} height={10} />
                </p>
                <div className="thread-views">
                    <i className="fa-solid fa-eye"></i>
                    <span style={{ width: '100%' }}><Skeleton variant="rounded" width={20} height={10} /></span>
                </div>
            </div>
        </div>
    );
};

export default ThreadSkeleton;