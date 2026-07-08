//came when intitiated

// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

//from tut

import {BaseRecord, DataProvider, GetListParams, GetListResponse} from "@refinedev/core";
import {mockData} from "@/constants/mock-data";

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({resource}: GetListParams):
      Promise<GetListResponse<TData>> => {
    const data = mockData[resource] ?? [];
    return {data: data as TData[], total: data.length};
  },

  getOne: async () => {
    throw new Error('getOne is not available in mock data provider');
  },

  create: async () => {
    throw new Error('create is not available in mock data provider');
  },

  update: async () => {
    throw new Error('update is not available in mock data provider');
  },

  deleteOne: async () => {
    throw new Error('deleteOne is not available in mock data provider');
  },

  getApiUrl: () => '',
};
