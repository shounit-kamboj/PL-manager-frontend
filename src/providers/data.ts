// import {BaseRecord, DataProvider, GetListParams, GetListResponse} from "@refinedev/core";
// import {mockData} from "@/constants/mock-data";
//
// export const dataProvider: DataProvider = {
//   getList: async <TData extends BaseRecord = BaseRecord>({resource}: GetListParams):
//       Promise<GetListResponse<TData>> => {
//     const data = mockData[resource] ?? [];
//     return {data: data as TData[], total: data.length};
//   },
//
//   getOne: async () => {
//     throw new Error('getOne is not available in mock data provider');
//   },
//
//   create: async () => {
//     throw new Error('create is not available in mock data provider');
//   },
//
//   update: async () => {
//     throw new Error('update is not available in mock data provider');
//   },
//
//   deleteOne: async () => {
//     throw new Error('deleteOne is not available in mock data provider');
//   },
//
//   getApiUrl: () => '',
// };
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { ApiListResponse } from "@/types";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ pagination, sorters, filters }) => {
      const params: Record<string, string> = {};

      if (pagination) {
        params.page = String(pagination.currentPage ?? 1);
        params.limit = String(pagination.pageSize ?? 10);
      }

      if (sorters && sorters.length > 0) {
        params.sort = sorters[0].field;
        params.order = sorters[0].order;
      }

      if (filters) {
        filters.forEach((filter) => {
          if ('field' in filter && filter.value !== undefined && filter.value !== '') {
            params[filter.field] = String(filter.value);
          }
        });
      }

      return params;
    },


    mapResponse: async (response) => {
      const payload: ApiListResponse = await response.json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ApiListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };