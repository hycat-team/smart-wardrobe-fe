import { PaginationMetadata, PaginationResult } from '@/types/api';

export type { PaginationMetadata, PaginationResult };

export interface CommunityUserRes {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string; // omitempty: có thể vắng khi người dùng chưa đặt avatar
  gender?: number;    // omitempty: 1 = Nam, 2 = Nữ, 3 = Khác; vắng khi không xác định (0)
}

export interface OutfitBriefRes {
  id: string;
  name: string;
  coverImageUrl?: string;
}

export interface PostMediaRes {
  id: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  publicId?: string;
  sortOrder: number;
}

export interface PostRes {
  id: string;
  publicId: string;
  user: CommunityUserRes;           // Thông tin tác giả dạng đối tượng lồng (Breaking)
  postType: 'outfit' | 'media';     // Chuẩn hóa chữ thường
  status: 'published' | 'hidden' | 'deleted'; // Trạng thái bài đăng
  title?: string | null;            // Tối đa 150 ký tự
  content: string;                  // Tối đa 5000 ký tự
  outfit?: OutfitBriefRes | null;   // Có khi postType = 'outfit'
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isFollowingAuthor: boolean;       // Luôn false nếu viewer là tác giả
  sharePath: string;                // Ví dụ: "/community/posts/{publicId}"
  media?: PostMediaRes[];           // Tối đa 10 phần tử
  createdAt: string;
  updatedAt: string;
}

export interface CommentRes {
  id: string;                       // UUID nội bộ của bình luận
  user: CommunityUserRes;           // Thông tin người bình luận dạng đối tượng lồng
  content: string;                  // Tối đa 1000 ký tự; rỗng khi isDeleted = true mà còn câu trả lời
  parentCommentId?: string | null;  // Vắng key khi là bình luận gốc
  replyCount: number;               // Số phản hồi con (chỉ có ở gốc, con = 0)
  isDeleted: boolean;               // True khi bình luận đã bị xóa
  createdAt: string;
}

export interface PublicProfileStats {
  followerCount: number;
  followingCount: number;
  postCount: number;
}

export interface PublicProfileRes {
  user: CommunityUserRes;
  stats: PublicProfileStats;
  isFollowing: boolean;
  isMe: boolean;
}

export interface FollowUserRes {
  user: CommunityUserRes;
  relation: 'following' | 'follower';
  followedAt: string;
}

export interface SearchRes {
  users: PaginationResult<CommunityUserRes>;
  posts: PaginationResult<PostRes>;
}

export interface AddCommentReq {
  content: string;
  parentCommentId?: string;
}

export interface LikePostReq {
  isLiked: boolean;
}

export interface FollowReq {
  isFollowing: boolean;
}

export interface PostMediaReq {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  publicId?: string;
  sortOrder: number;
}

export interface CreatePostReq {
  postType: 'outfit' | 'media';
  title?: string;
  content: string;
  outfitId?: string;
  media?: PostMediaReq[];
}

export interface UpdatePostReq {
  title?: string;
  content: string;
  outfitId?: string;
  media?: PostMediaReq[];
}

export interface UploadSignatureResult {
  apiKey: string;
  folder: string;
  publicId: string;
  signature: string;
  timestamp: number;
  resourceType: 'image' | 'video';
}
