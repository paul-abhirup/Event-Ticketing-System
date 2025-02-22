const validateBid = (bid) => {
  if (!bid.token_id || !bid.amount || !bid.bidder_address) {
    throw new Error("Invalid bid data");
  }
};

const validateListing = (listing) => {
  if (!listing.token_id || !listing.price || !listing.seller_address) {
    throw new Error("Invalid listing data");
  }
};

module.exports = {
  validateBid,
  validateListing,
};
