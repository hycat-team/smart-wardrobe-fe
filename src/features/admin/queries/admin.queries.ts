import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error';
import { summarizeGrantResult } from '../utils/subscription';

export const ADMIN_USERS_KEY = ['admin-users'];
export const ADMIN_USER_DETAIL_KEY = ['admin-user-detail'];
export const ADMIN_USER_SUBSCRIPTION_KEY = ['admin-user-subscription'];
export const ADMIN_SUBSCRIPTION_PLANS_KEY = ['admin-subscription-plans'];
export const ADMIN_POSTS_KEY = ['admin-posts'];
export const ADMIN_POST_ITEMS_KEY = ['admin-post-items'];
export const ADMIN_CATALOG_KEY = ['admin-catalog'];
export const ADMIN_CATEGORIES_KEY = ['admin-categories'];

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: () => adminApi.getCategories(),
  });
};

export const useUserCategories = () => {
  return useQuery({
    queryKey: ['user-categories'],
    queryFn: () => adminApi.getUserCategories(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      toast.success('Thêm danh mục thành công');
    },
    onError: (error) => handleApiError(error, 'Thêm danh mục thất bại'),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      toast.success('Cập nhật danh mục thành công');
    },
    onError: (error) => handleApiError(error, 'Cập nhật danh mục thất bại'),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      toast.success('Xóa danh mục thành công');
    },
    onError: (error) => handleApiError(error, 'Xóa danh mục thất bại'),
  });
};

export const useAdminUsers = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, params],
    queryFn: () => adminApi.getUsers(params),
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  });
};

export const useAdminUserDetail = (userId: string | null) => {
  return useQuery({
    queryKey: [...ADMIN_USER_DETAIL_KEY, userId],
    queryFn: () => adminApi.getUserDetail(userId as string),
    enabled: !!userId,
  });
};

/** Raw subscription row (start date, real expiry, auto-renew) for one account. */
export const useAdminUserSubscription = (userId: string | null) => {
  return useQuery({
    queryKey: [...ADMIN_USER_SUBSCRIPTION_KEY, userId],
    queryFn: () => adminApi.getUserSubscription(userId as string),
    enabled: !!userId,
  });
};

export const useAdminSubscriptionPlans = (enabled: boolean) => {
  return useQuery({
    queryKey: ADMIN_SUBSCRIPTION_PLANS_KEY,
    queryFn: () => adminApi.getSubscriptionPlans(),
    enabled,
    staleTime: 60_000,
  });
};

export const useGrantSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.grantSubscription,
    onSuccess: (result, variables) => {
      const userId = variables.items[0]?.userIdentifier;
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [...ADMIN_USER_DETAIL_KEY, userId] });
        queryClient.invalidateQueries({ queryKey: [...ADMIN_USER_SUBSCRIPTION_KEY, userId] });
      }
      const summary = summarizeGrantResult(result);
      if (summary.ok) toast.success(summary.message);
      else toast.error(summary.message);
    },
    onError: (error) => handleApiError(error, 'Cấp gói thất bại'),
  });
};

export const useCancelUserSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.cancelUserSubscription,
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_USER_DETAIL_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_USER_SUBSCRIPTION_KEY, userId] });
      toast.success('Đã huỷ gói hội viên, tài khoản chuyển về gói Free');
    },
    onError: (error) => handleApiError(error, 'Huỷ gói thất bại'),
  });
};

export const useAdminPosts = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [...ADMIN_POSTS_KEY, params],
    queryFn: () => adminApi.getPosts(params),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_POSTS_KEY });
      toast.success('Xóa bài viết thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Xóa bài viết thất bại');
    }
  });
};

export const useRestorePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.restorePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_POSTS_KEY });
      toast.success('Khôi phục bài viết thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Khôi phục bài viết thất bại');
    }
  });
};

export const useAdminPostItems = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [...ADMIN_POST_ITEMS_KEY, params],
    queryFn: () => adminApi.getPostItems(params),
  });
};

export const useHidePostItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.hidePostItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_POST_ITEMS_KEY });
      toast.success('Ẩn sản phẩm thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Ẩn sản phẩm thất bại');
    }
  });
};

export const useDeletePostItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deletePostItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_POST_ITEMS_KEY });
      toast.success('Xóa sản phẩm thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Xóa sản phẩm thất bại');
    }
  });
};

export const useAdminCatalog = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [...ADMIN_CATALOG_KEY, params],
    queryFn: () => adminApi.getSystemWardrobeItems(params),
  });
};

export const useBatchUploadSystemWardrobeItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.batchUploadSystemWardrobeItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEY });
      toast.success('Upload trang phục hệ thống thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Upload thất bại');
    }
  });
};

export const useUpdateSystemWardrobeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateSystemWardrobeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEY });
      toast.success('Cập nhật trang phục hệ thống thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Cập nhật thất bại');
    }
  });
};

export const useDeleteSystemWardrobeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteSystemWardrobeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEY });
      toast.success('Xóa trang phục hệ thống thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Xóa thất bại');
    }
  });
};

export const usePostComments = (postPublicID: string | null) => {
  return useQuery({
    queryKey: ['post-comments', postPublicID],
    queryFn: () => postPublicID ? adminApi.getPostComments(postPublicID) : Promise.resolve([]),
    enabled: !!postPublicID,
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteComment,
    onSuccess: (_, id) => {
      // Invalidate both post-comments and admin-posts if we want accurate comment counts
      queryClient.invalidateQueries({ queryKey: ['post-comments'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_POSTS_KEY });
      toast.success('Đã xóa bình luận');
    },
    onError: (error) => handleApiError(error, 'Lỗi khi xóa bình luận'),
  });
};

export const useRestoreComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.restoreComment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_POSTS_KEY });
      toast.success('Đã khôi phục bình luận');
    },
    onError: (error) => handleApiError(error, 'Lỗi khi khôi phục bình luận'),
  });
};
