import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-101',
    listingId: 'gaace-101',
    reviewerName: 'Marcus Vance (Apex Capital)',
    rating: 5,
    comment: 'Exceptional penthouse suite! The butler service was immaculate and the UTC time credit transfer went through seamlessly in seconds.',
    timestamp: '2 days ago',
    verifiedTransaction: true,
    transactionId: 'tx-101'
  },
  {
    id: 'rev-102',
    listingId: 'gaace-101',
    reviewerName: 'Elena Rostova',
    rating: 5,
    comment: 'Used the meeting lounge for an urgent A2A investor presentation. High speed internet and quiet atmosphere. Highly recommended.',
    timestamp: '1 week ago',
    verifiedTransaction: true,
    transactionId: 'tx-089'
  },
  {
    id: 'rev-103',
    listingId: 'gaace-102',
    reviewerName: 'Satoshi Dev Labs',
    rating: 5,
    comment: 'The AI Architect delivered our multi-agent Gemini integration 12 hours ahead of schedule. Flawless code quality and unit test coverage.',
    timestamp: '3 days ago',
    verifiedTransaction: true,
    transactionId: 'tx-102'
  },
  {
    id: 'rev-104',
    listingId: 'gaace-103',
    reviewerName: 'Horizon Aviation Syndicate',
    rating: 5,
    comment: 'Gulfstream G650 flight was smooth and punctual. Swapped hotel time credits directly for flight hours without conversion loss.',
    timestamp: '5 days ago',
    verifiedTransaction: true,
    transactionId: 'tx-077'
  }
];
