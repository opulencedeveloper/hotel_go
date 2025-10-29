'use client';

interface StaysErrorDisplayProps {
  updateError: string | null;
  deleteError: string | null;
}

export default function StaysErrorDisplay({ updateError, deleteError }: StaysErrorDisplayProps) {
  if (!updateError && !deleteError) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            {updateError && <p>Update failed: {updateError}</p>}
            {deleteError && <p>Delete failed: {deleteError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}











