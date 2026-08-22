"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import tasksAPI from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUSES = ["ALL", "TODO", "IN_PROGRESS", "DONE"];
const PRIORITIES = ["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"];
const LIMIT_OPTIONS = [5, 10, 20, 50];

const statusColors: Record<string, string> = {
  TODO: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export default function TasksTable() {
  const router = useRouter();
  const { user, isAuthenticated, authLoading } = useAuth();

  const [rawTasks, setRawTasks] = useState < Task[] > ([]);
  const [pagination, setPagination] = useState < Pagination > ({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  // Frontend filters
  const [title, setTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Fetch paginated tasks from backend (no filters sent)
  const fetchTasks = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const data = await tasksAPI.tasks.getTasksWithPagination(
        user._id,
        pagination.page,
        pagination.limit
      );
      setRawTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?._id) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, router, user?._id, pagination.page, pagination.limit]);

  // Frontend filtering on the fetched page
  const filteredTasks = useMemo(() => {
    let result = [...rawTasks];

    if (title.trim()) {
      const q = title.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== "ALL") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    return result;
  }, [rawTasks, title, statusFilter, priorityFilter]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const total = pagination.totalPages;
    const current = pagination.page;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, "...", total);
      } else if (current >= total - 2) {
        pages.push(1, "...", total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }
    return pages;
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 w-full">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-500">
                {pagination.total} total tasks · Page {pagination.page} of{" "}
                {pagination.totalPages}
              </p>
            </div>
            <button
              onClick={() => router.push("/Draggable")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Board
            </button>
          </div>

          {/* Filters Bar */}
          <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Title Filter */}
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Title
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Filter by title or description..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-44">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s === "ALL" ? "All Statuses" : s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="w-full md:w-44">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p === "ALL" ? "All Priorities" : p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Per Page */}
              <div className="w-full md:w-32">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Per Page
                </label>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  {LIMIT_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3.5 font-semibold text-gray-600">Title</th>
                    <th className="px-6 py-3.5 font-semibold text-gray-600">Description</th>
                    <th className="px-6 py-3.5 font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3.5 font-semibold text-gray-600">Priority</th>
                    <th className="px-6 py-3.5 font-semibold text-gray-600">Due Date</th>
                    <th className="px-6 py-3.5 font-semibold text-gray-600">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Loading tasks...
                        </div>
                      </td>
                    </tr>
                  ) : filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        <div className="mb-2 text-4xl">📋</div>
                        <div className="text-sm">No tasks match your filters</div>
                        <div className="mt-1 text-xs text-gray-400">
                          Try adjusting filters or go to another page
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr key={task._id} className="transition hover:bg-gray-50/80">
                        <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                        <td className="px-6 py-4 text-gray-500">
                          <div className="max-w-xs truncate">{task.description || "—"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[task.status] || "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[task.priority] || "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{formatDate(task.dueDate)}</td>
                        <td className="px-6 py-4 text-gray-500">{formatDate(task.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {pagination.totalPages > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {filteredTasks.length}
                  </span>{" "}
                  filtered of{" "}
                  <span className="font-medium text-gray-700">
                    {rawTasks.length}
                  </span>{" "}
                  on this page · Page{" "}
                  <span className="font-medium text-gray-700">{pagination.page}</span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">{pagination.totalPages}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((p, idx) =>
                    p === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p as number)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${pagination.page === p
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
}