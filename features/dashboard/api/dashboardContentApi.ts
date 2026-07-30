import { baseApi } from "@/features/store/api/baseApi";
import { queryResult } from "@/features/store/api/queryError";
import {
  dashboardContentService,
  type DashboardContent,
  type DashboardContentCommand,
} from "../services/dashboardContentService";

interface UpdateCommand {
  id: string;
  command: DashboardContentCommand;
}

const dashboardContentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardContent: build.query<DashboardContent | null, void>({
      queryFn: (_argument, api) => queryResult(dashboardContentService.current(api.signal)),
      providesTags: [{ type: "DashboardContent", id: "CURRENT" }],
    }),
    getAdminDashboardContents: build.query<DashboardContent[], void>({
      queryFn: (_argument, api) => queryResult(dashboardContentService.findAll(api.signal)),
      providesTags: (result) => result
        ? [{ type: "DashboardContent", id: "LIST" }, ...result.map((item) => ({
            type: "DashboardContent" as const, id: item.id,
          }))]
        : [{ type: "DashboardContent", id: "LIST" }],
    }),
    createDashboardContent: build.mutation<DashboardContent, DashboardContentCommand>({
      queryFn: (command) => queryResult(dashboardContentService.create(command)),
      invalidatesTags: [
        { type: "DashboardContent", id: "LIST" },
        { type: "DashboardContent", id: "CURRENT" },
      ],
    }),
    updateDashboardContent: build.mutation<DashboardContent, UpdateCommand>({
      queryFn: ({ id, command }) => queryResult(dashboardContentService.update(id, command)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DashboardContent", id },
        { type: "DashboardContent", id: "LIST" },
        { type: "DashboardContent", id: "CURRENT" },
      ],
    }),
    activateDashboardContent: build.mutation<DashboardContent, string>({
      queryFn: (id) => queryResult(dashboardContentService.activate(id)),
      invalidatesTags: [
        { type: "DashboardContent", id: "LIST" },
        { type: "DashboardContent", id: "CURRENT" },
      ],
    }),
    deactivateDashboardContent: build.mutation<null, string>({
      queryFn: (id) => queryResult(dashboardContentService.deactivate(id)),
      invalidatesTags: [
        { type: "DashboardContent", id: "LIST" },
        { type: "DashboardContent", id: "CURRENT" },
      ],
    }),
  }),
});

export const {
  useGetDashboardContentQuery,
  useGetAdminDashboardContentsQuery,
  useCreateDashboardContentMutation,
  useUpdateDashboardContentMutation,
  useActivateDashboardContentMutation,
  useDeactivateDashboardContentMutation,
} = dashboardContentApi;
