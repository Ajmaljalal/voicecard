import { RtkQueryTagTypes } from "@/src/constants/RtkQueryTagTeyps";
import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";

const baseQuery: BaseQueryFn = async () => ({ data: {} });

const api = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  tagTypes: [
    RtkQueryTagTypes.VoiceCards,
  ],
});

export default api;