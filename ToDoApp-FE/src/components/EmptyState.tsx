export function EmptyState() {
  return (
    <div className="text-center py-12">
      <svg 
        className="mx-auto h-16 w-16 text-gray-400 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
        />
      </svg>
      <p className="text-gray-500 text-lg">No tasks yet!</p>
      <p className="text-gray-400 text-sm mt-2">Add your first task to get started</p>
    </div>
  );
}
