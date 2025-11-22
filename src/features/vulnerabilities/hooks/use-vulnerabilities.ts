import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useVulnerabilitiesParams } from "./use-vulnerabilities-params";

/**
 * Hook to fetch all vulnerabilities using suspense
 */
export const useSuspenseVulnerabilities = () => {
  const trpc = useTRPC();
  const [params] = useVulnerabilitiesParams();

  return useSuspenseQuery(trpc.vulnerabilities.getMany.queryOptions(params));
};

/**
 * Hook to create a new vulnerability
 */
export const useCreateVulnerability = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.vulnerabilities.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Vulnerability created");
        queryClient.invalidateQueries({
          queryKey: trpc.vulnerabilities.getMany.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(`Failed to create vulnerability: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to update a vulnerability
 */
export const useUpdateVulnerability = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.vulnerabilities.update.mutationOptions({
      onSuccess: (data) => {
        toast.success("Vulnerability updated");
        queryClient.invalidateQueries({
          queryKey: trpc.vulnerabilities.getMany.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.vulnerabilities.getOne.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(`Failed to update vulnerability: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to remove a vulnerability
 */
export const useRemoveVulnerability = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.vulnerabilities.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success("Vulnerability removed");
        queryClient.invalidateQueries({
          queryKey: trpc.vulnerabilities.getMany.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.vulnerabilities.getOne.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(`Failed to remove vulnerability: ${error.message}`);
      },
    })
  )
}

/**
 * Hook to fetch a single vulnerability using suspense
 */
export const useSuspenseVulnerability = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.vulnerabilities.getOne.queryOptions({ id }));
};
