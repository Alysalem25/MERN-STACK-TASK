'use client';
import React from 'react';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';

export function Column({ children, id, index, count }) {
  const { ref } = useSortable({
    id,
    index,
    type: 'column',
    collisionPriority: CollisionPriority.Low,
    accept: ['item', 'column'],
  });

  return (
    <div className="Column w-fit md:min-w-72" ref={ref}>
      <h1>{id}, {count}</h1>
      {children}
    </div>
  );
}