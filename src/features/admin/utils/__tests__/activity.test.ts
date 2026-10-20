import {
  getActivityTypeConfig,
  getUserDisplayName,
  isValidUUID,
} from '../activity';

describe('activity utils', () => {
  describe('getActivityTypeConfig', () => {
    it('trả về cấu hình Đăng nhập cho type login', () => {
      const config = getActivityTypeConfig('login');
      expect(config.label).toBe('Đăng nhập');
      expect(config.className).toContain('emerald');
    });

    it('trả về cấu hình Làm mới phiên cho type refresh', () => {
      const config = getActivityTypeConfig('refresh');
      expect(config.label).toBe('Làm mới phiên');
      expect(config.className).toContain('blue');
    });

    it('fallback cho type không xác định hoặc rỗng', () => {
      const config = getActivityTypeConfig('logout');
      expect(config.label).toBe('logout');

      const emptyConfig = getActivityTypeConfig(null);
      expect(emptyConfig.label).toBe('—');
    });
  });

  describe('getUserDisplayName', () => {
    it('ghép họ và tên khi có đủ', () => {
      expect(
        getUserDisplayName({
          userFirstName: 'An',
          userLastName: 'Nguyễn',
          userEmail: 'an@example.com',
        }),
      ).toBe('An Nguyễn');
    });

    it('hiển thị một trong hai khi chỉ có firstName hoặc lastName', () => {
      expect(
        getUserDisplayName({
          userFirstName: 'An',
          userLastName: null,
          userEmail: 'an@example.com',
        }),
      ).toBe('An');

      expect(
        getUserDisplayName({
          userFirstName: null,
          userLastName: 'Nguyễn',
          userEmail: 'an@example.com',
        }),
      ).toBe('Nguyễn');
    });

    it('fallback về email khi không có tên', () => {
      expect(
        getUserDisplayName({
          userFirstName: null,
          userLastName: null,
          userEmail: 'an@example.com',
        }),
      ).toBe('an@example.com');
    });

    it('fallback về — khi cả tên và email đều rỗng', () => {
      expect(
        getUserDisplayName({
          userFirstName: null,
          userLastName: null,
          userEmail: '',
        }),
      ).toBe('—');
    });
  });

  describe('isValidUUID', () => {
    it('trả về true cho UUID v4 chuẩn', () => {
      expect(isValidUUID('1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f')).toBe(true);
      expect(isValidUUID('9F0B6A3E-4C5D-4E6F-8A9B-0C1D2E3F4A5B')).toBe(true);
      expect(isValidUUID('  1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f  ')).toBe(true);
    });

    it('trả về false cho chuỗi không phải UUID', () => {
      expect(isValidUUID('12345')).toBe(false);
      expect(isValidUUID('user-admin')).toBe(false);
      expect(isValidUUID('1c2d3e4f-5a6b-4c7d-8e9f')).toBe(false);
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID('1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5g')).toBe(false); // invalid hex char 'g'
    });
  });
});
