"use client"
import { Room } from '@/components/room/Room';
import { notFound } from 'next/navigation';
import { isValidRoomId } from '@/lib/utils/room.validation';

const RoomPage = ({ params }: { params: { id: string } }) => {
  if (!isValidRoomId(params.id)) {
    notFound();
  }

  return <Room />;
};

export default RoomPage;