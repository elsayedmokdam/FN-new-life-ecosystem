"use client";

import { useState } from "react";
import SegmentedTabs from "../shared/segmented-tabs/SegmentedTabs";
import TransactionsExplorer from "./TransactionsExplorer";
import CancellationRequestsView from "./CancellationRequestsView";
import {
  CancellationRequestItem,
  Transaction,
} from "@/services/types/transaction_interface";
import { PaginationMeta } from "@/services/types/api_interface";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  initial: { data: Transaction[]; meta: PaginationMeta };
  requests?: CancellationRequestItem[];
  isAdmin: boolean;
  initialTab: "all" | "requests";
  machineId?: string;
  cardId?: string;
  clientId?: string;
}

export default function TransactionsPageView({
  initial,
  requests = [],
  isAdmin,
  initialTab,
  machineId,
  cardId,
  clientId,
}: Props) {
  const { t } = useT();
  const [tab, setTab] = useState<"all" | "requests">(
    isAdmin ? initialTab : "all",
  );
  return (
    <div className="space-y-4 p-4 md:p-6">
      {isAdmin && (
        <SegmentedTabs<"all" | "requests">
          value={tab}
          onChange={setTab}
          options={[
            { value: "all", label: t("tx.all") },
            {
              value: "requests",
              label: `${t("tx.requests")}${requests.length ? ` (${requests.length})` : ""}`,
            },
          ]}
        />
      )}
      {tab === "all" ? (
        <TransactionsExplorer
          initial={initial}
          machineId={machineId}
          cardId={cardId}
          clientId={clientId}
        />
      ) : (
        <CancellationRequestsView items={requests} />
      )}
    </div>
  );
}
