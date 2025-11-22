"use client";

import { formatDistanceToNow } from "date-fns";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView
} from "@/components/entity-components";
import { useRemoveVulnerability, useSuspenseVulnerabilities } from "../hooks/use-vulnerabilities"
import { useVulnerabilitiesParams } from "../hooks/use-vulnerabilities-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Vulnerability } from "@/generated/prisma";
import { AlertTriangleIcon } from "lucide-react";

export const VulnerabilitiesSearch = () => {
  const [params, setParams] = useVulnerabilitiesParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search vulnerabilities"
    />
  );
};

export const VulnerabilitiesList = () => {
  const vulnerabilities = useSuspenseVulnerabilities();

  return (
    <EntityList
      items={vulnerabilities.data.items}
      getKey={(vulnerability) => vulnerability.id}
      renderItem={(vulnerability) => <VulnerabilityItem data={vulnerability} />}
      emptyView={<VulnerabilitiesEmpty />}
    />
  )
};

export const VulnerabilitiesHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Vulnerabilities"
      description="Manage security vulnerabilities and their clinical impact"
      disabled={disabled}
    />
  );
};

export const VulnerabilitiesPagination = () => {
  const vulnerabilities = useSuspenseVulnerabilities();
  const [params, setParams] = useVulnerabilitiesParams();

  return (
    <EntityPagination
      disabled={vulnerabilities.isFetching}
      totalPages={vulnerabilities.data.totalPages}
      page={vulnerabilities.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const VulnerabilitiesContainer = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<VulnerabilitiesHeader />}
      search={<VulnerabilitiesSearch />}
      pagination={<VulnerabilitiesPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const VulnerabilitiesLoading = () => {
  return <LoadingView message="Loading vulnerabilities..." />;
};

export const VulnerabilitiesError = () => {
  return <ErrorView message="Error loading vulnerabilities" />;
};

export const VulnerabilitiesEmpty = () => {
  return (
    <EmptyView
      message="No vulnerabilities found. Vulnerabilities are typically seeded using the database seed script."
    />
  );
};

export const VulnerabilityItem = ({
  data,
}: {
  data: Vulnerability
}) => {
  const removeVulnerability = useRemoveVulnerability();

  const handleRemove = () => {
    removeVulnerability.mutate({ id: data.id });
  }

  return (
    <EntityItem
      title={data.cpe}
      subtitle={
        <>
          {data.description.substring(0, 100)}
          {data.description.length > 100 ? "..." : ""}
          {" "}&bull; Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <AlertTriangleIcon className="size-5 text-destructive" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeVulnerability.isPending}
    />
  )
}
