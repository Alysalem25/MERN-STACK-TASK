'use client';
import Board from '@/components/kanban/Board';
import Navbar from '@/components/Navbar';
export default function Draggable() {
  return (
    <div className='w-full'>
      <Navbar />
      <div className="Root flet justify-center w-full">
        <Board />
      </div>
    </div>
  );
}