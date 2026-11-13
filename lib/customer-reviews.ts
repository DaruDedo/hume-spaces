type CustomerReview = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  productSku?: string;
};

// Add only customer reviews approved for publication. Use the catalogue SKU for product reviews.
export const publishedReviews: readonly CustomerReview[] = [];
