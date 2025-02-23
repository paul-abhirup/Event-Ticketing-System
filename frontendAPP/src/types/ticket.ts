export interface UserTicket {
  token_id: number;
  event_id: number;
  owner_address: string;
  event_name: string;
  event_date: string;
  venue: string;
  ipfs_cid: string;
  mint_date: string;
  is_used: boolean;
} 