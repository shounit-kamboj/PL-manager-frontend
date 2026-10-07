import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { ApiListResponse } from "@/types";
import { BaseRecord, CreateResponse, HttpError } from "@refinedev/core";

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'req failed';

  try {
    const payload = (await response.json()) as { message?: string };

    if (payload?.message) message = payload.message;
  }
  catch {
    //ign
  }

  return {
    message,
    statusCode: response.status,
  };
};

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
      if (!response.ok) throw await buildHttpError(response);
      const payload: ApiListResponse = await response.json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ApiListResponse = await response.json();
      return Number(payload.total ?? payload.data?.length ?? 0);
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const json: CreateResponse = await response.json();
      return json.data ?? [];
    },
  },

  getOne: {
      getEndpoint: ({ resource, id }) => `${resource}/${id}`,

      mapResponse: async (response) => {
          if (!response.ok) throw await buildHttpError(response);
          const json = (await response.json()) as { data: BaseRecord };
          return json.data;
          },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options, {
  credentials: "include", // send the login cookie with every API request
});

export { dataProvider };