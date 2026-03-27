import type { ReactNode } from "react";

export class QueryClient {}

export const QueryClientProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

export const HydrationBoundary = ({ children }: { children: ReactNode }) => <>{children}</>;

export const useQuery = () => {
  throw new Error("React Query is not enabled in this project.");
};

export const useMutation = () => {
  throw new Error("React Query is not enabled in this project.");
};

export const useInfiniteQuery = () => {
  throw new Error("React Query is not enabled in this project.");
};

export const useQueries = () => {
  throw new Error("React Query is not enabled in this project.");
};

export const useQueryClient = () => {
  throw new Error("React Query is not enabled in this project.");
};