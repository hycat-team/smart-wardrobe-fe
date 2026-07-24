import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';
import { wardrobeApi } from './wardrobe.api';

describe('wardrobeApi dashboard', () => {
  const mock = new MockAdapter(api);

  afterEach(() => mock.reset());
  afterAll(() => mock.restore());

  it('gọi đúng endpoint category distribution và unwrap data', async () => {
    const payload = {
      totalItems: 2,
      categories: [
        {
          categoryId: 'cat-1',
          categoryName: 'Áo',
          itemCount: 2,
          percentage: 100,
        },
      ],
    };
    mock
      .onGet('/me/dashboard/wardrobe/category-distribution')
      .reply(200, { data: payload });

    await expect(
      wardrobeApi.getWardrobeCategoryDistribution(),
    ).resolves.toEqual(payload);
  });
});