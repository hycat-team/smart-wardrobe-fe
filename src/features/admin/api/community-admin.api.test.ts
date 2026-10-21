import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';
import { communityAdminApi } from './community-admin.api';

describe('communityAdminApi', () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('Posts Moderation', () => {
    it('gọi GET /admin/posts với đúng params và unwrap data', async () => {
      const mockResult = {
        items: [
          {
            id: 'post-1',
            publicId: 'pst_1',
            title: 'Test post',
            content: 'Post content',
            postType: 'outfit',
            status: 'published',
            user: { userId: 'u1', username: 'tester' },
            likeCount: 5,
            commentCount: 2,
            isLiked: false,
            isFollowingAuthor: false,
            sharePath: '/community/posts/pst_1',
            createdAt: '2026-10-04T10:00:00Z',
            updatedAt: '2026-10-04T10:00:00Z',
          },
        ],
        metadata: {
          page: 1,
          limit: 10,
          totalItems: 1,
          totalPages: 1,
        },
      };

      mock.onGet('/admin/posts').reply((config) => {
        expect(config.params).toEqual({ q: 'minimal', status: 'published', page: 1, limit: 10 });
        return [200, { statusCode: 200, message: 'ok', data: mockResult }];
      });

      const res = await communityAdminApi.getAdminPosts({
        q: 'minimal',
        status: 'published',
        page: 1,
        limit: 10,
      });

      expect(res).toEqual(mockResult);
    });

    it('gọi PATCH /admin/posts/:id/hide', async () => {
      mock.onPatch('/admin/posts/pst_1/hide').reply(200, {
        statusCode: 200,
        message: 'Đã ẩn bài viết',
      });

      const res = await communityAdminApi.hidePost('pst_1');
      expect(res.message).toBe('Đã ẩn bài viết');
    });

    it('gọi PATCH /admin/posts/:id/restore', async () => {
      mock.onPatch('/admin/posts/pst_1/restore').reply(200, {
        statusCode: 200,
        message: 'Đã khôi phục bài viết',
      });

      const res = await communityAdminApi.restorePost('pst_1');
      expect(res.message).toBe('Đã khôi phục bài viết');
    });

    it('gọi DELETE /admin/posts/:id', async () => {
      mock.onDelete('/admin/posts/pst_1').reply(200, {
        statusCode: 200,
        message: 'Đã xóa bài viết',
      });

      const res = await communityAdminApi.deletePost('pst_1');
      expect(res.message).toBe('Đã xóa bài viết');
    });
  });

  describe('Comments Moderation', () => {
    it('gọi GET /admin/comments với đúng params và unwrap data', async () => {
      const mockResult = {
        items: [
          {
            id: 'cmt-1',
            user: { userId: 'u2', username: 'commenter' },
            content: 'Great outfit!',
            replyCount: 0,
            isDeleted: false,
            createdAt: '2026-10-04T11:00:00Z',
          },
        ],
        metadata: {
          page: 1,
          limit: 15,
          totalItems: 1,
          totalPages: 1,
        },
      };

      mock.onGet('/admin/comments').reply((config) => {
        expect(config.params).toEqual({ q: 'outfit', status: 'active', page: 1, limit: 15 });
        return [200, { statusCode: 200, message: 'ok', data: mockResult }];
      });

      const res = await communityAdminApi.getAdminComments({
        q: 'outfit',
        status: 'active',
        page: 1,
        limit: 15,
      });

      expect(res).toEqual(mockResult);
    });

    it('gọi PATCH /admin/comments/:id/hide', async () => {
      mock.onPatch('/admin/comments/cmt-1/hide').reply(200, {
        statusCode: 200,
        message: 'Đã ẩn bình luận',
      });

      const res = await communityAdminApi.hideComment('cmt-1');
      expect(res.message).toBe('Đã ẩn bình luận');
    });

    it('gọi PATCH /admin/comments/:id/restore', async () => {
      mock.onPatch('/admin/comments/cmt-1/restore').reply(200, {
        statusCode: 200,
        message: 'Đã khôi phục bình luận',
      });

      const res = await communityAdminApi.restoreComment('cmt-1');
      expect(res.message).toBe('Đã khôi phục bình luận');
    });

    it('gọi DELETE /admin/comments/:id', async () => {
      mock.onDelete('/admin/comments/cmt-1').reply(200, {
        statusCode: 200,
        message: 'Đã xóa bình luận',
      });

      const res = await communityAdminApi.deleteComment('cmt-1');
      expect(res.message).toBe('Đã xóa bình luận');
    });

    it('gọi GET /posts/:postPublicID/comments lấy bình luận ngữ cảnh', async () => {
      const mockComments = [
        {
          id: 'cmt-10',
          user: { userId: 'u3', username: 'fan' },
          content: 'Where did you get that shirt?',
          replyCount: 0,
          isDeleted: false,
          createdAt: '2026-10-04T12:00:00Z',
        },
      ];

      mock.onGet('/posts/pst_10/comments').reply(200, {
        statusCode: 200,
        data: mockComments,
      });

      const res = await communityAdminApi.getPostComments('pst_10');
      expect(res).toEqual(mockComments);
    });
  });
});
