// "use client";
// import React from "react";
// import { useSortable } from "@dnd-kit/react/sortable";

// export function Item({ id, index, column, className }) {
//   const { ref, isDragging } = useSortable({
//     id,
//     index,
//     type: "item",
//     accept: "item",
//     group: column,
//   });

//   return (
//     <button
//       className={
//         column === "TODO"
//           ? "TODO bg-amber-400"
//           : column === "DONE"
//             ? "DONE text-red-800"
//             : "UNDERPROSSEING A bg-blue-400"
//       }
//       ref={ref}
//       data-dragging={isDragging}
//     >
//       {id}
//     </button>
//   );
// }


// 'use client';
// import React from 'react';
// import { useSortable } from '@dnd-kit/react/sortable';

// export function Item({ id, index, column, title, status, className ,priority}) {
//   const { ref, isDragging } = useSortable({
//     id,
//     index,
//     type: 'item',
//     accept: 'item',
//     group: column,
//   });

//   return (
//     <button
//       className="task_buttom"
//       ref={ref} data-dragging={isDragging}>
//       <div className='flex flex-col items-start  px-2'>
//         <h3>{title}</h3>
//         <div className='w-full flex flex-wrap flex-row justify-between'>
//           <div>
//           {status}
//           </div>
//           <div>
//             {priority}
//           </div>
//         </div>
//       </div>
//     </button>
//   );
// }

'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/react/sortable';

export function Item({ id, index, column, title, status, className, priority }) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
  });

  return (
    <button
      className= "Item "
      ref={ref}
      data-dragging={isDragging}
    >
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-sm font-medium text-blsck">{title}</h3>
        <div className="w-full flex flex-wrap flex-row justify-between text-xs text-gray-400">
          <span>{status.replace("_", " ")}</span>
          <span>{priority}</span>
        </div>
      </div>
    </button>
  );
}