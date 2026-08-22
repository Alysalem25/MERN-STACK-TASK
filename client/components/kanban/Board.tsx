// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { DragDropProvider } from "@dnd-kit/react";
// import { move } from "@dnd-kit/helpers";
// import { Column } from "./Column";
// import { Item } from "./Item";
// import "./styles.css";
// import tasksAPI from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

// const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

// function groupByStatus(tasks) {
//   const grouped = { TODO: [], IN_PROGRESS: [], DONE: [] };
//   for (const task of tasks) {
//     const key = STATUSES.includes(task.status) ? task.status : "TODO";
//     grouped[key].push({ ...task, id: task._id ?? task.id });
//   }
//   return grouped;
// }

// function syncStatuses(items) {
//   const next = {};
//   for (const column of Object.keys(items)) {
//     next[column] = items[column].map((item) => ({ ...item, status: column }));
//   }
//   return next;
// }

// function flattenStatuses(items) {
//   const map = {};
//   for (const column of Object.keys(items)) {
//     for (const item of items[column]) {
//       map[item.id] = column;
//     }
//   }
//   return map;
// }

// async function patchTaskStatus(taskId, status) {
//   return tasksAPI.tasks.changeStatus(taskId, status);
// }

// export default function Board() {
//   const router = useRouter();

//   const [items, setItems] = useState({ TODO: [], IN_PROGRESS: [], DONE: [] });
//   const [loading, setLoading] = useState(true);
//   const previousItems = useRef(items);
//   const [columnOrder, setColumnOrder] = useState(STATUSES);
//   const [openForm, setOpenForm] = useState(false)
//   const {
//     isAuthenticated, authLoading
//   } = useAuth();

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       router.replace("/login");
//     }
//   }, [authLoading, isAuthenticated, router]);

//   // ...

//   // if (authLoading || loading) {
//   //   return <div className="Root">Loading tasks...</div>;
//   // }

//   const fetchTasks = async () => {
//     try {
//       const data = await tasksAPI.tasks.getUserTask();
//       console.log(data);
//       const grouped = groupByStatus(data);
//       setItems(grouped);
//       previousItems.current = grouped;
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // const openForm = async () => {
//     // }
//   const openFormButton = async (colunm:String) => {
//       alert("form")

//   }
//   if (loading) {
//     return <div className="Root">Loading tasks...</div>;
//   }

//   return (
//     <DragDropProvider
//       onDragStart={() => {
//         previousItems.current = items;
//       }}
//       onDragOver={(event) => {
//         const { source } = event.operation;
//         if (source?.type === "column") return;
//         setItems((items) => syncStatuses(move(items, event)));
//       }}
//       onDragEnd={(event) => {
//         const { source } = event.operation;

//         if (event.canceled) {
//           if (source.type === "item") {
//             setItems(previousItems.current);
//           }
//           return;
//         }

//         if (source.type === "column") {
//           setColumnOrder((columns) => move(columns, event));
//           return;
//         }

//         if (source.type === "item") {
//           const before = flattenStatuses(previousItems.current);
//           const after = flattenStatuses(items);
//           const taskId = source.id;

//           if (before[taskId] !== after[taskId]) {
//             const newStatus = after[taskId];

//             patchTaskStatus(taskId, newStatus).catch(() => {
//               setItems(previousItems.current);
//             });
//           }
//         }
//       }}
//     >
//       <div className="Root  flex flex-row justify-center content-center m-5 ">
//         {columnOrder.map((column, columnIndex) => (
//           <Column key={column} id={column} index={columnIndex} count={items[column].length}
//           >
//             {items[column].map((item, index) => (
//               <Item
//                 key={item.id}
//                 id={item.id}
//                 index={index}
//                 column={column}
//                 title={item.title}
//                 status={item.status}
//                 priority={item.priority}
//                 className="Item"
//               />
//             ))}
//             <button onClick={openFormButton(column)} className="button">create</button>
//           </Column>
//         ))}
//       </div>
//     </DragDropProvider>
//   );
// }


"use client";
import React, { useEffect, useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { Column } from "./Column";
import { Item } from "./Item";
import "./styles.css";
import tasksAPI from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CreateTaskForm from "@/components/CreateTaskForm";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

function groupByStatus(tasks) {
  const grouped = { TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const task of tasks) {
    const key = STATUSES.includes(task.status) ? task.status : "TODO";
    grouped[key].push({ ...task, id: task._id ?? task.id });
  }
  return grouped;
}

function syncStatuses(items) {
  const next = {};
  for (const column of Object.keys(items)) {
    next[column] = items[column].map((item) => ({ ...item, status: column }));
  }
  return next;
}

function flattenStatuses(items) {
  const map = {};
  for (const column of Object.keys(items)) {
    for (const item of items[column]) {
      map[item.id] = column;
    }
  }
  return map;
}

async function patchTaskStatus(taskId, status) {
  return tasksAPI.tasks.changeStatus(taskId, status);
}

interface TaskData {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

export default function Board() {
  const router = useRouter();

  const [items, setItems] = useState({ TODO: [], IN_PROGRESS: [], DONE: [] });
  const [loading, setLoading] = useState(true);
  const previousItems = useRef(items);
  const [columnOrder, setColumnOrder] = useState(STATUSES);
  const [openForm, setOpenForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskData | undefined>(undefined);
  const { isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchTasks = async () => {
    try {
      const data = await tasksAPI.tasks.getUserTask();
      console.log(data);
      const grouped = groupByStatus(data);
      setItems(grouped);
      previousItems.current = grouped;
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreateForm = (column: string) => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      status: column,
      priority: "MEDIUM",
      dueDate: "",
    });
    setOpenForm(true);
  };

  const openEditForm = (item: any) => {
    setEditingTaskId(item.id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      status: item.status || "TODO",
      priority: item.priority || "MEDIUM",
      dueDate: item.dueDate || "",
    });
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    setEditingTaskId(null);
    setFormData(undefined);
  };

  if (loading) {
    return <div className="Root">Loading tasks...</div>;
  }

  return (
    <>
      <DragDropProvider
        onDragStart={() => {
          previousItems.current = items;
        }}
        onDragOver={(event) => {
          const { source } = event.operation;
          if (source?.type === "column") return;
          setItems((items) => syncStatuses(move(items, event)));
        }}
        onDragEnd={(event) => {
          const { source } = event.operation;

          if (event.canceled) {
            if (source.type === "item") {
              setItems(previousItems.current);
            }
            return;
          }

          if (source.type === "column") {
            setColumnOrder((columns) => move(columns, event));
            return;
          }

          if (source.type === "item") {
            const before = flattenStatuses(previousItems.current);
            const after = flattenStatuses(items);
            const taskId = source.id;

            if (before[taskId] !== after[taskId]) {
              const newStatus = after[taskId];

              patchTaskStatus(taskId, newStatus).catch(() => {
                setItems(previousItems.current);
              });
            }
          }
        }}
      >
        <div className="Root  ">
          {columnOrder.map((column, columnIndex) => (
            <Column
              key={column}
              id={column}
              index={columnIndex}
              count={items[column].length}
            >
              {items[column].map((item, index) => (
                <div key={item.id} className="relative bg-gray-700 rounded-2xl">
                  <Item
                    id={item.id}
                    index={index}
                    column={column}
                    title={item.title}
                    status={item.status}
                    priority={item.priority}
                    className="Item bg-amber-800"
                  />
                  <button
                    onClick={() => openEditForm(item)}
                    className="absolute top-1 right-1 rounded px-2 py-0.5 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    edit
                  </button>
                </div>
              ))}
              <button
                onClick={() => openCreateForm(column)}
                className="button"
              >
                + Create Task
              </button>
            </Column>
          ))}
        </div>
      </DragDropProvider>

      <CreateTaskForm
        isOpen={openForm}
        onClose={closeForm}
        onSuccess={fetchTasks}
        initialData={formData}
        taskId={editingTaskId}
      />
    </>
  );
}