import { useState, useEffect } from 'react';
import SuccessDialog from './SuccessDialog';

export default function ReviewSystem({ mealId, mealName }) {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    name: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${mealId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // Generate some initial mock reviews
      const mockReviews = generateMockReviews(mealId, mealName);
      setReviews(mockReviews);
      localStorage.setItem(`reviews_${mealId}`, JSON.stringify(mockReviews));
      // Dispatch event to update rating display
      window.dispatchEvent(new CustomEvent('reviewsUpdated'));
    }
  }, [mealId, mealName]);

  // Generate mock reviews for demonstration
  function generateMockReviews(id, name) {
    const reviewTemplates = [
      {
        rating: 5,
        title: "Absolutely delicious!",
        comment: "This dish exceeded my expectations. The flavors were perfectly balanced and the presentation was beautiful.",
        name: "Sarah M.",
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        rating: 4,
        title: "Great taste, good portion",
        comment: "Really enjoyed this meal. The ingredients were fresh and the cooking was spot on. Would definitely order again.",
        name: "Mike R.",
        date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        rating: 5,
        title: "Perfect comfort food",
        comment: "This is exactly what I was craving. Warm, satisfying, and made with care. Highly recommend!",
        name: "Emma L.",
        date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        rating: 4,
        title: "Solid choice",
        comment: "Good quality ingredients and well-prepared. The portion size was generous and the price was fair.",
        name: "David K.",
        date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        rating: 3,
        title: "Decent but not amazing",
        comment: "It was okay, nothing special but not bad either. The taste was good but I expected more based on the description.",
        name: "Lisa P.",
        date: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Return 2-4 random reviews
    const numReviews = Math.floor(Math.random() * 3) + 2;
    return reviewTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, numReviews)
      .map((review, index) => ({
        ...review,
        id: `${id}_${index}`,
        helpful: Math.floor(Math.random() * 15) + 1
      }));
  }

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Get rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100
      : 0
  }));

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === 'all' || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  function handleSubmitReview(e) {
    e.preventDefault();
    
    if (!newReview.name.trim() || !newReview.title.trim() || !newReview.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const review = {
      ...newReview,
      id: `${mealId}_${Date.now()}`,
      date: new Date().toISOString(),
      helpful: 0
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${mealId}`, JSON.stringify(updatedReviews));
    
    // Dispatch event to update rating display
    window.dispatchEvent(new CustomEvent('reviewsUpdated'));

    // Reset form
    setNewReview({
      rating: 5,
      title: '',
      comment: '',
      name: ''
    });
    setShowReviewForm(false);
    
    // Show success dialog
    setShowSuccessDialog(true);
  }

  function handleHelpfulClick(reviewId) {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    );
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${mealId}`, JSON.stringify(updatedReviews));
  }

  function renderStars(rating, interactive = false, onRatingChange = null) {
    return (
      <div className={`stars ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  return (
    <>
      <div className="review-system">
        <div className="review-summary">
          <div className="rating-overview">
            <div className="average-rating">
              <span className="rating-number">{averageRating}</span>
              {renderStars(Math.round(averageRating))}
              <span className="review-count">({reviews.length} reviews)</span>
            </div>
            
            <div className="rating-breakdown">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating}★</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="rating-count">({count})</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="write-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Write Your Review</h3>
            
            <div className="form-group">
              <label>Your Rating</label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>

            <div className="form-group">
              <label htmlFor="review-name">Your Name</label>
              <input
                id="review-name"
                type="text"
                value={newReview.name}
                onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="review-title">Review Title</label>
              <input
                id="review-title"
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="review-comment">Your Review</label>
              <textarea
                id="review-comment"
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Tell us about your experience with this dish..."
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowReviewForm(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-review">
                Submit Review
              </button>
            </div>
          </form>
        )}

        <div className="reviews-section">
          <div className="reviews-header">
            <h3>Customer Reviews</h3>
            
            <div className="review-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>

              <select 
                value={filterRating} 
                onChange={(e) => setFilterRating(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="reviews-list">
            {filteredAndSortedReviews.length === 0 ? (
              <p className="no-reviews">No reviews match your criteria.</p>
            ) : (
              filteredAndSortedReviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-date">{formatDate(review.date)}</span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-comment">{review.comment}</p>
                  
                  <div className="review-actions">
                    <button 
                      className="helpful-btn"
                      onClick={() => handleHelpfulClick(review.id)}
                    >
                      👍 Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Review Submitted Successfully!"
        message="Thank you for sharing your experience! Your review helps other customers make informed decisions."
        type="success"
      />
    </>
  );
} 