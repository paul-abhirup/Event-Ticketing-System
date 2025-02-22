CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    wallet_address TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    venue TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    seat_map JSONB,
    ipfs_cid TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id TEXT UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    owner_address TEXT NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    mint_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id TEXT REFERENCES tickets(token_id) ON DELETE CASCADE,
    price NUMERIC NOT NULL,
    seller_address TEXT NOT NULL,
    expiration TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id TEXT REFERENCES tickets(token_id) ON DELETE CASCADE,
    bidder_address TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE royalties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_address TEXT NOT NULL,
    token_id TEXT REFERENCES tickets(token_id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payout_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

